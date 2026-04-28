import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ApiService,
  FashionItem,
  GalleryCollection,
  MediaGallery
} from '../../services/api.service';
import {
  buildGalleryStorySets,
  GalleryStorySet,
  getFallbackGalleryStorySets
} from '../gallery/gallery-story.utils';

interface FashionFeatureSlide {
  id: string;
  title: string;
  dateLabel: string;
  description: string;
  imageUrl: string;
  altText: string;
  eyebrow: string;
  sourceLabel: string;
  metaLabel: string;
  href: string;
  isExternal: boolean;
  ctaLabel: string;
}

interface FashionEditorialCard {
  id: string;
  title: string;
  dateLabel: string;
  description: string;
  imageUrl: string;
  altText: string;
  sourceLabel: string;
  href: string;
  isExternal: boolean;
  ctaLabel: string;
}

interface FashionSourceNote {
  id: string;
  label: string;
  value: string;
  detail: string;
  href?: string;
  isExternal?: boolean;
}

const FASHION_COLLECTION_KEY = 'fashion-editorials';
const FALLBACK_EXTERNAL_SOURCE = 'https://saaki.co/';
const BLOCKED_FASHION_TERMS = ['blenders pride', 'blenders-pride', 'blenders'];
const FEATURED_FASHION_COLLECTION_KEYS = [
  'saaki',
  'burberry',
  'tommy-hilfiger',
  'peacock',
  'louis-vuitton',
  'kresha-bajaj',
  'secret-alchemist',
  'saaki-pink',
  'myntra'
];
const FALLBACK_FASHION_ITEMS: FashionItem[] = [
  {
    title: 'Style Evolution',
    date: 'July 20, 2024',
    description: 'Exploring the journey through various fashion milestones and iconic looks.',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748271544/WD01RESIZED_phdvfr.webp',
    link: FALLBACK_EXTERNAL_SOURCE
  }
];

@Component({
  selector: 'app-fashion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './fashion.component.html',
  styleUrls: ['./fashion.component.css']
})
export class FashionComponent implements OnInit, OnDestroy {
  loading = true;
  selectedSlideIndex = 0;
  featureSlides: FashionFeatureSlide[] = [];
  editorialCards: FashionEditorialCard[] = [];
  sourceNotes: FashionSourceNote[] = [];
  fashionItems: FashionItem[] = [];
  curatedFashionSets: GalleryStorySet[] = [];
  fashionSet: GalleryStorySet | null = null;

  private slideTimer: ReturnType<typeof setInterval> | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    combineLatest([
      this.apiService.getFashion().pipe(catchError(() => of([] as FashionItem[]))),
      this.apiService.getGalleryCollections(true).pipe(catchError(() => of([] as GalleryCollection[]))),
      this.apiService.getMediaGalleries(true).pipe(catchError(() => of([] as MediaGallery[])))
    ]).subscribe(([fashionItems, collections, mediaItems]) => {
      const storySets = collections.length > 0 || mediaItems.length > 0
        ? buildGalleryStorySets(collections, mediaItems)
        : getFallbackGalleryStorySets();

      const fallbackFashionSet = getFallbackGalleryStorySets().find(set => set.key === FASHION_COLLECTION_KEY) || null;
      const nextFashionItems = this.resolveFashionItems(fashionItems);
      const nextFashionSets = this.resolveCuratedFashionSets(storySets);
      const nextFashionSet = nextFashionSets[0]
        || storySets.find(set => set.key === FASHION_COLLECTION_KEY && !this.isBlockedFashionSet(set))
        || storySets.find(set => set.category === 'fashion' && !this.isBlockedFashionSet(set))
        || fallbackFashionSet;

      this.fashionItems = nextFashionItems;
      this.curatedFashionSets = nextFashionSets.length > 0
        ? nextFashionSets
        : nextFashionSet ? [nextFashionSet] : [];
      this.fashionSet = nextFashionSet;
      this.featureSlides = this.buildFeatureSlides(nextFashionItems, this.curatedFashionSets);
      this.editorialCards = this.buildEditorialCards(nextFashionItems, this.curatedFashionSets);
      this.sourceNotes = this.buildSourceNotes(nextFashionItems, this.curatedFashionSets);
      this.selectedSlideIndex = Math.min(this.selectedSlideIndex, Math.max(this.featureSlides.length - 1, 0));
      this.loading = false;
      this.restartAutoRotate();
    });
  }

  ngOnDestroy(): void {
    this.stopAutoRotate();
  }

  get activeSlide(): FashionFeatureSlide | null {
    return this.featureSlides[this.selectedSlideIndex] ?? this.featureSlides[0] ?? null;
  }

  get fashionAccent(): string {
    return this.fashionSet?.accentTone || '#d0a05a';
  }

  get fashionTitle(): string {
    return 'Fashion Screen';
  }

  get fashionSubtitle(): string {
    const featuredCollections = this.getFeaturedCollectionNames(this.curatedFashionSets, 3);

    if (featuredCollections) {
      return `A sharper editorial mix built from Samantha's live fashion collections, featuring ${featuredCollections}.`;
    }

    return 'A cinematic mix of editorial looks, brand-linked stories, and official archive frames.';
  }

  get feedStoryCount(): number {
    return this.fashionItems.length;
  }

  get archiveFrameCount(): number {
    return this.curatedFashionSets.reduce((total, set) => total + set.itemCount, 0);
  }

  get sourceCount(): number {
    return this.sourceNotes.length;
  }

  get editorialArchiveLink(): string {
    return this.curatedFashionSets[0]
      ? `/gallery/set/${this.curatedFashionSets[0].key}`
      : `/gallery/set/${FASHION_COLLECTION_KEY}`;
  }

  previousSlide(): void {
    if (this.featureSlides.length === 0) {
      return;
    }

    const total = this.featureSlides.length;
    this.selectedSlideIndex = (this.selectedSlideIndex - 1 + total) % total;
    this.restartAutoRotate();
  }

  nextSlide(): void {
    if (this.featureSlides.length === 0) {
      return;
    }

    this.selectedSlideIndex = (this.selectedSlideIndex + 1) % this.featureSlides.length;
    this.restartAutoRotate();
  }

  selectSlide(index: number): void {
    if (index < 0 || index >= this.featureSlides.length) {
      return;
    }

    this.selectedSlideIndex = index;
    this.restartAutoRotate();
  }

  pauseAutoRotate(): void {
    this.stopAutoRotate();
  }

  resumeAutoRotate(): void {
    if (this.featureSlides.length > 1 && !this.slideTimer) {
      this.startAutoRotate();
    }
  }

  getDisplayIndex(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  trackBySlide(_: number, slide: FashionFeatureSlide): string {
    return slide.id;
  }

  trackByCard(_: number, card: FashionEditorialCard): string {
    return card.id;
  }

  trackBySource(_: number, source: FashionSourceNote): string {
    return source.id;
  }

  private resolveFashionItems(items: FashionItem[]): FashionItem[] {
    const candidateItems = (items.length > 0 ? items : FALLBACK_FASHION_ITEMS)
      .filter(item => !this.isBlockedFashionCopy(item.title, item.description, item.link, item.type));
    const safeItems = candidateItems.length > 0 ? candidateItems : FALLBACK_FASHION_ITEMS;

    return [...safeItems].sort((left, right) => {
      const dateDelta = this.parseContentDate(right.date) - this.parseContentDate(left.date);

      if (dateDelta !== 0) {
        return dateDelta;
      }

      return (right.id || 0) - (left.id || 0);
    });
  }

  private resolveCuratedFashionSets(storySets: GalleryStorySet[]): GalleryStorySet[] {
    const fashionSets = storySets.filter(set => set.category === 'fashion' && set.itemCount > 0 && !this.isBlockedFashionSet(set));
    const orderedKeys = new Set(FEATURED_FASHION_COLLECTION_KEYS);
    const preferredSets = FEATURED_FASHION_COLLECTION_KEYS
      .map(key => fashionSets.find(set => set.key === key))
      .filter((set): set is GalleryStorySet => !!set);
    const remainingSets = fashionSets.filter(set => !orderedKeys.has(set.key));

    return [...preferredSets, ...remainingSets];
  }

  private buildFeatureSlides(items: FashionItem[], fashionSets: GalleryStorySet[]): FashionFeatureSlide[] {
    const slides: FashionFeatureSlide[] = [];
    const seenImages = new Set<string>();

    for (const item of items) {
      if (!item.imageUrl || seenImages.has(item.imageUrl)) {
        continue;
      }

      slides.push({
        id: `fashion-${item.id ?? item.title}`,
        title: item.title,
        dateLabel: item.date,
        description: item.description,
        imageUrl: item.imageUrl,
        altText: item.title,
        eyebrow: 'Official Fashion Feed',
        sourceLabel: this.isSaakiLink(item.link) ? 'Saaki' : 'Official Story',
        metaLabel: this.isSaakiLink(item.link) ? 'Brand-linked highlight' : 'Feature story',
        href: item.link || `/gallery/set/${FASHION_COLLECTION_KEY}`,
        isExternal: !!item.link,
        ctaLabel: item.link ? this.getExternalCtaLabel(item.link) : 'Open Fashion Archive'
      });
      seenImages.add(item.imageUrl);
    }

    for (const set of fashionSets) {
      const imageUrl = set.coverImageUrl || set.leadImage?.imageUrl || '';

      if (!imageUrl || seenImages.has(imageUrl)) {
        continue;
      }

      slides.push({
        id: `archive-${set.key}`,
        title: set.title,
        dateLabel: set.leadImage?.date || set.subtitle || 'Official Archive',
        description: set.description || 'A curated frame from the official Samantha fashion archive.',
        imageUrl,
        altText: set.leadImage?.altText || set.title,
        eyebrow: 'Curated Live Collection',
        sourceLabel: this.getCollectionSourceLabel(set),
        metaLabel: `${set.itemCount} frame${set.itemCount === 1 ? '' : 's'}`,
        href: `/gallery/set/${set.key}`,
        isExternal: false,
        ctaLabel: 'Open Collection'
      });
      seenImages.add(imageUrl);
    }

    return slides.slice(0, 6);
  }

  private buildEditorialCards(items: FashionItem[], fashionSets: GalleryStorySet[]): FashionEditorialCard[] {
    const cards: FashionEditorialCard[] = [];
    const seenImages = new Set<string>();

    for (const item of items) {
      if (!item.imageUrl || seenImages.has(item.imageUrl)) {
        continue;
      }

      cards.push({
        id: `card-fashion-${item.id ?? item.title}`,
        title: item.title,
        dateLabel: item.date,
        description: item.description,
        imageUrl: item.imageUrl,
        altText: item.title,
        sourceLabel: this.isSaakiLink(item.link) ? 'Saaki-linked story' : 'Official fashion story',
        href: item.link || `/gallery/set/${FASHION_COLLECTION_KEY}`,
        isExternal: !!item.link,
        ctaLabel: item.link ? this.getExternalCtaLabel(item.link) : 'Open Archive'
      });
      seenImages.add(item.imageUrl);
    }

    for (const set of fashionSets) {
      const imageUrl = set.coverImageUrl || set.leadImage?.imageUrl || '';

      if (!imageUrl || seenImages.has(imageUrl)) {
        continue;
      }

      cards.push({
        id: `card-archive-${set.key}`,
        title: set.title,
        dateLabel: set.leadImage?.date || set.subtitle || 'Official Collection',
        description: set.description || 'A curated frame from the official fashion archive.',
        imageUrl,
        altText: set.leadImage?.altText || set.title,
        sourceLabel: `${set.itemCount} frame${set.itemCount === 1 ? '' : 's'} in archive`,
        href: `/gallery/set/${set.key}`,
        isExternal: false,
        ctaLabel: 'Open Collection'
      });
      seenImages.add(imageUrl);
    }

    return cards;
  }

  private buildSourceNotes(items: FashionItem[], fashionSets: GalleryStorySet[]): FashionSourceNote[] {
    const archiveFrames = fashionSets.reduce((total, set) => total + set.itemCount, 0);
    const notes: FashionSourceNote[] = [
      {
        id: 'feed',
        label: 'Fashion Feed',
        value: items.length === 1 ? '1 story ready' : `${items.length} stories ready`,
        detail: 'Pulled from the public fashion endpoint already powering the site.'
      },
      {
        id: 'collections',
        label: 'Live Collections',
        value: fashionSets.length === 1 ? '1 collection curated' : `${fashionSets.length} collections curated`,
        detail: this.getFeaturedCollectionNames(fashionSets, 4)
          ? `The hero slider now prioritises ${this.getFeaturedCollectionNames(fashionSets, 4)}.`
          : 'The hero slider now prioritises the strongest live fashion collections.'
      },
      {
        id: 'archive',
        label: 'Archive Frames',
        value: `${archiveFrames} official frame${archiveFrames === 1 ? '' : 's'}`,
        detail: 'Every collection card opens the full set from the official gallery archive.',
        href: this.editorialArchiveLink,
        isExternal: false
      }
    ];

    if (items.some(item => this.isSaakiLink(item.link)) || fashionSets.some(set => set.key.startsWith('saaki'))) {
      notes.push({
        id: 'brand',
        label: 'Brand Source',
        value: 'Saaki official source',
        detail: "Used where the live fashion feed already links to Samantha's official fashion brand.",
        href: FALLBACK_EXTERNAL_SOURCE,
        isExternal: true
      });
    }

    return notes;
  }

  private getFeaturedCollectionNames(sets: GalleryStorySet[], limit: number): string {
    return sets
      .slice(0, limit)
      .map(set => set.title)
      .join(', ');
  }

  private parseContentDate(value: string | undefined): number {
    if (!value) {
      return 0;
    }

    const parsedDate = Date.parse(value);
    return Number.isNaN(parsedDate) ? 0 : parsedDate;
  }

  private getExternalCtaLabel(link?: string): string {
    if (this.isSaakiLink(link)) {
      return 'Open Saaki';
    }

    return 'Open Official Source';
  }

  private isSaakiLink(link?: string): boolean {
    return !!link && link.toLowerCase().includes('saaki.co');
  }

  private getCollectionSourceLabel(set: GalleryStorySet): string {
    if (set.key.startsWith('saaki')) {
      return 'Saaki archive';
    }

    return 'Official collection';
  }

  private isBlockedFashionSet(set: GalleryStorySet): boolean {
    return this.isBlockedFashionCopy(
      set.key,
      set.title,
      set.subtitle,
      set.description,
      set.leadImage?.caption,
      set.leadImage?.altText
    );
  }

  private isBlockedFashionCopy(...values: Array<string | undefined>): boolean {
    const normalizedValues = values
      .map(value => value?.trim().toLowerCase() || '')
      .filter(Boolean);

    return BLOCKED_FASHION_TERMS.some(term => normalizedValues.some(value => value.includes(term)));
  }

  private restartAutoRotate(): void {
    this.stopAutoRotate();
    this.startAutoRotate();
  }

  private startAutoRotate(): void {
    if (typeof window === 'undefined' || this.featureSlides.length <= 1) {
      return;
    }

    this.slideTimer = window.setInterval(() => {
      this.selectedSlideIndex = (this.selectedSlideIndex + 1) % this.featureSlides.length;
    }, 6500);
  }

  private stopAutoRotate(): void {
    if (this.slideTimer) {
      clearInterval(this.slideTimer);
      this.slideTimer = null;
    }
  }
}
