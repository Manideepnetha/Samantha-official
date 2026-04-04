import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, NewsArticle } from '../../../services/api.service';

@Component({
  selector: 'app-manage-news',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sr-admin-page">
      <div class="sr-admin-page-header">
        <div>
          <span class="sr-kicker">Highlights</span>
          <h1 class="sr-admin-title">Manage News</h1>
          <p class="sr-admin-subtitle">Maintain the featured stories and highlight cards that power both the homepage and the dedicated news experience.</p>
        </div>
        <button (click)="openModal()" class="sr-button">Add Highlight</button>
      </div>

      <div class="sr-surface sr-admin-table-wrap">
        <div class="sr-admin-table-scroll">
          <table class="sr-admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Date</th>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let news of newsList">
                <td><img [src]="news.imageUrl" class="sr-admin-thumb" alt="Highlight"></td>
                <td>{{ news.date }}</td>
                <td class="sr-admin-title-cell">{{ news.title }}</td>
                <td>
                  <div class="sr-admin-actions">
                    <button (click)="editNews(news)" class="sr-admin-action">Edit</button>
                    <button (click)="deleteNews(news.id!)" class="sr-admin-action-danger">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="newsList.length === 0" class="sr-admin-empty-row">
                <td colspan="4">No highlights found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
        <div class="sr-modal-panel w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 md:p-7">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="sr-kicker">{{ isEditing ? 'Editing' : 'Creating' }}</span>
              <h2 class="sr-card-title mt-2">{{ isEditing ? 'Edit Highlight' : 'Add Highlight' }}</h2>
            </div>
            <button type="button" (click)="closeModal()" class="sr-close-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-6 space-y-4">
            <div>
              <label class="sr-field-label">Title</label>
              <input [(ngModel)]="currentNews.title" type="text" class="sr-input">
            </div>
            <div>
              <label class="sr-field-label">Date</label>
              <input [(ngModel)]="currentNews.date" type="text" placeholder="May 15, 2025" class="sr-input">
            </div>
            <div>
              <label class="sr-field-label">Excerpt</label>
              <textarea [(ngModel)]="currentNews.excerpt" rows="4" class="sr-textarea"></textarea>
            </div>
            <div>
              <label class="sr-field-label">Image URL</label>
              <input [(ngModel)]="currentNews.imageUrl" type="text" class="sr-input">
            </div>
            <div>
              <label class="sr-field-label">Link URL</label>
              <input [(ngModel)]="currentNews.link" type="text" class="sr-input">
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-3">
            <button type="button" (click)="closeModal()" class="sr-button-ghost">Cancel</button>
            <button type="button" (click)="saveNews()" class="sr-button">Save</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ManageNewsComponent implements OnInit {
  newsList: NewsArticle[] = [];
  isModalOpen = false;
  isEditing = false;
  currentNews: NewsArticle = { title: '', excerpt: '', date: '', imageUrl: '', link: '' };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.apiService.getNews().subscribe(data => this.newsList = data);
  }

  openModal(): void {
    this.isModalOpen = true;
    this.isEditing = false;
    this.currentNews = { title: '', excerpt: '', date: '', imageUrl: '', link: '' };
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  editNews(news: NewsArticle): void {
    this.isEditing = true;
    this.currentNews = { ...news };
    this.isModalOpen = true;
  }

  saveNews(): void {
    if (this.isEditing && this.currentNews.id) {
      this.apiService.updateNews(this.currentNews.id, this.currentNews).subscribe(() => {
        this.loadNews();
        this.closeModal();
      });
    } else {
      this.apiService.createNews(this.currentNews).subscribe(() => {
        this.loadNews();
        this.closeModal();
      });
    }
  }

  deleteNews(id: number): void {
    if (confirm('Are you sure you want to delete this highlight?')) {
      this.apiService.deleteNews(id).subscribe(() => this.loadNews());
    }
  }
}
