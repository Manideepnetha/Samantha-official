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
          <a href="https://x.com/Teamtwts2/status/1927045273177469277" target="_blank" rel="noopener noreferrer" class="block rounded-lg overflow-hidden hover-lift">
            <img 
              src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748293717/FFoxLHbX3EA-HD_p81ikk.jpg"
              alt="Press Coverage"
              class="w-full h-64 object-cover"
            />
            <div class="p-6 bg-white dark:bg-charcoal">
              <span class="text-sm text-royal-gold">May 27, 2025</span>
              <h3 class="font-playfair text-xl font-bold mt-2 mb-3 text-charcoal dark:text-ivory">Samantha Ruth Prabhu Grace The Vogue India Beauty & Wellness Honours 2025</h3>
              <p class="text-charcoal/80 dark:text-ivory/80">Actor Samantha Ruth Prabhu looked stunning in a form-fitting brown dress on Monday evening as she attended the Vogue Beauty and Wellness Honours. In a video posted by a paparazzo account, she looked drop-dead gorgeous as she posed for pictures before making her way inside</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MediaComponent {} 