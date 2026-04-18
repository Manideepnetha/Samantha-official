declare global {
  namespace YT {
    interface PlayerVars {
      autoplay?: 0 | 1;
      controls?: 0 | 1;
      disablekb?: 0 | 1;
      enablejsapi?: 0 | 1;
      fs?: 0 | 1;
      modestbranding?: 0 | 1;
      origin?: string;
      playsinline?: 0 | 1;
      rel?: 0 | 1;
    }

    interface PlayerEvent {
      target: Player;
    }

    interface OnStateChangeEvent extends PlayerEvent {
      data: number;
    }

    interface OnErrorEvent extends PlayerEvent {
      data: number;
    }

    interface Events {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onError?: (event: OnErrorEvent) => void;
    }

    interface PlayerOptions {
      width?: string | number;
      height?: string | number;
      videoId?: string;
      playerVars?: PlayerVars;
      events?: Events;
    }

    interface Player {
      cueVideoById(videoId: string): void;
      destroy(): void;
      getIframe(): HTMLIFrameElement;
      getPlayerState(): number;
      loadVideoById(videoId: string): void;
      mute(): void;
      pauseVideo(): void;
      playVideo(): void;
      setVolume(volume: number): void;
      stopVideo(): void;
      unMute(): void;
    }

    interface PlayerConstructor {
      new (elementId: string | HTMLElement, options?: PlayerOptions): Player;
    }

    const Player: PlayerConstructor;
    const PlayerState: {
      UNSTARTED: -1;
      ENDED: 0;
      PLAYING: 1;
      PAUSED: 2;
      BUFFERING: 3;
      CUED: 5;
    };
  }

  interface Window {
    YT?: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export {};
