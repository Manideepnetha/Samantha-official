import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { THIS_DAY_EVENTS } from '../../data/fan-experience.data';

@Component({
  selector: 'app-this-day-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="history-card sr-surface-soft">
      <span class="sr-kicker">This Day In History</span>
      <ng-container *ngIf="todayEvents.length > 0; else emptyState">
        <article *ngFor="let event of todayEvents" class="history-item">
          <div class="history-year">{{ event.year }}</div>
          <div class="history-copy">
            <h3>{{ event.title }}</h3>
            <p>{{ event.description }}</p>
            <a *ngIf="event.route" [routerLink]="event.route" class="sr-link">Explore</a>
          </div>
        </article>
      </ng-container>

      <ng-template #emptyState>
        <div class="history-empty">
          No archived milestone is mapped to today yet. This widget is ready for more dates as the archive grows.
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .history-card {
      display: grid;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 1.8rem;
    }

    .history-item {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 1rem;
      align-items: start;
      padding: 1rem 0;
      border-top: 1px solid rgba(228, 196, 163, 0.1);
    }

    .history-item:first-of-type {
      border-top: 0;
      padding-top: 0.4rem;
    }

    .history-year {
      min-width: 4.6rem;
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: 2rem;
      line-height: 0.92;
      color: var(--editorial-accent);
    }

    .history-copy h3 {
      margin: 0;
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: 2rem;
      font-weight: 500;
      color: #f6ecdf;
    }

    .history-copy p,
    .history-empty {
      margin: 0.6rem 0 0;
      font-family: "Manrope", "Inter", sans-serif;
      line-height: 1.75;
      color: var(--editorial-muted);
    }
  `]
})
export class ThisDayHistoryComponent {
  get todayEvents() {
    const today = new Date();
    const key = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return THIS_DAY_EVENTS.filter(event => event.dateKey === key);
  }
}
