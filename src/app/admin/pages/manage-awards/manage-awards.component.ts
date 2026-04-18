import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Award } from '../../../services/api.service';
import { AdminImageUploadFieldComponent } from '../../components/admin-image-upload-field/admin-image-upload-field.component';

@Component({
  selector: 'app-manage-awards',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminImageUploadFieldComponent],
  template: `
    <div class="sr-admin-page">
      <div class="sr-admin-page-header">
        <div>
          <span class="sr-kicker">Recognition</span>
          <h1 class="sr-admin-title">Manage Awards</h1>
          <p class="sr-admin-subtitle">Curate the timeline and gallery entries that shape the awards experience on the public site.</p>
        </div>
        <button (click)="openModal()" class="sr-button">Add Award</button>
      </div>

      <div class="sr-surface sr-admin-table-wrap">
        <div class="sr-admin-table-scroll">
          <table class="sr-admin-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Title</th>
                <th>Type</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let award of awards">
                <td>{{ award.year }}</td>
                <td>
                  <div class="sr-admin-title-cell">{{ award.title }}</div>
                </td>
                <td>
                  <span class="sr-admin-badge" [class.is-soft]="award.type === 'Timeline'" [class.is-accent]="award.type === 'Gallery'">{{ award.type }}</span>
                </td>
                <td>
                  <div *ngIf="award.type === 'Timeline'" class="max-w-md">
                    <p class="sr-card-text">{{ award.description }}</p>
                    <p *ngIf="award.quote" class="mt-3 font-['Cormorant_Garamond'] text-2xl italic text-[#f6ecdf]">"{{ award.quote }}"</p>
                  </div>
                  <div *ngIf="award.type === 'Gallery'" class="sr-admin-media">
                    <img *ngIf="award.imageUrl" [src]="award.imageUrl" alt="Preview" class="sr-admin-thumb">
                    <p class="sr-card-text">{{ award.description || 'Gallery-only visual award entry' }}</p>
                  </div>
                </td>
                <td>
                  <div class="sr-admin-actions">
                    <button (click)="openModal(award)" class="sr-admin-action">Edit</button>
                    <button (click)="deleteAward(award.id)" class="sr-admin-action-danger">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="awards.length === 0" class="sr-admin-empty-row">
                <td colspan="5">No awards have been added yet.</td>
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
              <h2 class="sr-card-title mt-2">{{ isEditing ? 'Edit Award' : 'Add Award' }}</h2>
            </div>
            <button type="button" (click)="closeModal()" class="sr-close-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form (ngSubmit)="saveAward()" class="mt-6 space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="sr-field-label">Year</label>
                <input [(ngModel)]="currentAward.year" name="year" type="number" class="sr-input" required>
              </div>
              <div>
                <label class="sr-field-label">Type</label>
                <select [(ngModel)]="currentAward.type" name="type" class="sr-select">
                  <option value="Timeline">Timeline</option>
                  <option value="Gallery">Gallery</option>
                </select>
              </div>
            </div>

            <div>
              <label class="sr-field-label">Title</label>
              <input [(ngModel)]="currentAward.title" name="title" class="sr-input" required>
            </div>

            <div *ngIf="currentAward.type === 'Timeline'" class="space-y-4">
              <div>
                <label class="sr-field-label">Description</label>
                <textarea [(ngModel)]="currentAward.description" name="description" rows="4" class="sr-textarea"></textarea>
              </div>
              <div>
                <label class="sr-field-label">Quote</label>
                <textarea [(ngModel)]="currentAward.quote" name="quote" rows="3" class="sr-textarea"></textarea>
              </div>
            </div>

            <div *ngIf="currentAward.type === 'Gallery'" class="space-y-4">
              <app-admin-image-upload-field
                label="Image URL"
                [value]="currentAward.imageUrl || ''"
                (valueChange)="currentAward.imageUrl = $event"
                (uploadCompleted)="persistEditedAwardImage()"
                placeholder="Paste image URL"
                uploadButtonLabel="Upload Award Image"
                uploadFolder="awards"
                previewAlt="Award image preview"
                previewClass="sr-admin-thumb h-48 w-full max-w-sm">
              </app-admin-image-upload-field>
              <div>
                <label class="sr-field-label">Description</label>
                <input [(ngModel)]="currentAward.description" name="galleryDescription" class="sr-input">
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" (click)="closeModal()" class="sr-button-ghost">Cancel</button>
              <button type="submit" class="sr-button">{{ isEditing ? 'Update Award' : 'Create Award' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ManageAwardsComponent implements OnInit {
  awards: Award[] = [];
  isModalOpen = false;
  isEditing = false;

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
    if (!this.currentAward.title) return;

    if (this.isEditing) {
      this.apiService.updateAward(this.currentAward.id, this.currentAward).subscribe(() => {
        this.loadAwards();
        this.closeModal();
      });
    } else {
      const { id, ...newAward } = this.currentAward;
      this.apiService.createAward(newAward as Award).subscribe(() => {
        this.loadAwards();
        this.closeModal();
      });
    }
  }

  persistEditedAwardImage(): void {
    if (!this.isEditing || !this.currentAward.id || !this.currentAward.title?.trim() || this.currentAward.type !== 'Gallery') {
      return;
    }

    this.apiService.updateAward(this.currentAward.id, this.currentAward).subscribe({
      next: () => this.loadAwards(),
      error: (error) => {
        console.error('Failed to auto-save uploaded award image', error);
        alert('The image uploaded, but the award was not saved automatically. Please click Update Award.');
      }
    });
  }

  deleteAward(id: number) {
    if (confirm('Are you sure you want to delete this award?')) {
      this.apiService.deleteAward(id).subscribe(() => {
        this.loadAwards();
      });
    }
  }
}
