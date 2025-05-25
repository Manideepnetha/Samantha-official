import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-philanthropy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-ivory dark:bg-deep-black">
      <!-- Hero Section -->
      <section class="relative h-[50vh] overflow-hidden">
        <div class="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Philanthropy" 
            class="w-full h-full object-cover object-center" 
          />
          <div class="absolute inset-0 bg-gradient-to-b from-deep-black/80 to-deep-black/40"></div>
        </div>
        
        <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">Giving Back</span>
          <h1 class="text-4xl md:text-6xl font-playfair font-bold text-ivory mb-6 text-shadow">Making a Difference</h1>
          <p class="text-xl md:text-2xl text-ivory/90 font-lora italic max-w-3xl">Empowering communities and creating positive change through the Pratyusha Foundation.</p>
        </div>
      </section>

      <!-- Mission Statement -->
      <section class="py-20 bg-ivory dark:bg-deep-black">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl md:text-4xl font-playfair font-bold text-charcoal dark:text-ivory mb-8">Our Mission</h2>
            <p class="text-xl font-lora text-charcoal/80 dark:text-ivory/80 leading-relaxed mb-12">
              The Pratyusha Foundation is committed to creating sustainable change in the lives of underprivileged women and children through education, healthcare, and skill development programs.
            </p>
            
            <!-- Impact Numbers -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div class="p-6 bg-white dark:bg-charcoal rounded-lg hover-lift">
                <div class="text-4xl font-playfair font-bold text-royal-gold mb-2">1,200+</div>
                <div class="text-charcoal/80 dark:text-ivory/80">Lives Impacted</div>
              </div>
              
              <div class="p-6 bg-white dark:bg-charcoal rounded-lg hover-lift">
                <div class="text-4xl font-playfair font-bold text-royal-gold mb-2">15</div>
                <div class="text-charcoal/80 dark:text-ivory/80">Active Projects</div>
              </div>
              
              <div class="p-6 bg-white dark:bg-charcoal rounded-lg hover-lift">
                <div class="text-4xl font-playfair font-bold text-royal-gold mb-2">5</div>
                <div class="text-charcoal/80 dark:text-ivory/80">States Reached</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Initiatives -->
      <section class="py-20 bg-white dark:bg-charcoal">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl md:text-4xl font-playfair font-bold text-center text-charcoal dark:text-ivory mb-16">Key Initiatives</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Education -->
            <div class="bg-ivory dark:bg-deep-black p-8 rounded-lg hover-lift">
              <div class="w-16 h-16 bg-royal-gold/10 rounded-full flex items-center justify-center mb-6">
                <span class="text-3xl text-royal-gold">📚</span>
              </div>
              <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">Education for All</h3>
              <p class="text-charcoal/80 dark:text-ivory/80 mb-6">Supporting underprivileged children with quality education, school supplies, and mentorship programs.</p>
              <ul class="space-y-2 text-charcoal/70 dark:text-ivory/70">
                <li>• 500+ children sponsored</li>
                <li>• 10 schools supported</li>
                <li>• After-school programs</li>
              </ul>
            </div>

            <!-- Healthcare -->
            <div class="bg-ivory dark:bg-deep-black p-8 rounded-lg hover-lift">
              <div class="w-16 h-16 bg-royal-gold/10 rounded-full flex items-center justify-center mb-6">
                <span class="text-3xl text-royal-gold">🏥</span>
              </div>
              <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">Healthcare Access</h3>
              <p class="text-charcoal/80 dark:text-ivory/80 mb-6">Providing medical support and healthcare facilities to communities in need.</p>
              <ul class="space-y-2 text-charcoal/70 dark:text-ivory/70">
                <li>• Mobile health clinics</li>
                <li>• Women's health camps</li>
                <li>• Mental health support</li>
              </ul>
            </div>

            <!-- Women Empowerment -->
            <div class="bg-ivory dark:bg-deep-black p-8 rounded-lg hover-lift">
              <div class="w-16 h-16 bg-royal-gold/10 rounded-full flex items-center justify-center mb-6">
                <span class="text-3xl text-royal-gold">💪</span>
              </div>
              <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">Women Empowerment</h3>
              <p class="text-charcoal/80 dark:text-ivory/80 mb-6">Empowering women through skill development and entrepreneurship programs.</p>
              <ul class="space-y-2 text-charcoal/70 dark:text-ivory/70">
                <li>• Vocational training</li>
                <li>• Micro-finance support</li>
                <li>• Leadership workshops</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Success Stories -->
      <section class="py-20 bg-ivory dark:bg-deep-black">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl md:text-4xl font-playfair font-bold text-center text-charcoal dark:text-ivory mb-16">Success Stories</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div class="bg-white dark:bg-charcoal p-8 rounded-lg hover-lift">
              <img src="https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg" alt="Success Story 1" class="w-full h-64 object-cover rounded-lg mb-6" />
              <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">Empowering Through Education</h3>
              <p class="text-charcoal/80 dark:text-ivory/80 mb-4">
                Meet Priya, a young girl from rural Tamil Nadu who dreamed of becoming a doctor. Through our educational support program, she's now pursuing her MBBS.
              </p>
              <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                "Education has given me wings to fly and the power to change my destiny."
              </blockquote>
            </div>

            <div class="bg-white dark:bg-charcoal p-8 rounded-lg hover-lift">
              <img src="https://images.pexels.com/photos/6646919/pexels-photo-6646919.jpeg" alt="Success Story 2" class="w-full h-64 object-cover rounded-lg mb-6" />
              <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">Breaking Barriers</h3>
              <p class="text-charcoal/80 dark:text-ivory/80 mb-4">
                Lakshmi's journey from a small village to owning her own tailoring business inspires us. Our skill development program helped her achieve financial independence.
              </p>
              <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                "I now employ five other women from my village. Change is possible when we support each other."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <!-- Get Involved -->
      <section class="py-20 bg-white dark:bg-charcoal">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl md:text-4xl font-playfair font-bold text-charcoal dark:text-ivory mb-8">Get Involved</h2>
            <p class="text-xl font-lora text-charcoal/80 dark:text-ivory/80 leading-relaxed mb-12">
              Join us in our mission to create positive change. Every contribution, big or small, makes a difference in someone's life.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-ivory dark:bg-deep-black p-8 rounded-lg hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">Donate</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-6">
                  Support our initiatives through monetary contributions. Every donation helps us reach more lives.
                </p>
                <button class="px-6 py-3 bg-royal-gold text-deep-black rounded-full font-inter font-medium hover:bg-royal-gold/90 transition-all">
                  Make a Donation
                </button>
              </div>

              <div class="bg-ivory dark:bg-deep-black p-8 rounded-lg hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">Volunteer</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-6">
                  Join our volunteer program and contribute your time and skills to make a difference.
                </p>
                <button class="px-6 py-3 bg-transparent border border-royal-gold text-royal-gold rounded-full font-inter font-medium hover:bg-royal-gold/10 transition-all">
                  Join as Volunteer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class PhilanthropyComponent {}