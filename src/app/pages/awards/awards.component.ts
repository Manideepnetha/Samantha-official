import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService, Award } from '../../services/api.service';

interface AwardGalleryCard {
  key: string;
  title: string;
  year: number;
  eyebrow: string;
  summary: string;
  imageUrl: string;
  altText: string;
  imageKind: 'Award Moment' | 'Winning Performance' | 'Recognition Portrait' | 'Official Award Portrait';
  imagePosition?: string;
}

const TIMELINE_AWARD_SUPPLEMENTS: Award[] = [
  {
    id: -101,
    title: 'Indian Film Festival of Melbourne Awards - Best Performance (Female) in a Web Series',
    year: 2021,
    description: 'Won for The Family Man (Season 2), adding an international festival recognition to her OTT breakthrough year.',
    quote: '"A role that expanded her reach far beyond theatrical cinema."',
    type: 'Timeline'
  },
  {
    id: -102,
    title: 'IIFA Utsavam - Best Actress',
    year: 2017,
    description: 'Won for A Aa, extending the film\'s awards run beyond the Filmfare recognition already highlighted on the page.',
    quote: '"A Aa continued Samantha\'s streak of audience-loved, awards-backed performances."',
    type: 'Timeline'
  },
  {
    id: -103,
    title: 'Nandi Awards - Best Actress',
    year: 2017,
    description: 'Honored for Yeto Vellipoyindhi Manasu when the delayed Nandi Awards were announced.',
    quote: '"The performance remained one of her most acclaimed romantic-drama turns."',
    type: 'Timeline'
  },
  {
    id: -104,
    title: 'Vijay Awards - Best Actress',
    year: 2013,
    description: 'Won for Neethaane En Ponvasantham, one of the defining Tamil-language performances of her early career.',
    quote: '"A performance that helped turn critical praise into major awards momentum."',
    type: 'Timeline'
  }
];

const CURATED_AWARD_GALLERY: AwardGalleryCard[] = [
  {
    key: '2025-vogue-power-list',
    title: 'Vogue Power List',
    year: 2025,
    eyebrow: 'Power Performer of the Year',
    summary: 'A current recognition portrait tied to Samantha\'s 2025 Power Performer honor and the wider cultural visibility around her recent work.',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249626/Samantha_in_Pink_Saree_Photo_Gallery_5_ww73qx.jpg',
    altText: 'Samantha Ruth Prabhu in a pink saree portrait used for the 2025 Vogue recognition highlight',
    imageKind: 'Recognition Portrait',
    imagePosition: 'center 18%'
  },
  {
    key: '2024-iifa-woman-of-the-year',
    title: 'IIFA Utsavam',
    year: 2024,
    eyebrow: 'Woman of the Year in Indian Cinema',
    summary: 'Official IIFA artwork for Samantha\'s 2024 Woman of the Year recognition, added to make the awards gallery feel complete for the latest honors.',
    imageUrl: 'https://media.iifa.com/iifa-assets/6242f858a92b28559ee40542d1c767ce.jpg',
    altText: 'Official IIFA Utsavam 2024 artwork honoring Samantha Ruth Prabhu as Woman of the Year in Indian Cinema',
    imageKind: 'Official Award Portrait',
    imagePosition: 'center 24%'
  },
  {
    key: '2023-iffm-excellence',
    title: 'Indian Film Festival of Melbourne',
    year: 2023,
    eyebrow: 'Excellence in Cinema',
    summary: 'A recognition-era portrait representing Samantha\'s 2023 global honors and the stronger international framing of her career.',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249610/20230206_182208_zftdrl.jpg',
    altText: 'Samantha Ruth Prabhu recognition portrait for the 2023 Indian Film Festival of Melbourne highlight',
    imageKind: 'Recognition Portrait',
    imagePosition: 'center 16%'
  },
  {
    key: '2022-critics-choice-yashoda',
    title: 'Critics\' Choice Award',
    year: 2022,
    eyebrow: 'Best Actress for Yashoda',
    summary: 'A performance-led visual for the role that anchored Samantha\'s 2022 critics-driven recognition.',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122614/Picsart_22-09-08_22-58-25-225_zupgqe.jpg',
    altText: 'Yashoda poster representing Samantha Ruth Prabhu\'s 2022 Best Actress recognition',
    imageKind: 'Winning Performance',
    imagePosition: 'center 22%'
  },
  {
    key: '2021-family-man-sweep',
    title: 'The Family Man 2',
    year: 2021,
    eyebrow: 'Filmfare OTT + IFFM wins',
    summary: 'Raji brought Samantha both major OTT recognition and an international festival win, so the awards gallery now reflects that breakthrough properly.',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122617/IMG_20210808_132006_uoe7py.jpg',
    altText: 'The Family Man Season 2 poster representing Samantha Ruth Prabhu\'s 2021 OTT award wins',
    imageKind: 'Winning Performance',
    imagePosition: 'center 18%'
  },
  {
    key: '2020-zee-cine-awards',
    title: 'Zee Cine Awards Telugu',
    year: 2020,
    eyebrow: 'Best Actor in a Leading Role - Female',
    summary: 'A dedicated award-moment card for the paired Oh! Baby and Majili recognition, replacing the previous generic 2020 entry.',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249610/BPpBBG8CYAAL16J_yrhmnj.jpg',
    altText: 'Samantha Ruth Prabhu at an award ceremony representing her 2020 Zee Cine Awards Telugu recognition',
    imageKind: 'Award Moment',
    imagePosition: 'center 14%'
  },
  {
    key: '2019-tv9-nava-nakshatra',
    title: 'TV9 Nava Nakshatra Sanmanam',
    year: 2019,
    eyebrow: 'Best Actor (Female)',
    summary: 'Recognition for a standout run spanning Rangasthalam, Mahanati, and Oh! Baby, now given a proper visual place on the page.',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249611/DCVZboIUQAE5KAE_msxjzx.jpg',
    altText: 'Samantha Ruth Prabhu at a 2019 recognition event for the TV9 Nava Nakshatra Sanmanam highlight',
    imageKind: 'Award Moment',
    imagePosition: 'center 18%'
  },
  {
    key: '2017-iifa-aaa',
    title: 'IIFA Utsavam',
    year: 2017,
    eyebrow: 'Best Actress for A Aa',
    summary: 'A stronger labeled awards card for the A Aa win that was missing from the original awards gallery presentation.',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249626/IMG_20160704_171051_sgdwig.jpg',
    altText: 'Samantha Ruth Prabhu at an award event representing her IIFA Utsavam Best Actress recognition for A Aa',
    imageKind: 'Award Moment',
    imagePosition: 'center 10%'
  },
  {
    key: '2014-ritz-style-award',
    title: 'Ritz Style Award',
    year: 2014,
    eyebrow: 'Style Recognition',
    summary: 'One of Samantha\'s clearest award-night visuals, retained and relabeled so the gallery feels more premium and less generic.',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249628/samantha-ritz-style-awards-2014-hq-012_mznaor.jpg',
    altText: 'Samantha Ruth Prabhu at the Ritz Style Awards in 2014',
    imageKind: 'Award Moment',
    imagePosition: 'center 20%'
  },
  {
    key: '2014-behindwoods-gold-medal',
    title: 'Behindwoods Gold Medal',
    year: 2014,
    eyebrow: 'People\'s Choice Recognition',
    summary: 'A cleaner, smaller card for a strong existing award photo already present in the archive.',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249610/behindwoods-gold-medals-2014_1438582220200_nojatw.jpg',
    altText: 'Samantha Ruth Prabhu holding a Behindwoods Gold Medal award in 2014',
    imageKind: 'Award Moment',
    imagePosition: 'center 24%'
  },
  {
    key: '2013-2017-nepv-nandi',
    title: 'Neethaane En Ponvasantham / Yeto Vellipoyindhi Manasu',
    year: 2013,
    eyebrow: 'Vijay Award + Nandi Best Actress',
    summary: 'The same performance carried Samantha to major recognition in both Tamil and Telugu award circuits, so it now anchors an early-career highlight card.',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122620/C50nIOvXMAAV5EB_pconzm.jpg',
    altText: 'Neethaane En Ponvasantham poster representing Samantha Ruth Prabhu\'s Vijay Award and Nandi Best Actress honors',
    imageKind: 'Winning Performance',
    imagePosition: 'center 20%'
  },
  {
    key: '2012-eega-filmfare',
    title: 'Eega',
    year: 2012,
    eyebrow: 'Filmfare Best Actress - Telugu',
    summary: 'A milestone performance that pushed Samantha decisively into the top-tier awards conversation.',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122620/C_23673_dmfo9e.jpg',
    altText: 'Eega poster representing Samantha Ruth Prabhu\'s 2012 Filmfare Best Actress Telugu win',
    imageKind: 'Winning Performance',
    imagePosition: 'center 20%'
  },
  {
    key: '2010-debut-breakthrough',
    title: 'Ye Maaya Chesave',
    year: 2010,
    eyebrow: 'Filmfare Debut + Nandi Special Jury',
    summary: 'The debut that launched Samantha\'s awards journey, now represented directly in the gallery instead of being left as a text-only milestone.',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122619/big_72182_2b57b25f6b78309614a6d526b9419b5a_q3uhir.jpg',
    altText: 'Ye Maaya Chesave poster representing Samantha Ruth Prabhu\'s debut award wins',
    imageKind: 'Winning Performance',
    imagePosition: 'center 18%'
  }
];

@Component({
  selector: 'app-awards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sr-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel min-h-[540px]">
            <div class="sr-hero-media">
              <img
                src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748038033/ad7ccf187002995.6580064d3e931_ajzyv5.jpg"
                alt="Awards & Milestones"
                class="object-[center_top_26%]"
              />
            </div>

            <div class="sr-hero-copy max-w-3xl">
              <span class="sr-kicker">Recognition</span>
              <h1 class="sr-hero-title">Awards & Milestones</h1>
              <p class="sr-hero-subtitle">
                Celebrating moments of excellence, major wins, and the visual highlights that shaped Samantha&apos;s
                recognition across film, streaming, style, and culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="sr-section-heading">
          <span class="sr-kicker">Timeline</span>
          <h2>Recognition Over Time</h2>
          <p>Major honors, defining moments, and milestones mapped into an editorial timeline.</p>
        </div>

        <div *ngIf="loading" class="sr-empty-state">Loading awards...</div>
        <div *ngIf="!loading && timelineAwards.length === 0" class="sr-empty-state">Awards will appear here once the recognition archive is published.</div>

        <div *ngIf="!loading && timelineAwards.length > 0" class="awards-timeline">
          <div
            *ngFor="let award of timelineAwards; let odd = odd"
            class="timeline-item"
            [class.timeline-item--right]="odd"
          >
            <div class="timeline-dot"></div>
            <div class="sr-surface p-6 md:p-7 sr-hover-card timeline-card">
              <div class="sr-meta mb-3">{{ award.year }}</div>
              <h3 class="sr-card-title mb-3">{{ award.title }}</h3>
              <p class="sr-card-text">{{ award.description }}</p>
              <blockquote
                *ngIf="award.quote"
                class="mt-4 border-l-2 border-[rgba(228,196,163,0.4)] pl-4 font-['Cormorant_Garamond'] text-xl italic text-[#f6ecdf]"
              >
                {{ award.quote }}
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section pb-12">
        <div class="sr-section-heading awards-gallery-heading">
          <span class="sr-kicker">Gallery</span>
          <h2>Award Highlights</h2>
          <p>
            Smaller, cleaner visuals now lead this section. Real award-moment photos stay where the archive has them,
            and missing ceremony years are now supported with strong performance-linked visuals instead of empty gaps.
          </p>
        </div>

        <div *ngIf="!loading && galleryAwards.length > 0" class="awards-gallery-meta" aria-label="Awards gallery summary">
          <span>{{ galleryAwards.length }} curated visuals</span>
          <span>{{ timelineAwards.length }} timeline recognitions</span>
          <span>{{ awardMomentCount }} award-moment photos</span>
        </div>

        <div *ngIf="loading" class="sr-empty-state">Loading gallery...</div>
        <div *ngIf="!loading && galleryAwards.length === 0" class="sr-empty-state">The visual awards archive is being curated.</div>

        <div class="awards-gallery-grid" *ngIf="!loading && galleryAwards.length > 0">
          <article
            *ngFor="let item of galleryAwards; trackBy: trackByGalleryAward"
            class="sr-surface overflow-hidden sr-hover-card award-gallery-card"
          >
            <div class="award-gallery-media">
              <img
                [src]="item.imageUrl"
                [alt]="item.altText"
                [style.object-position]="item.imagePosition || 'center center'"
              />

              <div class="award-gallery-overlay">
                <span
                  class="award-gallery-kind"
                  [class.is-performance]="item.imageKind === 'Winning Performance'"
                  [class.is-official]="item.imageKind === 'Official Award Portrait'"
                >
                  {{ item.imageKind }}
                </span>
                <strong>{{ item.year }}</strong>
              </div>
            </div>

            <div class="award-gallery-body">
              <span class="sr-meta">{{ item.eyebrow }}</span>
              <h3 class="sr-card-title">{{ item.title }}</h3>
              <p class="sr-card-text">{{ item.summary }}</p>
            </div>
          </article>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .awards-timeline {
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
    }

    .awards-timeline::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 1px;
      transform: translateX(-50%);
      background: linear-gradient(180deg, transparent, rgba(214, 169, 93, 0.5) 3%, rgba(214, 169, 93, 0.5) 97%, transparent);
      z-index: 0;
    }

    .timeline-item {
      position: relative;
      grid-column: 1;
      padding: 0 2rem 1rem 0;
    }

    .timeline-item--right {
      grid-column: 2;
      padding: 0 0 1rem 2rem;
      margin-top: 0;
    }

    .timeline-dot {
      position: absolute;
      top: 1.4rem;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #d6a95d;
      border: 2px solid rgba(214, 169, 93, 0.3);
      box-shadow: 0 0 0 4px rgba(214, 169, 93, 0.12);
      z-index: 1;
    }

    .timeline-item:not(.timeline-item--right) .timeline-dot {
      right: -6px;
      left: auto;
    }

    .timeline-item--right .timeline-dot {
      left: -6px;
    }

    .timeline-card {
      width: 100%;
    }

    .awards-gallery-heading {
      margin-bottom: 1.25rem;
    }

    .awards-gallery-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin: 0 0 1.4rem;
    }

    .awards-gallery-meta span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 2.5rem;
      padding: 0.55rem 0.95rem;
      border: 1px solid rgba(228, 196, 163, 0.18);
      border-radius: 999px;
      background: rgba(243, 232, 220, 0.04);
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.76rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(243, 232, 220, 0.82);
    }

    .awards-gallery-grid {
      display: grid;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      gap: 1rem;
    }

    .award-gallery-card {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      border: 1px solid rgba(228, 196, 163, 0.14);
      background:
        linear-gradient(180deg, rgba(245, 229, 214, 0.05), rgba(18, 10, 8, 0.94)),
        rgba(12, 7, 6, 0.96);
    }

    .award-gallery-media {
      position: relative;
      overflow: hidden;
      aspect-ratio: 5 / 4;
      border-radius: 1.35rem 1.35rem 0 0;
      background: rgba(243, 232, 220, 0.03);
    }

    .award-gallery-media::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(8, 4, 4, 0.08) 0%, rgba(8, 4, 4, 0.26) 45%, rgba(8, 4, 4, 0.82) 100%),
        radial-gradient(circle at top right, rgba(215, 177, 138, 0.18), transparent 32%);
      pointer-events: none;
    }

    .award-gallery-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.45s ease, filter 0.45s ease;
    }

    .award-gallery-card:hover .award-gallery-media img {
      transform: scale(1.04);
      filter: saturate(1.04);
    }

    .award-gallery-overlay {
      position: absolute;
      inset: auto 0 0;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.9rem 1rem 0.95rem;
    }

    .award-gallery-kind {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 2.1rem;
      padding: 0.35rem 0.8rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 244, 233, 0.16);
      background: rgba(13, 7, 6, 0.54);
      backdrop-filter: blur(10px);
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(246, 236, 223, 0.86);
    }

    .award-gallery-kind.is-performance {
      background: rgba(104, 128, 143, 0.3);
      color: #e4edf2;
    }

    .award-gallery-kind.is-official {
      background: rgba(181, 135, 78, 0.34);
      color: #f6e2c5;
    }

    .award-gallery-overlay strong {
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: 1.65rem;
      font-weight: 600;
      line-height: 1;
      color: #f6ecdf;
    }

    .award-gallery-body {
      display: grid;
      gap: 0.5rem;
      padding: 1.05rem 1.1rem 1.15rem;
    }

    .award-gallery-body .sr-meta {
      margin: 0;
    }

    .award-gallery-body .sr-card-title {
      margin: 0;
      font-size: clamp(1.55rem, 2.2vw, 2rem);
      line-height: 0.96;
    }

    .award-gallery-body .sr-card-text {
      margin: 0;
      line-height: 1.72;
      color: var(--editorial-muted);
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    @media (min-width: 680px) {
      .awards-gallery-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (min-width: 1180px) {
      .awards-gallery-grid {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .award-gallery-media {
        aspect-ratio: 4 / 3;
      }
    }

    @media (max-width: 768px) {
      .awards-timeline {
        grid-template-columns: 1fr;
      }

      .awards-timeline::before {
        left: 0.75rem;
      }

      .timeline-item,
      .timeline-item--right {
        grid-column: 1;
        padding: 0 0 1rem 2.5rem;
      }

      .timeline-item .timeline-dot,
      .timeline-item--right .timeline-dot {
        left: 0.25rem;
        right: auto;
      }

      .awards-gallery-meta span {
        width: 100%;
        justify-content: flex-start;
      }
    }
  `]
})
export class AwardsComponent implements OnInit {
  loading = true;
  timelineAwards: Award[] = [];
  galleryAwards: AwardGalleryCard[] = [];

  constructor(private apiService: ApiService) {}

  get awardMomentCount(): number {
    return this.galleryAwards.filter(item => item.imageKind !== 'Winning Performance').length;
  }

  ngOnInit(): void {
    this.apiService.getAwards().subscribe({
      next: (data) => {
        this.timelineAwards = this.buildTimelineAwards(data);
        this.galleryAwards = this.buildGalleryAwards();
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load awards page content', error);
        this.timelineAwards = this.buildTimelineAwards([]);
        this.galleryAwards = this.buildGalleryAwards();
        this.loading = false;
      }
    });
  }

  trackByGalleryAward(_: number, item: AwardGalleryCard): string {
    return item.key;
  }

  private buildTimelineAwards(sourceAwards: Award[]): Award[] {
    const groupedAwards = new Map<string, Award>();

    [...sourceAwards.filter(award => award.type === 'Timeline'), ...TIMELINE_AWARD_SUPPLEMENTS].forEach((award) => {
      const key = this.getTimelineAwardKey(award);
      const existing = groupedAwards.get(key);

      if (!existing) {
        groupedAwards.set(key, {
          ...award,
          description: award.description || '',
          quote: award.quote || ''
        });
        return;
      }

      existing.description = this.mergeDescriptions(existing.description, award.description);
      existing.quote = existing.quote || award.quote || '';
      existing.imageUrl = existing.imageUrl || award.imageUrl;
      existing.category = existing.category || award.category;
    });

    return Array.from(groupedAwards.values()).sort((left, right) => {
      if (right.year !== left.year) {
        return right.year - left.year;
      }

      return left.title.localeCompare(right.title);
    });
  }

  private buildGalleryAwards(): AwardGalleryCard[] {
    return [...CURATED_AWARD_GALLERY].sort((left, right) => {
      if (right.year !== left.year) {
        return right.year - left.year;
      }

      return left.title.localeCompare(right.title);
    });
  }

  private getTimelineAwardKey(award: Award): string {
    return `${award.year}-${this.normalizeKey(award.title)}`;
  }

  private normalizeKey(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private mergeDescriptions(existingDescription?: string, nextDescription?: string): string {
    const parts = [existingDescription, nextDescription]
      .map(part => (part || '').trim())
      .filter(Boolean);

    return Array.from(new Set(parts)).join(' ');
  }
}
