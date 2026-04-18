import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MUSIC_TRACK_BLUEPRINTS } from '../data/fan-experience.data';
import { ApiService, SiteSetting } from './api.service';

type AmbientPreset = 'antava-glow' | 'maaya-twilight' | 'honey-pulse';
type TrackSource = 'ambient' | 'audio' | 'youtube';

const STORAGE_KEY = 'srp_music_widget_state_v1';
const YOUTUBE_IFRAME_API_URL = 'https://www.youtube.com/iframe_api';
const YOUTUBE_PLAYER_HOST_ID = 'srp-hidden-youtube-player';

export interface MusicPlayerTrack {
  key: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  source: TrackSource;
  url?: string;
  youtubeVideoId?: string;
  ambientPreset: AmbientPreset;
}

export interface MusicPlayerState {
  playlist: MusicPlayerTrack[];
  currentTrackIndex: number;
  isPlaying: boolean;
  isExpanded: boolean;
  isHydrated: boolean;
  resumePending: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService implements OnDestroy {
  private readonly stateSubject = new BehaviorSubject<MusicPlayerState>({
    playlist: [],
    currentTrackIndex: 0,
    isPlaying: false,
    isExpanded: false,
    isHydrated: false,
    resumePending: false
  });

  readonly state$ = this.stateSubject.asObservable();

  private settingsSubscription: Subscription | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private youtubePlayer: YT.Player | null = null;
  private youtubeApiPromise: Promise<typeof YT> | null = null;
  private youtubePlayerPromise: Promise<YT.Player> | null = null;
  private ambientTimer: number | null = null;
  private ambientStep = 0;
  private activeOscillators = new Set<OscillatorNode>();
  private autoMinimizeTimer: ReturnType<typeof setTimeout> | null = null;
  private initialized = false;
  private hasUserActivationListener = false;
  private activeYouTubeVideoId: string | null = null;
  private suppressNextAudioPauseEvent = false;
  private suppressNextYouTubePauseEvent = false;

  constructor(private apiService: ApiService) {}

  initialize(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    this.restoreState();
    this.settingsSubscription = this.apiService.getSettings().subscribe({
      next: (settings) => {
        const playlist = this.buildPlaylist(settings);
        const nextIndex = Math.min(this.stateSubject.value.currentTrackIndex, Math.max(playlist.length - 1, 0));
        this.patchState({
          playlist,
          currentTrackIndex: nextIndex,
          isHydrated: true
        });

        if (playlist.some(track => track.source === 'youtube')) {
          void this.ensureYouTubePlayer();
        }

        if (this.stateSubject.value.resumePending) {
          this.bindResumeOnFirstGesture();
        }
      },
      error: () => {
        this.patchState({
          playlist: this.buildPlaylist([]),
          isHydrated: true
        });
      }
    });
  }

  togglePlayback(): void {
    const state = this.stateSubject.value;
    if (state.isPlaying) {
      this.pause();
      return;
    }

    void this.play();
  }

  async play(): Promise<void> {
    const track = this.getCurrentTrack();
    if (!track) {
      return;
    }

    this.patchState({ isPlaying: true, resumePending: false, isExpanded: true });
    this.persistState();

    if (track.source === 'audio' && track.url) {
      await this.playAudioTrack(track);
    } else if (track.source === 'youtube' && track.youtubeVideoId) {
      await this.playYouTubeTrack(track);
    } else {
      await this.playAmbientTrack(track.ambientPreset);
    }

    this.scheduleAutoMinimize();
  }

  pause(): void {
    this.pauseAudioElement();
    this.pauseYouTubePlayback();
    this.stopAmbientPlayback();
    this.patchState({ isPlaying: false, resumePending: false });
    this.persistState();
  }

  async next(): Promise<void> {
    const playlist = this.stateSubject.value.playlist;
    if (playlist.length === 0) {
      return;
    }

    const nextIndex = (this.stateSubject.value.currentTrackIndex + 1) % playlist.length;
    this.patchState({ currentTrackIndex: nextIndex, isExpanded: true });
    this.persistState();

    if (this.stateSubject.value.isPlaying) {
      await this.play();
      return;
    }

    this.scheduleAutoMinimize();
  }

  async previous(): Promise<void> {
    const playlist = this.stateSubject.value.playlist;
    if (playlist.length === 0) {
      return;
    }

    const previousIndex = (this.stateSubject.value.currentTrackIndex - 1 + playlist.length) % playlist.length;
    this.patchState({ currentTrackIndex: previousIndex, isExpanded: true });
    this.persistState();

    if (this.stateSubject.value.isPlaying) {
      await this.play();
      return;
    }

    this.scheduleAutoMinimize();
  }

  async selectTrack(index: number): Promise<void> {
    if (index === this.stateSubject.value.currentTrackIndex) {
      this.patchState({ isExpanded: true });
      this.scheduleAutoMinimize();
      return;
    }

    this.patchState({ currentTrackIndex: index, isExpanded: true });
    this.persistState();

    if (this.stateSubject.value.isPlaying) {
      await this.play();
      return;
    }

    this.scheduleAutoMinimize();
  }

  setExpanded(isExpanded: boolean): void {
    this.patchState({ isExpanded });
    if (isExpanded) {
      this.clearAutoMinimize();
    } else if (this.stateSubject.value.isPlaying) {
      this.scheduleAutoMinimize();
    }
  }

  ngOnDestroy(): void {
    this.clearAutoMinimize();
    this.stopAmbientPlayback();
    this.pauseAudioElement(true);
    this.destroyYouTubePlayer();
    this.settingsSubscription?.unsubscribe();
  }

  private restoreState(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored) as Partial<MusicPlayerState>;
      const desiredPlayState = parsed.isPlaying === true;

      this.patchState({
        currentTrackIndex: typeof parsed.currentTrackIndex === 'number' ? parsed.currentTrackIndex : 0,
        isExpanded: parsed.isExpanded === true,
        isPlaying: false,
        resumePending: desiredPlayState
      });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private persistState(): void {
    const state = this.stateSubject.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentTrackIndex: state.currentTrackIndex,
      isExpanded: state.isExpanded,
      isPlaying: state.isPlaying
    }));
  }

  private buildPlaylist(settings: SiteSetting[]): MusicPlayerTrack[] {
    return MUSIC_TRACK_BLUEPRINTS.map(blueprint => {
      const configuredUrl = settings.find(setting => setting.key === blueprint.audioUrlSettingKey)?.value?.trim()
        || blueprint.defaultAudioUrl?.trim();
      const resolvedTrackSource = this.resolveTrackSource(configuredUrl);

      return {
        key: blueprint.key,
        title: blueprint.title,
        subtitle: blueprint.subtitle,
        coverUrl: blueprint.coverUrl,
        source: resolvedTrackSource.source,
        url: resolvedTrackSource.url,
        youtubeVideoId: resolvedTrackSource.youtubeVideoId,
        ambientPreset: blueprint.ambientPreset
      } satisfies MusicPlayerTrack;
    });
  }

  private async playAudioTrack(track: MusicPlayerTrack): Promise<void> {
    this.stopAmbientPlayback();
    this.stopYouTubePlayback();

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.preload = 'auto';
      this.audioElement.addEventListener('pause', () => {
        if (this.suppressNextAudioPauseEvent) {
          this.suppressNextAudioPauseEvent = false;
          return;
        }

        if (!this.audioElement || this.audioElement.currentTime === 0) {
          return;
        }

        if (!this.audioElement.ended) {
          this.patchState({ isPlaying: false });
          this.persistState();
        }
      });
    }

    if (this.audioElement.src !== (track.url ?? '')) {
      this.audioElement.src = track.url ?? '';
    }

    try {
      await this.audioElement.play();
    } catch {
      this.patchState({ isPlaying: false, resumePending: true });
      this.persistState();
      this.bindResumeOnFirstGesture();
    }
  }

  private async playYouTubeTrack(track: MusicPlayerTrack): Promise<void> {
    if (!track.youtubeVideoId) {
      this.patchState({ isPlaying: false, resumePending: false });
      this.persistState();
      return;
    }

    this.stopAmbientPlayback();
    this.pauseAudioElement();

    try {
      const player = await this.ensureYouTubePlayer();
      if (!this.stateSubject.value.isPlaying) {
        return;
      }

      const shouldReloadVideo = this.activeYouTubeVideoId !== track.youtubeVideoId;
      this.activeYouTubeVideoId = track.youtubeVideoId;

      player.unMute();
      player.setVolume(100);

      if (shouldReloadVideo) {
        player.loadVideoById(track.youtubeVideoId);
      }

      player.playVideo();

      window.setTimeout(() => {
        if (!this.stateSubject.value.isPlaying || this.activeYouTubeVideoId !== track.youtubeVideoId) {
          return;
        }

        try {
          player.unMute();
          player.setVolume(100);
          player.playVideo();
        } catch {
          // If the browser still blocks playback, the existing resume flow handles the retry.
        }
      }, 250);
    } catch {
      this.patchState({ isPlaying: false, resumePending: true });
      this.persistState();
      this.bindResumeOnFirstGesture();
    }
  }

  private async playAmbientTrack(preset: AmbientPreset): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    this.pauseAudioElement();
    this.stopYouTubePlayback();

    if (!this.audioContext) {
      const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) {
        return;
      }

      this.audioContext = new AudioContextCtor();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.22; // Increased from 0.09 because the previous ambience was too quiet.
      this.masterGain.connect(this.audioContext.destination);
    }

    await this.audioContext.resume();
    if (!this.stateSubject.value.isPlaying) {
      this.stopAmbientPlayback();
      return;
    }

    this.stopAmbientPlayback();
    this.ambientStep = 0;

    const tick = () => this.scheduleAmbientStep(preset);
    tick();
    this.ambientTimer = window.setInterval(tick, this.getPresetConfig(preset).stepMs);
  }

  private scheduleAmbientStep(preset: AmbientPreset): void {
    if (!this.audioContext || !this.masterGain) {
      return;
    }

    const config = this.getPresetConfig(preset);
    const stepIndex = this.ambientStep % config.notes.length;
    const now = this.audioContext.currentTime;
    const note = config.notes[stepIndex];
    const pulseGain = config.pulseSteps.includes(stepIndex) ? 0.18 : 0.12;

    this.playTone(note, now, config.noteLength, config.waveform, pulseGain);
    this.playTone(note / 2, now, config.noteLength * 1.4, 'sine', pulseGain * 0.4);

    if (config.chimeSteps.includes(stepIndex)) {
      this.playTone(note * 2, now + 0.02, config.noteLength * 0.7, 'triangle', 0.022);
    }

    this.ambientStep += 1;
  }

  private playTone(frequency: number, startTime: number, duration: number, type: OscillatorType, peak: number): void {
    if (!this.audioContext || !this.masterGain) {
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(peak, startTime + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscillator.connect(gain);
    gain.connect(this.masterGain);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.08);
    oscillator.onended = () => this.activeOscillators.delete(oscillator);
    this.activeOscillators.add(oscillator);
  }

  private stopAmbientPlayback(): void {
    if (this.ambientTimer !== null) {
      window.clearInterval(this.ambientTimer);
      this.ambientTimer = null;
    }

    this.activeOscillators.forEach(oscillator => {
      try {
        oscillator.stop();
      } catch {
        // ignore stale oscillator stop errors
      }
    });
    this.activeOscillators.clear();
  }

  private resolveTrackSource(configuredUrl?: string): Pick<MusicPlayerTrack, 'source' | 'url' | 'youtubeVideoId'> {
    const normalizedUrl = configuredUrl?.trim();
    if (!normalizedUrl) {
      return {
        source: 'ambient'
      };
    }

    const youtubeVideoId = this.extractYouTubeVideoId(normalizedUrl);
    if (youtubeVideoId) {
      return {
        source: 'youtube',
        url: normalizedUrl,
        youtubeVideoId
      };
    }

    return {
      source: 'audio',
      url: normalizedUrl
    };
  }

  private extractYouTubeVideoId(url: string): string | null {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.replace(/^www\./, '').toLowerCase();

      if (hostname === 'youtu.be') {
        return parsed.pathname.split('/').filter(Boolean)[0] ?? null;
      }

      if (hostname === 'youtube.com' || hostname === 'm.youtube.com' || hostname === 'music.youtube.com') {
        if (parsed.pathname === '/watch') {
          return parsed.searchParams.get('v');
        }

        const pathSegments = parsed.pathname.split('/').filter(Boolean);
        if (pathSegments[0] === 'embed' || pathSegments[0] === 'shorts' || pathSegments[0] === 'live') {
          return pathSegments[1] ?? null;
        }
      }
    } catch {
      return null;
    }

    return null;
  }

  private pauseAudioElement(resetSource = false): void {
    if (!this.audioElement) {
      return;
    }

    this.suppressNextAudioPauseEvent = true;
    this.audioElement.pause();

    if (resetSource) {
      this.audioElement.src = '';
      this.audioElement = null;
    }
  }

  private pauseYouTubePlayback(): void {
    if (!this.youtubePlayer) {
      return;
    }

    this.suppressNextYouTubePauseEvent = true;
    this.youtubePlayer.pauseVideo();
  }

  private stopYouTubePlayback(): void {
    if (!this.youtubePlayer) {
      return;
    }

    this.suppressNextYouTubePauseEvent = true;
    this.youtubePlayer.pauseVideo();
    this.activeYouTubeVideoId = null;
  }

  private destroyYouTubePlayer(): void {
    if (!this.youtubePlayer) {
      return;
    }

    this.youtubePlayer.destroy();
    this.youtubePlayer = null;
    this.youtubePlayerPromise = null;
    this.activeYouTubeVideoId = null;
  }

  private async ensureYouTubePlayer(): Promise<YT.Player> {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new Error('YouTube playback is only available in the browser.');
    }

    if (this.youtubePlayer) {
      return this.youtubePlayer;
    }

    if (this.youtubePlayerPromise) {
      return this.youtubePlayerPromise;
    }

    this.youtubePlayerPromise = this.loadYouTubeApi().then(yt => {
      const host = this.ensureYouTubePlayerHost();

      return new Promise<YT.Player>((resolve, reject) => {
        this.youtubePlayer = new yt.Player(host, {
          width: 1,
          height: 1,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin
          },
          events: {
            onReady: () => {
              const iframe = this.youtubePlayer?.getIframe();
              iframe?.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
              this.youtubePlayer?.unMute();
              this.youtubePlayer?.setVolume(100);
              if (!this.youtubePlayer) {
                reject(new Error('YouTube player failed to initialize.'));
                return;
              }

              resolve(this.youtubePlayer);
            },
            onStateChange: (event) => this.handleYouTubeStateChange(event),
            onError: () => {
              this.patchState({ isPlaying: false, resumePending: false });
              this.persistState();
            }
          }
        });
      });
    }).catch(error => {
      this.youtubePlayerPromise = null;
      throw error;
    });

    return this.youtubePlayerPromise;
  }

  private loadYouTubeApi(): Promise<typeof YT> {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return Promise.reject(new Error('YouTube API requires a browser environment.'));
    }

    if (window.YT?.Player) {
      return Promise.resolve(window.YT);
    }

    if (this.youtubeApiPromise) {
      return this.youtubeApiPromise;
    }

    this.youtubeApiPromise = new Promise<typeof YT>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${YOUTUBE_IFRAME_API_URL}"]`);
      const previousReadyCallback = window.onYouTubeIframeAPIReady;
      const finalize = () => {
        if (window.YT?.Player) {
          resolve(window.YT);
        } else {
          this.youtubeApiPromise = null;
          reject(new Error('YouTube API did not expose the player constructor.'));
        }
      };

      window.onYouTubeIframeAPIReady = () => {
        previousReadyCallback?.();
        finalize();
      };

      if (existingScript) {
        return;
      }

      const script = document.createElement('script');
      script.src = YOUTUBE_IFRAME_API_URL;
      script.async = true;
      script.onerror = () => {
        this.youtubeApiPromise = null;
        reject(new Error('Failed to load the YouTube iframe API.'));
      };

      document.head.appendChild(script);
    });

    return this.youtubeApiPromise;
  }

  private ensureYouTubePlayerHost(): HTMLElement {
    const existingHost = document.getElementById(YOUTUBE_PLAYER_HOST_ID);
    if (existingHost) {
      return existingHost;
    }

    const host = document.createElement('div');
    host.id = YOUTUBE_PLAYER_HOST_ID;
    host.setAttribute('aria-hidden', 'true');
    host.style.position = 'fixed';
    host.style.width = '1px';
    host.style.height = '1px';
    host.style.opacity = '0';
    host.style.pointerEvents = 'none';
    host.style.left = '-9999px';
    host.style.bottom = '0';
    document.body.appendChild(host);

    return host;
  }

  private handleYouTubeStateChange(event: YT.OnStateChangeEvent): void {
    if (!window.YT?.PlayerState) {
      return;
    }

    if (event.data === window.YT.PlayerState.PLAYING) {
      this.patchState({ isPlaying: true, resumePending: false });
      this.persistState();
      return;
    }

    if (event.data === window.YT.PlayerState.PAUSED) {
      if (this.suppressNextYouTubePauseEvent) {
        this.suppressNextYouTubePauseEvent = false;
        return;
      }

      this.patchState({ isPlaying: false, resumePending: false });
      this.persistState();
      return;
    }

    if (event.data === window.YT.PlayerState.ENDED) {
      event.target.playVideo();
    }
  }

  private getPresetConfig(preset: AmbientPreset) {
    switch (preset) {
      case 'antava-glow':
        return {
          stepMs: 600,
          noteLength: 1.2,
          waveform: 'triangle' as OscillatorType,
          notes: [392, 440, 493.88, 523.25, 493.88, 440], // G4-A4-B4-C5 scale
          pulseSteps: [0, 2, 4],
          chimeSteps: [3]
        };
      case 'honey-pulse':
        return {
          stepMs: 500,
          noteLength: 0.9,
          waveform: 'sine' as OscillatorType,
          notes: [329.63, 440, 493.88, 440, 392, 440], // E4-A4-B4 pattern
          pulseSteps: [0, 1, 3, 5],
          chimeSteps: [2, 4]
        };
      case 'maaya-twilight':
      default:
        return {
          stepMs: 700,
          noteLength: 1.4,
          waveform: 'sine' as OscillatorType,
          notes: [349.23, 392, 440, 523.25, 440, 392], // F4-G4-A4-C5 romantic scale
          pulseSteps: [0, 2, 4],
          chimeSteps: [3]
        };
    }
  }

  private getCurrentTrack(): MusicPlayerTrack | null {
    return this.stateSubject.value.playlist[this.stateSubject.value.currentTrackIndex] ?? null;
  }

  private bindResumeOnFirstGesture(): void {
    if (this.hasUserActivationListener || typeof window === 'undefined') {
      return;
    }

    this.hasUserActivationListener = true;
    const resume = () => {
      this.hasUserActivationListener = false;
      if (this.stateSubject.value.resumePending) {
        void this.play();
      }

      window.removeEventListener('pointerdown', resume);
      window.removeEventListener('keydown', resume);
    };

    window.addEventListener('pointerdown', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
  }

  private scheduleAutoMinimize(): void {
    this.clearAutoMinimize();
    this.autoMinimizeTimer = setTimeout(() => {
      if (this.stateSubject.value.isPlaying) {
        this.patchState({ isExpanded: false });
        this.persistState();
      }
    }, 4600);
  }

  private clearAutoMinimize(): void {
    if (this.autoMinimizeTimer) {
      clearTimeout(this.autoMinimizeTimer);
      this.autoMinimizeTimer = null;
    }
  }

  private patchState(patch: Partial<MusicPlayerState>): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...patch
    });
  }
}
