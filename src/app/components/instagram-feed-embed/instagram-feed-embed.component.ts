import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { INSTAGRAM_FEED_CONFIG, LATEST_INSTAGRAM_POSTS } from '../../data/fan-experience.data';

type InstagramPreviewCard = (typeof LATEST_INSTAGRAM_POSTS)[number];

@Component({
  selector: 'app-instagram-feed-embed',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ig-section">
      <span class="ig-orbit ig-orbit-top" aria-hidden="true"></span>
      <span class="ig-orbit ig-orbit-bottom" aria-hidden="true"></span>

      <div class="ig-content">
        <div class="ig-header">
          <div class="ig-profile">
            <div class="ig-avatar">
              <img
                src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748007968/8F9A7052_blcxqk.jpg"
                alt="Samantha Ruth Prabhu"
              />
            </div>
            <div class="ig-profile-copy">
              <span class="ig-handle">{{ config.handle }}</span>
              <span class="ig-sub">Official Instagram</span>
            </div>
          </div>
          <a [href]="config.profileUrl" target="_blank" rel="noreferrer" class="ig-follow-btn">
            <span>Follow on Instagram</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </div>

        <ng-container *ngIf="featuredPost as featured; else emptyInstagramFeed">
          <div class="ig-layout">
            <a
              [href]="featured.href"
              target="_blank"
              rel="noreferrer"
              class="ig-feature-card"
            >
              <div class="ig-media-frame ig-media-frame-featured">
                <div class="ig-media-backdrop" [style.background-image]="getBackdropImage(featured.imageUrl)"></div>
                <div class="ig-media-sheen" aria-hidden="true"></div>
                <div class="ig-feature-badges">
                  <span class="ig-type-pill">{{ featured.typeLabel }}</span>
                  <span class="ig-date-pill">{{ featured.dateLabel }}</span>
                </div>
                <img
                  [src]="featured.imageUrl"
                  [alt]="featured.alt"
                  loading="lazy"
                  decoding="async"
                />
                <div *ngIf="isReel(featured)" class="ig-play-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 6.25v11.5l9-5.75-9-5.75z" />
                  </svg>
                </div>
              </div>

              <div class="ig-feature-copy">
                <h3>{{ featured.title }}</h3>
                <p>{{ featured.caption }}</p>
              </div>
            </a>

            <div class="ig-side-grid" aria-label="More Instagram posts">
              <a
                *ngFor="let post of secondaryPosts; trackBy: trackByPost"
                [href]="post.href"
                target="_blank"
                rel="noreferrer"
                class="ig-side-card"
              >
                <div class="ig-media-frame ig-media-frame-compact">
                  <div class="ig-media-backdrop" [style.background-image]="getBackdropImage(post.imageUrl)"></div>
                  <div class="ig-media-sheen" aria-hidden="true"></div>
                  <div class="ig-side-card-topbar">
                    <span class="ig-type-pill ig-type-pill-compact">{{ post.typeLabel }}</span>
                  </div>
                  <img
                    [src]="post.imageUrl"
                    [alt]="post.alt"
                    loading="lazy"
                    decoding="async"
                  />
                  <div *ngIf="isReel(post)" class="ig-play-badge ig-play-badge-compact" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 6.25v11.5l9-5.75-9-5.75z" />
                    </svg>
                  </div>
                </div>

                <div class="ig-side-copy">
                  <span class="ig-card-date">{{ post.dateLabel }}</span>
                  <h4>{{ post.title }}</h4>
                  <p>{{ post.caption }}</p>
                </div>
              </a>
            </div>
          </div>
        </ng-container>

        <ng-template #emptyInstagramFeed>
          <div class="ig-empty-state">Latest Instagram updates are syncing.</div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
      align-self: start;
    }
    .ig-section {
      position: relative;
      isolation: isolate;
      display: block;
      width: 100%;
      height: auto;
      min-height: 0;
      padding: clamp(1.05rem, 2vw, 1.45rem);
      overflow: hidden;
      border: 1px solid rgba(214, 169, 93, 0.18);
      border-radius: 2rem;
      background:
        radial-gradient(circle at top right, rgba(214, 169, 93, 0.16), transparent 30%),
        radial-gradient(circle at left bottom, rgba(150, 85, 62, 0.18), transparent 32%),
        linear-gradient(180deg, rgba(36, 17, 14, 0.98) 0%, rgba(15, 8, 7, 0.98) 100%);
      box-shadow: 0 28px 70px rgba(0, 0, 0, 0.24);
    }
    .ig-section > * {
      position: relative;
      z-index: 1;
    }
    .ig-content {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      gap: 1rem;
      width: 100%;
      min-width: 0;
    }
    .ig-orbit {
      position: absolute;
      border-radius: 999px;
      pointer-events: none;
      filter: blur(16px);
      opacity: 0.88;
      z-index: 0;
    }
    .ig-orbit-top {
      top: -5.5rem;
      right: -3rem;
      width: 16rem;
      height: 16rem;
      background: radial-gradient(circle, rgba(226, 162, 117, 0.22) 0%, transparent 72%);
    }
    .ig-orbit-bottom {
      left: -4.5rem;
      bottom: -6rem;
      width: 14rem;
      height: 14rem;
      background: radial-gradient(circle, rgba(183, 108, 78, 0.18) 0%, transparent 72%);
    }
    .ig-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .ig-profile {
      display: flex;
      align-items: center;
      gap: 0.9rem;
    }
    .ig-profile-copy {
      display: grid;
      gap: 0.18rem;
    }
    .ig-avatar {
      width: 3.2rem;
      height: 3.2rem;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid rgba(214,169,93,0.4);
      flex-shrink: 0;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
    }
    .ig-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .ig-handle {
      display: block;
      font-family: "Manrope","Inter",sans-serif;
      font-size: 0.92rem;
      font-weight: 700;
      color: #f6ecdf;
    }
    .ig-sub {
      display: block;
      font-family: "Manrope","Inter",sans-serif;
      font-size: 0.68rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(243,232,220,0.48);
    }
    .ig-follow-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      min-height: 2.7rem;
      padding: 0 1.2rem;
      border-radius: 999px;
      border: 1px solid rgba(214,169,93,0.35);
      background: rgba(214,169,93,0.08);
      color: #d6a95d;
      font-family: "Manrope","Inter",sans-serif;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      white-space: nowrap;
      transition: background 200ms ease, transform 200ms ease, border-color 200ms ease;
    }
    .ig-follow-btn svg {
      width: 0.95rem;
      height: 0.95rem;
    }
    .ig-follow-btn:hover {
      background: rgba(214,169,93,0.16);
      border-color: rgba(214,169,93,0.5);
      transform: translateY(-1px);
    }
    .ig-card-date {
      font-family: "Manrope","Inter",sans-serif;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }
    .ig-card-date {
      color: rgba(243, 232, 220, 0.56);
    }
    .ig-feature-copy h3,
    .ig-side-copy h4 {
      margin: 0;
      font-family: "Cormorant Garamond","Playfair Display",serif;
      font-weight: 500;
      line-height: 0.96;
      color: #fbf1e5;
    }
    .ig-feature-copy p,
    .ig-side-copy p {
      margin: 0;
      font-family: "Manrope","Inter",sans-serif;
      line-height: 1.75;
      color: rgba(243, 232, 220, 0.7);
    }
    .ig-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.04fr) minmax(310px, 0.96fr);
      gap: 0.9rem;
      align-items: start;
      align-content: start;
      width: 100%;
      min-width: 0;
    }
    .ig-feature-card,
    .ig-side-card { color: inherit; text-decoration: none; }
    .ig-feature-card {
      display: grid;
      gap: 0.85rem;
      align-content: start;
      padding: 0.95rem;
      border: 1px solid rgba(214, 169, 93, 0.16);
      border-radius: 1.7rem;
      background:
        radial-gradient(circle at top left, rgba(214, 169, 93, 0.1), transparent 36%),
        linear-gradient(180deg, rgba(44, 22, 18, 0.92), rgba(16, 9, 8, 0.96));
      transition: transform 240ms ease, border-color 240ms ease, box-shadow 240ms ease;
    }
    .ig-feature-card:hover,
    .ig-side-card:hover {
      transform: translateY(-3px);
      border-color: rgba(214, 169, 93, 0.32);
      box-shadow: 0 22px 48px rgba(0, 0, 0, 0.24);
    }
    .ig-feature-copy,
    .ig-side-copy {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .ig-feature-copy {
      gap: 0.85rem;
      padding: 0.2rem 0.2rem 0.1rem;
    }
    .ig-side-card-topbar,
    .ig-feature-badges {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }
    .ig-type-pill,
    .ig-date-pill,
    .ig-card-date { font-family: "Manrope","Inter",sans-serif; }
    .ig-type-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 1.9rem;
      padding: 0 0.75rem;
      border-radius: 999px;
      background: rgba(214, 169, 93, 0.16);
      color: #f4d6b7;
      border: 1px solid rgba(214, 169, 93, 0.2);
    }
    .ig-type-pill-compact {
      min-height: 1.7rem;
      padding: 0 0.65rem;
      font-size: 0.62rem;
    }
    .ig-date-pill { color: rgba(243, 232, 220, 0.56); }
    .ig-feature-copy h3 {
      font-size: clamp(2.3rem, 3.8vw, 3.3rem);
      max-width: 12ch;
    }
    .ig-side-copy h4 {
      font-size: clamp(1.45rem, 2.2vw, 1.95rem);
    }
    .ig-side-copy {
      gap: 0.45rem;
      justify-content: center;
    }
    .ig-side-copy p {
      font-size: 0.82rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .ig-side-grid {
      display: grid;
      gap: 0.95rem;
      align-items: start;
      min-width: 0;
    }
    .ig-side-card {
      display: grid;
      grid-template-columns: clamp(7.4rem, 16vw, 8.8rem) minmax(0, 1fr);
      gap: 0.85rem;
      padding: 0.8rem;
      border: 1px solid rgba(214, 169, 93, 0.14);
      border-radius: 1.45rem;
      background:
        linear-gradient(180deg, rgba(43, 22, 18, 0.9), rgba(17, 10, 9, 0.95)),
        rgba(20, 11, 9, 0.95);
      transition: transform 240ms ease, border-color 240ms ease, box-shadow 240ms ease;
    }
    .ig-media-frame {
      position: relative;
      overflow: hidden;
      border-radius: 1.35rem;
      border: 1px solid rgba(214, 169, 93, 0.16);
      background:
        radial-gradient(circle at top, rgba(214, 169, 93, 0.1), transparent 62%),
        linear-gradient(180deg, rgba(54, 29, 24, 0.98), rgba(17, 9, 8, 0.98));
      isolation: isolate;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ig-media-frame-featured {
      min-height: clamp(15rem, 24vw, 20rem);
      aspect-ratio: 5 / 4;
    }
    .ig-media-frame-compact {
      width: 100%;
      aspect-ratio: 1 / 1;
      align-self: stretch;
    }
    .ig-media-backdrop,
    .ig-media-sheen { position: absolute; inset: 0; }
    .ig-media-backdrop {
      inset: 0.65rem;
      border-radius: 1rem;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      filter: blur(28px) saturate(0.88);
      transform: scale(1.16);
      opacity: 0.48;
      z-index: 0;
    }
    .ig-media-sheen {
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 26%),
        linear-gradient(180deg, transparent 58%, rgba(7, 4, 4, 0.42) 100%);
      z-index: 1;
    }
    .ig-media-frame img {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
      padding: clamp(0.7rem, 1.8vw, 1.05rem);
      display: block;
      transition: transform 280ms ease;
    }
    .ig-feature-card:hover .ig-media-frame img,
    .ig-side-card:hover .ig-media-frame img { transform: scale(1.02); }
    .ig-feature-badges,
    .ig-side-card-topbar {
      position: absolute;
      top: 0.8rem;
      left: 0.8rem;
      right: 0.8rem;
      z-index: 3;
    }
    .ig-side-card-topbar {
      justify-content: space-between;
    }
    .ig-play-badge {
      position: absolute;
      inset: auto auto 0.95rem 0.95rem;
      z-index: 3;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      border-radius: 999px;
      background: rgba(9, 5, 4, 0.72);
      backdrop-filter: blur(10px);
      color: #f4d6b7;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 10px 26px rgba(0, 0, 0, 0.22);
    }
    .ig-play-badge svg { width: 1rem; height: 1rem; margin-left: 0.1rem; }
    .ig-play-badge-compact {
      width: 2.4rem;
      height: 2.4rem;
      inset: auto auto 0.7rem 0.7rem;
    }
    .ig-empty-state {
      padding: 1rem 1.1rem;
      border: 1px dashed rgba(214, 169, 93, 0.22);
      border-radius: 1.2rem;
      background: rgba(243, 232, 220, 0.03);
      font-family: "Manrope","Inter",sans-serif;
      font-size: 0.82rem;
      line-height: 1.6;
      color: rgba(243, 232, 220, 0.68);
    }
    @media (max-width: 1180px) {
      .ig-layout { grid-template-columns: 1fr; }
    }
    @media (max-width: 860px) {
      .ig-feature-copy h3 {
        max-width: none;
      }
    }
    @media (max-width: 640px) {
      .ig-section { padding: 0.95rem; border-radius: 1.45rem; }
      .ig-header,
      .ig-follow-btn { width: 100%; }
      .ig-follow-btn { justify-content: center; }
      .ig-feature-card,
      .ig-side-card { padding: 0.75rem; }
      .ig-media-frame-featured {
        min-height: 13rem;
        aspect-ratio: 4 / 3;
      }
      .ig-side-card {
        grid-template-columns: 1fr;
      }
      .ig-media-frame-compact {
        aspect-ratio: 4 / 3;
      }
      .ig-side-copy h4 { font-size: clamp(1.55rem, 8vw, 1.95rem); }
      .ig-feature-badges,
      .ig-side-card-topbar {
        flex-wrap: wrap;
      }
      .ig-follow-btn { width: 100%; justify-content: center; }
      .ig-header { align-items: stretch; }
    }
  `]
})
export class InstagramFeedEmbedComponent {
  readonly config = INSTAGRAM_FEED_CONFIG;
  readonly posts = LATEST_INSTAGRAM_POSTS;

  get featuredPost(): InstagramPreviewCard | null {
    return this.posts[0] ?? null;
  }

  get secondaryPosts(): InstagramPreviewCard[] {
    return this.posts.slice(1);
  }

  trackByPost(_: number, post: InstagramPreviewCard): string {
    return post.href || post.title;
  }

  isReel(post: InstagramPreviewCard): boolean {
    return post.typeLabel === 'Reel';
  }

  getBackdropImage(imageUrl: string): string {
    return `url("${imageUrl}")`;
  }
}
