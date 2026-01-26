import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Philanthropy } from '../../../services/api.service';

@Component({
  selector: 'app-manage-philanthropy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-playfair font-bold text-ivory">Manage Philanthropy</h1>
        <button (click)="openModal()" class="bg-royal-gold text-deep-black px-4 py-2 rounded-md font-bold hover:bg-white transition-colors">
          Add New Item
        </button>
      </div>

      <!-- Philanthropy Table -->
      <div class="bg-charcoal rounded-lg shadow-lg overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-deep-black text-royal-gold uppercase text-sm">
            <tr>
              <th class="p-4">Title</th>
              <th class="p-4">Type</th>
              <th class="p-4">Details</th>
              <th class="p-4">Actions</th>
            </tr>
          </thead>
          <tbody class="text-ivory/90 divide-y divide-white/10">
            <tr *ngFor="let item of philanthropies" class="hover:bg-white/5 transition-colors">
              <td class="p-4 font-bold">{{item.title}}</td>
              <td class="p-4">
                <span [ngClass]="{
                    'bg-blue-900': item.type === 'Initiative',
                    'bg-green-900': item.type === 'Stat',
                    'bg-purple-900': item.type === 'Story'
                }" class="px-2 py-1 rounded text-xs">
                  {{item.type}}
                </span>
              </td>
              <td class="p-4">
                <div *ngIf="item.type === 'Stat'">
                    <span class="font-bold text-royal-gold">{{item.value | number}}</span>
                    <span class="text-white/50 ml-2">Icon: {{item.icon}}</span>
                </div>
                <div *ngIf="item.type === 'Initiative'">
                    <span class="block text-white/50 mb-1">Icon: {{item.icon}}</span>
                    <span class="block truncate max-w-xs" title="{{item.description}}">{{item.description}}</span>
                </div>
                <div *ngIf="item.type === 'Story'">
                    <div class="flex items-center gap-2">
                        <img *ngIf="item.imageUrl" [src]="item.imageUrl" class="h-8 w-8 object-cover rounded" alt="thunb">
                        <span class="truncate max-w-xs" title="{{item.description}}">{{item.description}}</span>
                    </div>
                </div>
              </td>
              <td class="p-4 flex gap-3">
                <button (click)="openModal(item)" class="text-blue-400 hover:text-blue-300">Edit</button>
                <button (click)="deleteItem(item.id!)" class="text-red-400 hover:text-red-300">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div *ngIf="isModalOpen" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div class="bg-charcoal p-6 rounded-lg w-full max-w-lg relative border border-royal-gold/30">
          <button (click)="closeModal()" class="absolute top-4 right-4 text-white hover:text-royal-gold">✕</button>
          <h2 class="text-2xl font-playfair font-bold text-royal-gold mb-4">{{ isEditing ? 'Edit Item' : 'Add New Item' }}</h2>
          
          <form (ngSubmit)="saveItem()" class="space-y-4">
            <div>
                <label class="block text-sm text-ivory/70 mb-1">Type</label>
                <select [(ngModel)]="currentItem.type" name="type" class="w-full bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none">
                    <option value="Initiative">Initiative</option>
                    <option value="Stat">Stat</option>
                    <option value="Story">Success Story</option>
                </select>
            </div>

            <div>
              <label class="block text-sm text-ivory/70 mb-1">Title</label>
              <input [(ngModel)]="currentItem.title" name="title" class="w-full bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none" required>
            </div>

            <!-- Fields for Stat -->
            <div *ngIf="currentItem.type === 'Stat'" class="space-y-4">
                <div>
                    <label class="block text-sm text-ivory/70 mb-1">Value (Count)</label>
                    <input [(ngModel)]="currentItem.value" name="value" type="number" class="w-full bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none">
                </div>
                <div>
                     <label class="block text-sm text-ivory/70 mb-1">Icon (Emoji/Text)</label>
                     <input [(ngModel)]="currentItem.icon" name="icon" class="w-full bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none">
                </div>
            </div>

            <!-- Fields for Initiative -->
            <div *ngIf="currentItem.type === 'Initiative'" class="space-y-4">
                <div>
                  <label class="block text-sm text-ivory/70 mb-1">Description</label>
                  <textarea [(ngModel)]="currentItem.description" name="description" rows="3" class="w-full bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none"></textarea>
                </div>
                <div>
                    <label class="block text-sm text-ivory/70 mb-1">Icon (Emoji/Text)</label>
                    <input [(ngModel)]="currentItem.icon" name="icon" class="w-full bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none">
               </div>
            </div>

            <!-- Fields for Story -->
            <div *ngIf="currentItem.type === 'Story'" class="space-y-4">
                <div>
                    <label class="block text-sm text-ivory/70 mb-1">Content/Description</label>
                    <textarea [(ngModel)]="currentItem.description" name="description" rows="5" class="w-full bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none"></textarea>
                </div>
                <div>
                    <label class="block text-sm text-ivory/70 mb-1">Story Image</label>
                    <div class="flex gap-2 mb-2">
                        <input [(ngModel)]="currentItem.imageUrl" name="imageUrl" placeholder="Paste link or upload..." class="flex-1 bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none">
                        <button type="button" (click)="fileInput.click()" [disabled]="isUploading" class="px-3 py-2 bg-royal-gold/10 hover:bg-royal-gold/20 text-royal-gold rounded text-xs font-semibold transition-all flex items-center gap-2">
                            <svg *ngIf="!isUploading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <div *ngIf="isUploading" class="w-4 h-4 border-2 border-royal-gold border-t-transparent rounded-full animate-spin"></div>
                            {{ isUploading ? 'Uploading...' : 'Upload Image' }}
                        </button>
                        <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
                    </div>
                    
                    <!-- Preview Area -->
                    <div *ngIf="currentItem.imageUrl" class="mt-2 relative rounded-lg overflow-hidden border border-white/10 aspect-video bg-deep-black/30">
                        <img [src]="currentItem.imageUrl" class="w-full h-full object-cover" alt="Preview">
                    </div>
                </div>
            </div>

            <button type="submit" class="w-full bg-royal-gold text-deep-black font-bold py-2 rounded hover:bg-white transition-colors mt-4">
              {{ isEditing ? 'Update Item' : 'Create Item' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ManagePhilanthropyComponent implements OnInit {
  philanthropies: Philanthropy[] = [];
  isModalOpen = false;
  isEditing = false;
  isUploading = false;

  // Default
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.isUploading = true;

    // Cloudinary Upload Logic
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

  deleteItem(id: number) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.apiService.deletePhilanthropy(id).subscribe(() => {
        this.loadPhilanthropies();
      });
    }
  }
}
