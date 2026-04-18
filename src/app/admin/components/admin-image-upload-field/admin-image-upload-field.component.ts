import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, UploadedMediaAsset } from '../../../services/api.service';

@Component({
  selector: 'app-admin-image-upload-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-3">
      <label *ngIf="label" class="sr-field-label">{{ label }}</label>

      <div class="flex flex-col gap-3 md:flex-row">
        <input
          [ngModel]="value"
          (ngModelChange)="valueChange.emit($event)"
          type="text"
          [placeholder]="placeholder"
          class="sr-input flex-1">

        <button
          type="button"
          (click)="singleFileInput.click()"
          [disabled]="isUploading"
          class="sr-button-outline whitespace-nowrap px-5">
          {{ isUploading ? uploadLabel : uploadButtonLabel }}
        </button>

        <button
          *ngIf="allowBulk"
          type="button"
          (click)="bulkFileInput.click()"
          [disabled]="isUploading"
          class="sr-button-outline whitespace-nowrap px-5">
          {{ isUploading ? uploadLabel : bulkButtonLabel }}
        </button>

        <input #singleFileInput type="file" accept="image/*" (change)="onSingleFileSelected($event)" class="hidden">
        <input #bulkFileInput type="file" accept="image/*" multiple (change)="onBulkFilesSelected($event)" class="hidden">
      </div>

      <p *ngIf="helperText" class="sr-card-text">{{ helperText }}</p>

      <div
        *ngIf="value"
        class="overflow-hidden rounded-[1.3rem] border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] p-3">
        <img [src]="value" [alt]="previewAlt" [class]="previewClass">
      </div>

      <p *ngIf="statusMessage" class="sr-card-text text-[#d9c4af]">{{ statusMessage }}</p>
      <p *ngIf="errorMessage" class="sr-card-text text-[#f4aaa0]">{{ errorMessage }}</p>
    </div>
  `
})
export class AdminImageUploadFieldComponent {
  @Input() label = 'Image';
  @Input() value = '';
  @Input() placeholder = 'Paste image URL';
  @Input() previewAlt = 'Preview';
  @Input() previewClass = 'sr-admin-thumb h-40 w-full max-w-md';
  @Input() uploadButtonLabel = 'Upload Image';
  @Input() bulkButtonLabel = 'Bulk Upload';
  @Input() helperText = '';
  @Input() uploadFolder = 'admin';
  @Input() allowBulk = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() bulkUploaded = new EventEmitter<UploadedMediaAsset[]>();
  @Output() uploadCompleted = new EventEmitter<UploadedMediaAsset>();

  isUploading = false;
  uploadLabel = 'Uploading...';
  statusMessage = '';
  errorMessage = '';

  constructor(private apiService: ApiService) {}

  onSingleFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = this.extractFiles(input);

    if (files.length === 0) {
      return;
    }

    this.isUploading = true;
    this.uploadLabel = 'Uploading...';
    this.statusMessage = '';
    this.errorMessage = '';

    this.apiService.uploadImage(files[0], this.uploadFolder).subscribe({
      next: (asset) => {
        this.valueChange.emit(asset.url);
        this.uploadCompleted.emit(asset);
        this.statusMessage = 'Image uploaded successfully.';
        this.isUploading = false;
      },
      error: (error: unknown) => {
        console.error('Image upload failed', error);
        this.errorMessage = this.getErrorMessage(error, 'Image upload failed. Please try again.');
        this.isUploading = false;
      }
    });
  }

  onBulkFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = this.extractFiles(input);

    if (files.length === 0) {
      return;
    }

    this.isUploading = true;
    this.uploadLabel = `Uploading ${files.length} image${files.length === 1 ? '' : 's'}...`;
    this.statusMessage = '';
    this.errorMessage = '';

    this.apiService.uploadImages(files, this.uploadFolder).subscribe({
      next: (assets) => {
        if (assets[0]) {
          this.valueChange.emit(assets[0].url);
        }

        this.bulkUploaded.emit(assets);
        this.statusMessage = `${assets.length} image${assets.length === 1 ? '' : 's'} uploaded successfully.`;
        this.isUploading = false;
      },
      error: (error: unknown) => {
        console.error('Bulk image upload failed', error);
        this.errorMessage = this.getErrorMessage(error, 'Bulk image upload failed. Please try again.');
        this.isUploading = false;
      }
    });
  }

  private extractFiles(input: HTMLInputElement): File[] {
    const files = input.files ? Array.from(input.files) : [];
    input.value = '';
    return files;
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null) {
      const errorRecord = error as {
        error?: { message?: string; details?: string };
        message?: string;
      };

      if (errorRecord.error?.message) {
        return errorRecord.error.message;
      }

      if (errorRecord.message) {
        return errorRecord.message;
      }
    }

    return fallback;
  }
}
