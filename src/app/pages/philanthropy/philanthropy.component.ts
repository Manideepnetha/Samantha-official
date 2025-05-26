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
       <div class="absolute bottom-[-500px] left-0 right-0">
          <img 
            src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748288170/96372bg8_1_lm3v2w.jpg" 
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
              <div class="p-6 bg-white dark:bg-charcoal rounded-lg hover-lift text-center">
                <div class="text-5xl text-royal-gold mb-4">😊</div>
                <div class="text-4xl font-playfair font-bold text-charcoal dark:text-ivory mb-2">754</div>
                <div class="text-charcoal/80 dark:text-ivory/80">Happy Donors</div>
              </div>

              <div class="p-6 bg-white dark:bg-charcoal rounded-lg hover-lift text-center">
                <div class="text-5xl text-royal-gold mb-4">🚀</div>
                <div class="text-4xl font-playfair font-bold text-charcoal dark:text-ivory mb-2">675</div>
                <div class="text-charcoal/80 dark:text-ivory/80">Success Mission</div>
              </div>

              <div class="p-6 bg-white dark:bg-charcoal rounded-lg hover-lift text-center">
                <div class="text-5xl text-royal-gold mb-4">👤+</div>
                <div class="text-4xl font-playfair font-bold text-charcoal dark:text-ivory mb-2">1,248</div>
                <div class="text-charcoal/80 dark:text-ivory/80">Volunteer Reached</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Initiatives -->
      <section class="py-20 bg-white dark:bg-charcoal">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl md:text-4xl font-playfair font-bold text-center text-charcoal dark:text-ivory mb-16">Key Initiatives</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Sponsor for Health -->
            <div class="bg-ivory dark:bg-deep-black p-8 rounded-lg hover-lift">
              <div class="w-16 h-16 bg-royal-gold/10 rounded-full flex items-center justify-center mb-6">
                <span class="text-3xl text-royal-gold">😊</span>
              </div>
              <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">Sponsor for Health</h3>
              <p class="text-charcoal/80 dark:text-ivory/80 mb-6">So far, Pratyusha Support has sponsored for more than 150 critical surgeries for the underprivileged. This being our main objective, we have always intended to provide good health and support to the children and their families.</p>
            </div>

            <!-- Awareness Campaigns -->
            <div class="bg-ivory dark:bg-deep-black p-8 rounded-lg hover-lift">
              <div class="w-16 h-16 bg-royal-gold/10 rounded-full flex items-center justify-center mb-6">
                <span class="text-3xl text-royal-gold">🚀</span>
              </div>
              <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">Awareness Campaigns</h3>
              <p class="text-charcoal/80 dark:text-ivory/80 mb-6">These days, its important for children and women to be aware of various day to day issues happening in the society. Team Pratyusha Support works towards creating awareness on various sensitive topics at Government Schools, Orphanages and other Societies.</p>
            </div>

            <!-- Shelter for Poor -->
            <div class="bg-ivory dark:bg-deep-black p-8 rounded-lg hover-lift">
              <div class="w-16 h-16 bg-royal-gold/10 rounded-full flex items-center justify-center mb-6">
                <span class="text-3xl text-royal-gold">🏠</span>
              </div>
              <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">Shelter for Poor</h3>
              <p class="text-charcoal/80 dark:text-ivory/80 mb-6">Associated full-time with Pyaram Vijayabharathi Vidyasagar Charitable Trust, located in Nadargul, Adibatla Village. Sheltering about 28 orphan kids at the moment and providing them with education, health and other necessary amenities.</p>
            </div>

            <!-- Wish come True -->
            <div class="bg-ivory dark:bg-deep-black p-8 rounded-lg hover-lift">
              <div class="w-16 h-16 bg-royal-gold/10 rounded-full flex items-center justify-center mb-6">
                <span class="text-3xl text-royal-gold">✨</span>
              </div>
              <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">Wish come True</h3>
              <p class="text-charcoal/80 dark:text-ivory/80 mb-6">A special initiative by the team where we fulfill the wishes of those unfortunate children with life-threatening ailments.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Success Stories -->
      <section class="py-20 bg-ivory dark:bg-deep-black">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl md:text-4xl font-playfair font-bold text-center text-charcoal dark:text-ivory mb-16">Success Stories</h2>
          
          <div class="flex justify-center">
            <div class="bg-white dark:bg-charcoal p-10 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-2xl">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748291908/bg16_unojqa.jpg" alt="Success Story" class="w-full h-64 object-cover rounded-lg mb-6" />
              <h3 class="font-playfair text-2xl font-bold mb-4 text-charcoal dark:text-ivory">Pratyusha Support: Founded by Samantha Ruth Prabhu</h3>
              <p class="text-charcoal/80 dark:text-ivory/80 mb-6 leading-relaxed">
                Conceptualized by leading South Indian actress - Samantha Ruth Prabhu, Pratyusha Support has started its services in February 2014. Since then, we have been serving the underprivileged by delivering some unparalleled medical support to women and children, while fulfilling wishes of those children suffering from life-threatening medical conditions. We have been closely working with our partnered hospitals, Rainbow, Continental, Livlife, Ankura and Andhra Hospitals in Telangana and Andhra Pradesh states primarily.
              </p>
              <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90 text-lg">
                "I wanted to create something that would outlive me—something that would continue to bring hope to people long after I'm gone. That's why I started Pratyusha Support."
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
                <a href="https://pratyushasupport.org/hdfc/pay.php" target="_blank" class="px-6 py-3 bg-royal-gold text-deep-black rounded-full font-inter font-medium hover:bg-royal-gold/90 transition-all">
                  Make a Donation
                </a>
              </div>

              <div class="bg-ivory dark:bg-deep-black p-8 rounded-lg hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">Volunteer</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-6">
                  Join our volunteer program and contribute your time and skills to make a difference.
                </p>
                <a href="https://pratyushasupport.org/" target="_blank" class="px-6 py-3 bg-transparent border border-royal-gold text-royal-gold rounded-full font-inter font-medium hover:bg-royal-gold/10 transition-all">
                  Join as Volunteer
                </a>
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