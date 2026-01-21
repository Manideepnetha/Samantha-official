import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Award } from '../../../services/api.service';

@Component({
  selector: 'app-manage-awards',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-playfair font-bold text-admin-text-main">Manage Awards</h1>
        <button (click)="openModal()" class="bg-admin-accent text-white px-4 py-2 rounded-md font-bold hover:bg-admin-accent/90 transition-colors shadow-md">
          Add Award
        </button>
      </div>

      <!-- Awards Table -->
      <div class="bg-admin-card rounded-2xl shadow-sm border border-admin-border overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-admin-text-muted uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th class="p-4">Year</th>
              <th class="p-4">Title</th>
              <th class="p-4">Type</th>
              <th class="p-4">Description/Image</th>
              <th class="p-4">Actions</th>
            </tr>
          </thead>
          <tbody class="text-admin-text-main divide-y divide-gray-100">
            <tr *ngFor="let award of awards" class="hover:bg-gray-50 transition-colors">
              <td class="p-4 font-medium">{{award.year}}</td>
              <td class="p-4 font-bold font-playfair text-lg">{{award.title}}</td>
              <td class="p-4">
                <span [class.bg-blue-100]="award.type === 'Timeline'" [class.text-blue-700]="award.type === 'Timeline'" 
                      [class.bg-green-100]="award.type === 'Gallery'" [class.text-green-700]="award.type === 'Gallery'" 
                      class="px-2.5 py-1 rounded-full text-xs font-bold">
                  {{award.type}}
                </span>
              </td>
              <td class="p-4">
                <div *ngIf="award.type === 'Timeline'">
                    <span class="block truncate max-w-xs text-sm text-gray-600" title="{{award.description}}">{{award.description}}</span>
                    <span class="text-xs text-gray-400 italic truncate max-w-xs block mt-1">"{{award.quote}}"</span>
                </div>
                <div *ngIf="award.type === 'Gallery' && award.imageUrl">
                    <img [src]="award.imageUrl" alt="Preview" class="h-10 w-10 object-cover rounded-lg border border-gray-200 shadow-sm">
                </div>
              </td>
              <td class="p-4 flex gap-3">
                <button (click)="openModal(award)" class="text-admin-accent hover:text-yellow-600 font-medium text-sm">Edit</button>
                <button (click)="deleteAward(award.id)" class="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div *ngIf="isModalOpen" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white p-6 rounded-2xl w-full max-w-lg relative shadow-2xl border border-gray-100">
          <button (click)="closeModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>
          <h2 class="text-2xl font-playfair font-bold text-admin-text-main mb-6 border-b border-gray-100 pb-2">{{ isEditing ? 'Edit Award' : 'Add New Award' }}</h2>
          
          <form (ngSubmit)="saveAward()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-semibold text-gray-600 mb-1">Year</label>
                    <input [(ngModel)]="currentAward.year" name="year" type="number" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-admin-text-main focus:border-admin-accent focus:ring-1 focus:ring-admin-accent outline-none transition-all" required>
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-600 mb-1">Type</label>
                    <select [(ngModel)]="currentAward.type" name="type" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-admin-text-main focus:border-admin-accent focus:ring-1 focus:ring-admin-accent outline-none transition-all">
                        <option value="Timeline">Timeline</option>
                        <option value="Gallery">Gallery</option>
                    </select>
                </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-600 mb-1">Title</label>
              <input [(ngModel)]="currentAward.title" name="title" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-admin-text-main focus:border-admin-accent focus:ring-1 focus:ring-admin-accent outline-none transition-all" required>
            </div>

            <!-- Fields for Timeline -->
            <div *ngIf="currentAward.type === 'Timeline'" class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-600 mb-1">Description</label>
                  <textarea [(ngModel)]="currentAward.description" name="description" rows="3" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-admin-text-main focus:border-admin-accent focus:ring-1 focus:ring-admin-accent outline-none transition-all"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-600 mb-1">Quote</label>
                  <textarea [(ngModel)]="currentAward.quote" name="quote" rows="2" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-admin-text-main focus:border-admin-accent focus:ring-1 focus:ring-admin-accent outline-none transition-all"></textarea>
                </div>
            </div>

            <!-- Fields for Gallery -->
            <div *ngIf="currentAward.type === 'Gallery'" class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-600 mb-1">Image URL</label>
                  <input [(ngModel)]="currentAward.imageUrl" name="imageUrl" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-admin-text-main focus:border-admin-accent focus:ring-1 focus:ring-admin-accent outline-none transition-all">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-gray-600 mb-1">Description (Optional)</label>
                    <input [(ngModel)]="currentAward.description" name="description" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-admin-text-main focus:border-admin-accent focus:ring-1 focus:ring-admin-accent outline-none transition-all">
                </div>
            </div>

            <button type="submit" class="w-full bg-admin-accent text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition-all mt-4 shadow-lg shadow-admin-accent/20">
              {{ isEditing ? 'Update Award' : 'Create Award' }}
            </button>
          </form>
        </div>
      </div>
    </div>
    `
})
export class ManageAwardsComponent implements OnInit {
  awards: Award[] = [];
  isModalOpen = false;
  isEditing = false;

  // Default empty award
  currentAward: Award = {
    id: 0,
    title: '',
    year: new Date().getFullYear(),
    type: 'Timeline',
    description: '',
    quote: '',
    imageUrl: ''
  };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadAwards();
  }

  loadAwards() {
    this.apiService.getAwards().subscribe(data => {
      this.awards = data.sort((a, b) => b.year - a.year);
    });
  }

  openModal(award?: Award) {
    this.isModalOpen = true;
    if (award) {
      this.isEditing = true;
      this.currentAward = { ...award };
    } else {
      this.isEditing = false;
      this.currentAward = {
        id: 0,
        title: '',
        year: new Date().getFullYear(),
        type: 'Timeline',
        description: '',
        quote: '',
        imageUrl: ''
      };
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveAward() {
    // Basic validation
    if (!this.currentAward.title) return;

    if (this.isEditing) {
      this.apiService.updateAward(this.currentAward.id, this.currentAward).subscribe(() => {
        this.loadAwards();
        this.closeModal();
      });
    } else {
      // Remove ID 0
      const { id, ...newAward } = this.currentAward;
      this.apiService.createAward(newAward as Award).subscribe(() => {
        this.loadAwards();
        this.closeModal();
      });
    }
  }

  deleteAward(id: number) {
    if (confirm('Are you sure you want to delete this award?')) {
      this.apiService.deleteAward(id).subscribe(() => {
        this.loadAwards();
      });
    }
  }
}
