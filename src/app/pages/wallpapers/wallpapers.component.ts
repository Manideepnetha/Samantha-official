import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WALLPAPERS } from '../../data/fan-experience.data';

type WallpaperFilter = 'all' | 'desktop' | 'mobile';

@Component({
  selector: 'app-wallpapers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sr-page wallpapers-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel">
            <div class="sr-hero-media">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008414/8F9A7087_koclpw.jpg" alt="Wallpaper downloads cover" />
            </div>
            <div class="sr-hero-copy">
              <span class="sr-kicker">Wallpapers</span>
              <h1 class="sr-hero-title">Download polished frames for desktop and mobile.</h1>
              <p class="sr-hero-subtitle">
                A fan-first wallpaper vault built from the site’s visual library, optimized into portrait and widescreen picks.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="sr-tabbar wallpapers-tabs">
          <button type="button" class="sr-tab" [class.is-active]="activeFilter === 'all'" (click)="activeFilter = 'all'">All</button>
          <button type="button" class="sr-tab" [class.is-active]="activeFilter === 'desktop'" (click)="activeFilter = 'desktop'">Desktop</button>
          <button type="button" class="sr-tab" [class.is-active]="activeFilter === 'mobile'" (click)="activeFilter = 'mobile'">Mobile</button>
        </div>

        <div class="wallpaper-grid">
          <article *ngFor="let wallpaper of filteredWallpapers" class="wallpaper-card sr-surface sr-hover-card">
            <div class="wallpaper-media" [style.--wallpaper-accent]="wallpaper.accent">
              <img [src]="wallpaper.imageUrl" [alt]="wallpaper.title" loading="lazy" />
              <span class="wallpaper-badge">{{ wallpaper.category }}</span>
            </div>

            <div class="wallpaper-copy">
              <div>
                <span class="sr-kicker">{{ wallpaper.collection }}</span>
                <h2>{{ wallpaper.title }}</h2>
                <p>{{ wallpaper.resolution }}</p>
              </div>

              <div class="wallpaper-actions">
                <a [href]="wallpaper.imageUrl" target="_blank" rel="noreferrer" class="sr-button-outline">Preview</a>
                <a [href]="wallpaper.imageUrl" download class="sr-button">Download</a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .wallpapers-page {
      padding-bottom: 5rem;
    }

    .wallpapers-tabs {
      width: fit-content;
      margin-bottom: 2rem;
    }

    .wallpaper-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .wallpaper-card {
      overflow: hidden;
      border-radius: 1.8rem;
    }

    .wallpaper-media {
      position: relative;
      overflow: hidden;
      min-height: 20rem;
      background:
        radial-gradient(circle at 18% 20%, color-mix(in srgb, var(--wallpaper-accent) 40%, transparent), transparent 26%),
        rgba(243, 232, 220, 0.03);
    }

    .wallpaper-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .wallpaper-card:hover .wallpaper-media img {
      transform: scale(1.04);
    }

    .wallpaper-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      min-height: 2rem;
      padding: 0 0.85rem;
      border-radius: 999px;
      background: rgba(18, 9, 7, 0.72);
      border: 1px solid rgba(228, 196, 163, 0.18);
      display: inline-flex;
      align-items: center;
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--editorial-accent-strong);
    }

    .wallpaper-copy {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.25rem;
    }

    .wallpaper-copy h2 {
      margin: 0.2rem 0 0;
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: 2.1rem;
      font-weight: 500;
      color: #f6ecdf;
    }

    .wallpaper-copy p {
      margin: 0.45rem 0 0;
      font-family: "Manrope", "Inter", sans-serif;
      color: var(--editorial-muted);
    }

    .wallpaper-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    @media (max-width: 1080px) {
      .wallpaper-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 720px) {
      .wallpaper-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WallpapersComponent {
  activeFilter: WallpaperFilter = 'all';
  readonly wallpapers = WALLPAPERS;

  get filteredWallpapers() {
    if (this.activeFilter === 'all') {
      return this.wallpapers;
    }

    return this.wallpapers.filter(wallpaper => wallpaper.category === this.activeFilter);
  }
}
