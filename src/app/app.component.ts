import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { WelcomePopupComponent } from './components/welcome-popup/welcome-popup.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { ApiService } from './services/api.service';
import {
  ENTRY_EXPERIENCE_COMPLETED_STORAGE_KEY,
  PENDING_VISITOR_ENTRY_STORAGE_KEY
} from './components/welcome-popup/entry-experience.storage';

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

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.finishLoading();
    this.warmBackend();

    // 1. Scroll to top on every navigation
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
    setTimeout(() => {
      this.isLoading = false;
      this.checkPopupVisibility();
    }, 250);
  }

  checkPopupVisibility() {
    const currentUrl = this.router.url;
    const routePath = currentUrl.split('?')[0].replace(/\/+$/, '') || '/';
    const isRestricted = routePath.includes('/admin') || routePath.includes('/login');
    const isWelcomeRoute = routePath === '/';

    if (isRestricted || !isWelcomeRoute || this.isLoading) {
      this.showWelcomePopup = false;
      return;
    }

    // Persist popup state in localStorage so it only shows once per user (not every session)
    const hasSeenPopup = localStorage.getItem(ENTRY_EXPERIENCE_COMPLETED_STORAGE_KEY) === 'true';

    if (!this.hasShownPopup && !hasSeenPopup) {
      setTimeout(() => {
        this.showWelcomePopup = true;
        this.hasShownPopup = true;
      }, 500);
    }
  }

  onWelcomePopupClose() {
    this.showWelcomePopup = false;
  }

  private warmBackend() {
    this.apiService.getNews().subscribe({
      next: () => this.retryPendingVisitorEntry(),
      error: () => this.retryPendingVisitorEntry()
    });
  }

  private retryPendingVisitorEntry() {
    const pendingPayload = localStorage.getItem(PENDING_VISITOR_ENTRY_STORAGE_KEY);
    if (!pendingPayload) {
      return;
    }

    try {
      const parsedPayload = JSON.parse(pendingPayload);
      this.apiService.recordVisitorEntry(parsedPayload).subscribe({
        next: () => localStorage.removeItem(PENDING_VISITOR_ENTRY_STORAGE_KEY),
        error: () => {}
      });
    } catch {
      localStorage.removeItem(PENDING_VISITOR_ENTRY_STORAGE_KEY);
    }
  }
}
