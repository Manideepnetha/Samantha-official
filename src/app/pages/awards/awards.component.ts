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
          <p>Major honors, defining moments, and milestones mapped into an editorial timeline without changing the underlying award data.</p>
        </div>

        <div *ngIf="timelineAwards.length === 0" class="sr-empty-state">
          Loading awards...
        </div>

        <div class="grid gap-6 md:grid-cols-2" *ngIf="timelineAwards.length > 0">
          <div *ngFor="let award of timelineAwards" class="sr-surface p-6 md:p-7 sr-hover-card h-full">
            <div class="sr-meta mb-4 text-base">{{ award.year }}</div>
            <div>
              <h3 class="sr-card-title mb-3">{{ award.title }}</h3>
              <p class="sr-card-text">{{ award.description }}</p>
              <blockquote *ngIf="award.quote" class="mt-4 border-l border-[rgba(228,196,163,0.28)] pl-4 font-['Cormorant_Garamond'] text-2xl italic text-[#f6ecdf]">
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
  styles: []
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
