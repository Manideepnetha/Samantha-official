import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, MediaGallery } from '../../../services/api.service';

@Component({
  selector: 'app-manage-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sr-admin-page">
      <div class="sr-admin-page-header">
        <div>
          <span class="sr-kicker">Gallery</span>
          <h1 class="sr-admin-title">Manage Media Gallery</h1>
          <p class="sr-admin-subtitle">Organize the main gallery across categories while keeping homepage-specific images in their own space.</p>
        </div>
        <button (click)="openModal()" class="sr-button">Add Image</button>
      </div>

      <div class="flex flex-wrap gap-3">
        <button
          *ngFor="let cat of categories"
          (click)="filterCategory = cat.value"
          [class.is-active]="filterCategory === cat.value"
          class="sr-chip"
        >
          {{ cat.label }}
        </button>
      </div>

      <div class="sr-surface sr-admin-table-wrap">
        <div class="sr-admin-table-scroll">
          <table class="sr-admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Date</th>
                <th>Caption</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let media of filteredGallery">
                <td><img [src]="media.imageUrl" class="sr-admin-thumb" alt="Gallery item"></td>
                <td>{{ media.date }}</td>
                <td class="sr-admin-title-cell">{{ media.caption }}</td>
                <td><span class="sr-admin-badge is-soft">{{ media.type }}</span></td>
                <td>
                  <div class="sr-admin-actions">
                    <button (click)="editMedia(media)" class="sr-admin-action">Edit</button>
                    <button (click)="deleteMedia(media.id!)" class="sr-admin-action-danger">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredGallery.length === 0" class="sr-admin-empty-row">
                <td colspan="5">No images found in this category.</td>
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
              <h2 class="sr-card-title mt-2">{{ isEditing ? 'Edit Image' : 'Add Image' }}</h2>
            </div>
            <button type="button" (click)="closeModal()" class="sr-close-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-6 space-y-4">
            <div>
              <label class="sr-field-label">Caption</label>
              <input [(ngModel)]="currentMedia.caption" type="text" class="sr-input">
            </div>
            <div>
              <label class="sr-field-label">Date</label>
              <input [(ngModel)]="currentMedia.date" type="text" placeholder="March 2024" class="sr-input">
            </div>
            <div>
              <label class="sr-field-label">Gallery Image</label>
              <div class="flex flex-col gap-3 md:flex-row">
                <input [(ngModel)]="currentMedia.imageUrl" type="text" placeholder="Paste image URL" class="sr-input flex-1">
                <button type="button" (click)="fileInput.click()" [disabled]="isUploading" class="sr-button-outline whitespace-nowrap px-5">{{ isUploading ? 'Uploading...' : 'Upload Image' }}</button>
                <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
              </div>
              <div *ngIf="currentMedia.imageUrl" class="mt-4 overflow-hidden rounded-[1.3rem] border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] p-3">
                <img [src]="currentMedia.imageUrl" class="sr-admin-thumb h-40 w-full max-w-md" alt="Preview">
              </div>
            </div>
            <div>
              <label class="sr-field-label">Category</label>
              <select [(ngModel)]="currentMedia.type" class="sr-select">
                <option *ngFor="let cat of categories.slice(1)" [value]="cat.value">{{ cat.label }}</option>
              </select>
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-3">
            <button type="button" (click)="closeModal()" class="sr-button-ghost">Cancel</button>
            <button type="button" (click)="saveMedia()" class="sr-button">Save</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ManageGalleryComponent implements OnInit {
  galleryList: MediaGallery[] = [];
  isModalOpen = false;
  isEditing = false;
  isUploading = false;
  currentMedia: MediaGallery = { caption: '', imageUrl: '', type: 'fashion', date: '' };

  categories = [
    { value: 'all', label: 'All' },
    { value: 'Hero', label: 'Hero Slides' },
    { value: 'films', label: 'Films' },
    { value: 'events', label: 'Events' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'bts', label: 'BTS' },
    { value: 'photoshoots', label: 'Photoshoots' }
  ];
  filterCategory = 'all';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadGallery();
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
          this.currentMedia.imageUrl = res.secure_url;
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

  loadGallery(): void {
    this.apiService.getMediaGalleries().subscribe(data => {
      this.galleryList = data.filter(item => item.type !== 'Home');
    });
  }

  get filteredGallery() {
    if (this.filterCategory === 'all') return this.galleryList;
    return this.galleryList.filter(item => item.type === this.filterCategory);
  }

  openModal(): void {
    this.isModalOpen = true;
    this.isEditing = false;
    this.currentMedia = { caption: '', imageUrl: '', type: 'fashion', date: '' };
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  editMedia(media: MediaGallery): void {
    this.isEditing = true;
    this.currentMedia = { ...media };
    this.isModalOpen = true;
  }

  saveMedia(): void {
    if (this.isEditing && this.currentMedia.id) {
      this.apiService.updateMediaGallery(this.currentMedia.id, this.currentMedia).subscribe(() => {
        this.loadGallery();
        this.closeModal();
      });
    } else {
      this.apiService.createMediaGallery(this.currentMedia).subscribe(() => {
        this.loadGallery();
        this.closeModal();
      });
    }
  }

  deleteMedia(id: number): void {
    if (confirm('Delete this image?')) {
      this.apiService.deleteMediaGallery(id).subscribe(() => this.loadGallery());
    }
  }
}
