import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, FashionItem } from '../../services/api.service';

@Component({
  selector: 'app-fashion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sr-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel min-h-[500px]">
            <div class="sr-hero-media">
              <img
                src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg"
                alt="Fashion & Style"
                class="object-[center_18%]"
              />
            </div>

            <div class="sr-hero-copy max-w-3xl">
              <span class="sr-kicker">Fashion & Style</span>
              <h1 class="sr-hero-title">Fashion Journey</h1>
              <p class="sr-hero-subtitle">
                Editorial looks, memorable appearances, and signature style moments gathered from the existing fashion feed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section pb-12">
        <div class="sr-section-heading">
          <span class="sr-kicker">Style Notes</span>
          <h2>Looks That Defined the Era</h2>
          <p>The same fashion entries remain here, reframed into a richer magazine-like presentation.</p>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <a
            *ngFor="let item of fashionItems"
            [href]="item.link"
            target="_blank"
            rel="noopener noreferrer"
            class="sr-surface overflow-hidden sr-hover-card group block"
          >
            <div class="relative h-[420px] overflow-hidden">
              <img
                [src]="item.imageUrl"
                [alt]="item.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[rgba(8,4,4,0.8)] via-transparent to-transparent"></div>
            </div>
            <div class="p-6">
              <span class="sr-meta">{{ item.date }}</span>
              <h3 class="sr-card-title mt-3 mb-3">{{ item.title }}</h3>
              <p class="sr-card-text">{{ item.description }}</p>
            </div>
          </a>

          <div *ngIf="fashionItems.length === 0" class="sr-empty-state md:col-span-2 xl:col-span-3">
            Fashion entries will appear here once they are added.
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class FashionComponent implements OnInit {
  fashionItems: FashionItem[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getFashion().subscribe(data => {
      this.fashionItems = data;
    });
  }
}
