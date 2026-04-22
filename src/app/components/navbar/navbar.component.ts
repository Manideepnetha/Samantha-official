import { Component, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';

@Component({
   selector: 'app-navbar',
   standalone: true,
   imports: [
      CommonModule,
      RouterLink,
      RouterLinkActive,
      NotificationBellComponent
   ],
   template: `
    <div class="navbar-desktop hidden md:block" [class.is-scrolled]="scrolled">
      <div class="navbar-shell">
        <header class="navbar-topbar">
          <a routerLink="/" class="hero-brand navbar-home-brand" aria-label="Samantha Ruth Prabhu home">
            <span class="brand-emblem" aria-hidden="true">
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
            <span class="brand-text">Samantha</span>
          </a>

          <div class="navbar-desktop-actions">
            <nav class="hero-nav navbar-home-nav" aria-label="Primary">
              <a
                *ngFor="let item of primaryNavItems"
                [routerLink]="item.route"
                routerLinkActive="is-active"
                [routerLinkActiveOptions]="{exact: item.exact}"
                class="navbar-home-link"
              >
                {{ item.label }}
              </a>

              <div class="navbar-more" [class.is-open]="isDesktopMenuOpen">
                <button
                  type="button"
                  class="navbar-home-link navbar-more-trigger"
                  [class.is-active]="hasActiveSecondaryRoute()"
                  [attr.aria-expanded]="isDesktopMenuOpen"
                  aria-haspopup="menu"
                  (click)="toggleDesktopMenu($event)"
                >
                  Explore
                  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M6 8l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>

                <div *ngIf="isDesktopMenuOpen" class="navbar-more-panel" role="menu">
                  <a
                    *ngFor="let item of secondaryNavItems"
                    [routerLink]="item.route"
                    class="navbar-more-link"
                    (click)="closeDesktopMenu()"
                    role="menuitem"
                  >
                    {{ item.label }}
                  </a>
                </div>
              </div>
            </nav>

            <app-notification-bell [compact]="true"></app-notification-bell>

            <button
              (click)="toggleTheme()"
              class="navbar-theme-button navbar-home-theme"
              aria-label="Toggle theme"
            >
              <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd" /></svg>
              <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
            </button>
          </div>
        </header>
      </div>
    </div>

    <div class="md:hidden fixed right-4 top-4 z-[111] flex items-center gap-2">
      <app-notification-bell [compact]="true"></app-notification-bell>
      <button
        (click)="toggleTheme()"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(228,196,163,0.14)] bg-[rgba(18,9,7,0.9)] text-[rgba(243,232,220,0.82)] backdrop-blur-lg transition-colors hover:bg-[rgba(243,232,220,0.08)]"
        aria-label="Toggle theme"
      >
        <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd" /></svg>
        <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
      </button>
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
             <a *ngFor="let item of mobileNavItems" 
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
    :host {
      --navbar-accent: var(--editorial-accent, #d7b18a);
      --navbar-accent-strong: var(--editorial-accent-strong, #e4c4a3);
      --navbar-ink: var(--editorial-ink, #f3e8dc);
      display: block;
    }

    .hero-brand {
      display: inline-flex;
      align-items: center;
      gap: 0.9rem;
      color: var(--navbar-accent-strong);
    }

    .brand-emblem {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.8rem;
      height: 2.8rem;
      border-radius: 999px;
      background: rgba(243, 232, 220, 0.08);
      color: var(--navbar-accent-strong);
      box-shadow: inset 0 0 0 1px rgba(228, 196, 163, 0.16);
      transition: transform 0.35s ease, background 0.35s ease;
    }

    .hero-brand:hover .brand-emblem {
      transform: scale(1.04);
      background: rgba(243, 232, 220, 0.12);
    }

    .brand-text {
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.72rem;
      letter-spacing: 0.34em;
      text-transform: uppercase;
      color: rgba(248, 239, 228, 0.92);
      text-shadow: 0 1px 12px rgba(8, 4, 4, 0.4);
    }

    .hero-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.55rem;
      margin-left: 0;
    }

    .hero-nav a,
    .navbar-more-trigger {
      position: relative;
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.73rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(248, 239, 228, 0.94);
      text-shadow: 0 1px 12px rgba(8, 4, 4, 0.42);
      transition: color 0.3s ease, text-shadow 0.3s ease;
    }

    .hero-nav a::after,
    .navbar-more-trigger::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -0.45rem;
      height: 1px;
      background: var(--navbar-accent);
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 0.3s ease;
    }

    .hero-nav a:hover,
    .navbar-more-trigger:hover {
      color: var(--navbar-accent-strong);
      text-shadow: 0 1px 16px rgba(8, 4, 4, 0.54);
    }

    .navbar-desktop {
      position: sticky;
      top: 0;
      z-index: 80;
      margin-bottom: -5.25rem;
      padding: 0 clamp(1rem, 2vw, 1.75rem);
      background: transparent;
      transition: background 0.35s ease, padding 0.35s ease, margin-bottom 0.35s ease;
    }

    .navbar-desktop::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(8, 4, 4, 0.58) 0%, rgba(8, 4, 4, 0.2) 60%, transparent 100%);
      pointer-events: none;
    }

    .navbar-desktop.is-scrolled {
      background:
        linear-gradient(180deg, rgba(8, 4, 4, 0.82) 0%, rgba(8, 4, 4, 0.34) 68%, transparent 100%);
    }

    .navbar-shell {
      width: min(100%, 1520px);
      margin: 0 auto;
      position: relative;
    }

    .navbar-topbar {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      padding: 1.2rem 2rem 0;
      transition: padding 0.35s ease, background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
    }

    .navbar-desktop.is-scrolled .navbar-topbar {
      padding: 0.85rem 1.35rem;
      border: 1px solid rgba(228, 196, 163, 0.12);
      border-radius: 999px;
      background: rgba(18, 9, 7, 0.48);
      backdrop-filter: blur(14px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
    }

    .navbar-home-brand {
      min-width: max-content;
    }

    .navbar-desktop-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1rem;
      margin-left: auto;
      min-width: 0;
    }

    .navbar-home-nav {
      justify-content: center;
      gap: 1.35rem;
      min-width: 0;
      flex-wrap: nowrap;
    }

    .navbar-home-link {
      position: relative;
      white-space: nowrap;
    }

    .navbar-home-link.is-active {
      color: var(--navbar-accent-strong);
    }

    .navbar-home-link.is-active::after,
    .navbar-more-trigger.is-active::after,
    .navbar-home-link:hover::after,
    .navbar-more-trigger:hover::after {
      transform: scaleX(1);
    }

    .navbar-more {
      position: relative;
    }

    .navbar-more-trigger {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      border: 0;
      padding: 0;
      background: transparent;
      cursor: pointer;
    }

    .navbar-more-trigger svg {
      width: 0.9rem;
      height: 0.9rem;
      transition: transform 0.25s ease;
    }

    .navbar-more-trigger.is-active {
      color: var(--navbar-accent-strong);
    }

    .navbar-more.is-open .navbar-more-trigger {
      color: var(--navbar-accent-strong);
    }

    .navbar-more.is-open .navbar-more-trigger::after {
      transform: scaleX(1);
    }

    .navbar-more.is-open .navbar-more-trigger svg {
      transform: rotate(180deg);
    }

    .navbar-more-panel {
      position: absolute;
      top: calc(100% + 1rem);
      right: 0;
      min-width: 14rem;
      display: grid;
      gap: 0.35rem;
      padding: 0.8rem;
      border: 1px solid rgba(228, 196, 163, 0.16);
      border-radius: 1.25rem;
      background:
        linear-gradient(180deg, rgba(27, 14, 11, 0.96), rgba(12, 7, 6, 0.96)),
        rgba(18, 9, 7, 0.94);
      box-shadow: 0 28px 60px rgba(0, 0, 0, 0.28);
      animation: slide-in 0.22s ease-out;
    }

    .navbar-more-link {
      display: block;
      padding: 0.82rem 0.95rem;
      border-radius: 0.9rem;
      color: rgba(243, 232, 220, 0.82);
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      transition: background 0.28s ease, color 0.28s ease;
    }

    .navbar-more-link:hover {
      background: rgba(243, 232, 220, 0.06);
      color: var(--navbar-accent-strong);
    }

    .navbar-home-theme {
      width: 2.8rem;
      height: 2.8rem;
      border: 1px solid rgba(228, 196, 163, 0.16);
      background: rgba(243, 232, 220, 0.06);
      color: rgba(243, 232, 220, 0.72);
    }

    .navbar-home-theme:hover {
      color: var(--navbar-accent-strong);
      background: rgba(243, 232, 220, 0.1);
    }

    .navbar-theme-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
    }

    .navbar-theme-button:hover {
      transform: translateY(-1px);
    }

    @media (max-width: 1420px) {
      .navbar-home-nav {
        gap: 1.1rem;
      }

      .navbar-home-link {
        font-size: 0.69rem;
        letter-spacing: 0.12em;
      }
    }

    @media (max-width: 1199px) {
      .navbar-desktop {
        margin-bottom: -4.8rem;
      }

      .navbar-topbar {
        gap: 1rem;
        padding: 1rem 1rem 0;
      }

      .navbar-desktop.is-scrolled .navbar-topbar {
        padding: 0.8rem 1rem;
      }

      .brand-text {
        display: none;
      }

      .navbar-home-nav {
        gap: 0.95rem;
      }

      .navbar-home-link {
        font-size: 0.67rem;
        letter-spacing: 0.12em;
      }

      .navbar-more-link {
        font-size: 0.68rem;
      }
    }

    @keyframes slide-in {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-in { animation: slide-in 0.3s ease-out; }
  `]
})
export class NavbarComponent implements OnDestroy {
   @Output() themeToggle = new EventEmitter<void>();

   scrolled = false;
   isMobileMenuOpen = false;
   isDesktopMenuOpen = false;
   isDarkMode = false;

   primaryNavItems = [
      { label: 'About Me', route: '/about', exact: false },
      { label: 'Filmography', route: '/filmography', exact: false },
      { label: 'Awards', route: '/awards', exact: false },
      { label: 'Gallery', route: '/gallery', exact: false },
      { label: 'Fan Zone', route: '/fan-zone', exact: false }
   ];

   secondaryNavItems = [
      { label: 'Fashion', route: '/fashion', exact: false },
      { label: 'Philanthropy', route: '/philanthropy', exact: false },
      { label: 'Journal', route: '/journal', exact: false },
      { label: 'Fan Wall', route: '/fan-wall', exact: false },
      { label: 'Wallpapers', route: '/wallpapers', exact: false },
      { label: 'Press', route: '/media', exact: false }
   ];

   mobileNavItems = [
      { label: 'Home', route: '/', exact: true },
      ...this.primaryNavItems,
      ...this.secondaryNavItems
   ];

   constructor(private themeService: ThemeService, private router: Router) {
      this.themeService.isDarkMode$.subscribe(isDark => {
         this.isDarkMode = isDark;
      });
   }

   @HostListener('window:scroll', [])
   onWindowScroll() {
      this.scrolled = window.scrollY > 20;
   }

   @HostListener('document:click', ['$event'])
   onDocumentClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('.navbar-more')) {
         this.isDesktopMenuOpen = false;
      }
   }

   @HostListener('document:keydown.escape')
   onEscapeKey() {
      this.closeDesktopMenu();
      if (this.isMobileMenuOpen) {
         this.toggleMobileMenu();
      }
   }

   toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
   }

   toggleDesktopMenu(event: Event) {
      event.stopPropagation();
      this.isDesktopMenuOpen = !this.isDesktopMenuOpen;
   }

   closeDesktopMenu() {
      this.isDesktopMenuOpen = false;
   }

   hasActiveSecondaryRoute(): boolean {
      return this.secondaryNavItems.some(item => this.isCurrentRoute(item.route, item.exact));
   }

   isCurrentRoute(route: string, exact = false): boolean {
      if (route === '/') {
         return this.router.url === '/';
      }

      return exact ? this.router.url === route : this.router.url.startsWith(route);
   }

   toggleTheme() {
      this.themeService.toggleDarkMode();
   }

   ngOnDestroy(): void {
      document.body.style.overflow = '';
   }
}
