import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService, GalleryCollection, MediaGallery, UploadedMediaAsset } from '../../../services/api.service';
import { AdminImageUploadFieldComponent } from '../../components/admin-image-upload-field/admin-image-upload-field.component';
import {
  createEmptyGalleryCollection,
  createEmptyGalleryImage,
  GALLERY_CATEGORY_OPTIONS,
  getGalleryCategoryLabel,
  normalizeGalleryCollectionKey
} from '../../../pages/gallery/gallery-story.utils';

type GalleryAdminTab = 'collections' | 'images';

@Component({
  selector: 'app-manage-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminImageUploadFieldComponent],
  templateUrl: './manage-gallery.component.html',
  styleUrls: ['./manage-gallery.component.css']
})
export class ManageGalleryComponent implements OnInit {
  readonly categories = GALLERY_CATEGORY_OPTIONS;

  activeTab: GalleryAdminTab = 'collections';
  loading = true;
  filterCategory = 'all';
  filterCollection = 'all';

  feedbackMessage = '';
  errorMessage = '';

  isCollectionModalOpen = false;
  isImageModalOpen = false;
  isEditingCollection = false;
  isEditingImage = false;

  galleryCollections: GalleryCollection[] = [];
  galleryList: MediaGallery[] = [];

  currentCollection: GalleryCollection = createEmptyGalleryCollection();
  currentMedia: MediaGallery = createEmptyGalleryImage();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadGalleryData();
  }

  get collectionCount(): number {
    return this.galleryCollections.length;
  }

  get imageCount(): number {
    return this.galleryList.length;
  }

  get assignedImageCount(): number {
    return this.galleryList.filter(item => !!item.collectionKey).length;
  }

  get sortedCollections(): GalleryCollection[] {
    return [...this.galleryCollections].sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return left.title.localeCompare(right.title);
    });
  }

  get filteredGallery(): MediaGallery[] {
    return this.galleryList.filter(item => {
      if (this.filterCategory !== 'all' && item.type !== this.filterCategory) {
        return false;
      }

      if (this.filterCollection !== 'all' && (item.collectionKey || '') !== this.filterCollection) {
        return false;
      }

      return true;
    });
  }

  get hasSelectedCollection(): boolean {
    return !!this.currentMedia.collectionKey;
  }

  loadGalleryData(): void {
    this.loading = true;

    forkJoin({
      collections: this.apiService.getGalleryCollections(),
      images: this.apiService.getMediaGalleries()
    }).subscribe({
      next: ({ collections, images }) => {
        this.galleryCollections = collections;
        this.galleryList = images.filter(item => item.type !== 'Home');
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load gallery admin data', error);
        this.setError('Gallery data could not be loaded.');
        this.loading = false;
      }
    });
  }

  openCollectionModal(collection?: GalleryCollection): void {
    this.resetMessages();
    this.isEditingCollection = !!collection;
    this.currentCollection = collection ? { ...collection } : createEmptyGalleryCollection();

    if (!collection) {
      this.currentCollection.sortOrder = this.getNextCollectionSortOrder();
    }

    this.isCollectionModalOpen = true;
  }

  closeCollectionModal(): void {
    this.isCollectionModalOpen = false;
  }

  openImageModal(media?: MediaGallery): void {
    this.resetMessages();
    this.isEditingImage = !!media;
    this.currentMedia = media ? { ...media } : createEmptyGalleryImage();

    if (!media) {
      this.currentMedia.displayOrder = this.getNextDisplayOrder(this.currentMedia.collectionKey);
    }

    this.isImageModalOpen = true;
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
  }

  onCollectionSelectionChange(collectionKey: string): void {
    this.currentMedia.collectionKey = collectionKey || '';

    const selectedCollection = this.galleryCollections.find(item => item.key === collectionKey);
    if (!selectedCollection) {
      return;
    }

    this.currentMedia.type = selectedCollection.category;

    if (!this.currentMedia.id) {
      this.currentMedia.displayOrder = this.getNextDisplayOrder(collectionKey);
    }
  }

  saveCollection(): void {
    this.resetMessages();

    const title = this.currentCollection.title.trim();
    if (!title) {
      this.setError('Story set title is required.');
      return;
    }

    const payload: GalleryCollection = {
      ...this.currentCollection,
      title,
      subtitle: this.currentCollection.subtitle?.trim() || '',
      description: this.currentCollection.description?.trim() || '',
      key: normalizeGalleryCollectionKey(this.currentCollection.key || title),
      category: this.currentCollection.category || 'fashion',
      coverImageUrl: this.currentCollection.coverImageUrl?.trim() || '',
      accentTone: this.currentCollection.accentTone?.trim() || '#d0a05a',
      sortOrder: Number(this.currentCollection.sortOrder) || this.getNextCollectionSortOrder()
    };

    if (this.isEditingCollection && payload.id) {
      this.apiService.updateGalleryCollection(payload.id, payload).subscribe({
        next: () => {
          this.loadGalleryData();
          this.closeCollectionModal();
          this.setFeedback('Story set updated.');
        },
        error: (error: unknown) => {
          console.error('Failed to save gallery collection', error);
          this.setError('Story set could not be saved.');
        }
      });

      return;
    }

    this.apiService.createGalleryCollection(payload).subscribe({
      next: () => {
        this.loadGalleryData();
        this.closeCollectionModal();
        this.setFeedback('Story set created.');
      },
      error: (error: unknown) => {
        console.error('Failed to save gallery collection', error);
        this.setError('Story set could not be saved.');
      }
    });
  }

  saveImage(): void {
    this.resetMessages();

    const payload = this.prepareMediaPayload(this.currentMedia);

    if (!payload.caption) {
      this.setError('Image caption is required.');
      return;
    }

    if (!payload.imageUrl) {
      this.setError('Image URL is required.');
      return;
    }

    if (this.isEditingImage && payload.id) {
      this.apiService.updateMediaGallery(payload.id, payload).subscribe({
        next: () => {
          this.loadGalleryData();
          this.closeImageModal();
          this.setFeedback('Gallery image updated.');
        },
        error: (error: unknown) => {
          console.error('Failed to save gallery image', error);
          this.setError('Gallery image could not be saved.');
        }
      });

      return;
    }

    this.apiService.createMediaGallery(payload).subscribe({
      next: () => {
        this.loadGalleryData();
        this.closeImageModal();
        this.setFeedback('Gallery image created.');
      },
      error: (error: unknown) => {
        console.error('Failed to save gallery image', error);
        this.setError('Gallery image could not be saved.');
      }
    });
  }

  handleBulkUpload(assets: UploadedMediaAsset[]): void {
    if (assets.length === 0) {
      return;
    }

    this.resetMessages();

    const template = this.prepareMediaPayload(this.currentMedia);
    const startingOrder = template.displayOrder || this.getNextDisplayOrder(template.collectionKey);
    const requests = assets.map((asset, index) => {
      const caption = this.formatUploadLabel(asset.fileName);

      return this.apiService.createMediaGallery({
        caption,
        imageUrl: asset.url,
        altText: caption,
        type: template.type,
        date: template.date,
        collectionKey: template.collectionKey,
        displayOrder: startingOrder + index
      });
    });

    forkJoin(requests).subscribe({
      next: () => {
        this.loadGalleryData();
        this.closeImageModal();
        this.setFeedback(`${assets.length} gallery image${assets.length === 1 ? '' : 's'} uploaded into the selected story set.`);
      },
      error: (error) => {
        console.error('Failed to create gallery items from bulk upload', error);
        this.setError('Bulk upload finished, but the gallery items could not all be saved.');
      }
    });
  }

  deleteCollection(collection: GalleryCollection): void {
    if (!collection.id) {
      return;
    }

    const linkedCount = this.getLinkedImageCount(collection.key);
    const confirmed = confirm(
      linkedCount > 0
        ? `Delete "${collection.title}"? ${linkedCount} linked image${linkedCount === 1 ? '' : 's'} will remain in the gallery but will be unassigned from this set.`
        : `Delete "${collection.title}"?`
    );

    if (!confirmed) {
      return;
    }

    this.resetMessages();
    this.apiService.deleteGalleryCollection(collection.id).subscribe({
      next: () => {
        this.loadGalleryData();
        this.setFeedback('Story set deleted.');
      },
      error: (error) => {
        console.error('Failed to delete gallery collection', error);
        this.setError('Story set could not be deleted.');
      }
    });
  }

  deleteMedia(id: number): void {
    if (!confirm('Delete this gallery image?')) {
      return;
    }

    this.resetMessages();
    this.apiService.deleteMediaGallery(id).subscribe({
      next: () => {
        this.loadGalleryData();
        this.setFeedback('Gallery image deleted.');
      },
      error: (error) => {
        console.error('Failed to delete gallery image', error);
        this.setError('Gallery image could not be deleted.');
      }
    });
  }

  getLinkedImageCount(collectionKey: string): number {
    return this.galleryList.filter(item => item.collectionKey === collectionKey).length;
  }

  getCollectionTitle(collectionKey?: string): string {
    if (!collectionKey) {
      return 'Unassigned';
    }

    return this.galleryCollections.find(item => item.key === collectionKey)?.title || collectionKey;
  }

  getCollectionSubtitle(collection: GalleryCollection): string {
    return collection.subtitle || getGalleryCategoryLabel(collection.category);
  }

  getGalleryCategoryLabel(category: string): string {
    return getGalleryCategoryLabel(category);
  }

  private getNextCollectionSortOrder(): number {
    if (this.galleryCollections.length === 0) {
      return 1;
    }

    return Math.max(...this.galleryCollections.map(item => Number(item.sortOrder) || 0)) + 1;
  }

  private getNextDisplayOrder(collectionKey?: string): number {
    const matchingItems = this.galleryList.filter(item => (item.collectionKey || '') === (collectionKey || ''));
    if (matchingItems.length === 0) {
      return 1;
    }

    return Math.max(...matchingItems.map(item => Number(item.displayOrder) || 0)) + 1;
  }

  private prepareMediaPayload(media: MediaGallery): MediaGallery {
    const selectedCollection = this.galleryCollections.find(item => item.key === (media.collectionKey || ''));
    const caption = media.caption.trim();
    const altText = (media.altText || caption).trim();
    const collectionKey = media.collectionKey?.trim() || '';

    return {
      ...media,
      caption,
      imageUrl: media.imageUrl.trim(),
      altText,
      type: selectedCollection?.category || media.type || 'fashion',
      date: media.date?.trim() || '',
      collectionKey,
      displayOrder: Number(media.displayOrder) || this.getNextDisplayOrder(collectionKey)
    };
  }

  private resetMessages(): void {
    this.feedbackMessage = '';
    this.errorMessage = '';
  }

  private setFeedback(message: string): void {
    this.feedbackMessage = message;
    this.errorMessage = '';
  }

  private setError(message: string): void {
    this.errorMessage = message;
    this.feedbackMessage = '';
  }

  private formatUploadLabel(fileName: string): string {
    const cleaned = fileName
      .replace(/\.[^.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleaned) {
      return 'Gallery Image';
    }

    return cleaned.replace(/\b\w/g, char => char.toUpperCase());
  }
}
