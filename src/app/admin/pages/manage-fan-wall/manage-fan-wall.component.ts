import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService, FanWallMessage } from '../../../services/api.service';

@Component({
  selector: 'app-manage-fan-wall',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sr-admin-page">
      <div class="sr-admin-page-header">
        <div>
          <span class="sr-kicker">Fan Wall</span>
          <h1 class="sr-admin-title">Moderate Fan Messages</h1>
          <p class="sr-admin-subtitle">Approve, reject, or remove public messages before they appear on the live fan wall.</p>
        </div>
      </div>

      <div class="sr-admin-stats">
        <article class="sr-surface sr-admin-stat-card">
          <span class="sr-meta">Pending</span>
          <strong class="sr-admin-stat-value">{{ pendingCount }}</strong>
          <span class="sr-admin-stat-label">Awaiting moderation</span>
        </article>
        <article class="sr-surface sr-admin-stat-card">
          <span class="sr-meta">Approved</span>
          <strong class="sr-admin-stat-value">{{ approvedCount }}</strong>
          <span class="sr-admin-stat-label">Visible on the live wall</span>
        </article>
        <article class="sr-surface sr-admin-stat-card">
          <span class="sr-meta">Rejected</span>
          <strong class="sr-admin-stat-value">{{ rejectedCount }}</strong>
          <span class="sr-admin-stat-label">Filtered out from the public page</span>
        </article>
      </div>

      <div class="sr-surface sr-admin-table-wrap">
        <div class="sr-admin-table-scroll">
          <table class="sr-admin-table">
            <thead>
              <tr>
                <th>Fan</th>
                <th>Location</th>
                <th>Message</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let message of messages">
                <td>
                  <div class="sr-admin-title-cell">{{ message.name }}</div>
                </td>
                <td>{{ message.city || '—' }}</td>
                <td class="max-w-[420px]">{{ message.message }}</td>
                <td>
                  <span
                    class="sr-admin-badge"
                    [class.is-soft]="message.status === 'Pending'"
                    [class.is-success]="message.status === 'Approved'"
                    [class.is-accent]="message.status === 'Rejected'"
                  >
                    {{ message.status }}
                  </span>
                </td>
                <td>{{ message.createdAt ? (message.createdAt | date:'mediumDate') : '—' }}</td>
                <td>
                  <div class="sr-admin-actions">
                    <button type="button" class="sr-admin-action" (click)="updateStatus(message, 'Approved')">Approve</button>
                    <button type="button" class="sr-admin-action" (click)="updateStatus(message, 'Rejected')">Reject</button>
                    <button type="button" class="sr-admin-action-danger" (click)="remove(message)">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="messages.length === 0" class="sr-admin-empty-row">
                <td colspan="6">Fan wall submissions will appear here once messages start coming in.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ManageFanWallComponent implements OnInit {
  messages: FanWallMessage[] = [];

  constructor(private apiService: ApiService) {}

  get pendingCount(): number {
    return this.messages.filter(message => message.status === 'Pending').length;
  }

  get approvedCount(): number {
    return this.messages.filter(message => message.status === 'Approved').length;
  }

  get rejectedCount(): number {
    return this.messages.filter(message => message.status === 'Rejected').length;
  }

  ngOnInit(): void {
    this.loadMessages();
  }

  updateStatus(message: FanWallMessage, status: 'Pending' | 'Approved' | 'Rejected'): void {
    if (!message.id || message.status === status) {
      return;
    }

    this.apiService.updateFanWallMessageStatus(message.id, status).subscribe({
      next: () => this.loadMessages()
    });
  }

  remove(message: FanWallMessage): void {
    if (!message.id) {
      return;
    }

    this.apiService.deleteFanWallMessage(message.id).subscribe({
      next: () => this.loadMessages()
    });
  }

  private loadMessages(): void {
    this.apiService.getAdminFanWallMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: () => {
        this.messages = [];
      }
    });
  }
}
