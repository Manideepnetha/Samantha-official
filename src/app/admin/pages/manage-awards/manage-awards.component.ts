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
        <h1 class="text-3xl font-playfair font-bold text-ivory">Manage Awards</h1>
        <button (click)="openModal()" class="bg-royal-gold text-deep-black px-4 py-2 rounded-md font-bold hover:bg-white transition-colors">
          Add Award
        </button>
      </div>

      <!-- Awards Table -->
      <div class="bg-charcoal rounded-lg shadow-lg overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-deep-black text-royal-gold uppercase text-sm">
            <tr>
              <th class="p-4">Year</th>
              <th class="p-4">Title</th>
              <th class="p-4">Type</th>
              <th class="p-4">Description/Image</th>
              <th class="p-4">Actions</th>
            </tr>
          </thead>
          <tbody class="text-ivory/90 divide-y divide-white/10">
            <tr *ngFor="let award of awards" class="hover:bg-white/5 transition-colors">
              <td class="p-4">{{award.year}}</td>
              <td class="p-4 font-bold">{{award.title}}</td>
              <td class="p-4">
                <span [class.bg-blue-900]="award.type === 'Timeline'" [class.bg-green-900]="award.type === 'Gallery'" class="px-2 py-1 rounded text-xs">
                  {{award.type}}
                </span>
              </td>
              <td class="p-4">
                <div *ngIf="award.type === 'Timeline'">
                    <span class="block truncate max-w-xs" title="{{award.description}}">{{award.description}}</span>
                    <span class="text-xs text-white/50 italic truncate max-w-xs block">{{award.quote}}</span>
                </div>
                <div *ngIf="award.type === 'Gallery' && award.imageUrl">
                    <img [src]="award.imageUrl" alt="Preview" class="h-10 w-10 object-cover rounded">
                </div>
              </td>
              <td class="p-4 flex gap-3">
                <button (click)="openModal(award)" class="text-blue-400 hover:text-blue-300">Edit</button>
                <button (click)="deleteAward(award.id)" class="text-red-400 hover:text-red-300">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div *ngIf="isModalOpen" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div class="bg-charcoal p-6 rounded-lg w-full max-w-lg relative border border-royal-gold/30">
          <button (click)="closeModal()" class="absolute top-4 right-4 text-white hover:text-royal-gold">✕</button>
          <h2 class="text-2xl font-playfair font-bold text-royal-gold mb-4">{{ isEditing ? 'Edit Award' : 'Add New Award' }}</h2>
          
          <form (ngSubmit)="saveAward()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm text-ivory/70 mb-1">Year</label>
                    <input [(ngModel)]="currentAward.year" name="year" type="number" class="w-full bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none" required>
                </div>
                <div>
                    <label class="block text-sm text-ivory/70 mb-1">Type</label>
                    <select [(ngModel)]="currentAward.type" name="type" class="w-full bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none">
                        <option value="Timeline">Timeline</option>
                        <option value="Gallery">Gallery</option>
                    </select>
                </div>
            </div>

            <div>
              <label class="block text-sm text-ivory/70 mb-1">Title</label>
              <input [(ngModel)]="currentAward.title" name="title" class="w-full bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none" required>
            </div>

            <!-- Fields for Timeline -->
            <div *ngIf="currentAward.type === 'Timeline'" class="space-y-4">
                <div>
                  <label class="block text-sm text-ivory/70 mb-1">Description</label>
                  <textarea [(ngModel)]="currentAward.description" name="description" rows="3" class="w-full bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none"></textarea>
                </div>
                <div>
                  <label class="block text-sm text-ivory/70 mb-1">Quote</label>
                  <textarea [(ngModel)]="currentAward.quote" name="quote" rows="2" class="w-full bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none"></textarea>
                </div>
            </div>

            <!-- Fields for Gallery -->
            <div *ngIf="currentAward.type === 'Gallery'" class="space-y-4">
                <div>
                  <label class="block text-sm text-ivory/70 mb-1">Image URL</label>
                  <input [(ngModel)]="currentAward.imageUrl" name="imageUrl" class="w-full bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none">
                </div>
                <div>
                    <label class="block text-sm text-ivory/70 mb-1">Description (Optional)</label>
                    <input [(ngModel)]="currentAward.description" name="description" class="w-full bg-deep-black border border-white/20 rounded p-2 text-ivory focus:border-royal-gold outline-none">
                </div>
            </div>

            <button type="submit" class="w-full bg-royal-gold text-deep-black font-bold py-2 rounded hover:bg-white transition-colors mt-4">
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
