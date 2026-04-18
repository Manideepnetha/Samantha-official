import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { INSTAGRAM_FEED_CONFIG } from '../../data/fan-experience.data';

@Component({
  selector: 'app-instagram-feed-embed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ig-section">

      <!-- Header -->
      <div class="ig-header">
        <div class="ig-profile">
          <div class="ig-avatar">
            <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748007968/8F9A7052_blcxqk.jpg"
                 alt="Samantha Ruth Prabhu" />
          </div>
          <div>
            <span class="ig-handle">{{ config.handle }}</span>
            <span class="ig-sub">Official Instagram</span>
          </div>
        </div>
        <a [href]="config.profileUrl" target="_blank" rel="noreferrer" class="ig-follow-btn">
          Follow on Instagram
        </a>
      </div>

      <!-- Explanation -->
      <div class="ig-notice">
        <svg xmlns="http://www.w3.org/2000/svg" class="ig-notice-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>Instagram's live feed requires account authorization. To show real-time posts, Samantha's team needs to connect the account once via <strong>behold.so</strong> — a free 2-minute setup. Until then, visit her profile directly.</p>
      </div>

      <!-- Photo grid linking to Instagram -->
      <div class="ig-grid">
        <a *ngFor="let post of posts; let i = index"
           [href]="post.href" target="_blank" rel="noreferrer"
           class="ig-tile" [class.ig-tile-large]="i === 0">
          <img [src]="post.imageUrl" [alt]="post.alt" loading="lazy" />
          <div class="ig-tile-overlay">
            <span class="ig-tile-caption">{{ post.caption }}</span>
          </div>
        </a>
      </div>

      <a [href]="config.profileUrl" target="_blank" rel="noreferrer" class="ig-view-all">
        View all posts on Instagram →
      </a>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .ig-section { display: flex; flex-direction: column; gap: 1.25rem; }
    .ig-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
    .ig-profile { display: flex; align-items: center; gap: 0.85rem; }
    .ig-avatar { width: 3rem; height: 3rem; border-radius: 50%; overflow: hidden; border: 2px solid rgba(214,169,93,0.4); flex-shrink: 0; }
    .ig-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .ig-handle { display: block; font-family: "Manrope","Inter",sans-serif; font-size: 0.88rem; font-weight: 700; color: #f6ecdf; }
    .ig-sub { display: block; font-family: "Manrope","Inter",sans-serif; font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(243,232,220,0.45); margin-top: 0.15rem; }
    .ig-follow-btn { display: inline-flex; align-items: center; height: 2.4rem; padding: 0 1.1rem; border-radius: 999px; border: 1px solid rgba(214,169,93,0.35); background: rgba(214,169,93,0.08); color: #d6a95d; font-family: "Manrope","Inter",sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; transition: background 200ms, transform 200ms; white-space: nowrap; }
    .ig-follow-btn:hover { background: rgba(214,169,93,0.16); transform: translateY(-1px); }
    .ig-notice { display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.85rem 1rem; border-radius: 0.65rem; border: 1px solid rgba(214,169,93,0.2); background: rgba(214,169,93,0.06); }
    .ig-notice-icon { width: 1.2rem; height: 1.2rem; flex-shrink: 0; color: #d6a95d; margin-top: 0.1rem; }
    .ig-notice p { font-family: "Manrope","Inter",sans-serif; font-size: 0.75rem; line-height: 1.6; color: rgba(243,232,220,0.6); margin: 0; }
    .ig-notice strong { color: #d6a95d; font-weight: 700; }
    .ig-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 1fr); gap: 0.5rem; aspect-ratio: 3/2; }
    .ig-tile { position: relative; overflow: hidden; border-radius: 0.6rem; display: block; }
    .ig-tile-large { grid-column: 1 / 2; grid-row: 1 / 3; }
    .ig-tile img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 400ms ease; }
    .ig-tile:hover img { transform: scale(1.06); }
    .ig-tile-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,4,4,0.75) 0%, transparent 50%); opacity: 0; transition: opacity 250ms; display: flex; align-items: flex-end; padding: 0.6rem; }
    .ig-tile:hover .ig-tile-overlay { opacity: 1; }
    .ig-tile-caption { font-family: "Manrope","Inter",sans-serif; font-size: 0.68rem; color: rgba(255,255,255,0.85); line-height: 1.4; }
    .ig-view-all { display: inline-flex; align-items: center; font-family: "Manrope","Inter",sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #d6a95d; gap: 0.4rem; transition: gap 200ms; }
    .ig-view-all:hover { gap: 0.7rem; }
    @media (max-width: 640px) { .ig-grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: auto; aspect-ratio: auto; } .ig-tile-large { grid-column: 1 / 3; grid-row: auto; aspect-ratio: 16/9; } }
  `]
})
export class InstagramFeedEmbedComponent {
  readonly config = INSTAGRAM_FEED_CONFIG;

  readonly posts = [
    { imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008414/8F9A7087_koclpw.jpg', alt: 'Samantha editorial portrait', caption: 'Editorial portrait', href: 'https://www.instagram.com/samantharuthprabhuoffl/' },
    { imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg', alt: 'Samantha fashion', caption: 'Fashion moment', href: 'https://www.instagram.com/samantharuthprabhuoffl/' },
    { imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008413/PAND7159_k4qlvo.jpg', alt: 'Samantha portrait', caption: 'Behind the frame', href: 'https://www.instagram.com/samantharuthprabhuoffl/' },
    { imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748010072/8F9A7985_m86vsc.jpg', alt: 'Samantha portrait', caption: 'Style diary', href: 'https://www.instagram.com/samantharuthprabhuoffl/' },
    { imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg', alt: 'Samantha candid', caption: 'Candid moment', href: 'https://www.instagram.com/samantharuthprabhuoffl/' }
  ];
}
