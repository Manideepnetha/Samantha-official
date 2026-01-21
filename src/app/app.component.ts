import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { WelcomePopupComponent } from './components/welcome-popup/welcome-popup.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { ApiService } from './services/api.service';

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
    // 1. Wake up the backend
    this.apiService.getNews().subscribe({
      next: () => {
        this.finishLoading();
      },
      error: () => {
        // Even if error (e.g. backend down), we should eventually show the site
        // Maybe show an error toast, but for now just let them in
        this.finishLoading();
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (!this.isLoading) {
        this.checkPopupVisibility();
      }
    });
  }

  finishLoading() {
    // Add a minimum delay so the animation isn't too fast on subsequent loads
    setTimeout(() => {
      this.isLoading = false;
      this.checkPopupVisibility();
    }, 2000);
  }

  checkPopupVisibility() {
    // Check if current route is restricted
    const currentUrl = this.router.url;
    const isRestricted = currentUrl.includes('/admin') || currentUrl.includes('/login');

    if (!isRestricted && !this.hasShownPopup && !this.isLoading) {
      // 500ms delay for smooth entrance after page load
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