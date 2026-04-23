import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService, FanPollResult } from '../../services/api.service';
import { FAN_POLL_DEFINITION } from '../../data/fan-experience.data';

const CLIENT_ID_KEY = 'srp_fan_poll_client_id_v1';
const PENDING_VOTE_KEY_PREFIX = 'srp_fan_poll_pending_vote_v1_';

@Component({
  selector: 'app-fan-poll',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="poll-shell sr-surface">
      <div class="poll-head">
        <span class="sr-kicker">{{ poll.title }}</span>
        <h3>{{ poll.prompt }}</h3>
        <p>{{ poll.description }}</p>
      </div>

      <div class="poll-options" *ngIf="result">
        <button
          type="button"
          *ngFor="let option of result.options"
          class="poll-option"
          [class.is-selected]="result.userOptionKey === option.optionKey"
          [disabled]="result.hasVoted || voting"
          (click)="vote(option.optionKey)"
        >
          <div class="poll-option-top">
            <strong>{{ option.label }}</strong>
            <span>{{ option.votes }} votes</span>
          </div>
          <div class="poll-bar">
            <span [style.width.%]="option.percentage"></span>
          </div>
          <small>{{ option.percentage }}%</small>
        </button>
      </div>

      <div class="poll-footer">
        <span>{{ result?.totalVotes || 0 }} total votes</span>
        <span *ngIf="result?.hasVoted">Your vote is locked in.</span>
        <span *ngIf="!result?.hasVoted">Vote once to reveal the live split.</span>
        <span *ngIf="notice">{{ notice }}</span>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .poll-shell {
      display: grid;
      gap: 1.25rem;
      padding: 1.4rem;
      border-radius: 1.8rem;
    }

    .poll-head h3 {
      margin: 0;
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 500;
      color: #f6ecdf;
    }

    .poll-head p,
    .poll-footer {
      margin: 0.75rem 0 0;
      font-family: "Manrope", "Inter", sans-serif;
      line-height: 1.75;
      color: var(--editorial-muted);
    }

    .poll-options {
      display: grid;
      gap: 0.75rem;
    }

    .poll-option {
      display: grid;
      gap: 0.55rem;
      padding: 1rem;
      border-radius: 1.15rem;
      border: 1px solid rgba(228, 196, 163, 0.12);
      background: rgba(243, 232, 220, 0.04);
      text-align: left;
      transition: transform 0.28s ease, border-color 0.28s ease, background-color 0.28s ease;
    }

    .poll-option:hover:enabled {
      transform: translateY(-2px);
      border-color: rgba(228, 196, 163, 0.26);
      background: rgba(215, 177, 138, 0.08);
    }

    .poll-option.is-selected {
      border-color: rgba(228, 196, 163, 0.28);
      background: rgba(215, 177, 138, 0.12);
    }

    .poll-option-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .poll-option-top strong {
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: 1.6rem;
      font-weight: 500;
      color: #f6ecdf;
    }

    .poll-option-top span,
    .poll-option small,
    .poll-footer span {
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.78rem;
      color: var(--editorial-muted);
    }

    .poll-bar {
      height: 0.55rem;
      border-radius: 999px;
      background: rgba(243, 232, 220, 0.08);
      overflow: hidden;
    }

    .poll-bar span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(135deg, #d5b18c 0%, #e2c4a1 100%);
      transition: width 0.55s ease;
    }

    .poll-footer {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 0.6rem;
    }
  `]
})
export class FanPollComponent implements OnInit {
  readonly poll = FAN_POLL_DEFINITION;
  result: FanPollResult | null = null;
  voting = false;
  notice = '';
  private readonly clientId = this.resolveClientId();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.retryPendingVote();
    this.loadPoll();
  }

  vote(optionKey: string): void {
    if (this.voting || this.result?.hasVoted) {
      return;
    }

    this.voting = true;
    this.notice = '';
    this.persistPendingVote(optionKey);
    this.apiService.submitFanPollVote(this.poll.key, {
      optionKey,
      clientId: this.clientId
    }).subscribe({
      next: (result) => {
        this.result = result;
        this.clearPendingVote();
        this.voting = false;
      },
      error: (error: { status?: number; error?: FanPollResult }) => {
        this.result = error.error ?? this.result;
        if (error.status === 409 || error.error?.hasVoted) {
          this.clearPendingVote();
          this.notice = '';
        } else {
          this.notice = 'Your vote is saved on this device and will retry automatically if the network was interrupted.';
        }
        this.voting = false;
      }
    });
  }

  private loadPoll(): void {
    this.apiService.getFanPollResult(this.poll.key, this.clientId).subscribe({
      next: (result) => {
        this.result = result;
        if (result.hasVoted) {
          this.clearPendingVote();
          this.notice = '';
        }
      },
      error: () => {
        this.result = null;
      }
    });
  }

  private resolveClientId(): string {
    const stored = localStorage.getItem(CLIENT_ID_KEY);
    if (stored) {
      return stored;
    }

    const generated = `poll-${crypto.randomUUID()}`;
    localStorage.setItem(CLIENT_ID_KEY, generated);
    return generated;
  }

  private retryPendingVote(): void {
    const pendingOptionKey = this.loadPendingVote();
    if (!pendingOptionKey) {
      return;
    }

    this.voting = true;
    this.apiService.submitFanPollVote(this.poll.key, {
      optionKey: pendingOptionKey,
      clientId: this.clientId
    }).subscribe({
      next: (result) => {
        this.result = result;
        this.clearPendingVote();
        this.notice = '';
        this.voting = false;
      },
      error: (error: { status?: number; error?: FanPollResult }) => {
        this.result = error.error ?? this.result;
        if (error.status === 409 || error.error?.hasVoted) {
          this.clearPendingVote();
          this.notice = '';
        } else {
          this.notice = 'A vote is still waiting to sync and will retry automatically.';
        }
        this.voting = false;
      }
    });
  }

  private getPendingVoteKey(): string {
    return `${PENDING_VOTE_KEY_PREFIX}${this.poll.key}`;
  }

  private persistPendingVote(optionKey: string): void {
    localStorage.setItem(this.getPendingVoteKey(), optionKey);
  }

  private loadPendingVote(): string | null {
    const optionKey = localStorage.getItem(this.getPendingVoteKey());
    return optionKey?.trim() || null;
  }

  private clearPendingVote(): void {
    localStorage.removeItem(this.getPendingVoteKey());
  }
}
