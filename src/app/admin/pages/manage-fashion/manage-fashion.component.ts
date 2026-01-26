import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, FashionItem } from '../../../services/api.service';

@Component({
  selector: 'app-manage-fashion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-playfair font-bold text-charcoal dark:text-ivory">Manage Fashion Journey</h2>
        <button (click)="openModal()" class="px-4 py-2 bg-royal-gold text-deep-black rounded hover-lift font-medium">
          Add Fashion Story
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto bg-white dark:bg-charcoal rounded-lg shadow">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-100 dark:bg-deep-black/50 text-charcoal dark:text-ivory">
              <th class="p-4 border-b border-gray-200 dark:border-gray-700">Image</th>
              <th class="p-4 border-b border-gray-200 dark:border-gray-700">Date</th>
              <th class="p-4 border-b border-gray-200 dark:border-gray-700">Title</th>
              <th class="p-4 border-b border-gray-200 dark:border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of fashionItems" class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5">
              <td class="p-4">
                <img [src]="item.imageUrl" class="w-16 h-10 object-cover rounded" alt="Thumbnail">
              </td>
              <td class="p-4 text-charcoal/80 dark:text-ivory/80">{{ item.date }}</td>
              <td class="p-4 text-charcoal dark:text-ivory font-medium">{{ item.title }}</td>
              <td class="p-4">
                <button (click)="editItem(item)" class="text-royal-gold hover:text-royal-gold/80 mr-3">Edit</button>
                <button (click)="deleteItem(item.id!)" class="text-red-500 hover:text-red-400">Delete</button>
              </td>
            </tr>
            <tr *ngIf="fashionItems.length === 0">
              <td colspan="4" class="p-8 text-center text-gray-500">No fashion stories found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-charcoal rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 class="text-xl font-bold font-playfair text-charcoal dark:text-ivory">
              {{ isEditing ? 'Edit Story' : 'Add Story' }}
            </h3>
            <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">&times;</button>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-charcoal dark:text-ivory mb-1">Title</label>
              <input [(ngModel)]="currentItem.title" type="text" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-charcoal dark:text-ivory focus:border-royal-gold outline-none">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-charcoal dark:text-ivory mb-1">Date</label>
              <input [(ngModel)]="currentItem.date" type="text" placeholder="e.g. July 20, 2024" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-charcoal dark:text-ivory focus:border-royal-gold outline-none">
            </div>

            <div>
              <label class="block text-sm font-medium text-charcoal dark:text-ivory mb-1">Description</label>
              <textarea [(ngModel)]="currentItem.description" rows="3" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-charcoal dark:text-ivory focus:border-royal-gold outline-none"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-charcoal dark:text-ivory mb-1">Image URL</label>
              <div class="flex gap-2 mb-2">
                <input [(ngModel)]="currentItem.imageUrl" type="text" placeholder="Paste link or upload below..." class="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-charcoal dark:text-ivory focus:border-royal-gold outline-none">
                <button (click)="fileInput.click()" [disabled]="isUploading" class="px-3 py-2 bg-royal-gold/10 hover:bg-royal-gold/20 text-royal-gold rounded text-xs font-semibold transition-all flex items-center gap-2">
                  <svg *ngIf="!isUploading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <div *ngIf="isUploading" class="w-4 h-4 border-2 border-royal-gold border-t-transparent rounded-full animate-spin"></div>
                  {{ isUploading ? 'Uploading...' : 'Upload Image' }}
                </button>
                <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
              </div>
              
              <!-- Image Preview Area -->
              <div *ngIf="currentItem.imageUrl" class="mt-2 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 aspect-video bg-gray-50 dark:bg-deep-black/20">
                <img [src]="currentItem.imageUrl" class="w-full h-full object-cover" alt="Preview">
                <div class="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-white font-medium uppercase tracking-wider">
                  Live Preview
                </div>
              </div>
            </div>

             <div>
              <label class="block text-sm font-medium text-charcoal dark:text-ivory mb-1">Link URL</label>
              <input [(ngModel)]="currentItem.link" type="text" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-charcoal dark:text-ivory focus:border-royal-gold outline-none">
            </div>
          </div>

          <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button (click)="closeModal()" class="px-4 py-2 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button (click)="saveItem()" class="px-4 py-2 bg-royal-gold text-deep-black rounded hover:bg-royal-gold/90 font-medium">Save</button>
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

    // Cloudinary Upload Logic
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // You might need to change this to your specific preset
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
