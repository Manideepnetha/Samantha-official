import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { WelcomePopupComponent } from './components/welcome-popup/welcome-popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, WelcomePopupComponent],
  template: `
    <app-welcome-popup 
      *ngIf="showWelcomePopup" 
      (close)="onWelcomePopupClose()"
    ></app-welcome-popup>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  title = 'Samantha Ruth Prabhu';
  showWelcomePopup = false;
  private hasShownPopup = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkPopupVisibility();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkPopupVisibility();
    });
  }

  checkPopupVisibility() {
    // Check if current route is restricted
    const currentUrl = this.router.url;
    const isRestricted = currentUrl.includes('/admin') || currentUrl.includes('/login');

    if (!isRestricted && !this.hasShownPopup) {
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