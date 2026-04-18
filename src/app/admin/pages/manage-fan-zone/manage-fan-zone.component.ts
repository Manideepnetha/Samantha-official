import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminImageUploadFieldComponent } from '../../components/admin-image-upload-field/admin-image-upload-field.component';
import { ApiService, FanCreation, UploadedMediaAsset } from '../../../services/api.service';

@Component({
  selector: 'app-manage-fan-zone',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminImageUploadFieldComponent],
  template: `
    <div class="sr-admin-page">
      <div class="sr-admin-page-header">
        <div>
          <span class="sr-kicker">Fan Zone</span>
          <h1 class="sr-admin-title">Manage Fan Made Edits</h1>
          <p class="sr-admin-subtitle">Control the public Fan Made Edits screen and keep the community poster, video, and illustration layers in sync.</p>
        </div>
        <button (click)="resetForm()" class="sr-button">New Entry</button>
      </div>

      <div class="sr-tabbar">
        <button
          *ngFor="let type of creationTypes"
          type="button"
          class="sr-tab"
          [class.is-active]="activeType === type"
          (click)="setActiveType(type)">
          {{ type }}
        </button>
      </div>

      <section class="sr-surface p-6 md:p-7">
        <div class="sr-admin-toolbar">
          <div>
            <span class="sr-kicker">Community Layer</span>
            <h2 class="sr-card-title mt-2">{{ activeType }} Entries</h2>
          </div>
        </div>

        <div class="sr-admin-table-scroll mt-6">
          <table class="sr-admin-table">
            <thead>
              <tr>
                <th>Artwork</th>
                <th>Creator</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of filteredCreations">
                <td>
                  <div class="sr-admin-media">
                    <img [src]="item.imageUrl" class="sr-admin-thumb" [alt]="item.title">
                    <div>
                      <div class="sr-admin-title-cell">{{ item.title }}</div>
                      <p class="sr-card-text mt-2 max-w-md">{{ item.description || 'No description added yet.' }}</p>
                    </div>
                  </div>
                </td>
                <td>{{ item.creatorName || 'Fan Creator' }}</td>
                <td>
                  <span class="sr-admin-badge" [class.is-accent]="item.isFeatured" [class.is-soft]="!item.isFeatured">
                    {{ item.isFeatured ? 'Featured' : 'Standard' }}
                  </span>
                </td>
                <td>
                  <div class="sr-admin-actions">
                    <button type="button" (click)="editItem(item)" class="sr-admin-action">Edit</button>
                    <button type="button" (click)="deleteItem(item.id!)" class="sr-admin-action-danger">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredCreations.length === 0" class="sr-admin-empty-row">
                <td colspan="4">No {{ activeType.toLowerCase() }} entries have been added yet.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <div class="space-y-4">
            <input [(ngModel)]="currentItem.title" class="sr-input" placeholder="Title">
            <div class="grid gap-4 md:grid-cols-2">
              <input [(ngModel)]="currentItem.creatorName" class="sr-input" placeholder="Creator name">
              <input [(ngModel)]="currentItem.dateLabel" class="sr-input" placeholder="Date or label">
            </div>
            <textarea [(ngModel)]="currentItem.description" rows="4" class="sr-textarea" placeholder="Description"></textarea>
            <div class="grid gap-4 md:grid-cols-2">
              <input [(ngModel)]="currentItem.platform" class="sr-input" [placeholder]="platformPlaceholder">
              <input [(ngModel)]="currentItem.mediaUrl" class="sr-input" [placeholder]="mediaUrlPlaceholder">
            </div>
            <label class="inline-flex items-center gap-3 text-sm text-[rgba(243,232,220,0.72)]">
              <input [(ngModel)]="currentItem.isFeatured" type="checkbox" class="h-4 w-4 rounded border-[rgba(228,196,163,0.3)] bg-transparent">
              Mark as featured on the Fan Zone landing preview
            </label>
          </div>

          <div class="space-y-4">
            <app-admin-image-upload-field
              [label]="imageFieldLabel"
              [value]="currentItem.imageUrl"
              (valueChange)="currentItem.imageUrl = $event"
              (uploadCompleted)="persistEditedFanCreationImage()"
              [placeholder]="imagePlaceholder"
              [uploadButtonLabel]="uploadButtonLabel"
              [bulkButtonLabel]="bulkButtonLabel"
              [helperText]="bulkHelperText"
              [uploadFolder]="uploadFolder"
              [allowBulk]="allowBulkUpload"
              [previewAlt]="currentItem.title || activeType"
              (bulkUploaded)="handleBulkUpload($event)">
            </app-admin-image-upload-field>

            <div class="sr-admin-note">
              <p *ngIf="activeType === 'Video'">Video edits use the uploaded image as a thumbnail and the media URL as the external watch link.</p>
              <p *ngIf="activeType !== 'Video'">Bulk upload creates one {{ activeType.toLowerCase() }} entry per image and uses the filename as the starting title.</p>
            </div>

            <div class="flex justify-end gap-3">
              <button type="button" (click)="resetForm()" class="sr-button-ghost">Clear</button>
              <button type="button" (click)="saveItem()" class="sr-button">{{ currentItem.id ? 'Update Entry' : 'Save Entry' }}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class ManageFanZoneComponent implements OnInit {
  creationTypes: FanCreation['type'][] = ['Poster', 'Video', 'Illustration'];
  activeType: FanCreation['type'] = 'Poster';
  creations: FanCreation[] = [];
  currentItem: FanCreation = this.getEmptyItem('Poster');

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCreations();
  }

  get filteredCreations(): FanCreation[] {
    return this.creations.filter(item => item.type === this.activeType);
  }

  get allowBulkUpload(): boolean {
    return this.activeType !== 'Video';
  }

  get imageFieldLabel(): string {
    return this.activeType === 'Video' ? 'Thumbnail Image' : `${this.activeType} Image`;
  }

  get imagePlaceholder(): string {
    return this.activeType === 'Video' ? 'Thumbnail image URL' : `${this.activeType} image URL`;
  }

  get uploadButtonLabel(): string {
    return this.activeType === 'Video' ? 'Upload Thumbnail' : `Upload ${this.activeType} Image`;
  }

  get bulkButtonLabel(): string {
    return this.activeType === 'Poster' ? 'Bulk Upload Posters' : 'Bulk Upload Illustrations';
  }

  get bulkHelperText(): string {
    return this.allowBulkUpload
      ? `Bulk upload is enabled for ${this.activeType.toLowerCase()} entries.`
      : 'Single thumbnail upload keeps each video edit paired to its own external link.';
  }

  get mediaUrlPlaceholder(): string {
    return this.activeType === 'Video' ? 'Watch URL' : 'Optional full artwork URL';
  }

  get platformPlaceholder(): string {
    return this.activeType === 'Video' ? 'Platform (YouTube, Instagram)' : 'Medium or platform';
  }

  get uploadFolder(): string {
    return `fan-zone/${this.activeType.toLowerCase()}s`;
  }

  setActiveType(type: FanCreation['type']): void {
    this.activeType = type;
    this.resetForm();
  }

  editItem(item: FanCreation): void {
    this.activeType = item.type;
    this.currentItem = { ...item };
  }

  resetForm(): void {
    this.currentItem = this.getEmptyItem(this.activeType);
  }

  saveItem(): void {
    const payload: FanCreation = {
      ...this.currentItem,
      type: this.activeType,
      title: this.currentItem.title.trim(),
      creatorName: (this.currentItem.creatorName || '').trim(),
      description: (this.currentItem.description || '').trim(),
      imageUrl: this.currentItem.imageUrl.trim(),
      mediaUrl: (this.currentItem.mediaUrl || '').trim(),
      dateLabel: (this.currentItem.dateLabel || '').trim(),
      platform: (this.currentItem.platform || '').trim(),
      isFeatured: !!this.currentItem.isFeatured
    };

    if (!payload.title || !payload.imageUrl) {
      alert('Please add a title and image before saving.');
      return;
    }

    if (payload.type === 'Video' && !payload.mediaUrl) {
      alert('Please add the external video URL for this video edit.');
      return;
    }

    if (payload.id) {
      this.apiService.updateFanCreation(payload.id, payload).subscribe({
        next: () => {
          this.loadCreations();
          this.resetForm();
        },
        error: (error) => {
          console.error('Failed to update fan creation', error);
          alert('Could not update this entry right now.');
        }
      });
      return;
    }

    this.apiService.createFanCreation(payload).subscribe({
      next: () => {
        this.loadCreations();
        this.resetForm();
      },
      error: (error) => {
        console.error('Failed to create fan creation', error);
        alert('Could not save this entry right now.');
      }
    });
  }

  handleBulkUpload(assets: UploadedMediaAsset[]): void {
    if (!this.allowBulkUpload || assets.length === 0) {
      return;
    }

    const requests = assets.map(asset => {
      const title = this.formatUploadLabel(asset.fileName);
      return this.apiService.createFanCreation({
        title,
        creatorName: 'Fan Submission',
        type: this.activeType,
        description: '',
        imageUrl: asset.url,
        mediaUrl: asset.url,
        dateLabel: this.currentItem.dateLabel || '',
        platform: this.currentItem.platform || (this.activeType === 'Poster' ? 'Poster Art' : 'Digital Illustration'),
        isFeatured: false
      });
    });

    forkJoin(requests).subscribe({
      next: () => {
        this.loadCreations();
        this.resetForm();
        alert(`${assets.length} ${this.activeType.toLowerCase()} entr${assets.length === 1 ? 'y' : 'ies'} uploaded successfully.`);
      },
      error: (error) => {
        console.error('Bulk upload save failed', error);
        alert('Some uploaded entries could not be saved.');
      }
    });
  }

  deleteItem(id: number): void {
    if (!confirm('Delete this fan edit entry?')) {
      return;
    }

    this.apiService.deleteFanCreation(id).subscribe({
      next: () => {
        this.loadCreations();
        this.resetForm();
      },
      error: (error) => {
        console.error('Failed to delete fan creation', error);
        alert('Could not delete this entry right now.');
      }
    });
  }

  persistEditedFanCreationImage(): void {
    if (!this.currentItem.id || !this.currentItem.title.trim()) {
      return;
    }

    const payload: FanCreation = {
      ...this.currentItem,
      type: this.activeType,
      title: this.currentItem.title.trim(),
      creatorName: (this.currentItem.creatorName || '').trim(),
      description: (this.currentItem.description || '').trim(),
      imageUrl: this.currentItem.imageUrl.trim(),
      mediaUrl: (this.currentItem.mediaUrl || '').trim(),
      dateLabel: (this.currentItem.dateLabel || '').trim(),
      platform: (this.currentItem.platform || '').trim(),
      isFeatured: !!this.currentItem.isFeatured
    };

    this.apiService.updateFanCreation(payload.id!, payload).subscribe({
      next: () => this.loadCreations(),
      error: (error) => {
        console.error('Failed to auto-save uploaded fan creation image', error);
        alert('The image uploaded, but the fan entry was not saved automatically. Please click Update Entry.');
      }
    });
  }

  private loadCreations(): void {
    this.apiService.getFanCreations().subscribe(data => {
      this.creations = data;
    });
  }

  private getEmptyItem(type: FanCreation['type']): FanCreation {
    return {
      title: '',
      creatorName: '',
      type,
      description: '',
      imageUrl: '',
      mediaUrl: '',
      dateLabel: '',
      platform: '',
      isFeatured: false
    };
  }

  private formatUploadLabel(fileName: string): string {
    const cleaned = fileName
      .replace(/\.[^.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleaned) {
      return `${this.activeType} Submission`;
    }

    return cleaned.replace(/\b\w/g, char => char.toUpperCase());
  }
}
