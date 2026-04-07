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
    <div class="hidden md:block">
      <div class="fixed top-0 left-0 right-0 z-[60] flex justify-center px-4 pt-2 pointer-events-none">
        <nav
          class="pointer-events-auto w-full max-w-7xl rounded-[1.9rem] border border-[rgba(228,196,163,0.18)] bg-[rgba(18,9,7,0.84)] backdrop-blur-xl shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition-all duration-500"
          [class.py-2]="scrolled"
          [class.py-3]="!scrolled"
          [class.px-5]="scrolled"
          [class.px-7]="!scrolled"
        >
          <div class="flex items-center gap-8 justify-between">
            <a routerLink="/" class="flex items-center gap-3 group">
              <span class="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(228,196,163,0.16)] bg-[rgba(243,232,220,0.05)] text-[var(--editorial-accent-strong)] shadow-[inset_0_0_0_1px_rgba(228,196,163,0.12)]">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7">
                  <circle cx="32" cy="32" r="10.5" stroke="currentColor" stroke-width="2.4" />
                  <circle cx="32" cy="13" r="6.5" stroke="currentColor" stroke-width="2.2" />
                  <circle cx="49" cy="22" r="6.5" stroke="currentColor" stroke-width="2.2" />
                  <circle cx="49" cy="42" r="6.5" stroke="currentColor" stroke-width="2.2" />
                  <circle cx="32" cy="51" r="6.5" stroke="currentColor" stroke-width="2.2" />
                  <circle cx="15" cy="42" r="6.5" stroke="currentColor" stroke-width="2.2" />
                  <circle cx="15" cy="22" r="6.5" stroke="currentColor" stroke-width="2.2" />
                </svg>
              </span>
              <span
                class="font-['Manrope'] text-[11px] font-extrabold uppercase tracking-[0.34em] text-[rgba(243,232,220,0.84)] transition-all duration-500 ease-out"
                [class.opacity-100]="scrolled"
                [class.opacity-90]="!scrolled"
              >
                Samantha
              </span>
            </a>

            <div class="flex items-center gap-8">
              <a *ngFor="let item of navItems" 
                 [routerLink]="item.route" 
                 routerLinkActive="text-[var(--editorial-accent-strong)]"
                 [routerLinkActiveOptions]="{exact: item.exact}"
                 class="font-['Manrope'] text-[12px] font-extrabold uppercase tracking-[0.14em] text-[rgba(243,232,220,0.74)] transition-colors relative group hover:text-[var(--editorial-accent-strong)]">
                {{item.label}}
                <span class="absolute -bottom-1 left-1/2 h-px w-full -translate-x-1/2 scale-x-0 bg-[var(--editorial-accent)] opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"></span>
              </a>
            </div>

            <div class="flex items-center gap-4">
               <button
                  (click)="toggleTheme()"
                  class="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] text-[rgba(243,232,220,0.64)] transition-colors hover:text-[var(--editorial-accent-strong)]"
               >
                  <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd" /></svg>
                  <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
               </button>

               <a routerLink="/fan-zone" class="sr-button">Fan Zone</a>
            </div>
          </div>
        </nav>
      </div>
    </div>

    <div class="md:hidden fixed bottom-0 left-0 right-0 z-[100] border-t border-[rgba(228,196,163,0.16)] bg-[rgba(18,9,7,0.92)] backdrop-blur-lg pb-safe">
       <div class="flex justify-around items-center h-16 px-2">
          <a routerLink="/" routerLinkActive="text-[var(--editorial-accent-strong)]" [routerLinkActiveOptions]="{exact: true}" class="flex flex-col items-center gap-1 p-2 text-[rgba(243,232,220,0.44)] transition-colors hover:text-[var(--editorial-accent-strong)]">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
             <span class="text-[10px] font-medium tracking-wide">Home</span>
          </a>

          <a routerLink="/filmography" routerLinkActive="text-[var(--editorial-accent-strong)]" class="flex flex-col items-center gap-1 p-2 text-[rgba(243,232,220,0.44)] transition-colors hover:text-[var(--editorial-accent-strong)]">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
             <span class="text-[10px] font-medium tracking-wide">Films</span>
          </a>

          <div class="relative -top-5">
             <a routerLink="/gallery" class="flex items-center justify-center w-14 h-14 rounded-full bg-[linear-gradient(135deg,#d5b18c_0%,#e2c4a1_100%)] shadow-lg shadow-[rgba(212,177,140,0.25)] border-4 border-[rgba(18,9,7,0.92)] transform active:scale-95 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#24130f]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
             </a>
          </div>

          <a routerLink="/awards" routerLinkActive="text-[var(--editorial-accent-strong)]" class="flex flex-col items-center gap-1 p-2 text-[rgba(243,232,220,0.44)] transition-colors hover:text-[var(--editorial-accent-strong)]">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
             <span class="text-[10px] font-medium tracking-wide">Awards</span>
          </a>

          <button (click)="toggleMobileMenu()" class="flex flex-col items-center gap-1 p-2 text-[rgba(243,232,220,0.44)] transition-colors hover:text-[var(--editorial-accent-strong)]">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
             <span class="text-[10px] font-medium tracking-wide">Menu</span>
          </button>
       </div>
    </div>

    <div *ngIf="isMobileMenuOpen" class="fixed inset-0 z-[101] flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in" (click)="toggleMobileMenu()">
       <div class="rounded-t-[2rem] border-t border-[rgba(228,196,163,0.16)] bg-[linear-gradient(180deg,#170c0a_0%,#0c0605_100%)] p-6 pb-24 shadow-2xl animate-slide-up" (click)="$event.stopPropagation()">
          <div class="mb-6 flex items-center justify-between border-b border-[rgba(228,196,163,0.1)] pb-4">
             <span class="font-['Cormorant_Garamond'] text-3xl font-semibold text-[var(--editorial-accent-strong)]">More Options</span>
             <button (click)="toggleTheme()" class="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.05)]">
                <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[rgba(243,232,220,0.8)]" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd" /></svg>
                <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[rgba(243,232,220,0.8)]" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
             </button>
          </div>
          
          <div class="grid grid-cols-3 gap-6">
             <a *ngFor="let item of navItems" 
                 [routerLink]="item.route" 
                 (click)="toggleMobileMenu()"
                 class="flex flex-col items-center gap-3 rounded-xl border border-[rgba(228,196,163,0.08)] bg-[rgba(243,232,220,0.03)] p-3 transition-colors hover:bg-[rgba(243,232,220,0.06)]">
                 <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(215,177,138,0.12)] text-[var(--editorial-accent-strong)]">
                    <span class="font-playfair font-bold text-lg">{{item.label[0]}}</span>
                 </div>
                 <span class="text-center text-xs font-medium tracking-wide text-[rgba(243,232,220,0.82)]">{{item.label}}</span>
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
      { label: 'Blog', route: '/blog', exact: false },
      { label: 'Press', route: '/media', exact: false },
      { label: 'Gallery', route: '/gallery', exact: false },
      { label: 'Fan Zone', route: '/fan-zone', exact: false }
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
