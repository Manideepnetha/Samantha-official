import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, FanWallMessage } from '../../services/api.service';

@Component({
  selector: 'app-fan-wall',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sr-page fan-wall-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel">
            <div class="sr-hero-media">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748011805/8F9A6978_1_jd2efv.jpg" alt="Fan wall cover" />
            </div>
            <div class="sr-hero-copy">
              <span class="sr-kicker">Fan Wall</span>
              <h1 class="sr-hero-title">Messages from every city, stitched into one glowing wall.</h1>
              <p class="sr-hero-subtitle">
                Leave a short note for Samantha. Every post goes through moderation, and approved messages join the public fan mosaic.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section fan-wall-grid">
        <div class="fan-wall-form sr-surface-soft">
          <span class="sr-kicker">Submit Your Message</span>
          <h2 class="sr-card-title">Add your voice</h2>
          <p class="sr-card-text">Name, city, and a short message. Keep it warm, concise, and under 150 characters.</p>

          <div class="fan-wall-fields">
            <label>
              <span class="sr-field-label">Name</span>
              <input [(ngModel)]="form.name" maxlength="60" class="sr-input" placeholder="Your name" />
            </label>
            <label>
              <span class="sr-field-label">City</span>
              <input [(ngModel)]="form.city" maxlength="60" class="sr-input" placeholder="City or country" />
            </label>
            <label>
              <span class="sr-field-label">Message</span>
              <textarea [(ngModel)]="form.message" maxlength="150" rows="5" class="sr-textarea" placeholder="A short message for Samantha"></textarea>
            </label>
            <div class="fan-wall-meta">
              <span>{{ remainingCharacters }} characters left</span>
              <span>Moderated before publishing</span>
            </div>
            <p *ngIf="statusMessage" class="fan-wall-status">{{ statusMessage }}</p>
            <p *ngIf="errorMessage" class="fan-wall-error">{{ errorMessage }}</p>
            <button type="button" class="sr-button w-fit" (click)="submit()" [disabled]="submitting">
              {{ submitting ? 'Sending...' : 'Submit To Fan Wall' }}
            </button>
          </div>
        </div>

        <div class="fan-wall-cards">
          <article
            *ngFor="let message of messages; let i = index"
            class="fan-wall-card sr-surface"
            [style.--fan-delay]="i"
          >
            <div class="fan-wall-card-top">
              <strong>{{ message.name }}</strong>
              <span>{{ message.city || 'Fan Community' }}</span>
            </div>
            <p>{{ message.message }}</p>
          </article>

          <div *ngIf="messages.length === 0" class="sr-empty-state">
            The first approved messages will appear here as soon as the wall starts filling up.
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .fan-wall-page {
      padding-bottom: 5rem;
    }

    .fan-wall-grid {
      display: grid;
      grid-template-columns: minmax(320px, 0.86fr) minmax(0, 1.14fr);
      gap: 1rem;
      align-items: start;
    }

    .fan-wall-form {
      position: sticky;
      top: 6.5rem;
      padding: 1.5rem;
      border-radius: 1.8rem;
    }

    .fan-wall-fields {
      display: grid;
      gap: 1rem;
      margin-top: 1.25rem;
    }

    .fan-wall-meta {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.78rem;
      color: rgba(243, 232, 220, 0.56);
    }

    .fan-wall-status,
    .fan-wall-error {
      margin: 0;
      font-family: "Manrope", "Inter", sans-serif;
      line-height: 1.7;
    }

    .fan-wall-status {
      color: #bfd9e2;
    }

    .fan-wall-error {
      color: #f4aaa0;
    }

    .fan-wall-cards {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem;
    }

    .fan-wall-card {
      display: grid;
      gap: 0.9rem;
      min-height: 12rem;
      padding: 1.25rem;
      border-radius: 1.5rem;
      animation: fan-wall-rise 0.5s ease both;
      animation-delay: calc(var(--fan-delay) * 80ms);
    }

    .fan-wall-card:nth-child(3n) {
      transform: translateY(1.25rem);
    }

    .fan-wall-card-top strong {
      display: block;
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: 2rem;
      font-weight: 500;
      color: #f6ecdf;
    }

    .fan-wall-card-top span,
    .fan-wall-card p {
      font-family: "Manrope", "Inter", sans-serif;
      color: var(--editorial-muted);
    }

    .fan-wall-card-top span {
      font-size: 0.74rem;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--editorial-accent);
    }

    .fan-wall-card p {
      margin: 0;
      line-height: 1.85;
    }

    @keyframes fan-wall-rise {
      from {
        opacity: 0;
        transform: translateY(22px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 980px) {
      .fan-wall-grid,
      .fan-wall-cards {
        grid-template-columns: 1fr;
      }

      .fan-wall-form {
        position: static;
      }
    }
  `]
})
export class FanWallComponent implements OnInit {
  messages: FanWallMessage[] = [];
  submitting = false;
  statusMessage = '';
  errorMessage = '';

  form: FanWallMessage = {
    name: '',
    city: '',
    message: ''
  };

  constructor(private apiService: ApiService) {}

  get remainingCharacters(): number {
    return 150 - (this.form.message?.length ?? 0);
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  submit(): void {
    this.statusMessage = '';
    this.errorMessage = '';

    if (this.form.name.trim().length < 2) {
      this.errorMessage = 'Please enter your name.';
      return;
    }

    if (this.form.message.trim().length < 6) {
      this.errorMessage = 'Please write a slightly longer message.';
      return;
    }

    this.submitting = true;
    this.apiService.submitFanWallMessage({
      name: this.form.name.trim(),
      city: this.form.city?.trim(),
      message: this.form.message.trim()
    }).subscribe({
      next: () => {
        this.form = { name: '', city: '', message: '' };
        this.statusMessage = 'Your message has been sent for moderation and will appear once approved.';
        this.submitting = false;
      },
      error: (error: { error?: { message?: string } }) => {
        this.errorMessage = error.error?.message || 'Could not submit your message. Please try again.';
        this.submitting = false;
      }
    });
  }

  private loadMessages(): void {
    this.apiService.getFanWallMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: () => {
        this.messages = [];
      }
    });
  }
}
