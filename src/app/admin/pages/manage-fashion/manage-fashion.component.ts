import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, FashionItem } from '../../../services/api.service';

@Component({
  selector: 'app-manage-fashion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sr-admin-page">
      <div class="sr-admin-page-header">
        <div>
          <span class="sr-kicker">Style</span>
          <h1 class="sr-admin-title">Manage Fashion Journey</h1>
          <p class="sr-admin-subtitle">Shape the editorial fashion timeline with strong imagery, captions, and linked stories.</p>
        </div>
        <button (click)="openModal()" class="sr-button">Add Story</button>
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
              <tr *ngFor="let item of fashionItems">
                <td><img [src]="item.imageUrl" class="sr-admin-thumb" alt="Fashion story"></td>
                <td>{{ item.date }}</td>
                <td class="sr-admin-title-cell">{{ item.title }}</td>
                <td>
                  <div class="sr-admin-actions">
                    <button (click)="editItem(item)" class="sr-admin-action">Edit</button>
                    <button (click)="deleteItem(item.id!)" class="sr-admin-action-danger">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="fashionItems.length === 0" class="sr-admin-empty-row">
                <td colspan="4">No fashion stories found.</td>
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
              <h2 class="sr-card-title mt-2">{{ isEditing ? 'Edit Story' : 'Add Story' }}</h2>
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
              <input [(ngModel)]="currentItem.title" type="text" class="sr-input">
            </div>
            <div>
              <label class="sr-field-label">Date</label>
              <input [(ngModel)]="currentItem.date" type="text" placeholder="July 20, 2024" class="sr-input">
            </div>
            <div>
              <label class="sr-field-label">Description</label>
              <textarea [(ngModel)]="currentItem.description" rows="4" class="sr-textarea"></textarea>
            </div>
            <div>
              <label class="sr-field-label">Image</label>
              <div class="flex flex-col gap-3 md:flex-row">
                <input [(ngModel)]="currentItem.imageUrl" type="text" placeholder="Paste image URL" class="sr-input flex-1">
                <button type="button" (click)="fileInput.click()" [disabled]="isUploading" class="sr-button-outline whitespace-nowrap px-5">{{ isUploading ? 'Uploading...' : 'Upload Image' }}</button>
                <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
              </div>
              <div *ngIf="currentItem.imageUrl" class="mt-4 overflow-hidden rounded-[1.3rem] border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] p-3">
                <img [src]="currentItem.imageUrl" class="sr-admin-thumb h-40 w-full max-w-md" alt="Preview">
              </div>
            </div>
            <div>
              <label class="sr-field-label">Link URL</label>
              <input [(ngModel)]="currentItem.link" type="text" class="sr-input">
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-3">
            <button type="button" (click)="closeModal()" class="sr-button-ghost">Cancel</button>
            <button type="button" (click)="saveItem()" class="sr-button">Save</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ManageFashionComponent implements OnInit {
  fashionItems: FashionItem[] = [];
  isModalOpen = false;
  isEditing = false;
  isUploading = false;
  currentItem: FashionItem = { title: '', date: '', description: '', imageUrl: '', link: '' };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadItems();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.isUploading = true;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    formData.append('cloud_name', 'dpnd6ve1e');

    fetch(`https://api.cloudinary.com/v1_1/dpnd6ve1e/image/upload`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res.secure_url) {
          this.currentItem.imageUrl = res.secure_url;
        } else {
          alert('Upload failed. Please ensure your Cloudinary "Unsigned Upload Preset" is named "ml_default".');
        }
      })
      .catch(err => {
        console.error('Upload error:', err);
        alert('Error connecting to Cloudinary.');
      })
      .finally(() => {
        this.isUploading = false;
      });
  }

  loadItems(): void {
    this.apiService.getFashion().subscribe(data => this.fashionItems = data);
  }

  openModal(): void {
    this.isModalOpen = true;
    this.isEditing = false;
    this.currentItem = { title: '', date: '', description: '', imageUrl: '', link: '' };
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  editItem(item: FashionItem): void {
    this.isEditing = true;
    this.currentItem = { ...item };
    this.isModalOpen = true;
  }

  saveItem(): void {
    if (this.isEditing && this.currentItem.id) {
      this.apiService.updateFashion(this.currentItem.id, this.currentItem).subscribe(() => {
        this.loadItems();
        this.closeModal();
      });
    } else {
      this.apiService.createFashion(this.currentItem).subscribe(() => {
        this.loadItems();
        this.closeModal();
      });
    }
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this fashion story?')) {
      this.apiService.deleteFashion(id).subscribe(() => this.loadItems());
    }
  }
}
