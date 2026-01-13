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
              <input [(ngModel)]="currentItem.imageUrl" type="text" class="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-transparent text-charcoal dark:text-ivory focus:border-royal-gold outline-none">
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
    currentItem: FashionItem = { title: '', date: '', description: '', imageUrl: '', link: '' };

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loadItems();
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
