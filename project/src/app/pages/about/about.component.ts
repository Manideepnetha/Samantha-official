import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-ivory dark:bg-deep-black">
      <!-- Hero Section -->
      <section class="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div class="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748011805/8F9A6978_1_jd2efv.jpg" 
            alt="Samantha Ruth Prabhu Portrait" 
            class="w-full h-full object-cover object-[center_30%]" 
          />
          <div class="absolute inset-0 bg-gradient-to-b from-deep-black/80 to-deep-black/40"></div>
        </div>
        
        <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <div class="max-w-3xl">
            <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">About</span>
            <h1 class="text-4xl md:text-6xl font-playfair font-bold text-ivory mb-6 text-shadow">The Journey of Samantha</h1>
            <p class="text-xl md:text-2xl text-ivory/90 font-lora italic">An inspiring tale of passion, perseverance, and purpose.</p>
          </div>
        </div>
      </section>

      <!-- Biography Section -->
      <section class="py-16 md:py-24 bg-ivory dark:bg-deep-black">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            <!-- Sidebar -->
            <div class="md:sticky md:top-24 space-y-8">
              <img 
                src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748010072/8F9A7985_m86vsc.jpg" 
                alt="Samantha Ruth Prabhu" 
                class="w-full rounded-lg shadow-lg hover-zoom" 
              />
              
              <div class="bg-white dark:bg-charcoal p-6 rounded-lg shadow-sm">
                <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">At a Glance</h3>
                
                <div class="space-y-3">
                  <div>
                    <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</span>
                    <span class="block font-medium text-charcoal dark:text-ivory">Samantha Ruth Prabhu</span>
                  </div>
                  
                  <div>
                    <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">Born</span>
                    <span class="block font-medium text-charcoal dark:text-ivory">April 28, 1987</span>
                  </div>
                  
                  <div>
                    <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">Nationality</span>
                    <span class="block font-medium text-charcoal dark:text-ivory">Indian</span>
                  </div>
                  
                  <div>
                    <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">Languages</span>
                    <span class="block font-medium text-charcoal dark:text-ivory">Tamil, Telugu, English, Hindi</span>
                  </div>
                  
                  <div>
                    <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">Debut Film</span>
                    <span class="block font-medium text-charcoal dark:text-ivory">Ye Maaya Chesave (2010)</span>
                  </div>
                  
                  <div>
                    <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">Notable Awards</span>
                    <span class="block font-medium text-charcoal dark:text-ivory">4 Filmfare Awards South</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Main Content -->
            <div class="md:col-span-2 space-y-8">
              <div class="prose prose-lg max-w-none dark:prose-invert">
                <p class="font-lora text-lg leading-relaxed">
                  Samantha Ruth Prabhu stands as one of Indian cinema's most versatile and acclaimed actresses, with a career spanning over a decade across Tamil and Telugu film industries. Born in Chennai to a Telugu father and a Malayali mother, Samantha's journey to stardom is a testament to her unwavering determination and exceptional talent.
                </p>
                
                <h2 class="font-playfair text-2xl font-bold mt-8 mb-4 text-charcoal dark:text-ivory">Early Life & Education</h2>
                
                <p class="font-lora text-lg leading-relaxed">
                  Raised in Chennai, Samantha completed her schooling at Holy Angels Anglo Indian Higher Secondary School and pursued a degree in Commerce at Stella Maris College. Her entry into the entertainment industry began through modeling during her college days, where her natural presence in front of the camera caught the attention of filmmakers.
                </p>
                
                <h2 class="font-playfair text-2xl font-bold mt-8 mb-4 text-charcoal dark:text-ivory">Rise to Prominence</h2>
                
                <p class="font-lora text-lg leading-relaxed">
                  Samantha's cinematic journey began with Gautham Menon's Telugu romantic drama "Ye Maaya Chesave" (2010), where her portrayal of Jessie, a complex character torn between love and family obligations, immediately established her as a performer of remarkable depth. This debut earned her the Filmfare Award for Best Female Debut – South, marking the beginning of an illustrious career.
                </p>
                
                <p class="font-lora text-lg leading-relaxed">
                  What followed was a series of powerful performances across diverse genres – from the heartwrenching "Eega" (2012) to the socially conscious "Mahanati" (2018). Her versatility shone through in commercial blockbusters like "Theri" (2016) and critically acclaimed films such as "Super Deluxe" (2019). With each role, Samantha pushed boundaries and challenged herself, refusing to be typecast.
                </p>
                
                <h2 class="font-playfair text-2xl font-bold mt-8 mb-4 text-charcoal dark:text-ivory">Breaking New Ground</h2>
                
                <p class="font-lora text-lg leading-relaxed">
                  Samantha's career took a revolutionary turn with her digital debut in "The Family Man 2" (2021), where she portrayed Raji, a Sri Lankan Tamil liberation fighter. This performance showcased her incredible range and commitment to her craft, earning unprecedented acclaim across India and internationally.
                </p>
                
                <h2 class="font-playfair text-2xl font-bold mt-8 mb-4 text-charcoal dark:text-ivory">Beyond Cinema</h2>
                
                <p class="font-lora text-lg leading-relaxed">
                  While her on-screen presence continues to captivate audiences, Samantha's influence extends far beyond cinema. In 2012, she established the Pratyusha Foundation, focusing on providing medical support, education, and other essential services to underprivileged women and children.
                </p>
                
                <p class="font-lora text-lg leading-relaxed">
                  As an entrepreneur, she launched her own fashion label, Saaki, which reflects her personal style philosophy of blending tradition with contemporary aesthetics. The brand embodies her commitment to sustainable fashion and ethical business practices.
                </p>
                
                <h2 class="font-playfair text-2xl font-bold mt-8 mb-4 text-charcoal dark:text-ivory">Personal Journey & Resilience</h2>
                
                <p class="font-lora text-lg leading-relaxed">
                  In 2022, Samantha revealed her diagnosis with Myositis, an autoimmune condition. With characteristic courage, she has shared her health journey openly, becoming an inspiration for millions facing similar challenges. Her candor about personal struggles has redefined celebrity vulnerability in the Indian context.
                </p>
                
                <p class="font-lora text-lg leading-relaxed">
                  Throughout personal and professional challenges, Samantha has maintained an unwavering commitment to her craft and her causes, emerging stronger with each chapter of her life.
                </p>
                
                <h2 class="font-playfair text-2xl font-bold mt-8 mb-4 text-charcoal dark:text-ivory">Legacy in the Making</h2>
                
                <p class="font-lora text-lg leading-relaxed">
                  As she continues to evolve as an artist, activist, and entrepreneur, Samantha Ruth Prabhu's legacy is characterized by her refusal to conform to industry norms and her determination to use her platform for meaningful change. Her journey represents the changing face of Indian cinema – one that embraces authenticity, diversity, and social responsibility.
                </p>
                
                <p class="font-lora text-lg leading-relaxed">
                  With upcoming international projects and growing global recognition, Samantha stands at the threshold of a new chapter that promises to further cement her position as one of India's most significant cultural ambassadors.
                </p>
              </div>
              
              <!-- Quote -->
              <blockquote class="border-l-4 border-royal-gold pl-6 py-2 my-8">
                <p class="text-xl font-playfair italic text-charcoal dark:text-ivory">"I believe in constantly reinventing myself and never settling for what's comfortable. Growth happens outside your comfort zone."</p>
                <footer class="mt-2 text-royal-gold">— Samantha Ruth Prabhu</footer>
              </blockquote>
              
              <!-- Timeline Preview -->
              <div class="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
                <h3 class="font-playfair text-2xl font-bold mb-8 text-charcoal dark:text-ivory">Career Highlights</h3>
                
                <div class="space-y-8">
                  <div class="flex">
                    <div class="flex flex-col items-center mr-6">
                      <div class="w-4 h-4 bg-royal-gold rounded-full"></div>
                      <div class="w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div>
                      <span class="text-royal-gold font-inter font-medium">2010</span>
                      <h4 class="font-playfair text-lg font-bold mb-2 text-charcoal dark:text-ivory">Cinematic Debut</h4>
                      <p class="text-charcoal/80 dark:text-ivory/80">Won the Filmfare Award for Best Female Debut for "Ye Maaya Chesave".</p>
                    </div>
                  </div>
                  
                  <div class="flex">
                    <div class="flex flex-col items-center mr-6">
                      <div class="w-4 h-4 bg-royal-gold rounded-full"></div>
                      <div class="w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div>
                      <span class="text-royal-gold font-inter font-medium">2012</span>
                      <h4 class="font-playfair text-lg font-bold mb-2 text-charcoal dark:text-ivory">Foundation of Pratyusha</h4>
                      <p class="text-charcoal/80 dark:text-ivory/80">Established the Pratyusha Foundation to support underprivileged women and children.</p>
                    </div>
                  </div>
                  
                  <div class="flex">
                    <div class="flex flex-col items-center mr-6">
                      <div class="w-4 h-4 bg-royal-gold rounded-full"></div>
                      <div class="w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                    </div>
                    <div>
                      <span class="text-royal-gold font-inter font-medium">2018</span>
                      <h4 class="font-playfair text-lg font-bold mb-2 text-charcoal dark:text-ivory">Critical Acclaim</h4>
                      <p class="text-charcoal/80 dark:text-ivory/80">Her performance in "Rangasthalam" received widespread critical acclaim.</p>
                    </div>
                  </div>
                  
                  <div class="flex">
                    <div class="flex flex-col items-center mr-6">
                      <div class="w-4 h-4 bg-royal-gold rounded-full"></div>
                      <div class="w-0.5 h-none bg-transparent"></div>
                    </div>
                    <div>
                      <span class="text-royal-gold font-inter font-medium">2021</span>
                      <h4 class="font-playfair text-lg font-bold mb-2 text-charcoal dark:text-ivory">Digital Breakthrough</h4>
                      <p class="text-charcoal/80 dark:text-ivory/80">Her portrayal of Raji in "The Family Man 2" earned international recognition.</p>
                    </div>
                  </div>
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
export class AboutComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  initAnimations(): void {
    // Animate hero section
    gsap.from('.hero-section h1, .hero-section p', {
      duration: 1.2,
      y: 50,
      opacity: 0,
      stagger: 0.3,
      ease: 'power3.out'
    });

    // Animate biography content
    gsap.from('.prose > *', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.prose',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    // Animate timeline
    gsap.from('.timeline-item', {
      duration: 0.8,
      x: -50,
      opacity: 0,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  }
}