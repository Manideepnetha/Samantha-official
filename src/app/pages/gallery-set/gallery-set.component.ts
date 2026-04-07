import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { buildGalleryStorySets, GalleryStoryImage, GalleryStorySet, getGalleryCategoryLabel } from '../gallery/gallery-story.utils';

@Component({
  selector: 'app-gallery-set',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gallery-set.component.html',
  styleUrls: ['./gallery-set.component.css']
})
export class GallerySetComponent implements OnInit {
  loading = true;
  currentSet: GalleryStorySet | null = null;
  allSets: GalleryStorySet[] = [];
  selectedImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.route.paramMap,
      this.apiService.getGalleryCollections(),
      this.apiService.getMediaGalleries()
    ]).subscribe({
      next: ([params, collections, images]) => {
        const collectionKey = params.get('collectionKey') || '';
        const storySets = buildGalleryStorySets(collections, images);
        const nextSet = storySets.find(item => item.key === collectionKey) || null;

        this.allSets = storySets;
        this.currentSet = nextSet;
        this.selectedImageIndex = 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load gallery set', error);
        this.currentSet = null;
        this.allSets = [];
        this.loading = false;
      }
    });
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

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  getGalleryCategoryLabel(category: string): string {
    return getGalleryCategoryLabel(category);
  }

  trackByImage(_: number, image: GalleryStoryImage): number {
    return image.id;
  }

  trackBySet(_: number, set: GalleryStorySet): string {
    return set.key;
  }
}
