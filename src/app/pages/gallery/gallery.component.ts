import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  category: string;
  caption: string;
  date?: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sr-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel min-h-[500px]">
            <div class="sr-hero-media">
              <img
                src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748295799/5_6185746542628962570_c68nyo.jpg"
                alt="Gallery"
                class="object-[center_35%]"
              />
            </div>

            <div class="sr-hero-copy max-w-3xl text-center md:text-left">
              <span class="sr-kicker">Gallery</span>
              <h1 class="sr-hero-title">Visual Journey</h1>
              <p class="sr-hero-subtitle">
                A curated collection of moments captured throughout Samantha's career.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="sr-surface p-4">
          <div class="flex flex-wrap justify-center gap-3">
            <button
              *ngFor="let category of categories"
              type="button"
              (click)="filterByCategory(category.value)"
              class="sr-chip"
              [class.is-active]="selectedCategory === category.value"
            >
              {{category.label}}
            </button>
          </div>
        </div>
      </section>

      <section class="sr-section pb-12">
        <div class="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3 xl:columns-4">
          <div
            *ngFor="let image of filteredImages"
            class="sr-surface sr-hover-card group relative mb-6 break-inside-avoid-column cursor-pointer overflow-hidden"
            (click)="openLightbox(image)"
          >
            <img
              [src]="image.url"
              [alt]="image.alt"
              class="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[rgba(8,4,4,0.82)] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div class="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p class="text-sm font-semibold uppercase tracking-[0.08em] text-[#f6ecdf]">{{image.caption}}</p>
              <span *ngIf="image.date" class="sr-meta mt-2 inline-flex">{{image.date}}</span>
            </div>
          </div>
        </div>

        <div *ngIf="filteredImages.length === 0" class="sr-empty-state">
          We couldn't find any images in this category.
        </div>
      </section>

      <div
        *ngIf="lightboxImage"
        class="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,4,4,0.92)] p-4"
        (click)="closeLightbox()"
      >
        <button (click)="closeLightbox()" class="sr-close-button absolute right-6 top-6 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          *ngIf="filteredImages.length > 1"
          (click)="navigateLightbox('prev', $event)"
          class="sr-close-button absolute left-6 top-1/2 -translate-y-1/2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          *ngIf="filteredImages.length > 1"
          (click)="navigateLightbox('next', $event)"
          class="sr-close-button absolute right-6 top-1/2 -translate-y-1/2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div class="sr-modal-panel relative max-w-6xl overflow-hidden" (click)="$event.stopPropagation()">
          <img
            [src]="lightboxImage.url"
            [alt]="lightboxImage.alt"
            class="max-h-[80vh] max-w-full object-contain"
          />
          <div class="p-5">
            <h3 class="sr-card-title mb-2">{{lightboxImage.alt}}</h3>
            <p class="sr-card-text">{{lightboxImage.caption}}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class GalleryComponent implements OnInit {
  categories = [
    { value: 'all', label: 'All Photos' },
    { value: 'films', label: 'Films' },
    { value: 'events', label: 'Events' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'bts', label: 'Behind the Scenes' },
    { value: 'photoshoots', label: 'Photoshoots' }
  ];

  selectedCategory: string = 'all';
  images: GalleryImage[] = [];
  filteredImages: GalleryImage[] = [];
  lightboxImage: GalleryImage | null = null;
  currentLightboxIndex: number = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getMediaGalleries().subscribe(data => {
      this.images = data
        .filter(item => item.type !== 'Home')
        .map(item => ({
          id: item.id!,
          url: item.imageUrl,
          alt: item.altText || item.caption,
          category: item.type,
          caption: item.caption,
          date: item.date,
          width: 800,
          height: 800
        }));

      this.filteredImages = [...this.images];
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;

    if (category === 'all') {
      this.filteredImages = [...this.images];
    } else {
      this.filteredImages = this.images.filter(image => image.category === category);
    }
  }

  openLightbox(image: GalleryImage): void {
    this.lightboxImage = image;
    this.currentLightboxIndex = this.filteredImages.findIndex(img => img.id === image.id);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxImage = null;
    document.body.style.overflow = '';
  }

  navigateLightbox(direction: 'prev' | 'next', event: Event): void {
    event.stopPropagation();

    if (direction === 'prev') {
      this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.filteredImages.length) % this.filteredImages.length;
    } else {
      this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.filteredImages.length;
    }

    this.lightboxImage = this.filteredImages[this.currentLightboxIndex];
  }
}
