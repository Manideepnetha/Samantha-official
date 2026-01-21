import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChildren, QueryList, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative min-h-screen overflow-hidden bg-deep-black">
      <!-- Hero Section with Video/Image Carousel -->
      <section class="relative h-screen w-full overflow-hidden">
        
        <!-- Video Background (Primary) -->
        <div class="absolute inset-0 z-0 select-none pointer-events-none">
           <!-- Placeholder Gradient for loading -->
           <div class="absolute inset-0 bg-gradient-to-br from-deep-black via-charcoal to-deep-black z-0"></div>
           
           <!-- Active Carousel Image (Ken Burns Effect) -->
           <div *ngFor="let slide of heroSlides; let i = index" 
                class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                [class.opacity-100]="currentSlide === i"
                [class.opacity-0]="currentSlide !== i">
             <img 
               [src]="slide.image" 
               [alt]="'Samantha Ruth Prabhu - ' + slide.role"
               class="w-full h-full object-cover object-top ken-burns"
             />
             <div class="absolute inset-0 bg-gradient-to-b from-deep-black/60 via-transparent to-deep-black/90"></div>
           </div>
        </div>

        <!-- Hero Content -->
        <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-ivory">
          <div class="hero-content max-w-5xl mt-12 md:mt-0">
            <h1 class="font-playfair text-5xl md:text-7xl lg:text-9xl font-bold mb-4 text-shadow-lg tracking-tight leading-none mix-blend-overlay opacity-90">
              SAMANTHA
            </h1>
            <h2 class="font-playfair text-2xl md:text-4xl lg:text-5xl font-light mb-12 tracking-widest uppercase text-royal-gold/90">
              Ruth Prabhu
            </h2>
          </div>
          
          <div class="h-16 overflow-hidden mb-12">
             <div id="role-text" class="text-xl md:text-3xl font-inter font-light tracking-wide text-ivory/90">
               {{roles[currentRole]}}
             </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-6 hero-buttons">
            <a [routerLink]="['/about']" class="group relative px-8 py-4 bg-royal-gold text-deep-black rounded-sm font-inter font-bold tracking-widest overflow-hidden transition-all hover:bg-white">
              <span class="relative z-10">EXPLORE</span>
              <div class="absolute inset-0 h-full w-full scale-0 rounded-sm transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
            </a>
            <a [routerLink]="['/filmography']" class="px-8 py-4 bg-transparent text-ivory border border-ivory/30 rounded-sm font-inter font-medium tracking-widest hover:border-royal-gold hover:text-royal-gold transition-all backdrop-blur-sm">
              FILMOGRAPHY
            </a>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-pulse">
           <span class="text-[10px] uppercase tracking-[0.3em] text-ivory/60 mb-2">Scroll</span>
           <div class="w-[1px] h-12 bg-gradient-to-b from-royal-gold to-transparent"></div>
        </div>
      </section>

      <!-- Latest News Section -->
      <section class="py-24 bg-ivory dark:bg-deep-black relative overflow-hidden">
        <!-- Parallax decoration -->
        <div class="absolute top-0 right-0 w-1/2 h-full bg-royal-gold/5 blur-[150px] rounded-full pointer-events-none parallax-bg" data-speed="0.05"></div>

        <div class="container mx-auto px-4 relative z-10">
          <div class="text-center mb-20 scroll-reveal">
            <span class="inline-block text-royal-gold font-inter text-xs uppercase tracking-[0.2em] mb-4 border-b border-royal-gold pb-1">Updates</span>
            <h2 class="text-4xl md:text-6xl font-playfair font-bold text-charcoal dark:text-ivory">Latest Highlights</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div *ngFor="let news of latestNews" #tiltCard class="group cursor-pointer perspective-1000">
               <div class="relative overflow-hidden rounded-sm shadow-2xl transition-all duration-500 transform-style-3d group-hover:shadow-royal-gold/20">
                  <div class="aspect-[4/5] overflow-hidden">
                    <img [src]="news.image" [alt]="news.title" 
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0">
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-80"></div>
                  <div class="absolute bottom-0 left-0 p-8 transform translate-z-20">
                    <span class="text-xs text-royal-gold font-inter uppercase tracking-wider mb-2 block">{{news.date}}</span>
                    <h3 class="font-playfair text-2xl font-bold text-ivory leading-tight group-hover:text-royal-gold transition-colors">{{news.title}}</h3>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming Projects -->
      <section class="py-32 bg-charcoal relative">
        <div class="container mx-auto px-4">
          <div class="text-center mb-24 scroll-reveal">
             <h2 class="text-4xl md:text-6xl font-playfair font-bold text-ivory mb-6">Upcoming <span class="italic text-royal-gold">Projects</span></h2>
             <p class="max-w-2xl mx-auto text-ivory/60 font-inter font-light">The future of cinema, unfolding soon.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div *ngFor="let project of upcomingProjects" #tiltCard 
                 class="relative group rounded-lg overflow-hidden bg-deep-black hover-lift shadow-none border border-white/5 hover:border-royal-gold/30 transition-all duration-500">
              <div class="aspect-[2/3] overflow-hidden opacity-60 group-hover:opacity-40 transition-opacity duration-500">
                 <img [src]="project.image" [alt]="project.title" class="w-full h-full object-cover filter blur-[2px] group-hover:blur-0 transition-all duration-700">
              </div>
              <div class="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-deep-black via-deep-black/80 to-transparent">
                 <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                   <div class="flex items-center gap-3 mb-3">
                      <span class="px-2 py-1 text-[10px] border border-royal-gold text-royal-gold uppercase tracking-widest">{{project.type}}</span>
                      <span class="text-xs text-ivory/60 uppercase tracking-wide">{{project.releaseDate}}</span>
                   </div>
                   <h3 class="font-playfair text-3xl font-bold text-ivory mb-2">{{project.title}}</h3>
                   <p class="text-sm text-ivory/60 font-inter line-clamp-2 md:line-clamp-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{{project.description}}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Gallery (Bento Grid) -->
      <section class="py-24 bg-deep-black">
        <div class="container mx-auto px-4">
           <div class="flex justify-between items-end mb-16 px-4 scroll-reveal">
              <h2 class="text-4xl md:text-5xl font-playfair font-bold text-ivory">Visual <br/><span class="text-royal-gold italic">Archives</span></h2>
              <a [routerLink]="['/gallery']" class="hidden md:inline-block text-ivory/60 hover:text-royal-gold transition-colors font-inter text-sm uppercase tracking-widest mb-2 border-b border-transparent hover:border-royal-gold pb-1">View Full Gallery</a>
           </div>

           <div class="grid grid-cols-2 md:grid-cols-4 grid-rows-2 h-[80vh] gap-4">
              <div *ngFor="let image of featuredGallery; let i = index" 
                   class="relative overflow-hidden group cursor-none"
                   [class.col-span-2]="i === 0 || i === 5"
                   [class.row-span-2]="i === 0 || i === 3"
                   [class.md:row-span-2]="i === 0">
                 <img [src]="image.url" [alt]="image.alt" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105">
                 <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>
           </div>
           
           <div class="mt-12 text-center md:hidden">
              <a [routerLink]="['/gallery']" class="text-ivory/60 hover:text-royal-gold font-inter text-sm uppercase tracking-widest border-b border-white/20 pb-1">View Full Gallery</a>
           </div>
        </div>
      </section>

      <!-- Minimal Connect Section -->
      <section class="py-32 bg-white dark:bg-ivory text-deep-black">
         <div class="container mx-auto px-4 text-center">
            <h2 class="text-5xl md:text-8xl font-playfair font-bold mb-12 tracking-tighter opacity-10">SAMANTHA</h2>
            <div class="flex justify-center gap-8 md:gap-16">
               <a href="https://instagram.com/samantharuthprabhuoffl" target="_blank" class="text-xl md:text-2xl font-inter font-medium hover:text-royal-gold hover:scale-110 transition-all">Instagram</a>
               <a href="https://twitter.com/samanthaprabhu2" target="_blank" class="text-xl md:text-2xl font-inter font-medium hover:text-royal-gold hover:scale-110 transition-all">Twitter</a>
               <a href="https://youtube.com/@samanthaofficial" target="_blank" class="text-xl md:text-2xl font-inter font-medium hover:text-royal-gold hover:scale-110 transition-all">YouTube</a>
            </div>
         </div>
      </section>
    </div>
  `,
  styles: [`
    .ken-burns { animation: kenBurns 20s infinite alternate; }
    @keyframes kenBurns {
      0% { transform: scale(1) translate(0, 0); }
      100% { transform: scale(1.15) translate(-1%, -1%); }
    }
    .text-shadow-lg { text-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .perspective-1000 { perspective: 1000px; }
    .transform-style-3d { transform-style: preserve-3d; }
    .translate-z-20 { transform: translateZ(20px); }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('tiltCard') tiltCards!: QueryList<ElementRef>;

  currentSlide = 0;
  currentRole = 0;
  roles = ['Artist', 'Philanthropist', 'Entrepreneur', 'Icon'];
  roleInterval: any;
  slideInterval: any;

  // Using high-res images for Hero
  heroSlides = [
    { image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008414/8F9A7087_koclpw.jpg', role: 'Artist' },
    { image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008413/PAND7159_k4qlvo.jpg', role: 'Philanthropist' },
    { image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg', role: 'Icon' }
  ];

  latestNews: any[] = [];
  upcomingProjects: any[] = [];
  featuredGallery: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.startCarousels();
    this.loadData();
  }

  loadData() {
    this.apiService.getNews().subscribe(data => this.latestNews = data.map(item => ({ ...item, image: item.imageUrl })).slice(0, 3));
    this.apiService.getMovies().subscribe(data => {
      this.upcomingProjects = data.filter(m => m.year >= 2025).map(m => ({
        title: m.title,
        type: 'Film',
        releaseDate: m.releaseDate,
        description: m.description,
        director: m.director,
        image: m.title.toLowerCase().includes('bangaram') ? 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1768338977/vdTawCMwiQs-HD_hz86rl.jpg' : (m.poster || 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748010072/8F9A7985_m86vsc.jpg')
      })).slice(0, 3);
    });
    this.apiService.getMediaGalleries().subscribe(data => {
      this.featuredGallery = data.filter(g => g.type === 'Home').map(g => ({ url: g.imageUrl, alt: g.altText, caption: g.caption }));
    });
  }

  ngAfterViewInit(): void {
    this.initAnimations();
    this.initTiltEffect();
  }

  ngOnDestroy(): void {
    clearInterval(this.roleInterval);
    clearInterval(this.slideInterval);
  }

  startCarousels(): void {
    this.roleInterval = setInterval(() => this.currentRole = (this.currentRole + 1) % this.roles.length, 3000);
    this.slideInterval = setInterval(() => this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length, 6000);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Simple parallax for bg elements
    const scrolled = window.scrollY;
    const parallaxBg = document.querySelector('.parallax-bg') as HTMLElement;
    if (parallaxBg) {
      parallaxBg.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
  }

  initTiltEffect() {
    // 3D Tilt Logic using GSAP
    this.tiltCards.forEach((cardRef) => {
      const card = cardRef.nativeElement;

      card.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(card.children[0], {
          duration: 0.5,
          rotateX: rotateX,
          rotateY: rotateY,
          scale: 1.02,
          ease: 'power2.out',
          transformPerspective: 1000,
          transformOrigin: 'center'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card.children[0], {
          duration: 0.8,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          ease: 'elastic.out(1, 0.5)'
        });
      });
    });
  }

  initAnimations(): void {
    // Staggered reveal for Hero text
    gsap.from('.hero-content > *', {
      duration: 1.2,
      y: 50,
      opacity: 0,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 0.5
    });

    // Reveal buttons
    gsap.from('.hero-buttons a', {
      duration: 1,
      y: 20,
      opacity: 0,
      stagger: 0.2,
      ease: 'power2.out',
      delay: 1.2
    });

    // Reveal sections on scroll using IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.from(entry.target.children, {
            duration: 1,
            y: 40,
            opacity: 0,
            stagger: 0.15,
            ease: 'power3.out'
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
  }
}
