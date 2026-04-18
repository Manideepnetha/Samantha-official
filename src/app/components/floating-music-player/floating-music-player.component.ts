import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  MusicPlayerService,
  MusicPlayerState,
  MusicPlayerTrack
} from '../../services/music-player.service';

@Component({
  selector: 'app-floating-music-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="music-widget" *ngIf="currentTrack as track">
      <button *ngIf="!isExpanded" type="button" class="music-mini" (click)="expand()">
        <img [src]="track.coverUrl" [alt]="track.title" />
        <div class="music-mini-copy">
          <strong>Now Playing</strong>
          <span>{{ track.title }}</span>
        </div>
        <div class="music-mini-wave" [class.is-playing]="isPlaying">
          <span></span><span></span><span></span>
        </div>
      </button>

      <div *ngIf="isExpanded" class="music-panel">
        <button type="button" class="music-close" (click)="collapse()" aria-label="Minimize">&times;</button>

        <div class="music-panel-top">
          <img [src]="track.coverUrl" [alt]="track.title" class="music-art" />
          <div class="music-copy">
            <span class="music-kicker">Now Playing</span>
            <h3>{{ track.title }}</h3>
            <p>{{ track.subtitle }}</p>
          </div>
        </div>

        <div class="music-status" *ngIf="resumePending">
          Tap play once more if your browser paused the audio on first load.
        </div>

        <div class="music-controls">
          <button type="button" (click)="previous()" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none"><path d="M7 6v12M17 7l-7 5 7 5V7z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button type="button" class="music-play" (click)="togglePlay()" aria-label="Play or pause">
            <svg *ngIf="!isPlaying" viewBox="0 0 24 24" fill="none"><path d="M9 7.5v9l7-4.5-7-4.5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg *ngIf="isPlaying" viewBox="0 0 24 24" fill="none"><path d="M10 7v10M14 7v10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
          <button type="button" (click)="next()" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none"><path d="M17 6v12M7 7l7 5-7 5V7z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <div class="music-list" *ngIf="tracks.length > 1">
          <button *ngFor="let playlistTrack of tracks; let i = index"
                  type="button" class="music-track"
                  [class.is-active]="i === currentIndex"
                  (click)="selectTrack(i)">
            <img [src]="playlistTrack.coverUrl" [alt]="playlistTrack.title" />
            <div>
              <strong>{{ playlistTrack.title }}</strong>
              <span>{{ playlistTrack.subtitle }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { position: fixed; right: 1rem; bottom: 1rem; z-index: 190; }
    .music-widget { width: 20rem; max-width: calc(100vw - 1.5rem); }
    .music-mini, .music-panel {
      border: 1px solid rgba(228,196,163,0.16);
      background: linear-gradient(180deg, rgba(243,232,220,0.08), rgba(18,9,7,0.94)), rgba(18,9,7,0.92);
      backdrop-filter: blur(18px);
      box-shadow: 0 24px 60px rgba(0,0,0,0.28);
    }
    .music-mini {
      display: grid; grid-template-columns: 3.35rem minmax(0,1fr) auto;
      align-items: center; gap: 0.85rem; width: 100%;
      padding: 0.72rem; border-radius: 1.35rem; text-align: left; cursor: pointer;
    }
    .music-mini img, .music-art, .music-track img { object-fit: cover; border-radius: 999px; }
    .music-mini img { width: 3.35rem; height: 3.35rem; box-shadow: 0 0 0 1px rgba(228,196,163,0.18); }
    .music-mini-copy strong { display: block; font-family: "Cormorant Garamond","Playfair Display",serif; font-weight: 500; color: #f6ecdf; font-size: 1.2rem; }
    .music-mini-copy span { display: block; font-family: "Manrope","Inter",sans-serif; color: var(--editorial-muted); font-size: 0.82rem; }
    .music-mini-wave { display: inline-flex; gap: 0.18rem; align-items: flex-end; min-width: 1.5rem; justify-content: center; }
    .music-mini-wave span { width: 0.16rem; height: 0.8rem; border-radius: 999px; background: rgba(228,196,163,0.35); animation: music-wave 1s ease-in-out infinite; animation-play-state: paused; }
    .music-mini-wave span:nth-child(2) { animation-delay: 0.12s; }
    .music-mini-wave span:nth-child(3) { animation-delay: 0.24s; }
    .music-mini-wave.is-playing span { background: var(--editorial-accent-strong); animation-play-state: running; }
    .music-panel { position: relative; display: grid; gap: 1rem; padding: 1rem; border-radius: 1.65rem; animation: music-expand 0.3s ease; }
    .music-close { position: absolute; top: 0.8rem; right: 0.9rem; width: 2rem; height: 2rem; border-radius: 999px; background: rgba(243,232,220,0.06); color: rgba(243,232,220,0.72); font-size: 1.2rem; cursor: pointer; }
    .music-panel-top { display: grid; grid-template-columns: 5rem minmax(0,1fr); gap: 0.95rem; padding-right: 2.2rem; }
    .music-art { width: 5rem; height: 5rem; box-shadow: 0 0 0 1px rgba(228,196,163,0.2), 0 18px 30px rgba(0,0,0,0.2); }
    .music-kicker { display: block; font-family: "Manrope","Inter",sans-serif; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--editorial-accent); }
    .music-copy h3 { margin: 0.35rem 0 0; font-family: "Cormorant Garamond","Playfair Display",serif; font-weight: 500; color: #f6ecdf; font-size: 2rem; line-height: 0.94; }
    .music-copy p { margin: 0.45rem 0 0; font-family: "Manrope","Inter",sans-serif; color: var(--editorial-muted); font-size: 0.9rem; }
    .music-status {
      padding: 0.7rem 0.9rem;
      border-radius: 0.9rem;
      background: rgba(243,232,220,0.05);
      color: rgba(243,232,220,0.76);
      font-family: "Manrope","Inter",sans-serif;
      font-size: 0.76rem;
      line-height: 1.5;
    }
    .music-controls { display: flex; align-items: center; justify-content: center; gap: 0.8rem; }
    .music-controls button { display: inline-flex; align-items: center; justify-content: center; width: 2.8rem; height: 2.8rem; border-radius: 999px; background: rgba(243,232,220,0.05); color: rgba(243,232,220,0.84); cursor: pointer; }
    .music-controls button svg { width: 1.1rem; height: 1.1rem; }
    .music-play { width: 3.35rem !important; height: 3.35rem !important; background: linear-gradient(135deg, #d5b18c 0%, #e2c4a1 100%) !important; color: #24130f !important; box-shadow: 0 12px 26px rgba(212,177,140,0.2); }
    .music-list { display: grid; gap: 0.6rem; }
    .music-track { display: grid; grid-template-columns: 2.9rem minmax(0,1fr); align-items: center; gap: 0.7rem; padding: 0.55rem; border-radius: 1rem; border: 1px solid rgba(228,196,163,0.08); background: rgba(243,232,220,0.03); text-align: left; cursor: pointer; }
    .music-track.is-active { border-color: rgba(228,196,163,0.22); background: rgba(215,177,138,0.1); }
    .music-track img { width: 2.9rem; height: 2.9rem; }
    .music-track strong { display: block; font-family: "Cormorant Garamond","Playfair Display",serif; font-weight: 500; color: #f6ecdf; font-size: 1.15rem; }
    .music-track span { display: block; font-family: "Manrope","Inter",sans-serif; color: var(--editorial-muted); font-size: 0.78rem; }
    @keyframes music-wave { 0%,100% { transform: scaleY(0.45); } 50% { transform: scaleY(1); } }
    @keyframes music-expand { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @media (max-width: 767px) { :host { bottom: 5.75rem; right: 0.85rem; } .music-widget { width: min(19rem, calc(100vw - 1.2rem)); } }
  `]
})
export class FloatingMusicPlayerComponent implements OnInit, OnDestroy {
  private readonly fallbackTrack: MusicPlayerTrack = {
    key: 'loading',
    title: 'Thassadiya',
    subtitle: 'Maa Inti Bangaram',
    coverUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1776277916/samantha-official-website/music/Maa-Inti-Bangaram_xb1fuc.webp',
    source: 'audio',
    url: 'https://res.cloudinary.com/dpnd6ve1e/video/upload/v1776277706/samantha-official-website/music/WhatsApp_Audio_2026-04-15_at_10.45.02_PM_iimghz.mp3',
    ambientPreset: 'antava-glow'
  };

  private stateSubscription: Subscription | null = null;

  tracks: MusicPlayerTrack[] = [this.fallbackTrack];
  currentIndex = 0;
  isPlaying = false;
  isExpanded = false;
  resumePending = false;

  constructor(private musicPlayerService: MusicPlayerService) {}

  get currentTrack(): MusicPlayerTrack {
    return this.tracks[this.currentIndex] ?? this.tracks[0] ?? this.fallbackTrack;
  }

  ngOnInit(): void {
    this.musicPlayerService.initialize();
    this.stateSubscription = this.musicPlayerService.state$.subscribe(state => this.applyState(state));
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
  }

  expand(): void {
    this.musicPlayerService.setExpanded(true);
  }

  collapse(): void {
    this.musicPlayerService.setExpanded(false);
  }

  togglePlay(): void {
    this.musicPlayerService.togglePlayback();
  }

  next(): void {
    void this.musicPlayerService.next();
  }

  previous(): void {
    void this.musicPlayerService.previous();
  }

  selectTrack(index: number): void {
    void this.musicPlayerService.selectTrack(index);
  }

  private applyState(state: MusicPlayerState): void {
    this.tracks = state.playlist.length > 0 ? state.playlist : [this.fallbackTrack];
    this.currentIndex = Math.min(state.currentTrackIndex, this.tracks.length - 1);
    this.isPlaying = state.isPlaying;
    this.isExpanded = state.isExpanded;
    this.resumePending = state.resumePending;
  }
}
