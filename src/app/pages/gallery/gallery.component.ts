import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ApiService } from '../../services/api.service';
import {
  buildGalleryStorySets,
  GALLERY_CATEGORY_OPTIONS,
  GalleryStorySet,
  getFallbackGalleryStorySets,
  getGalleryCategoryLabel
} from './gallery-story.utils';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  readonly categories = GALLERY_CATEGORY_OPTIONS;

  selectedCategory = 'all';
  loading = true;
  storySets: GalleryStorySet[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    combineLatest([
      this.apiService.getGalleryCollections(true),
      this.apiService.getMediaGalleries(true)
    ]).subscribe({
      next: ([collections, images]) => {
        this.storySets = buildGalleryStorySets(collections, images);
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load gallery story sets', error);
        this.storySets = getFallbackGalleryStorySets();
        this.loading = false;
      }
    });
  }

  get filteredStorySets(): GalleryStorySet[] {
    if (this.selectedCategory === 'all') {
      return this.storySets;
    }

    return this.storySets.filter(set => set.category === this.selectedCategory);
  }

  get featuredSet(): GalleryStorySet | null {
    return this.filteredStorySets[0] || null;
  }

  get totalImageCount(): number {
    return this.storySets.reduce((sum, set) => sum + set.itemCount, 0);
  }

  get activeImageCount(): number {
    return this.filteredStorySets.reduce((sum, set) => sum + set.itemCount, 0);
  }

  get activeCategoryLabel(): string {
    return this.categories.find(category => category.value === this.selectedCategory)?.label || 'All Collections';
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  getGalleryCategoryLabel(category: string): string {
    return getGalleryCategoryLabel(category);
  }

  getCategoryCount(category: string): number {
    if (category === 'all') {
      return this.storySets.length;
    }

    return this.storySets.filter(set => set.category === category).length;
  }

  getDisplayIndex(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  trackBySet(_: number, set: GalleryStorySet): string {
    return set.key;
  }
}
