import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule, Scroll } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { WelcomePopupComponent } from './components/welcome-popup/welcome-popup.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { ApiService } from './services/api.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, WelcomePopupComponent, PreloaderComponent],
  template: `
    <app-preloader *ngIf="isLoading"></app-preloader>
    
    <app-welcome-popup 
      *ngIf="!isLoading && showWelcomePopup" 
      (close)="onWelcomePopupClose()"
    ></app-welcome-popup>
    
    <router-outlet *ngIf="!isLoading"></router-outlet>
  `
})
export class AppComponent implements OnInit {
  title = 'Samantha Ruth Prabhu';
  showWelcomePopup = false;
  isLoading = true; // Start in loading state
  private hasShownPopup = false;

  constructor(private router: Router, private apiService: ApiService, private viewportScroller: ViewportScroller) { }

  ngOnInit() {
    // 1. Wake up the backend
    this.apiService.getNews().subscribe({
      next: () => { this.finishLoading(); },
      error: () => { this.finishLoading(); }
    });

    // 2. Scroll to top on every navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (!this.isLoading) {
        this.checkPopupVisibility();
      }
    });
  }

  finishLoading() {
    // Reduce forced delay to 1s for better UX
    setTimeout(() => {
      this.isLoading = false;
      this.checkPopupVisibility();
    }, 1000);
  }

  checkPopupVisibility() {
    // Check if current route is restricted
    const currentUrl = this.router.url;
    const isRestricted = currentUrl.includes('/admin') || currentUrl.includes('/login');

    // Persist popup state in localStorage so it only shows once per user (not every session)
    const hasSeenPopup = localStorage.getItem('srp_welcome_seen') === 'true';

    if (!isRestricted && !this.hasShownPopup && !this.isLoading && !hasSeenPopup) {
      setTimeout(() => {
        this.showWelcomePopup = true;
        this.hasShownPopup = true;
      }, 500);
    }
  }

  onWelcomePopupClose() {
    this.showWelcomePopup = false;
  }
}