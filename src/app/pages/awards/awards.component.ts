import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Award } from '../../services/api.service';

@Component({
  selector: 'app-awards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sr-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel min-h-[540px]">
            <div class="sr-hero-media">
              <img
                src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748038033/ad7ccf187002995.6580064d3e931_ajzyv5.jpg"
                alt="Awards & Milestones"
                class="object-[center_top_26%]"
              />
            </div>

            <div class="sr-hero-copy max-w-3xl">
              <span class="sr-kicker">Recognition</span>
              <h1 class="sr-hero-title">Awards & Milestones</h1>
              <p class="sr-hero-subtitle">
                Celebrating moments of excellence and recognition throughout Samantha's illustrious career.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="sr-section-heading">
          <span class="sr-kicker">Timeline</span>
          <h2>Recognition Over Time</h2>
          <p>Major honors, defining moments, and milestones mapped into an editorial timeline.</p>
        </div>

        <div *ngIf="timelineAwards.length === 0" class="sr-empty-state">Loading awards...</div>

        <!-- Vertical timeline -->
        <div *ngIf="timelineAwards.length > 0" class="awards-timeline">
          <div *ngFor="let award of timelineAwards; let i = index; let odd = odd"
               class="timeline-item" [class.timeline-item--right]="odd">
            <div class="timeline-dot"></div>
            <div class="sr-surface p-6 md:p-7 sr-hover-card timeline-card">
              <div class="sr-meta mb-3">{{ award.year }}</div>
              <h3 class="sr-card-title mb-3">{{ award.title }}</h3>
              <p class="sr-card-text">{{ award.description }}</p>
              <blockquote *ngIf="award.quote"
                class="mt-4 border-l-2 border-[rgba(228,196,163,0.4)] pl-4 font-['Cormorant_Garamond'] text-xl italic text-[#f6ecdf]">
                "{{ award.quote }}"
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section pb-12">
        <div class="sr-section-heading">
          <span class="sr-kicker">Gallery</span>
          <h2>Award Gallery</h2>
          <p>A visual archive of celebrated moments presented in the same premium style as the homepage.</p>
        </div>

        <div *ngIf="galleryAwards.length === 0" class="sr-empty-state">
          Loading gallery...
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" *ngIf="galleryAwards.length > 0">
          <div *ngFor="let item of galleryAwards" class="sr-surface overflow-hidden sr-hover-card group">
            <div class="relative aspect-[3/4] overflow-hidden">
              <img [src]="item.imageUrl" [alt]="item.title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div class="absolute inset-0 bg-gradient-to-t from-[rgba(8,4,4,0.84)] via-transparent to-transparent"></div>
            </div>
            <div class="p-6">
              <span class="sr-meta">{{ item.year }}</span>
              <h3 class="sr-card-title mt-3 mb-2">{{ item.title }}</h3>
              <p class="sr-card-text">{{ item.category || 'Award recognition' }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    /* Two-column timeline — cards side by side, center line, no gaps */
    .awards-timeline {
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
    }
    /* Center vertical line */
    .awards-timeline::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0; bottom: 0;
      width: 1px;
      transform: translateX(-50%);
      background: linear-gradient(180deg, transparent, rgba(214,169,93,0.5) 3%, rgba(214,169,93,0.5) 97%, transparent);
      z-index: 0;
    }
    /* Every item spans both columns but uses padding to sit in one half */
    .timeline-item {
      position: relative;
      grid-column: 1;
      padding: 0 2rem 1rem 0;
    }
    .timeline-item--right {
      grid-column: 2;
      padding: 0 0 1rem 2rem;
      /* Pull up to align with the previous left item */
      margin-top: 0;
    }
    /* Dot sits on the center line */
    .timeline-dot {
      position: absolute;
      top: 1.4rem;
      width: 12px; height: 12px;
      border-radius: 50%;
      background: #d6a95d;
      border: 2px solid rgba(214,169,93,0.3);
      box-shadow: 0 0 0 4px rgba(214,169,93,0.12);
      z-index: 1;
    }
    /* Left item dot on right edge */
    .timeline-item:not(.timeline-item--right) .timeline-dot {
      right: -6px;
      left: auto;
    }
    /* Right item dot on left edge */
    .timeline-item--right .timeline-dot {
      left: -6px;
    }
    .timeline-card { width: 100%; }

    @media (max-width: 768px) {
      .awards-timeline { grid-template-columns: 1fr; }
      .awards-timeline::before { left: 0.75rem; }
      .timeline-item, .timeline-item--right {
        grid-column: 1;
        padding: 0 0 1rem 2.5rem;
      }
      .timeline-item .timeline-dot,
      .timeline-item--right .timeline-dot {
        left: 0.25rem; right: auto;
      }
    }
  `]
})
export class AwardsComponent implements OnInit {
  timelineAwards: Award[] = [];
  galleryAwards: Award[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getAwards().subscribe(data => {
      this.timelineAwards = data
        .filter(a => a.type === 'Timeline')
        .sort((a, b) => b.year - a.year);

      this.galleryAwards = data
        .filter(a => a.type === 'Gallery')
        .sort((a, b) => b.year - a.year);
    });
  }
}
