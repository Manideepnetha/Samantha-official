import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative min-h-screen overflow-hidden">
      <!-- Hero Section with Video/Image Carousel -->
      <section class="relative min-h-screen pt-0 overflow-hidden">
        <!-- Carousel Items -->
        <div class="absolute inset-0 top-0 z-0">
          <div *ngFor="let slide of heroSlides; let i = index" 
               class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
               [class.opacity-100]="currentSlide === i"
               [class.opacity-0]="currentSlide !== i">
            <img 
              [src]="slide.image" 
              [alt]="'Samantha Ruth Prabhu - ' + slide.role"
              class="w-full h-full object-cover object-center"
            />
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-b from-deep-black/70 to-transparent"></div>
          </div>
        </div>

        <!-- Hero Content -->
        <div class="relative z-10 container mx-auto px-4 h-screen flex flex-col justify-center items-center text-center text-ivory mt-24">
          <div class="typewriter max-w-4xl mt-20">
            <h1 class="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow">Samantha Ruth Prabhu</h1>
          </div>
          
          <div class="text-xl md:text-3xl font-playfair italic mb-12">
            <span id="role-text" class="inline-block min-h-[1.5em]">{{roles[currentRole]}}</span>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <a [routerLink]="['/about']" class="px-6 py-3 bg-royal-gold text-deep-black rounded-full font-inter font-medium hover-lift hover:shadow-royal-gold/50 transition-all">
              Explore Her Journey
            </a>
            <a [routerLink]="['/filmography']" class="px-6 py-3 bg-transparent text-ivory border border-royal-gold rounded-full font-inter font-medium hover-lift hover:bg-royal-gold/10 transition-all">
              View Filmography
            </a>
            <a [routerLink]="['/gallery']" class="px-6 py-3 bg-transparent text-ivory border border-ivory/30 rounded-full font-inter font-medium hover-lift hover:border-royal-gold hover:text-royal-gold transition-all">
              Enter Gallery
            </a>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span class="text-ivory opacity-80 mb-2">Scroll</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-royal-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <!-- Latest News Section -->
      <section class="video-highlights py-20 bg-ivory dark:bg-deep-black/80">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <span class="section-label">Latest Videos</span>
            <h2>Current Highlights</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div *ngFor="let news of latestNews" class="rounded-lg overflow-hidden hover-lift">
              <img [src]="news.image" [alt]="news.title" class="w-full h-60 object-cover">
              <div class="p-6 bg-white dark:bg-charcoal">
                <span class="text-sm text-royal-gold font-inter">{{news.date}}</span>
                <h3 class="font-playfair text-xl font-bold mt-2 mb-3 text-charcoal dark:text-ivory">{{news.title}}</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-4">{{news.excerpt}}</p>
                <a [href]="news.link" class="inline-block text-royal-gold font-inter font-medium hover:underline">
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming Projects -->
      <section class="py-20 bg-lavender-mist/20 dark:bg-deep-black/80">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">Coming Soon</span>
            <h2 class="text-3xl md:text-4xl font-playfair font-bold text-charcoal dark:text-ivory">Upcoming Projects</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let project of upcomingProjects" 
                 class="glass dark:bg-charcoal/40 rounded-lg p-6 hover-lift">
              <h3 class="font-playfair text-xl font-bold mb-3 text-charcoal dark:text-ivory">{{project.title}}</h3>
              <div class="flex items-center mb-4">
                <span class="px-3 py-1 bg-royal-gold/10 text-royal-gold rounded-full text-sm">{{project.type}}</span>
                <span class="ml-3 text-sm text-charcoal/70 dark:text-ivory/70">{{project.releaseDate}}</span>
              </div>
              <p class="text-charcoal/80 dark:text-ivory/80 mb-4">{{project.description}}</p>
              <div class="flex items-center text-sm text-charcoal/70 dark:text-ivory/70">
                <span class="font-medium text-royal-gold">Director:</span>
                <span class="ml-2">{{project.director}}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Gallery -->
      <section class="py-20 bg-ivory dark:bg-deep-black">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">Visual Journey</span>
            <h2 class="text-3xl md:text-4xl font-playfair font-bold text-charcoal dark:text-ivory">Featured Gallery</h2>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div *ngFor="let image of featuredGallery; let i = index" 
                 class="relative overflow-hidden rounded-lg group"
                 [class.col-span-2]="i === 0 || i === 5"
                 [class.row-span-2]="i === 0 || i === 3">
              <img 
                [src]="image.url" 
                [alt]="image.alt" 
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p class="text-ivory text-shadow font-inter">{{image.caption}}</p>
              </div>
            </div>
          </div>

          <div class="text-center mt-12">
            <a [routerLink]="['/gallery']" class="inline-block px-8 py-3 bg-royal-gold text-deep-black rounded-full font-inter font-medium hover-lift hover:shadow-royal-gold/50 transition-all">
              View Full Gallery
            </a>
          </div>
        </div>
      </section>

      <!-- Quote Section -->
      <section class="py-32 bg-deep-black relative">
        <div class="absolute inset-0 opacity-20">
          <img src="https://images.pexels.com/photos/4347366/pexels-photo-4347366.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
               alt="Background texture" 
               class="w-full h-full object-cover" />
        </div>
        <div class="container mx-auto px-4 relative z-10">
          <div class="max-w-3xl mx-auto text-center">
            <svg class="w-12 h-12 text-royal-gold mx-auto mb-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M0 216C0 149.7 53.7 96 120 96h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V320 288 216zm256 0c0-66.3 53.7-120 120-120h8c17.7 0 32 14.3 32 32s-14.3 32-32 32h-8c-30.9 0-56 25.1-56 56v8h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64H320c-35.3 0-64-28.7-64-64V320 288 216z"/>
            </svg>
            <blockquote class="text-2xl md:text-4xl font-playfair italic text-ivory mb-8">
              "I have never met a strong person with an easy past."
            </blockquote>
            <div class="flex items-center justify-center">
              <div class="w-12 h-0.5 bg-royal-gold mr-4"></div>
              <span class="text-royal-gold font-inter font-medium">Samantha Ruth Prabhu</span>
              <div class="w-12 h-0.5 bg-royal-gold ml-4"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Connect Section -->
      <section class="py-20 bg-white dark:bg-charcoal">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">Stay Connected</span>
            <h2 class="text-3xl md:text-4xl font-playfair font-bold text-charcoal dark:text-ivory">Follow the Journey</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <a href="https://instagram.com/samantharuthprabhuoffl" target="_blank" 
               class="flex flex-col items-center p-8 rounded-lg border border-gray-200 dark:border-charcoal hover-lift hover:border-royal-gold dark:hover:border-royal-gold transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-royal-gold mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span class="font-playfair text-lg text-charcoal dark:text-ivory">Instagram</span>
              <span class="text-sm text-charcoal/70 dark:text-ivory/70 mt-2">&#64;samantharuthprabhuoffl</span>
            </a>

            <a href="https://twitter.com/samanthaprabhu2" target="_blank" 
               class="flex flex-col items-center p-8 rounded-lg border border-gray-200 dark:border-charcoal hover-lift hover:border-royal-gold dark:hover:border-royal-gold transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-royal-gold mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.036 10.036 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
              </svg>
              <span class="font-playfair text-lg text-charcoal dark:text-ivory">Twitter</span>
              <span class="text-sm text-charcoal/70 dark:text-ivory/70 mt-2">&#64;samanthaprabhu2</span>
            </a>

            <a href="https://www.facebook.com/share/1BfbgU1yKq/" target="_blank" 
               class="flex flex-col items-center p-8 rounded-lg border border-gray-200 dark:border-charcoal hover-lift hover:border-royal-gold dark:hover:border-royal-gold transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-royal-gold mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
              <span class="font-playfair text-lg text-charcoal dark:text-ivory">Facebook</span>
              <span class="text-sm text-charcoal/70 dark:text-ivory/70 mt-2">SamanthaRuthPrabhuOffl</span>
            </a>

            <a href="https://youtube.com/@samanthaofficial?si=bqXC1Es5AkFHxBAV" target="_blank" 
               class="flex flex-col items-center p-8 rounded-lg border border-gray-200 dark:border-charcoal hover-lift hover:border-royal-gold dark:hover:border-royal-gold transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-royal-gold mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              <span class="font-playfair text-lg text-charcoal dark:text-ivory">YouTube</span>
              <span class="text-sm text-charcoal/70 dark:text-ivory/70 mt-2">Official Channel</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit, AfterViewInit {
  currentSlide = 0;
  currentRole = 0;
  roles = ['Actress', 'Icon', 'Philanthropist', 'Entrepreneur', 'Fearless Fighter'];
  roleInterval: any;
  slideInterval: any;

  heroSlides = [
    {
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008414/8F9A7087_koclpw.jpg',
      role: 'Actress'
    },
    {
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008413/PAND7159_k4qlvo.jpg',
      role: 'Icon'
    },
    {
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg',
      role: 'Philanthropist'
    }
  ];

  latestNews = [
    {
      image: 'https://images.pexels.com/photos/6954162/pexels-photo-6954162.jpeg',
      date: 'May 15, 2025',
      title: 'New Project Announcement',
      excerpt: 'Samantha joins the cast of an international project directed by an acclaimed filmmaker.',
      link: '#'
    },
    {
      image: 'https://images.pexels.com/photos/3394231/pexels-photo-3394231.png',
      date: 'April 28, 2025',
      title: 'Award for Philanthropy Work',
      excerpt: 'Pratyusha Foundation receives recognition for its outstanding contribution to women\'s education.',
      link: '#'
    },
    {
      image: 'https://images.pexels.com/photos/2916450/pexels-photo-2916450.jpeg',
      date: 'April 10, 2025',
      title: 'Fashion Line Launch',
      excerpt: 'Saaki by Samantha unveils its new summer collection with sustainable materials.',
      link: '#'
    }
  ];

  upcomingProjects = [
    {
      title: 'Rakt Brahmand',
      type: 'Feature Film',
      releaseDate: 'To be announced',
      description: 'A thrilling new project.',
      director: 'To be announced'
    },
    {
      title: 'Maa Inti Bangaram',
      type: 'Feature Film',
      releaseDate: 'To be announced',
      description: 'A heartwarming family drama.',
      director: 'To be announced'
    }
  ];

  featuredGallery = [
    {
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045091/7fb8df223537765.67fa812e2e11a_y4wnfj.jpg',
      alt: 'Samantha Ruth Prabhu portrait',
      caption: 'Elegant Portrait'
    },
    {
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045106/behance_download_1696836520640_z70bkf.jpg',
      alt: 'Samantha Ruth Prabhu in traditional attire',
      caption: 'Traditional Look'
    },
    {
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045105/RDT_20230918_1518324927662270333256076_x6bzvb.png',
      alt: 'Samantha Ruth Prabhu candid moment',
      caption: 'Candid Moment'
    },
    {
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045289/Majili_aqbpbd.jpg',
      alt: 'Samantha Ruth Prabhu in Majili',
      caption: 'Majili Movie'
    },
    {
      url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg',
      alt: 'Samantha Ruth Prabhu glamorous look',
      caption: 'Glamorous Style'
    }
  ];

  ngOnInit(): void {
    // Start the carousel rotations
    this.startCarousels();
  }

  ngAfterViewInit(): void {
    // GSAP animations
    this.initAnimations();
  }

  ngOnDestroy(): void {
    // Clear intervals when component is destroyed
    clearInterval(this.roleInterval);
    clearInterval(this.slideInterval);
  }

  startCarousels(): void {
    // Rotate roles every 3 seconds
    this.roleInterval = setInterval(() => {
      this.currentRole = (this.currentRole + 1) % this.roles.length;
    }, 3000);
    
    // Rotate slides every 5 seconds
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
    }, 5000);
  }

  initAnimations(): void {
    // Hero section animations
    gsap.from('.typewriter h1', { 
      duration: 1.5, 
      opacity: 0, 
      y: 50, 
      ease: 'power3.out' 
    });

    gsap.from('#role-text', { 
      duration: 1, 
      opacity: 0, 
      y: 20, 
      delay: 1, 
      ease: 'power3.out' 
    });

    gsap.from('.hero-section a', { 
      duration: 1, 
      opacity: 0, 
      y: 30, 
      stagger: 0.2, 
      delay: 1.5, 
      ease: 'power3.out' 
    });

    // Scroll animations will be implemented with a scroll trigger plugin
    // in a future enhancement
  }
}