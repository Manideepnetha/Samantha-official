import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fashion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-ivory dark:bg-deep-black py-20">
      <div class="container mx-auto px-4">
        <!-- Header Section (matches media.component.ts) -->
        <div class="text-center mb-16">
          <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">Fashion & Style</span>
          <h1 class="text-4xl md:text-5xl font-playfair font-bold text-charcoal dark:text-ivory">Fashion Journey</h1>
        </div>

        <!-- Fashion Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <a href="https://saaki.co/" target="_blank" rel="noopener noreferrer" class="block rounded-lg overflow-hidden hover-lift">
            <img 
              src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748271544/WD01RESIZED_phdvfr.webp"
              alt="Fashion Style"
              class="w-full h-64 object-cover"
            />
            <div class="p-6 bg-white dark:bg-charcoal">
              <span class="text-sm text-royal-gold">July 20, 2024</span>
              <h3 class="font-playfair text-xl font-bold mt-2 mb-3 text-charcoal dark:text-ivory">Style Evolution</h3>
              <p class="text-charcoal/80 dark:text-ivory/80">Exploring the journey through various fashion milestones and iconic looks.</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FashionComponent {} 