import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    <div class="min-h-screen bg-ivory dark:bg-deep-black">
      <!-- Hero Section -->
      <section class="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div class="absolute bottom-[-1490px] left-0 right-0">
          <img 
            src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748295799/5_6185746542628962570_c68nyo.jpg" 
            alt="Gallery" 
            class="w-full h-full object-cover object-center" 
          />
          <div class="absolute inset-0 bg-gradient-to-b from-deep-black/80 to-deep-black/40"></div>
        </div>
        
        <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">Gallery</span>
          <h1 class="text-4xl md:text-6xl font-playfair font-bold text-ivory mb-6 text-shadow">Visual Journey</h1>
          <p class="text-xl md:text-2xl text-ivory/90 font-lora italic max-w-3xl">A curated collection of moments captured throughout Samantha's career.</p>
        </div>
      </section>

      <!-- Gallery Filters -->
      <section class="py-10 bg-white dark:bg-charcoal">
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap justify-center gap-4">
            <button 
              *ngFor="let category of categories" 
              (click)="filterByCategory(category.value)"
              [class.bg-royal-gold]="selectedCategory === category.value"
              [class.text-deep-black]="selectedCategory === category.value"
              [class.bg-gray-200]="selectedCategory !== category.value"
              [class.dark:bg-gray-800]="selectedCategory !== category.value"
              [class.text-charcoal]="selectedCategory !== category.value"
              [class.dark:text-ivory]="selectedCategory !== category.value"
              class="px-6 py-2 rounded-full font-inter transition-colors hover:shadow-md"
            >
              {{category.label}}
            </button>
          </div>
        </div>
      </section>

      <!-- Gallery Grid -->
      <section class="py-16 bg-ivory dark:bg-deep-black">
        <div class="container mx-auto px-4">
          <div class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            <div *ngFor="let image of filteredImages" 
                 class="relative break-inside-avoid-column hover-lift cursor-pointer"
                 (click)="openLightbox(image)">
              <img 
                [src]="image.url" 
                [alt]="image.alt" 
                class="w-full rounded-lg shadow-md" 
              />
              <!-- Caption Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end rounded-lg">
                <div class="p-4">
                  <p class="text-ivory text-shadow font-inter">{{image.caption}}</p>
                  <span *ngIf="image.date" class="text-royal-gold text-sm font-inter">{{image.date}}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results Message -->
          <div *ngIf="filteredImages.length === 0" class="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="text-xl font-playfair font-bold text-charcoal dark:text-ivory mb-2">No Images Found</h3>
            <p class="text-charcoal/70 dark:text-ivory/70">We couldn't find any images in this category.</p>
          </div>
        </div>
      </section>

      <!-- Lightbox -->
      <div *ngIf="lightboxImage" 
           class="fixed inset-0 z-50 bg-deep-black/90 flex items-center justify-center p-4"
           (click)="closeLightbox()">
        <!-- Close Button -->
        <button 
          (click)="closeLightbox()" 
          class="absolute top-6 right-6 z-10 text-ivory hover:text-royal-gold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Previous Button -->
        <button 
          *ngIf="filteredImages.length > 1" 
          (click)="navigateLightbox('prev', $event)" 
          class="absolute left-6 top-1/2 transform -translate-y-1/2 text-ivory hover:text-royal-gold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Next Button -->
        <button 
          *ngIf="filteredImages.length > 1" 
          (click)="navigateLightbox('next', $event)" 
          class="absolute right-6 top-1/2 transform -translate-y-1/2 text-ivory hover:text-royal-gold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Image -->
        <div class="relative max-w-6xl max-h-[90vh] overflow-hidden" (click)="$event.stopPropagation()">
          <img 
            [src]="lightboxImage.url" 
            [alt]="lightboxImage.alt" 
            class="max-w-full max-h-[80vh] mx-auto object-contain" 
          />
          
          <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-deep-black/80 to-transparent">
            <h3 class="text-ivory text-xl font-playfair font-bold mb-1">{{lightboxImage.alt}}</h3>
            <p class="text-ivory/80">{{lightboxImage.caption}}</p>
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
  images: GalleryImage[] = [
    {
      id: 1,
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296933/Samantha_x_burberry_ml1yed.jpg',
      alt: 'Samantha x Burberry',
      category: 'fashion',
      caption: 'Samantha x Burberry Collaboration',
      date: 'March 2024',
      width: 800,
      height: 1200
    },
    {
      id: 2,
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748298223/d5wj1d4ydqe61_fr3adf.jpg',
      alt: 'Fashion Editorial',
      category: 'fashion',
      caption: 'Latest Fashion Editorial',
      date: 'March 2024',
      width: 800,
      height: 1000
    },
    {
      id: 3,
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748297784/behance_download_1705218613069_toqclh.jpg',
      alt: 'Fashion Editorial - Blue Saree',
      category: 'fashion',
      caption: 'Latest Fashion Editorial - Blue Saree',
      date: 'March 2024',
      width: 1000,
      height: 800
    },
    {
      id: 4,
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748297382/Samantha17_zxr8ah.jpg',
      alt: 'Fashion Editorial',
      category: 'fashion',
      caption: 'Latest Fashion Editorial',
      date: 'March 2024',
      width: 900,
      height: 1100
    },
    {
      id: 5,
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296644/ee0bed145412067.629e2c026e891_1_wgw0tk.jpg',
      alt: 'Fashion Editorial',
      category: 'fashion',
      caption: 'Latest Fashion Editorial',
      date: 'March 2024',
      width: 1200,
      height: 900
    },
    {
      id: 6,
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296812/SRP_q8wmpl.jpg',
      alt: 'Film Still',
      category: 'films',
      caption: 'Latest Film Project',
      date: '2024',
      width: 1200,
      height: 900
    },
    {
      id: 7,
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296881/53885681037_6a705301cf_o_ztjyeg.jpg',
      alt: 'Behind the Scenes',
      category: 'bts',
      caption: 'Behind the Scenes',
      date: 'March 2024',
      width: 1200,
      height: 800
    },
    {
      id: 8,
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748295435/5_6185746542628962569_bgalhv.jpg',
      alt: 'Fashion Event',
      category: 'events',
      caption: 'Fashion Event Appearance',
      date: 'March 2024',
      width: 900,
      height: 1200
    },
    {
      id: 9,
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748295799/5_6185746542628962570_c68nyo.jpg',
      alt: 'Magazine Cover',
      category: 'photoshoots',
      caption: 'Magazine Cover Shoot',
      date: 'March 2024',
      width: 800,
      height: 1100
    },
    {
      id: 10,
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748297381/IMG_20231010_193941_idl7at.jpg',
      alt: 'Fashion Event',
      category: 'events',
      caption: 'Fashion Event Appearance',
      date: 'October 2023',
      width: 1200,
      height: 800
    },
    {
      id: 11,
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748297890/RDT_20230925_1145373619426103841407709_l5sply.png',
      alt: 'Fashion Event',
      category: 'events',
      caption: 'Fashion Event Appearance',
      date: 'September 2023',
      width: 1200,
      height: 800
    }
  ];

  filteredImages: GalleryImage[] = [];
  lightboxImage: GalleryImage | null = null;
  currentLightboxIndex: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.filteredImages = [...this.images];
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
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeLightbox(): void {
    this.lightboxImage = null;
    document.body.style.overflow = ''; // Re-enable scrolling
  }

  navigateLightbox(direction: 'prev' | 'next', event: Event): void {
    event.stopPropagation(); // Prevent lightbox closing
    
    if (direction === 'prev') {
      this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.filteredImages.length) % this.filteredImages.length;
    } else {
      this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.filteredImages.length;
    }
    
    this.lightboxImage = this.filteredImages[this.currentLightboxIndex];
  }
}