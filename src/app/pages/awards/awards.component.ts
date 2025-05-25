import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
          <div class="max-w-4xl mx-auto">
            <!-- 2024 -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <!-- Year Label -->
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2024</div>
              
              <!-- Timeline line -->
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              
              <!-- Timeline dot -->
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              
              <!-- Content -->
              <div class="bg-white dark:bg-charcoal p-6 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Best Actress - Filmfare Awards South</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-4">For the groundbreaking performance in "Kushi" that captivated audiences and critics alike.</p>
                <img src="https://images.pexels.com/photos/2916450/pexels-photo-2916450.jpeg" alt="Filmfare Awards 2024" class="w-full rounded-lg mb-4" />
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "This award is dedicated to every artist who dares to dream beyond boundaries."
                </blockquote>
              </div>
            </div>

            <!-- 2023 -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2023</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-6 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Indian Film Festival Melbourne - Excellence in Cinema</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-4">Recognized for outstanding contribution to Indian cinema and breaking stereotypes.</p>
                <img src="https://images.pexels.com/photos/2900115/pexels-photo-2900115.jpeg" alt="IFFM 2023" class="w-full rounded-lg mb-4" />
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "Cinema has the power to transform lives and challenge perspectives."
                </blockquote>
              </div>
            </div>

            <!-- 2022 -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2022</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-6 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Critics' Choice Award - Best Actress</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-4">For the powerful portrayal in "Yashoda" that showcased unprecedented versatility.</p>
                <img src="https://images.pexels.com/photos/2513900/pexels-photo-2513900.jpeg" alt="Critics Choice 2022" class="w-full rounded-lg mb-4" />
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "Every role is an opportunity to push boundaries and discover new dimensions."
                </blockquote>
              </div>
            </div>

            <!-- 2021 -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2021</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-6 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Best Performance in a Series - Filmfare OTT Awards</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-4">For the groundbreaking role of Raji in "The Family Man 2" that redefined digital entertainment.</p>
                <img src="https://images.pexels.com/photos/2916450/pexels-photo-2916450.jpeg" alt="Filmfare OTT Awards 2021" class="w-full rounded-lg mb-4" />
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "Digital platforms have opened new avenues for storytelling and character exploration."
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
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://images.pexels.com/photos/2513900/pexels-photo-2513900.jpeg" alt="Award 1" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Filmfare Award</h3>
                  <p class="text-ivory/90">Best Actress - Telugu</p>
                </div>
              </div>
            </div>

            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://images.pexels.com/photos/2900115/pexels-photo-2900115.jpeg" alt="Award 2" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">SIIMA Award</h3>
                  <p class="text-ivory/90">Best Actress - Tamil</p>
                </div>
              </div>
            </div>

            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://images.pexels.com/photos/2916450/pexels-photo-2916450.jpeg" alt="Award 3" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Critics' Choice Award</h3>
                  <p class="text-ivory/90">Best Performance</p>
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
export class AwardsComponent {}