import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Philanthropy } from '../../services/api.service';

interface PhilanthropyPageContent {
  heroImage: string;
  heroAlt: string;
  heroTitle: string;
  heroSubtitle: string;
  missionKicker: string;
  missionTitle: string;
  missionDescription: string;
  donateTitle: string;
  donateDescription: string;
  donateLink: string;
  donateCtaLabel: string;
  volunteerTitle: string;
  volunteerDescription: string;
  volunteerLink: string;
  volunteerCtaLabel: string;
}

const DEFAULT_PHILANTHROPY_PAGE_CONTENT: PhilanthropyPageContent = {
  heroImage: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748288170/96372bg8_1_lm3v2w.jpg',
  heroAlt: 'Philanthropy',
  heroTitle: 'Making a Difference',
  heroSubtitle: 'Empowering communities and creating positive change through the Pratyusha Foundation.',
  missionKicker: 'Our Mission',
  missionTitle: 'Creating Sustainable Change',
  missionDescription: 'The Pratyusha Foundation is committed to creating sustainable change in the lives of underprivileged women and children through education, healthcare, and skill development programs.',
  donateTitle: 'Donate',
  donateDescription: 'Support our initiatives through monetary contributions. Every donation helps us reach more lives.',
  donateLink: 'https://pratyushasupport.org/hdfc/pay.php',
  donateCtaLabel: 'Make a Donation',
  volunteerTitle: 'Volunteer',
  volunteerDescription: 'Join our volunteer program and contribute your time and skills to make a difference.',
  volunteerLink: 'https://pratyushasupport.org/',
  volunteerCtaLabel: 'Join as Volunteer'
};

const DEFAULT_PHILANTHROPY_STATS: (Philanthropy & { currentValue?: number })[] = [
  { id: 1, title: 'Lives Touched', value: 10000, icon: 'Heart', type: 'Stat', currentValue: 0 },
  { id: 2, title: 'Surgeries Funded', value: 150, icon: 'Care', type: 'Stat', currentValue: 0 },
  { id: 3, title: 'Health Camps', value: 50, icon: 'Aid', type: 'Stat', currentValue: 0 }
];

const DEFAULT_PHILANTHROPY_INITIATIVES: Philanthropy[] = [
  {
    title: 'Healthcare Support',
    description: 'Providing financial aid for critical medical treatments and surgeries for underprivileged children and women.',
    icon: 'Care',
    type: 'Initiative'
  },
  {
    title: 'Child Welfare',
    description: 'Ensuring proper nutrition, vaccination, and healthcare for infants and children.',
    icon: 'Kids',
    type: 'Initiative'
  },
  {
    title: 'Women Empowerment',
    description: 'Supporting skill development and vocational training to help women become financially independent.',
    icon: 'Rise',
    type: 'Initiative'
  },
  {
    title: 'Community Outreach',
    description: 'Organizing health camps and awareness drives in rural and underserved communities.',
    icon: 'Reach',
    type: 'Initiative'
  }
];

const DEFAULT_PHILANTHROPY_STORIES: Philanthropy[] = [
  {
    title: 'A New Lease on Life',
    description: 'Little Ananya was diagnosed with a congenital heart defect. Through the foundation, she received the life-saving surgery she needed and is now a healthy, active child.',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    type: 'Story'
  },
  {
    title: 'Empowering Lakshmi',
    description: 'Lakshmi, a single mother, joined our tailoring vocational program. Today, she runs her own boutique and supports her family with dignity.',
    imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    type: 'Story'
  }
];

@Component({
  selector: 'app-philanthropy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sr-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel min-h-[540px]">
            <div class="sr-hero-media">
              <img
                [src]="content.heroImage"
                [alt]="content.heroAlt"
                class="object-[center_38%]"
              />
            </div>

            <div class="sr-hero-copy max-w-3xl">
              <span class="sr-kicker">Giving Back</span>
              <h1 class="sr-hero-title">{{ content.heroTitle }}</h1>
              <p class="sr-hero-subtitle">
                {{ content.heroSubtitle }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="sr-surface p-8 md:p-10 text-center">
          <span class="sr-kicker justify-center">{{ content.missionKicker }}</span>
          <h2 class="sr-card-title text-[clamp(2.3rem,4vw,4rem)]">{{ content.missionTitle }}</h2>
          <p class="sr-card-text mx-auto mt-5 max-w-4xl text-lg">
            {{ content.missionDescription }}
          </p>

          <div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div *ngFor="let stat of stats" class="sr-surface-soft p-6 text-center sr-hover-card">
              <div class="mb-4 text-5xl">{{stat.icon}}</div>
              <div class="font-['Cormorant_Garamond'] text-5xl text-[#f6ecdf]">{{ stat.currentValue || 0 | number:'1.0-0' }}</div>
              <div class="sr-card-text mt-3">{{stat.title}}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="sr-section-heading">
          <span class="sr-kicker">Initiatives</span>
          <h2>Programs That Drive Impact</h2>
          <p>Existing initiative entries are preserved and presented as a unified editorial grid.</p>
        </div>

        <div *ngIf="initiatives.length === 0" class="sr-empty-state">Loading initiatives...</div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4" *ngIf="initiatives.length > 0">
          <div *ngFor="let item of initiatives" class="sr-surface p-6 sr-hover-card">
            <div class="sr-icon-ring mb-5 text-3xl">{{item.icon}}</div>
            <h3 class="sr-card-title mb-3">{{item.title}}</h3>
            <p class="sr-card-text">{{item.description}}</p>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="sr-section-heading">
          <span class="sr-kicker">Stories</span>
          <h2>Lives, Changed</h2>
          <p>Real outcomes and continuing journeys from the foundation's work.</p>
        </div>

        <div *ngIf="stories.length === 0" class="sr-empty-state">Loading stories...</div>

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-2" *ngIf="stories.length > 0">
          <div *ngFor="let story of stories" class="sr-surface overflow-hidden sr-hover-card">
            <img *ngIf="story.imageUrl" [src]="story.imageUrl" [alt]="story.title" class="h-72 w-full object-cover" />
            <div class="p-6 md:p-8">
              <h3 class="sr-card-title mb-4">{{ story.title }}</h3>
              <p class="sr-card-text whitespace-pre-line">{{ story.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section pb-12">
        <div class="sr-section-heading">
          <span class="sr-kicker">Get Involved</span>
          <h2>Support the Mission</h2>
          <p>Join in through donations or volunteering without changing any of the existing destination links.</p>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="sr-surface p-8 sr-hover-card">
            <h3 class="sr-card-title mb-4">{{ content.donateTitle }}</h3>
            <p class="sr-card-text mb-6">
              {{ content.donateDescription }}
            </p>
            <a [href]="content.donateLink" target="_blank" class="sr-button">
              {{ content.donateCtaLabel }}
            </a>
          </div>

          <div class="sr-surface p-8 sr-hover-card">
            <h3 class="sr-card-title mb-4">{{ content.volunteerTitle }}</h3>
            <p class="sr-card-text mb-6">
              {{ content.volunteerDescription }}
            </p>
            <a [href]="content.volunteerLink" target="_blank" class="sr-button-outline">
              {{ content.volunteerCtaLabel }}
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class PhilanthropyComponent implements OnInit {
  content: PhilanthropyPageContent = DEFAULT_PHILANTHROPY_PAGE_CONTENT;
  stories: Philanthropy[] = [];
  initiatives: Philanthropy[] = [];
  stats: (Philanthropy & { currentValue?: number })[] = [];
  isLoading = true;

  private animationDuration = 2000;
  private animationStep = 10;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.stats = DEFAULT_PHILANTHROPY_STATS.map(stat => ({ ...stat }));
    this.initiatives = DEFAULT_PHILANTHROPY_INITIATIVES.map(item => ({ ...item }));
    this.stories = DEFAULT_PHILANTHROPY_STORIES.map(item => ({ ...item }));

    this.apiService.getPageContent<Partial<PhilanthropyPageContent>>('philanthropy-page').subscribe({
      next: (content) => {
        this.content = this.mergeContent(content);
      },
      error: () => {
        this.content = DEFAULT_PHILANTHROPY_PAGE_CONTENT;
      }
    });

    this.apiService.getPhilanthropies().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const apiStories = data.filter(i => i.type === 'Story');
          const apiInitiatives = data.filter(i => i.type === 'Initiative');
          const apiStats = data.filter(i => i.type === 'Stat');

          if (apiStories.length > 0) this.stories = apiStories;
          if (apiInitiatives.length > 0) this.initiatives = apiInitiatives;
          if (apiStats.length > 0) {
            this.stats = apiStats.map(s => ({ ...s, currentValue: 0 }));
          }
        }
        this.isLoading = false;
        this.stats.forEach(stat => this.animateStat(stat));
      },
      error: (err) => {
        console.error('Failed to load philanthropy data', err);
        this.isLoading = false;
        this.stats.forEach(stat => this.animateStat(stat));
      }
    });
  }

  animateStat(stat: Philanthropy & { currentValue?: number }): void {
    const target = stat.value || 0;
    const increment = Math.ceil(target / (this.animationDuration / this.animationStep));

    const timer = setInterval(() => {
      stat.currentValue = (stat.currentValue || 0) + increment;
      if (stat.currentValue >= target) {
        stat.currentValue = target;
        clearInterval(timer);
      }
    }, this.animationStep);
  }

  private mergeContent(content: Partial<PhilanthropyPageContent>): PhilanthropyPageContent {
    return {
      ...DEFAULT_PHILANTHROPY_PAGE_CONTENT,
      ...content
    };
  }
}
