import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Philanthropy } from '../../../services/api.service';
import { AdminImageUploadFieldComponent } from '../../components/admin-image-upload-field/admin-image-upload-field.component';

@Component({
  selector: 'app-manage-philanthropy',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminImageUploadFieldComponent],
  template: `
    <div class="sr-admin-page">
      <div class="sr-admin-page-header">
        <div>
          <span class="sr-kicker">Impact</span>
          <h1 class="sr-admin-title">Manage Philanthropy</h1>
          <p class="sr-admin-subtitle">Maintain initiatives, statistics, and success stories with the same editorial tone as the public philanthropy page.</p>
        </div>
        <button (click)="openModal()" class="sr-button">Add Item</button>
      </div>

      <div class="sr-surface sr-admin-table-wrap">
        <div class="sr-admin-table-scroll">
          <table class="sr-admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of philanthropies">
                <td class="sr-admin-title-cell">{{ item.title }}</td>
                <td>
                  <span class="sr-admin-badge" [class.is-soft]="item.type === 'Initiative'" [class.is-success]="item.type === 'Stat'" [class.is-accent]="item.type === 'Story'">{{ item.type }}</span>
                </td>
                <td>
                  <div *ngIf="item.type === 'Stat'" class="space-y-2">
                    <p class="font-['Cormorant_Garamond'] text-3xl leading-none text-[var(--editorial-accent-strong)]">{{ item.value | number }}</p>
                    <p class="sr-card-text">Icon: {{ item.icon || 'Not set' }}</p>
                  </div>
                  <div *ngIf="item.type === 'Initiative'" class="space-y-2 max-w-md">
                    <p class="sr-card-text">{{ item.description }}</p>
                    <p class="sr-card-text">Icon: {{ item.icon || 'Not set' }}</p>
                  </div>
                  <div *ngIf="item.type === 'Story'" class="sr-admin-media max-w-md">
                    <img *ngIf="item.imageUrl" [src]="item.imageUrl" class="sr-admin-thumb" alt="Story image">
                    <p class="sr-card-text">{{ item.description }}</p>
                  </div>
                </td>
                <td>
                  <div class="sr-admin-actions">
                    <button (click)="openModal(item)" class="sr-admin-action">Edit</button>
                    <button (click)="deleteItem(item.id!)" class="sr-admin-action-danger">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="philanthropies.length === 0" class="sr-admin-empty-row">
                <td colspan="4">No philanthropy items found.</td>
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
              <h2 class="sr-card-title mt-2">{{ isEditing ? 'Edit Item' : 'Add Item' }}</h2>
            </div>
            <button type="button" (click)="closeModal()" class="sr-close-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form (ngSubmit)="saveItem()" class="mt-6 space-y-4">
            <div>
              <label class="sr-field-label">Type</label>
              <select [(ngModel)]="currentItem.type" name="type" class="sr-select">
                <option value="Initiative">Initiative</option>
                <option value="Stat">Stat</option>
                <option value="Story">Success Story</option>
              </select>
            </div>
            <div>
              <label class="sr-field-label">Title</label>
              <input [(ngModel)]="currentItem.title" name="title" class="sr-input" required>
            </div>

            <div *ngIf="currentItem.type === 'Stat'" class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="sr-field-label">Value</label>
                <input [(ngModel)]="currentItem.value" name="value" type="number" class="sr-input">
              </div>
              <div>
                <label class="sr-field-label">Icon</label>
                <input [(ngModel)]="currentItem.icon" name="statIcon" class="sr-input">
              </div>
            </div>

            <div *ngIf="currentItem.type === 'Initiative'" class="space-y-4">
              <div>
                <label class="sr-field-label">Description</label>
                <textarea [(ngModel)]="currentItem.description" name="initiativeDescription" rows="4" class="sr-textarea"></textarea>
              </div>
              <div>
                <label class="sr-field-label">Icon</label>
                <input [(ngModel)]="currentItem.icon" name="initiativeIcon" class="sr-input">
              </div>
            </div>

            <div *ngIf="currentItem.type === 'Story'" class="space-y-4">
              <div>
                <label class="sr-field-label">Content</label>
                <textarea [(ngModel)]="currentItem.description" name="storyDescription" rows="5" class="sr-textarea"></textarea>
              </div>
              <div>
                <app-admin-image-upload-field
                  label="Story Image"
                  [value]="currentItem.imageUrl || ''"
                  (valueChange)="currentItem.imageUrl = $event"
                  (uploadCompleted)="persistEditedStoryImage()"
                  placeholder="Paste image URL"
                  uploadButtonLabel="Upload Story Image"
                  uploadFolder="philanthropy"
                  previewAlt="Story image preview">
                </app-admin-image-upload-field>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" (click)="closeModal()" class="sr-button-ghost">Cancel</button>
              <button type="submit" class="sr-button">{{ isEditing ? 'Update Item' : 'Create Item' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ManagePhilanthropyComponent implements OnInit {
  philanthropies: Philanthropy[] = [];
  isModalOpen = false;
  isEditing = false;

  currentItem: Philanthropy = {
    title: '',
    type: 'Initiative',
    description: '',
    value: 0,
    icon: '',
    imageUrl: ''
  };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadPhilanthropies();
  }

  loadPhilanthropies() {
    this.apiService.getPhilanthropies().subscribe(data => {
      this.philanthropies = data;
    });
  }

  openModal(item?: Philanthropy) {
    this.isModalOpen = true;
    if (item) {
      this.isEditing = true;
      this.currentItem = { ...item };
    } else {
      this.isEditing = false;
      this.currentItem = {
        title: '',
        type: 'Initiative',
        description: '',
        value: 0,
        icon: '',
        imageUrl: ''
      };
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveItem() {
    if (!this.currentItem.title) return;

    if (this.isEditing && this.currentItem.id) {
      this.apiService.updatePhilanthropy(this.currentItem.id, this.currentItem).subscribe(() => {
        this.loadPhilanthropies();
        this.closeModal();
      });
    } else {
      this.apiService.createPhilanthropy(this.currentItem).subscribe(() => {
        this.loadPhilanthropies();
        this.closeModal();
      });
    }
  }

  persistEditedStoryImage(): void {
    if (!this.isEditing || !this.currentItem.id || !this.currentItem.title?.trim() || this.currentItem.type !== 'Story') {
      return;
    }

    this.apiService.updatePhilanthropy(this.currentItem.id, this.currentItem).subscribe({
      next: () => this.loadPhilanthropies(),
      error: (error) => {
        console.error('Failed to auto-save uploaded philanthropy image', error);
        alert('The image uploaded, but the story was not saved automatically. Please click Update Item.');
      }
    });
  }

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.apiService.deletePhilanthropy(id).subscribe(() => {
        this.loadPhilanthropies();
      });
    }
  }
}
