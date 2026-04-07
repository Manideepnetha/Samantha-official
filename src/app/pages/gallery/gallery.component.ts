import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { buildGalleryStorySets, GALLERY_CATEGORY_OPTIONS, GalleryStorySet, getGalleryCategoryLabel } from './gallery-story.utils';

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
      this.apiService.getGalleryCollections(),
      this.apiService.getMediaGalleries()
    ]).subscribe({
      next: ([collections, images]) => {
        this.storySets = buildGalleryStorySets(collections, images);
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load gallery story sets', error);
        this.storySets = [];
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

  get supportingSets(): GalleryStorySet[] {
    return this.filteredStorySets.slice(1);
  }

  getGalleryCategoryLabel(category: string): string {
    return getGalleryCategoryLabel(category);
  }

  trackBySet(_: number, set: GalleryStorySet): string {
    return set.key;
  }
}
