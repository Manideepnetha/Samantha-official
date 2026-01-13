import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, MediaGallery } from '../../../services/api.service';

@Component({
    selector: 'app-manage-media-gallery',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-playfair font-bold text-charcoal dark:text-ivory">Manage Featured Gallery</h2>
        <button (click)="openModal()" class="px-4 py-2 bg-royal-gold text-deep-black rounded hover-lift font-medium">
          Add Image
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto bg-white dark:bg-charcoal rounded-lg shadow">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-100 dark:bg-deep-black/50 text-charcoal dark:text-ivory">
              <th class="p-4 border-b border-gray-200 dark:border-gray-700">Image</th>
              <th class="p-4 border-b border-gray-200 dark:border-gray-700">Caption</th>
              <th class="p-4 border-b border-gray-200 dark:border-gray-700">Type</th>
              <th class="p-4 border-b border-gray-200 dark:border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let media of galleryList" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5">
              <td class="p-4">
                <img [src]="media.imageUrl" class="w-16 h-10 object-cover rounded" alt="Thumbnail">
              </td>
              <td class="p-4 text-charcoal dark:text-ivory font-medium">{{ media.caption }}</td>
              <td class="p-4 text-charcoal/80 dark:text-ivory/80">{{ media.type }}</td>
              <td class="p-4">
                <button (click)="editMedia(media)" class="text-royal-gold hover:text-royal-gold/80 mr-3">Edit</button>
                <button (click)="deleteMedia(media.id!)" class="text-red-500 hover:text-red-400">Delete</button>
              </td>
            </tr>
            <tr *ngIf="galleryList.length === 0">
              <td colspan="4" class="p-8 text-center text-gray-500">No images found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-charcoal rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 class="text-xl font-bold font-playfair text-charcoal dark:text-ivory">
              {{ isEditing ? 'Edit Image' : 'Add Image' }}
            </h3>
            <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">&times;</button>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-charcoal dark:text-ivory mb-1">Caption</label>
              <input [(ngModel)]="currentMedia.caption" type="text" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-charcoal dark:text-ivory focus:border-royal-gold outline-none">
            </div>

            <div>
              <label class="block text-sm font-medium text-charcoal dark:text-ivory mb-1">Image URL</label>
              <input [(ngModel)]="currentMedia.imageUrl" type="text" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-charcoal dark:text-ivory focus:border-royal-gold outline-none">
            </div>

            <div>
              <label class="block text-sm font-medium text-charcoal dark:text-ivory mb-1">Alt Text</label>
              <input [(ngModel)]="currentMedia.altText" type="text" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-charcoal dark:text-ivory focus:border-royal-gold outline-none">
            </div>

            <div>
              <label class="block text-sm font-medium text-charcoal dark:text-ivory mb-1">Type</label>
              <select [(ngModel)]="currentMedia.type" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-charcoal dark:text-ivory focus:border-royal-gold outline-none">
                <option value="Home" class="bg-white dark:bg-charcoal">Home</option>
                <option value="General" class="bg-white dark:bg-charcoal">General</option>
              </select>
            </div>
          </div>

          <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button (click)="closeModal()" class="px-4 py-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button (click)="saveMedia()" class="px-4 py-2 bg-royal-gold text-deep-black rounded hover:bg-royal-gold/90 font-medium">Save</button>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class ManageMediaGalleryComponent implements OnInit {
    galleryList: MediaGallery[] = [];
    isModalOpen = false;
    isEditing = false;
    currentMedia: MediaGallery = { caption: '', imageUrl: '', type: 'Home' };

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loadGallery();
    }

    loadGallery(): void {
        this.apiService.getMediaGalleries().subscribe(data => this.galleryList = data);
    }

    openModal(): void {
        this.isModalOpen = true;
        this.isEditing = false;
        this.currentMedia = { caption: '', imageUrl: '', type: 'Home' };
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
        if (confirm('Are you sure you want to delete this image from the gallery?')) {
            this.apiService.deleteMediaGallery(id).subscribe(() => this.loadGallery());
        }
    }
}
