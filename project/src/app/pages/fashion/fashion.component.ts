import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fashion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-ivory dark:bg-deep-black py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">Fashion & Style</span>
          <h1 class="text-4xl md:text-5xl font-playfair font-bold text-charcoal dark:text-ivory">Fashion Journey</h1>
        </div>

        <!-- Fashion Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="rounded-lg overflow-hidden hover-lift">
            <img 
              src="https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Fashion Style"
              class="w-full h-64 object-cover"
            />
            <div class="p-6 bg-white dark:bg-charcoal">
              <h3 class="font-playfair text-xl font-bold mb-3 text-charcoal dark:text-ivory">Style Evolution</h3>
              <p class="text-charcoal/80 dark:text-ivory/80">Exploring the journey through various fashion milestones and iconic looks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FashionComponent {} 