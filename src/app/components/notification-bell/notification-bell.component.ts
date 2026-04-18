import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SiteNotificationService } from '../../services/site-notification.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-wrap" [class.compact]="compact">
      <button
        type="button"
        class="notification-button"
        [class.is-active]="isSubscribed"
        (click)="togglePanel($event)"
        aria-label="Notification alerts"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 17h5l-1.42-1.42A2 2 0 0 1 18 14.17V11a6 6 0 1 0-12 0v3.17c0 .53-.21 1.04-.58 1.41L4 17h5" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 17a3 3 0 0 0 6 0" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span *ngIf="isSubscribed" class="notification-dot"></span>
      </button>

      <div *ngIf="isOpen" class="notification-panel sr-surface-soft">
        <span class="sr-kicker">Alerts</span>
        <h3>Stay in the loop</h3>
        <p>
          Turn on browser alerts for fresh headlines, journal updates, and fan-first drops.
        </p>

        <div class="notification-status" [class.is-active]="isSubscribed">
          <span>{{ statusLabel }}</span>
          <strong>{{ statusValue }}</strong>
        </div>

        <button
          type="button"
          class="notification-cta"
          [disabled]="permission === 'denied' || permission === 'unsupported'"
          (click)="toggleSubscription($event)"
        >
          {{ isSubscribed ? 'Pause Alerts' : 'Enable Alerts' }}
        </button>

        <p *ngIf="permission === 'denied'" class="notification-note">
          Browser permission is blocked. Re-enable notifications in your browser settings to use alerts.
        </p>
        <p *ngIf="permission === 'unsupported'" class="notification-note">
          This browser does not support notifications, but the rest of the site experience still works normally.
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .notification-wrap {
      position: relative;
      display: inline-flex;
    }

    .notification-button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.8rem;
      height: 2.8rem;
      border-radius: 999px;
      border: 1px solid rgba(228, 196, 163, 0.16);
      background: rgba(243, 232, 220, 0.06);
      color: rgba(243, 232, 220, 0.78);
      transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }

    .notification-button:hover {
      transform: translateY(-1px);
      color: var(--editorial-accent-strong);
      background: rgba(243, 232, 220, 0.1);
    }

    .notification-button.is-active {
      color: var(--editorial-accent-strong);
      border-color: rgba(228, 196, 163, 0.26);
      background: rgba(215, 177, 138, 0.12);
      box-shadow: 0 0 0 1px rgba(228, 196, 163, 0.06);
    }

    .notification-wrap.compact .notification-button {
      width: 2.55rem;
      height: 2.55rem;
    }

    .notification-button svg {
      width: 1.1rem;
      height: 1.1rem;
    }

    .notification-dot {
      position: absolute;
      top: 0.58rem;
      right: 0.56rem;
      width: 0.48rem;
      height: 0.48rem;
      border-radius: 999px;
      background: linear-gradient(135deg, #d7b18a 0%, #f0d2b6 100%);
      box-shadow: 0 0 12px rgba(228, 196, 163, 0.4);
    }

    .notification-panel {
      position: absolute;
      top: calc(100% + 0.85rem);
      right: 0;
      width: min(21rem, calc(100vw - 2rem));
      padding: 1.15rem;
      border-radius: 1.5rem;
      border: 1px solid rgba(228, 196, 163, 0.16);
      box-shadow: 0 28px 70px rgba(0, 0, 0, 0.3);
      z-index: 40;
    }

    .notification-panel h3 {
      margin: 0;
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: 2rem;
      font-weight: 500;
      color: #f6ecdf;
    }

    .notification-panel p {
      margin: 0.65rem 0 0;
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.92rem;
      line-height: 1.7;
      color: var(--editorial-muted);
    }

    .notification-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.85rem;
      margin-top: 1rem;
      padding: 0.9rem 1rem;
      border-radius: 1rem;
      border: 1px solid rgba(228, 196, 163, 0.12);
      background: rgba(243, 232, 220, 0.04);
      font-family: "Manrope", "Inter", sans-serif;
    }

    .notification-status span {
      font-size: 0.74rem;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(243, 232, 220, 0.52);
    }

    .notification-status strong {
      font-size: 0.85rem;
      color: #f6ecdf;
    }

    .notification-status.is-active {
      border-color: rgba(228, 196, 163, 0.22);
      background: rgba(215, 177, 138, 0.1);
    }

    .notification-cta {
      width: 100%;
      margin-top: 1rem;
      min-height: 3rem;
      border-radius: 999px;
      background: linear-gradient(135deg, #d5b18c 0%, #e2c4a1 100%);
      color: #24130f;
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .notification-cta:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .notification-note {
      margin-top: 0.8rem;
      font-size: 0.82rem;
    }
  `]
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  @Input() compact = false;

  isOpen = false;
  isSubscribed = false;
  permission: NotificationPermission | 'unsupported' = 'default';
  statusLabel = 'Current status';
  statusValue = 'Loading';

  private subscription = new Subscription();

  constructor(private siteNotificationService: SiteNotificationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.siteNotificationService.isSubscribed$.subscribe(value => {
        this.isSubscribed = value;
        this.updateStatus();
      })
    );

    this.subscription.add(
      this.siteNotificationService.permission$.subscribe(value => {
        this.permission = value;
        this.updateStatus();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  togglePanel(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  async toggleSubscription(event: Event): Promise<void> {
    event.stopPropagation();
    await this.siteNotificationService.toggleSubscription();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isOpen = false;
  }

  private updateStatus(): void {
    if (this.permission === 'unsupported') {
      this.statusValue = 'Unsupported';
      return;
    }

    if (this.permission === 'denied') {
      this.statusValue = 'Permission blocked';
      return;
    }

    this.statusValue = this.isSubscribed ? 'Alerts active' : 'Alerts paused';
  }
}
