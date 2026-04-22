import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DAILY_QUOTES, DailyQuote } from '../../data/fan-experience.data';

@Component({
  selector: 'app-quote-of-the-day',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="quote-shell sr-surface">
      <div class="quote-copy" [class.is-visible]="isVisible">
        <span class="sr-kicker">Quote Of The Day</span>
        <blockquote>“{{ activeQuote.text }}”</blockquote>
        <p>{{ activeQuote.source }}</p>
      </div>

      <div class="quote-actions">
        <button type="button" class="quote-share" (click)="share('whatsapp')">Share on WhatsApp</button>
        <button type="button" class="quote-share is-ghost" (click)="share('twitter')">Share on X</button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .quote-shell {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1rem;
      min-height: clamp(23rem, 30vw, 27rem);
      padding: clamp(1.5rem, 4vw, 2.3rem);
      border-radius: 2rem;
      overflow: hidden;
      position: relative;
      isolation: isolate;
    }

    .quote-shell::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(12, 7, 6, 0.18) 0%, rgba(12, 7, 6, 0.42) 100%),
        linear-gradient(135deg, rgba(228, 196, 163, 0.09), transparent 42%),
        url("https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748178089/6923df53863279.5943b8caecd81_vxre5s.jpg") center center / cover;
      opacity: 0.22;
      z-index: -1;
    }

    .quote-copy {
      max-width: 18rem;
      opacity: 0;
      transform: translateY(12px);
      transition: opacity 0.45s ease, transform 0.45s ease;
    }

    .quote-copy.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    blockquote {
      margin: 0;
      max-width: 15ch;
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: clamp(2.35rem, 4.6vw, 3.95rem);
      font-weight: 500;
      line-height: 0.98;
      letter-spacing: -0.03em;
      color: #f6ecdf;
    }

    p {
      margin: 1rem 0 0;
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.76rem;
      font-weight: 800;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--editorial-accent);
    }

    .quote-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: auto;
    }

    .quote-share {
      min-height: 2.9rem;
      padding: 0.72rem 1.2rem;
      border-radius: 999px;
      background: linear-gradient(135deg, #d5b18c 0%, #e2c4a1 100%);
      color: #24130f;
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.74rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .quote-share.is-ghost {
      background: rgba(243, 232, 220, 0.05);
      color: var(--editorial-accent-strong);
      border: 1px solid rgba(228, 196, 163, 0.16);
    }

    @media (max-width: 720px) {
      .quote-shell {
        min-height: auto;
      }

      .quote-copy {
        max-width: none;
      }
    }
  `]
})
export class QuoteOfTheDayComponent implements OnInit, OnDestroy {
  activeQuote: DailyQuote = DAILY_QUOTES[0];
  isVisible = false;
  private timerRef: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.pickQuote();
    this.timerRef = setInterval(() => this.pickQuote(), 60000);
  }

  ngOnDestroy(): void {
    if (this.timerRef) {
      clearInterval(this.timerRef);
    }
  }

  share(platform: 'twitter' | 'whatsapp'): void {
    const message = `“${this.activeQuote.text}” — ${this.activeQuote.source}`;
    const url = platform === 'whatsapp'
      ? `https://wa.me/?text=${encodeURIComponent(message)}`
      : `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank', 'noopener');
  }

  private pickQuote(): void {
    const today = new Date();
    const index = Math.abs(Math.floor(today.setHours(0, 0, 0, 0) / 86400000)) % DAILY_QUOTES.length;

    this.isVisible = false;
    setTimeout(() => {
      this.activeQuote = DAILY_QUOTES[index];
      this.isVisible = true;
    }, 120);
  }
}
