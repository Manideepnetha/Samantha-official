import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ApiService } from '../../services/api.service';
import {
  buildGalleryStorySets,
  GALLERY_CATEGORY_OPTIONS,
  GalleryStoryImage,
  GalleryStorySet,
  getFallbackGalleryStorySets,
  getGalleryCategoryLabel
} from './gallery-story.utils';

type GallerySortOption = 'curated' | 'title-asc' | 'title-desc' | 'most-photos';

const GALLERY_SORT_OPTIONS: Array<{ value: GallerySortOption; label: string }> = [
  { value: 'curated', label: 'Curated Order' },
  { value: 'title-asc', label: 'Alphabetical (A-Z)' },
  { value: 'title-desc', label: 'Alphabetical (Z-A)' },
  { value: 'most-photos', label: 'Most Photos' }
];

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  readonly categories = GALLERY_CATEGORY_OPTIONS;
  readonly sortOptions = GALLERY_SORT_OPTIONS;

  selectedCategory = 'all';
  selectedCollectionKey = 'all';
  searchQuery = '';
  sortOption: GallerySortOption = 'curated';
  loading = true;
  storySets: GalleryStorySet[] = [];
  filteredStorySets: GalleryStorySet[] = [];
  collectionOptions: GalleryStorySet[] = [];
  featuredSet: GalleryStorySet | null = null;
  activeImageCount = 0;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    combineLatest([
      this.apiService.getGalleryCollections(true),
      this.apiService.getMediaGalleries(true),
      this.route.queryParamMap
    ]).subscribe({
      next: ([collections, images, queryParams]) => {
        this.storySets = buildGalleryStorySets(collections, images);
        this.applyRouteCollectionFocus(queryParams.get('collection'));
        this.refreshGalleryView();
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load gallery story sets', error);
        this.storySets = getFallbackGalleryStorySets();
        this.applyRouteCollectionFocus(this.route.snapshot.queryParamMap.get('collection'));
        this.refreshGalleryView();
        this.loading = false;
      }
    });
  }

  get totalImageCount(): number {
    return this.storySets.reduce((sum, set) => sum + set.itemCount, 0);
  }

  get activeCategoryLabel(): string {
    return this.categories.find(category => category.value === this.selectedCategory)?.label || 'All Collections';
  }

  get activeCollectionLabel(): string {
    if (this.selectedCollectionKey === 'all') {
      return 'All Collections';
    }

    return this.storySets.find(set => set.key === this.selectedCollectionKey)?.title || 'Selected Collection';
  }

  get activeSortLabel(): string {
    return this.sortOptions.find(option => option.value === this.sortOption)?.label || 'Curated Order';
  }

  get hasActiveFilters(): boolean {
    return this.selectedCategory !== 'all'
      || this.selectedCollectionKey !== 'all'
      || this.sortOption !== 'curated'
      || !!this.searchQuery.trim();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.refreshGalleryView();
  }

  selectCollection(collectionKey: string): void {
    this.selectedCollectionKey = collectionKey || 'all';
    this.refreshGalleryView();
  }

  setSearchQuery(query: string): void {
    this.searchQuery = query;
    this.refreshGalleryView();
  }

  selectSortOption(option: string): void {
    if (this.isGallerySortOption(option)) {
      this.sortOption = option;
    } else {
      this.sortOption = 'curated';
    }

    this.refreshGalleryView();
  }

  resetFilters(): void {
    this.selectedCategory = 'all';
    this.selectedCollectionKey = 'all';
    this.searchQuery = '';
    this.sortOption = 'curated';
    this.refreshGalleryView();
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

  getCardPreviewImages(set: GalleryStorySet): GalleryStoryImage[] {
    return set.previewImages.slice(1, 4);
  }

  getHeroBackdropImageUrl(set: GalleryStorySet): string {
    return set.coverImageUrl || this.getHeroFocusImageUrl(set);
  }

  getHeroFocusImageUrl(set: GalleryStorySet): string {
    return set.leadImage?.imageUrl || set.coverImageUrl || set.previewImages[0]?.imageUrl || '';
  }

  getHeroPreviewImages(set: GalleryStorySet): GalleryStoryImage[] {
    const focusImageUrl = this.getHeroFocusImageUrl(set);
    return set.previewImages.filter(image => image.imageUrl !== focusImageUrl).slice(0, 3);
  }

  trackByImage(_: number, image: GalleryStoryImage): number {
    return image.id;
  }

  trackBySet(_: number, set: GalleryStorySet): string {
    return set.key;
  }

  private applyRouteCollectionFocus(collectionKey: string | null): void {
    const normalizedKey = collectionKey?.trim() || 'all';

    if (normalizedKey === 'all') {
      this.selectedCategory = 'all';
      this.selectedCollectionKey = 'all';
      this.searchQuery = '';
      this.sortOption = 'curated';
      return;
    }

    const matchedSet = this.storySets.find(set => set.key === normalizedKey);
    if (!matchedSet) {
      this.selectedCategory = 'all';
      this.selectedCollectionKey = 'all';
      this.searchQuery = '';
      this.sortOption = 'curated';
      return;
    }

    this.selectedCategory = matchedSet.category;
    this.selectedCollectionKey = matchedSet.key;
    this.searchQuery = '';
    this.sortOption = 'curated';
  }

  private refreshGalleryView(): void {
    const categoryMatches = this.storySets.filter(set => this.selectedCategory === 'all' || set.category === this.selectedCategory);
    this.collectionOptions = [...categoryMatches].sort((left, right) => left.title.localeCompare(right.title));

    if (this.selectedCollectionKey !== 'all' && !this.collectionOptions.some(set => set.key === this.selectedCollectionKey)) {
      this.selectedCollectionKey = 'all';
    }

    let nextSets = categoryMatches;

    if (this.selectedCollectionKey !== 'all') {
      nextSets = nextSets.filter(set => set.key === this.selectedCollectionKey);
    }

    const normalizedQuery = this.searchQuery.trim().toLowerCase();
    if (normalizedQuery) {
      nextSets = nextSets.filter(set => this.matchesSearch(set, normalizedQuery));
    }

    this.filteredStorySets = this.sortStorySets(nextSets);
    this.featuredSet = this.filteredStorySets[0] || null;
    this.activeImageCount = this.filteredStorySets.reduce((sum, set) => sum + set.itemCount, 0);
  }

  private matchesSearch(set: GalleryStorySet, query: string): boolean {
    const searchableText = [
      set.title,
      set.subtitle,
      set.description,
      getGalleryCategoryLabel(set.category)
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(query);
  }

  private sortStorySets(storySets: GalleryStorySet[]): GalleryStorySet[] {
    const sortedSets = [...storySets];

    switch (this.sortOption) {
      case 'title-asc':
        return sortedSets.sort((left, right) => left.title.localeCompare(right.title));
      case 'title-desc':
        return sortedSets.sort((left, right) => right.title.localeCompare(left.title));
      case 'most-photos':
        return sortedSets.sort((left, right) => {
          if (right.itemCount !== left.itemCount) {
            return right.itemCount - left.itemCount;
          }

          return left.title.localeCompare(right.title);
        });
      case 'curated':
      default:
        return sortedSets.sort((left, right) => {
          if (left.sortOrder !== right.sortOrder) {
            return left.sortOrder - right.sortOrder;
          }

          return left.title.localeCompare(right.title);
        });
    }
  }

  private isGallerySortOption(value: string): value is GallerySortOption {
    return this.sortOptions.some(option => option.value === value);
  }
}
