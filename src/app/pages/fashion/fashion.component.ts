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
      const nextFashionSet = storySets.find(set => set.key === FASHION_COLLECTION_KEY)
        || storySets.find(set => set.category === 'fashion')
        || fallbackFashionSet;
      const nextFashionItems = this.resolveFashionItems(fashionItems);

      this.fashionItems = nextFashionItems;
      this.fashionSet = nextFashionSet;
      this.featureSlides = this.buildFeatureSlides(nextFashionItems, nextFashionSet);
      this.editorialCards = this.buildEditorialCards(nextFashionItems, nextFashionSet);
      this.sourceNotes = this.buildSourceNotes(nextFashionItems, nextFashionSet);
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
    return this.fashionSet?.title || 'Fashion Journey';
  }

  get fashionSubtitle(): string {
    return this.fashionSet?.description
      || 'A cinematic mix of editorial looks, brand-linked stories, and official archive frames.';
  }

  get feedStoryCount(): number {
    return this.fashionItems.length;
  }

  get archiveFrameCount(): number {
    return this.fashionSet?.itemCount || 0;
  }

  get sourceCount(): number {
    return this.sourceNotes.length;
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
    const candidateItems = items.length > 0 ? items : FALLBACK_FASHION_ITEMS;

    return [...candidateItems].sort((left, right) => {
      const dateDelta = this.parseContentDate(right.date) - this.parseContentDate(left.date);

      if (dateDelta !== 0) {
        return dateDelta;
      }

      return (right.id || 0) - (left.id || 0);
    });
  }

  private buildFeatureSlides(items: FashionItem[], fashionSet: GalleryStorySet | null): FashionFeatureSlide[] {
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

    for (const image of fashionSet?.images || []) {
      if (!image.imageUrl || seenImages.has(image.imageUrl)) {
        continue;
      }

      slides.push({
        id: `archive-${image.id}`,
        title: image.caption,
        dateLabel: image.date || fashionSet?.subtitle || 'Official Archive',
        description: fashionSet?.description || 'A curated frame from the official Samantha fashion archive.',
        imageUrl: image.imageUrl,
        altText: image.altText,
        eyebrow: fashionSet?.title || 'Official Fashion Archive',
        sourceLabel: 'Gallery Archive',
        metaLabel: fashionSet?.subtitle || 'Curated editorial set',
        href: `/gallery/set/${fashionSet?.key || FASHION_COLLECTION_KEY}`,
        isExternal: false,
        ctaLabel: 'View Archive Set'
      });
      seenImages.add(image.imageUrl);
    }

    return slides.slice(0, 6);
  }

  private buildEditorialCards(items: FashionItem[], fashionSet: GalleryStorySet | null): FashionEditorialCard[] {
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

    for (const image of fashionSet?.images || []) {
      if (!image.imageUrl || seenImages.has(image.imageUrl)) {
        continue;
      }

      cards.push({
        id: `card-archive-${image.id}`,
        title: image.caption,
        dateLabel: image.date || fashionSet?.subtitle || 'Official Archive',
        description: fashionSet?.description || 'A curated frame from the official fashion archive.',
        imageUrl: image.imageUrl,
        altText: image.altText,
        sourceLabel: 'Official gallery archive',
        href: `/gallery/set/${fashionSet?.key || FASHION_COLLECTION_KEY}`,
        isExternal: false,
        ctaLabel: 'Open Gallery Set'
      });
      seenImages.add(image.imageUrl);
    }

    return cards;
  }

  private buildSourceNotes(items: FashionItem[], fashionSet: GalleryStorySet | null): FashionSourceNote[] {
    const notes: FashionSourceNote[] = [
      {
        id: 'feed',
        label: 'Fashion Feed',
        value: items.length === 1 ? '1 story ready' : `${items.length} stories ready`,
        detail: 'Pulled from the public fashion endpoint already powering the site.'
      }
    ];

    if (fashionSet) {
      notes.push({
        id: 'archive',
        label: 'Editorial Archive',
        value: `${fashionSet.itemCount} official frame${fashionSet.itemCount === 1 ? '' : 's'}`,
        detail: fashionSet.subtitle || 'Curated from the official gallery archive.',
        href: `/gallery/set/${fashionSet.key}`,
        isExternal: false
      });
    }

    if (items.some(item => this.isSaakiLink(item.link))) {
      notes.push({
        id: 'brand',
        label: 'Brand Source',
        value: 'Saaki official site',
        detail: "Used where the fashion feed already links to Samantha's official fashion brand.",
        href: FALLBACK_EXTERNAL_SOURCE,
        isExternal: true
      });
    }

    return notes;
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
