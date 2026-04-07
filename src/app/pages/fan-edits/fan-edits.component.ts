import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, FanCreation } from '../../services/api.service';

@Component({
  selector: 'app-fan-edits',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './fan-edits.component.html',
  styleUrls: ['./fan-edits.component.css']
})
export class FanEditsComponent implements OnInit {
  fanCreations: FanCreation[] = [];
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getFanCreations().subscribe({
      next: (data) => {
        this.fanCreations = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get posters(): FanCreation[] {
    return this.fanCreations.filter(item => item.type === 'Poster');
  }

  get videos(): FanCreation[] {
    return this.fanCreations.filter(item => item.type === 'Video');
  }

  get illustrations(): FanCreation[] {
    return this.fanCreations.filter(item => item.type === 'Illustration');
  }

  get featuredPoster(): FanCreation | null {
    return this.getFeaturedItem(this.posters);
  }

  get featuredVideo(): FanCreation | null {
    return this.getFeaturedItem(this.videos);
  }

  get featuredIllustration(): FanCreation | null {
    return this.getFeaturedItem(this.illustrations);
  }

  get heroCover(): FanCreation | null {
    return this.featuredPoster ?? this.featuredIllustration ?? this.featuredVideo;
  }

  get heroSupportCards(): FanCreation[] {
    return [
      this.featuredVideo,
      this.featuredIllustration,
      this.featuredPoster
    ].filter((item): item is FanCreation => !!item && item !== this.heroCover).slice(0, 2);
  }

  get posterGallery(): FanCreation[] {
    return this.getRemainingItems(this.posters, this.featuredPoster);
  }

  get videoGallery(): FanCreation[] {
    return this.getRemainingItems(this.videos, this.featuredVideo);
  }

  get illustrationGallery(): FanCreation[] {
    return this.getRemainingItems(this.illustrations, this.featuredIllustration);
  }

  get creatorCount(): number {
    const creators = this.fanCreations
      .map(item => item.creatorName?.trim().toLowerCase())
      .filter((creator): creator is string => !!creator);

    return new Set(creators).size;
  }

  get spotlightCount(): number {
    return this.fanCreations.filter(item => item.isFeatured).length || this.fanCreations.length;
  }

  getMediaCta(item: FanCreation): string {
    return item.type === 'Video' ? 'Watch Edit' : 'Open Artwork';
  }

  getCollectionLabel(item: FanCreation): string {
    switch (item.type) {
      case 'Poster':
        return 'Poster Vault';
      case 'Video':
        return 'Motion Layer';
      default:
        return 'Illustration Room';
    }
  }

  getDetailTag(item: FanCreation): string {
    return item.platform || item.dateLabel || this.getCollectionLabel(item);
  }

  private getFeaturedItem(items: FanCreation[]): FanCreation | null {
    return items.find(item => item.isFeatured) ?? items[0] ?? null;
  }

  private getRemainingItems(items: FanCreation[], featured: FanCreation | null): FanCreation[] {
    return items.filter(item => item !== featured);
  }
}
