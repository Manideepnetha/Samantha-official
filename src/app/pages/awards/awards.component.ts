import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Award } from '../../services/api.service';

@Component({
  selector: 'app-awards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-ivory dark:bg-deep-black">
      <!-- Hero Section -->
      <section class="relative h-[50vh] overflow-hidden">
        <div class="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748038033/ad7ccf187002995.6580064d3e931_ajzyv5.jpg" 
            alt="Awards & Milestones" 
            class="w-full h-full object-cover object-[center_top_30%]" 
          />
          <div class="absolute inset-0 bg-gradient-to-b from-deep-black/80 to-deep-black/40"></div>
        </div>
        
        <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">Recognition</span>
          <h1 class="text-4xl md:text-6xl font-playfair font-bold text-ivory mb-6 text-shadow">Awards & Milestones</h1>
          <p class="text-xl md:text-2xl text-ivory/90 font-lora italic max-w-3xl">Celebrating moments of excellence and recognition throughout Samantha's illustrious career.</p>
        </div>
      </section>

      <!-- Awards Timeline -->
      <section class="py-20 bg-ivory dark:bg-deep-black">
        <div class="container mx-auto px-4">
          <div *ngIf="timelineAwards.length === 0" class="text-center text-charcoal/50 dark:text-ivory/50">
             Loading awards...
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div *ngFor="let award of timelineAwards" class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">{{ award.year }}</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">{{ award.title }}</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">{{ award.description }}</p>
                <blockquote *ngIf="award.quote" class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "{{ award.quote }}"
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Awards Gallery -->
      <section class="py-20 bg-white dark:bg-charcoal">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl md:text-4xl font-playfair font-bold text-center text-charcoal dark:text-ivory mb-16">Award Gallery</h2>
          
          <div *ngIf="galleryAwards.length === 0" class="text-center text-charcoal/50 dark:text-ivory/50">
             Loading gallery...
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let item of galleryAwards" class="relative group overflow-hidden rounded-lg hover-lift">
              <img [src]="item.imageUrl" [alt]="item.title" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">{{ item.title }}</h3>
                  <p class="text-ivory/90">{{ item.year }}</p>
                </div>
              </div>
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
      // Sort by year descending for timeline
      this.timelineAwards = data
        .filter(a => a.type === 'Timeline')
        .sort((a, b) => b.year - a.year);

      // Gallery items (sorting optional, keeping default or by year)
      this.galleryAwards = data
        .filter(a => a.type === 'Gallery')
        .sort((a, b) => b.year - a.year);
    });
  }
}