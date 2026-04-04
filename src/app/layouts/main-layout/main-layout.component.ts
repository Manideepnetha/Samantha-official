import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar *ngIf="!isHomeRoute"></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>

    <!-- Back to Top Button -->
    <button
      *ngIf="showBackToTop"
      (click)="scrollToTop()"
      aria-label="Back to top"
      class="fixed bottom-24 md:bottom-8 right-6 z-[200] w-12 h-12 rounded-full bg-royal-gold text-deep-black shadow-lg flex items-center justify-center hover:bg-royal-gold/90 hover:-translate-y-1 transition-all duration-300 animate-fade-in">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  `,
  styles: [`
    main { min-height: calc(100vh - 160px); }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
  `]
})
export class MainLayoutComponent {
  showBackToTop = false;
  isHomeRoute = true;

  constructor(private router: Router) {
    this.syncRouteState(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.syncRouteState(event.urlAfterRedirects);
      }
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.showBackToTop = window.scrollY > 400;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private syncRouteState(url: string) {
    this.isHomeRoute = url === '/' || url === '';
  }
}
