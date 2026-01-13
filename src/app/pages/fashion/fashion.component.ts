import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, FashionItem } from '../../services/api.service';

@Component({
  selector: 'app-fashion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-ivory dark:bg-deep-black py-20">
      <div class="container mx-auto px-4">
        <!-- Header Section -->
        <div class="text-center mb-16">
          <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">Fashion & Style</span>
          <h1 class="text-4xl md:text-5xl font-playfair font-bold text-charcoal dark:text-ivory">Fashion Journey</h1>
        </div>

        <!-- Fashion Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <a *ngFor="let item of fashionItems" [href]="item.link" target="_blank" rel="noopener noreferrer" class="block rounded-lg overflow-hidden hover-lift relative h-[400px]">
            <div class="absolute bottom-[-30px] left-0 right-0">
              <img 
                [src]="item.imageUrl"
                [alt]="item.title"
                class="w-full h-[500px] object-cover"
              />
            </div>
            <div class="p-6 bg-white dark:bg-charcoal absolute bottom-0 left-0 right-0">
              <span class="text-sm text-royal-gold">{{ item.date }}</span>
              <h3 class="font-playfair text-xl font-bold mt-2 mb-3 text-charcoal dark:text-ivory">{{ item.title }}</h3>
              <p class="text-charcoal/80 dark:text-ivory/80">{{ item.description }}</p>
            </div>
          </a>
        </div>
      </div>
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