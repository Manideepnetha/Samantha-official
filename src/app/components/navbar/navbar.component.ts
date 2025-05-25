import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <nav class="fixed top-0 w-full z-50 transition-all duration-300" 
         [class.nav-scrolled]="scrolled">
      <div class="absolute inset-0 bg-gradient-to-r from-white/80 via-royal-gold/20 to-charcoal/80 dark:from-deep-black/80 dark:via-royal-gold/10 dark:to-deep-black/80 backdrop-blur-xl border-b border-royal-gold/40 dark:border-royal-gold/30 animate-gradient-move"></div>
      <div class="container mx-auto px-4 md:px-8 relative">
        <div class="flex items-center justify-between h-20">
          <!-- Logo + Avatar -->
          <a routerLink="/" class="flex items-center group space-x-3">
            <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748007968/8F9A7052_blcxqk.jpg" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-royal-gold shadow-lg object-cover aspect-square transition-transform duration-300 group-hover:scale-110" />
            <span class="text-2xl font-playfair font-bold bg-gradient-to-r from-charcoal to-charcoal/80 dark:from-ivory dark:to-ivory/80 bg-clip-text text-transparent group-hover:from-royal-gold group-hover:to-royal-gold/80 transition-all duration-300">SR</span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex space-x-8">
            <a *ngFor="let item of navItems" 
               [routerLink]="item.route" 
               routerLinkActive="nav-active" 
               [routerLinkActiveOptions]="{exact: item.exact}"
               class="font-inter text-white dark:text-white hover:text-royal-gold dark:hover:text-royal-gold transition-all duration-300 relative nav-link transform hover:scale-110">
              {{item.label}}
            </a>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center space-x-4">
            <!-- CTA Button -->
            <a href="#" class="hidden md:inline-block px-5 py-2 rounded-full bg-royal-gold text-white font-bold shadow-lg hover:shadow-royal-gold/50 hover:bg-royal-gold/90 transition-all duration-300 border-2 border-transparent hover:border-ivory dark:hover:border-charcoal animate-bounce-slow">Follow</a>

            <!-- Theme Toggle -->
            <button (click)="toggleTheme()" 
                    class="p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-charcoal/30 transition-all duration-300 group">
              <span *ngIf="isDarkMode" class="text-ivory/90 group-hover:text-royal-gold transition-colors duration-300">
                <!-- Sun icon (for dark mode) -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <span *ngIf="!isDarkMode" class="text-charcoal/90 group-hover:text-royal-gold transition-colors duration-300">
                <!-- Moon icon (for light mode) -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </span>
            </button>

            <!-- Mobile Menu Button -->
            <button (click)="toggleMobileMenu()" 
                    class="md:hidden p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-charcoal/30 transition-all duration-300 group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-charcoal/90 dark:text-ivory/90 group-hover:text-royal-gold transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div *ngIf="isMobileMenuOpen" 
           class="md:hidden fixed inset-0 bg-gradient-to-br from-deep-black/98 to-deep-black/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center animate-fade-in">
        <button (click)="toggleMobileMenu()" class="absolute top-6 right-6 hover:text-royal-gold transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-ivory/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="flex flex-col items-center space-y-8 py-12">
          <a *ngFor="let item of navItems" 
             [routerLink]="item.route" 
             routerLinkActive="text-royal-gold" 
             [routerLinkActiveOptions]="{exact: item.exact}"
             (click)="toggleMobileMenu()"
             class="font-playfair text-2xl text-ivory/90 hover:text-royal-gold transition-all duration-300 relative mobile-nav-link transform hover:scale-110">
            {{item.label}}
          </a>
          <a href="#" class="mt-8 px-8 py-3 rounded-full bg-royal-gold text-white font-bold shadow-lg hover:shadow-royal-gold/50 hover:bg-royal-gold/90 transition-all duration-300 border-2 border-transparent hover:border-ivory dark:hover:border-charcoal animate-bounce-slow">Follow</a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .nav-scrolled {
      @apply shadow-2xl shadow-royal-gold/30 dark:shadow-royal-gold/40 border-b-4 border-royal-gold/60 dark:border-royal-gold/80;
      box-shadow: 0 8px 32px 0 rgba(255, 215, 0, 0.25), 0 1.5px 0 0 #FFD700;
    }

    .nav-link::after {
      content: '';
      @apply absolute bottom-0 left-0 w-0 h-0.5 bg-royal-gold transition-all duration-300 opacity-0;
    }

    .nav-link:hover::after {
      @apply w-full opacity-100;
    }

    .nav-link:hover {
      @apply text-royal-gold scale-110;
      filter: drop-shadow(0 0 6px #FFD70088);
    }

    .nav-active {
      @apply text-royal-gold;
    }

    .nav-active::after {
      content: '';
      @apply absolute bottom-0 left-0 w-full h-0.5 bg-royal-gold opacity-100;
    }

    .mobile-nav-link::after {
      content: '';
      @apply absolute -bottom-2 left-1/2 w-0 h-0.5 bg-royal-gold transition-all duration-300 opacity-0 transform -translate-x-1/2;
    }

    .mobile-nav-link:hover::after {
      @apply w-full opacity-100;
    }

    .mobile-nav-link:hover {
      @apply text-royal-gold scale-110;
      filter: drop-shadow(0 0 6px #FFD70088);
    }

    @keyframes fade-in {
      from { 
        opacity: 0;
        transform: scale(0.98);
      }
      to { 
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }

    @keyframes gradient-move {
      0% {
        background-position: 0% 50%;
      }
      100% {
        background-position: 100% 50%;
      }
    }

    .animate-gradient-move {
      background-size: 200% 200%;
      animation: gradient-move 6s ease-in-out infinite alternate;
    }

    .animate-bounce-slow {
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-6px);
      }
    }
  `]
})
export class NavbarComponent {
  @Output() themeToggle = new EventEmitter<void>();
  
  scrolled = false;
  isMobileMenuOpen = false;
  isDarkMode = false;
  
  navItems = [
    { label: 'Home', route: '/', exact: true },
    { label: 'About', route: '/about', exact: false },
    { label: 'Films', route: '/filmography', exact: false },
    { label: 'Awards', route: '/awards', exact: false },
    { label: 'Philanthropy', route: '/philanthropy', exact: false },
    { label: 'Fashion', route: '/fashion', exact: false },
    { label: 'Gallery', route: '/gallery', exact: false },
    { label: 'Media', route: '/media', exact: false },
    { label: 'Contact', route: '/contact', exact: false }
  ];
  
  constructor(private themeService: ThemeService) {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', () => {
      this.scrolled = window.scrollY > 20;
    });
  }
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Prevent scrolling when mobile menu is open
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }
  
  toggleTheme(): void {
    this.themeToggle.emit();
  }
}