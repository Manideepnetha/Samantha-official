import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-ivory dark:bg-deep-black py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">Media & Press</span>
          <h1 class="text-4xl md:text-5xl font-playfair font-bold text-charcoal dark:text-ivory">Latest Coverage</h1>
        </div>

        <!-- Media Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="rounded-lg overflow-hidden hover-lift">
            <img 
              src="https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Press Coverage"
              class="w-full h-64 object-cover"
            />
            <div class="p-6 bg-white dark:bg-charcoal">
              <span class="text-sm text-royal-gold">May 15, 2025</span>
              <h3 class="font-playfair text-xl font-bold mt-2 mb-3 text-charcoal dark:text-ivory">Latest Interview</h3>
              <p class="text-charcoal/80 dark:text-ivory/80">Exclusive interview about upcoming projects and personal growth journey.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MediaComponent {} 