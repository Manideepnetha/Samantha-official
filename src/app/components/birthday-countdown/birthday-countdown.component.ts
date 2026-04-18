import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SAMANTHA_BIRTHDAY } from '../../data/fan-experience.data';

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-birthday-countdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="countdown-card sr-surface">
      <div class="countdown-copy">
        <span class="sr-kicker">Birthday Countdown</span>
        <h3 *ngIf="!isBirthday">April 28 is getting closer.</h3>
        <h3 *ngIf="isBirthday">Happy Birthday, Samantha.</h3>
        <p>
          <ng-container *ngIf="!isBirthday">
            Fans are counting down to the next celebration window, with the timer resetting automatically every year.
          </ng-container>
          <ng-container *ngIf="isBirthday">
            Celebration mode is live. Enjoy the confetti, the glow, and a full day dedicated to the icon.
          </ng-container>
        </p>
      </div>

      <div class="countdown-grid" *ngIf="!isBirthday; else birthdayState">
        <article *ngFor="let item of countdownItems" class="countdown-chip">
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </article>
      </div>

      <ng-template #birthdayState>
        <div class="birthday-pill">Celebration Day</div>
      </ng-template>

      <div class="confetti-field" *ngIf="isBirthday">
        <span
          *ngFor="let piece of confettiPieces; let i = index"
          class="confetti-piece"
          [style.--piece-index]="i"
        ></span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .countdown-card {
      position: relative;
      overflow: hidden;
      display: grid;
      gap: 1.4rem;
      padding: 1.5rem;
      border-radius: 1.8rem;
      isolation: isolate;
    }

    .countdown-card::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 12% 18%, rgba(228, 196, 163, 0.14), transparent 26%),
        linear-gradient(135deg, rgba(78, 42, 26, 0.2) 0%, transparent 52%);
      z-index: -1;
    }

    .countdown-copy h3 {
      margin: 0;
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 500;
      line-height: 0.95;
      color: #f6ecdf;
    }

    .countdown-copy p {
      margin: 0.8rem 0 0;
      max-width: 38rem;
      font-family: "Manrope", "Inter", sans-serif;
      line-height: 1.8;
      color: var(--editorial-muted);
    }

    .countdown-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 0.8rem;
    }

    .countdown-chip {
      display: grid;
      gap: 0.25rem;
      padding: 1rem 0.95rem;
      border-radius: 1.2rem;
      border: 1px solid rgba(228, 196, 163, 0.12);
      background: rgba(243, 232, 220, 0.05);
      text-align: center;
    }

    .countdown-chip strong {
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: clamp(2rem, 4vw, 3.1rem);
      line-height: 0.9;
      color: #f6ecdf;
    }

    .countdown-chip span,
    .birthday-pill {
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--editorial-accent-strong);
    }

    .birthday-pill {
      display: inline-flex;
      width: fit-content;
      align-items: center;
      min-height: 2.8rem;
      padding: 0 1.15rem;
      border-radius: 999px;
      background: rgba(215, 177, 138, 0.16);
      border: 1px solid rgba(228, 196, 163, 0.26);
    }

    .confetti-field {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .confetti-piece {
      position: absolute;
      top: -1rem;
      left: calc((var(--piece-index) * 3.8%) + 2%);
      width: 0.42rem;
      height: 1rem;
      border-radius: 999px;
      background: linear-gradient(180deg, #f4d4b5 0%, #d7b18a 100%);
      opacity: 0.9;
      animation: confetti-fall calc(3.2s + (var(--piece-index) * 0.08s)) linear infinite;
      animation-delay: calc(var(--piece-index) * -0.2s);
      transform: rotate(calc(var(--piece-index) * 12deg));
    }

    @keyframes confetti-fall {
      0% {
        transform: translate3d(0, 0, 0) rotate(0deg);
        opacity: 0;
      }
      8% {
        opacity: 0.92;
      }
      100% {
        transform: translate3d(-1rem, 120%, 0) rotate(320deg);
        opacity: 0;
      }
    }

    @media (max-width: 720px) {
      .countdown-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `]
})
export class BirthdayCountdownComponent implements OnInit, OnDestroy {
  private timerRef: ReturnType<typeof setInterval> | null = null;

  countdown: CountdownState = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  readonly confettiPieces = Array.from({ length: 26 });
  isBirthday = false;

  get countdownItems() {
    return [
      { label: 'Days', value: this.countdown.days },
      { label: 'Hours', value: this.countdown.hours },
      { label: 'Minutes', value: this.countdown.minutes },
      { label: 'Seconds', value: this.countdown.seconds }
    ];
  }

  ngOnInit(): void {
    this.updateCountdown();
    this.timerRef = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timerRef) {
      clearInterval(this.timerRef);
    }
  }

  private updateCountdown(): void {
    const now = new Date();
    const isBirthdayToday = (now.getMonth() + 1) === SAMANTHA_BIRTHDAY.month && now.getDate() === SAMANTHA_BIRTHDAY.day;

    this.isBirthday = isBirthdayToday;
    if (isBirthdayToday) {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return;
    }

    const targetYear = this.isPastBirthday(now) ? now.getFullYear() + 1 : now.getFullYear();
    const targetDate = new Date(targetYear, SAMANTHA_BIRTHDAY.month - 1, SAMANTHA_BIRTHDAY.day, 0, 0, 0, 0);
    const difference = Math.max(0, targetDate.getTime() - now.getTime());

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    this.countdown = { days, hours, minutes, seconds };
  }

  private isPastBirthday(now: Date): boolean {
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    return currentMonth > SAMANTHA_BIRTHDAY.month
      || (currentMonth === SAMANTHA_BIRTHDAY.month && currentDay > SAMANTHA_BIRTHDAY.day);
  }
}
