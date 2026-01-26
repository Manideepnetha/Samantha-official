import { Component, Output, EventEmitter, HostListener } from '@angular/core';
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
    <!-- ======================= -->
    <!-- DESKTOP NAVBAR (Top Tab) -->
    <!-- ======================= -->
    <div class="hidden md:block">
      <!-- Attached Tab Container -->
      <!-- Top is 0 to tuck strictly under the global 6px border z-overlay -->
      <div class="fixed top-0 left-0 right-0 z-[50] flex justify-center pointer-events-none transition-all duration-300">
           
        <!-- The Attached Tab (Pointer events auto to allow clicking) -->
        <nav class="pointer-events-auto bg-white/95 dark:bg-charcoal/95 backdrop-blur-md border-b border-x border-gray-200 dark:border-white/10 rounded-b-[2rem] shadow-lg transition-all duration-500"
             [class.px-12]="true"
             [class.max-w-7xl]="true"
             [class.w-auto]="true"
             [class.py-2]="scrolled"
             [class.py-4]="!scrolled">
          
          <div class="flex items-center gap-12 justify-between">
            
            <!-- LEFT: Brand / Logo -->
            <a routerLink="/" class="flex items-center gap-3 group">
              <div class="relative w-9 h-9 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700">
                 <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748007968/8F9A7052_blcxqk.jpg" alt="SR" class="w-full h-full object-cover" />
              </div>
              <!-- Gucci-Style Transition: Hidden at top (!scrolled), Visible on scroll -->
              <span class="font-playfair font-bold text-xl tracking-wide text-charcoal dark:text-ivory group-hover:text-royal-gold transition-all duration-500 ease-out transform"
                    [class.opacity-0]="!scrolled" 
                    [class.-translate-y-2]="!scrolled"
                    [class.opacity-100]="scrolled"
                    [class.translate-y-0]="scrolled">
                Samantha
              </span>
            </a>

            <!-- CENTER: Navigation Links (Desktop) -->
            <div class="flex items-center gap-8">
              <a *ngFor="let item of navItems" 
                 [routerLink]="item.route" 
                 routerLinkActive="text-royal-gold font-semibold"
                 [routerLinkActiveOptions]="{exact: item.exact}"
                 class="font-inter text-[15px] font-medium text-charcoal/80 dark:text-ivory/80 hover:text-royal-gold dark:hover:text-royal-gold transition-colors relative group">
                {{item.label}}
                <span class="absolute -bottom-1 left-1/2 w-1 h-1 bg-royal-gold rounded-full opacity-0 group-hover:opacity-100 transform -translate-x-1/2 transition-all duration-300"></span>
              </a>
            </div>

            <!-- RIGHT: Actions -->
            <div class="flex items-center gap-4">
               <button (click)="toggleTheme()" class="p-2 text-gray-500 hover:text-royal-gold transition-colors">
                  <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd" /></svg>
                  <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
               </button>

               <a href="#" class="px-6 py-2.5 rounded-xl bg-deep-black dark:bg-ivory text-white dark:text-deep-black text-xs font-bold tracking-wider hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  GET IN TOUCH
               </a>
            </div>
          </div>
        </nav>
      </div>
    </div>

    <!-- ====================== -->
    <!-- MOBILE BOTTOM APP BAR -->
    <!-- ====================== -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 dark:bg-charcoal/95 backdrop-blur-lg border-t border-gray-200 dark:border-white/10 pb-safe">
       <div class="flex justify-around items-center h-16 px-2">
          <!-- Home -->
          <a routerLink="/" routerLinkActive="text-royal-gold" [routerLinkActiveOptions]="{exact: true}" class="flex flex-col items-center gap-1 p-2 text-gray-400 dark:text-gray-500 hover:text-royal-gold transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
             <span class="text-[10px] font-medium tracking-wide">Home</span>
          </a>

          <!-- Films -->
          <a routerLink="/filmography" routerLinkActive="text-royal-gold" class="flex flex-col items-center gap-1 p-2 text-gray-400 dark:text-gray-500 hover:text-royal-gold transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
             <span class="text-[10px] font-medium tracking-wide">Films</span>
          </a>

          <!-- Center FAB (Brand/Gallery) -->
          <div class="relative -top-5">
             <a routerLink="/gallery" class="flex items-center justify-center w-14 h-14 rounded-full bg-deep-black dark:bg-ivory shadow-lg shadow-royal-gold/20 border-4 border-white dark:border-charcoal transform active:scale-95 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white dark:text-deep-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             </a>
          </div>

          <!-- Awards -->
          <a routerLink="/awards" routerLinkActive="text-royal-gold" class="flex flex-col items-center gap-1 p-2 text-gray-400 dark:text-gray-500 hover:text-royal-gold transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
             <span class="text-[10px] font-medium tracking-wide">Awards</span>
          </a>

          <!-- Menu/More -->
          <button (click)="toggleMobileMenu()" class="flex flex-col items-center gap-1 p-2 text-gray-400 dark:text-gray-500 hover:text-royal-gold transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
             <span class="text-[10px] font-medium tracking-wide">Menu</span>
          </button>
       </div>
    </div>

    <!-- Mobile Full Menu Overlay (Triggered by 'More' button) -->
    <div *ngIf="isMobileMenuOpen" class="fixed inset-0 z-[101] flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in" (click)="toggleMobileMenu()">
       <div class="bg-white dark:bg-charcoal rounded-t-[2rem] p-6 pb-24 shadow-2xl animate-slide-up" (click)="$event.stopPropagation()">
          <div class="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-white/5 pb-4">
             <span class="font-playfair text-xl font-bold dark:text-ivory">More Options</span>
             <button (click)="toggleTheme()" class="p-2 rounded-full bg-gray-50 dark:bg-white/5">
                <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd" /></svg>
                <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
             </button>
          </div>
          
          <div class="grid grid-cols-3 gap-6">
             <a *ngFor="let item of navItems" 
                 [routerLink]="item.route" 
                 (click)="toggleMobileMenu()"
                 class="flex flex-col items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                 <div class="w-10 h-10 rounded-full bg-royal-gold/10 flex items-center justify-center text-royal-gold">
                    <!-- Simple dot for now, or bespoke icons later -->
                    <span class="font-playfair font-bold text-lg">{{item.label[0]}}</span>
                 </div>
                 <span class="text-xs font-medium text-charcoal dark:text-ivory text-center">{{item.label}}</span>
             </a>
          </div>
       </div>
    </div>
  `,
   styles: [`
    @keyframes slide-in {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-in { animation: slide-in 0.3s ease-out; }
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
      { label: 'Fashion', route: '/fashion', exact: false },
      { label: 'Philanthropy', route: '/philanthropy', exact: false },
      { label: 'Press', route: '/media', exact: false },
      { label: 'Gallery', route: '/gallery', exact: false },
      { label: 'Contact', route: '/contact', exact: false }
   ];

   constructor(private themeService: ThemeService) {
      this.themeService.isDarkMode$.subscribe(isDark => {
         this.isDarkMode = isDark;
      });
   }

   @HostListener('window:scroll', [])
   onWindowScroll() {
      this.scrolled = window.scrollY > 20;
   }

   toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
   }

   toggleTheme() {
      this.themeService.toggleDarkMode();
   }
}