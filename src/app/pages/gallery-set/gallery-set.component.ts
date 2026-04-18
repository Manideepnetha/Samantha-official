import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ApiService } from '../../services/api.service';
import {
  buildGalleryStorySets,
  GalleryStoryImage,
  GalleryStorySet,
  getFallbackGalleryStorySets,
  getGalleryCategoryLabel
} from '../gallery/gallery-story.utils';

@Component({
  selector: 'app-gallery-set',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gallery-set.component.html',
  styleUrls: ['./gallery-set.component.css']
})
export class GallerySetComponent implements OnInit, OnDestroy {
  loading = true;
  currentSet: GalleryStorySet | null = null;
  allSets: GalleryStorySet[] = [];
  selectedImageIndex = 0;
  isLightboxOpen = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.route.paramMap,
      this.apiService.getGalleryCollections(true),
      this.apiService.getMediaGalleries(true)
    ]).subscribe({
      next: ([params, collections, images]) => {
        const collectionKey = params.get('collectionKey') || '';
        const storySets = buildGalleryStorySets(collections, images);
        const nextSet = storySets.find(item => item.key === collectionKey) || null;

        this.allSets = storySets;
        this.currentSet = nextSet;
        this.selectedImageIndex = 0;
        this.isLightboxOpen = false;
        document.body.style.overflow = '';
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load gallery set', error);
        const storySets = getFallbackGalleryStorySets();
        const collectionKey = this.route.snapshot.paramMap.get('collectionKey') || '';
        this.allSets = storySets;
        this.currentSet = storySets.find(item => item.key === collectionKey) || null;
        this.selectedImageIndex = 0;
        this.isLightboxOpen = false;
        document.body.style.overflow = '';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  get selectedImage(): GalleryStoryImage | null {
    if (!this.currentSet || this.currentSet.images.length === 0) {
      return null;
    }

    return this.currentSet.images[this.selectedImageIndex] || this.currentSet.images[0];
  }

  get relatedSets(): GalleryStorySet[] {
    if (!this.currentSet) {
      return this.allSets.slice(0, 3);
    }

    return this.allSets
      .filter(item => item.key !== this.currentSet?.key)
      .slice(0, 3);
  }

  get hasMultipleImages(): boolean {
    return (this.currentSet?.images.length || 0) > 1;
  }

  get selectedImageProgress(): number {
    if (!this.currentSet || this.currentSet.images.length === 0) {
      return 0;
    }

    return ((this.selectedImageIndex + 1) / this.currentSet.images.length) * 100;
  }

  get selectedImageDisplayIndex(): string {
    return this.getDisplayIndex(this.selectedImageIndex);
  }

  get selectedImageCountLabel(): string {
    return String(this.currentSet?.images.length || 0).padStart(2, '0');
  }

  openImage(index: number): void {
    this.selectImage(index);
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeImage(): void {
    this.isLightboxOpen = false;
    document.body.style.overflow = '';
  }

  selectImage(index: number): void {
    if (!this.currentSet) {
      return;
    }

    this.selectedImageIndex = Math.max(0, Math.min(index, this.currentSet.images.length - 1));
  }

  stepSelection(direction: number): void {
    if (!this.currentSet || this.currentSet.images.length === 0) {
      return;
    }

    const total = this.currentSet.images.length;
    this.selectedImageIndex = (this.selectedImageIndex + direction + total) % total;
  }

  getGalleryCategoryLabel(category: string): string {
    return getGalleryCategoryLabel(category);
  }

  getDisplayIndex(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  trackByImage(_: number, image: GalleryStoryImage): number {
    return image.id;
  }

  trackBySet(_: number, set: GalleryStorySet): string {
    return set.key;
  }
}
