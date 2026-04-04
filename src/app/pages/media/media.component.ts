import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, NewsArticle } from '../../services/api.service';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sr-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel min-h-[500px]">
            <div class="sr-hero-media">
              <img
                src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748293717/FFoxLHbX3EA-HD_p81ikk.jpg"
                alt="Media & Press"
                class="object-[center_24%]"
              />
            </div>

            <div class="sr-hero-copy max-w-3xl text-center md:text-left">
              <span class="sr-kicker">Media & Press</span>
              <h1 class="sr-hero-title">Latest Coverage</h1>
              <p class="sr-hero-subtitle">
                Press features, interviews, and media highlights curated into the same cinematic visual language as the homepage.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section pb-12">
        <div class="sr-section-heading">
          <span class="sr-kicker">Coverage</span>
          <h2>Press Features & Interviews</h2>
          <p>Every current article remains intact, now presented through a richer editorial card system.</p>
        </div>

        <div *ngIf="isLoading" class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div *ngFor="let i of [1,2,3]" class="sr-surface overflow-hidden animate-pulse">
            <div class="h-64 bg-[rgba(243,232,220,0.06)]"></div>
            <div class="space-y-3 p-6">
              <div class="h-3 w-1/4 rounded bg-[rgba(243,232,220,0.08)]"></div>
              <div class="h-6 w-3/4 rounded bg-[rgba(243,232,220,0.08)]"></div>
              <div class="h-3 w-full rounded bg-[rgba(243,232,220,0.08)]"></div>
            </div>
          </div>
        </div>

        <div *ngIf="!isLoading" class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <a
            *ngFor="let article of articles"
            [href]="article.link || '#'"
            [target]="article.link ? '_blank' : '_self'"
            rel="noopener noreferrer"
            class="sr-surface overflow-hidden sr-hover-card group block"
          >
            <div class="relative h-64 overflow-hidden">
              <img
                [src]="article.imageUrl || 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748293717/FFoxLHbX3EA-HD_p81ikk.jpg'"
                [alt]="article.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[rgba(8,4,4,0.72)] via-transparent to-transparent"></div>
            </div>
            <div class="p-6">
              <span class="sr-meta">{{ article.date }}</span>
              <h3 class="sr-card-title mt-3 mb-3 line-clamp-2">{{ article.title }}</h3>
              <p class="sr-card-text line-clamp-3">{{ article.excerpt }}</p>
              <span *ngIf="article.link" class="sr-link mt-5">Read Full Article</span>
            </div>
          </a>

          <div *ngIf="articles.length === 0" class="sr-empty-state md:col-span-2 xl:col-span-3">
            No articles yet. Check back soon for the latest press coverage.
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  `]
})
export class MediaComponent implements OnInit {
  articles: NewsArticle[] = [];
  isLoading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getNews().subscribe({
      next: (data) => { this.articles = data; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }
}
