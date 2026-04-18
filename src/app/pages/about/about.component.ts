import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ApiService } from '../../services/api.service';

interface AboutGlanceItem {
  label: string;
  value: string;
}

interface AboutSection {
  title: string;
  paragraphs: string[];
}

interface AboutQuote {
  text: string;
  author: string;
}

interface AboutMilestonesHeading {
  kicker: string;
  title: string;
  description: string;
}

interface AboutMilestone {
  year: string;
  title: string;
  description: string;
  wide?: boolean;
}

interface AboutPageContent {
  heroImage: string;
  heroAlt: string;
  heroTitle: string;
  heroSubtitle: string;
  portraitImage: string;
  portraitAlt: string;
  glanceTitle: string;
  glanceItems: AboutGlanceItem[];
  sections: AboutSection[];
  quote: AboutQuote;
  milestonesHeading: AboutMilestonesHeading;
  milestones: AboutMilestone[];
}

const DEFAULT_ABOUT_CONTENT: AboutPageContent = {
  heroImage: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748011805/8F9A6978_1_jd2efv.jpg',
  heroAlt: 'Samantha Ruth Prabhu Portrait',
  heroTitle: 'Samantha Ruth Prabhu',
  heroSubtitle: 'Actor, producer, entrepreneur, and founder of Pratyusha Support.',
  portraitImage: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748010072/8F9A7985_m86vsc.jpg',
  portraitAlt: 'Samantha Ruth Prabhu',
  glanceTitle: 'At a Glance',
  glanceItems: [
    { label: 'Full Name', value: 'Samantha Ruth Prabhu' },
    { label: 'Born', value: '28 April 1987' },
    { label: 'Birthplace', value: 'Chennai, Tamil Nadu, India' },
    { label: 'Languages', value: 'Tamil, Telugu, English' },
    { label: 'Acting Debut', value: 'Ye Maaya Chesave (2010)' },
    { label: 'Major Honours', value: '4 Filmfare Awards South, 2 Nandi Awards' }
  ],
  sections: [
    {
      title: 'Overview',
      paragraphs: [
        'Samantha Ruth Prabhu is an Indian actress who works predominantly in Telugu and Tamil films. Since her screen debut in 2010, she has built a career that spans theatrical films, streaming series, entrepreneurship, philanthropy, and film production.'
      ]
    },
    {
      title: 'Early Life & Education',
      paragraphs: [
        'Born to Joseph Prabhu and Ninette, Samantha grew up in the Pallavaram neighbourhood of Chennai. She studied at Holy Angels Anglo Indian Higher Secondary School and later completed a degree in commerce at Stella Maris College.',
        'Near the end of college, she began taking up modelling assignments, including work for Naidu Hall. That phase opened the door to screen opportunities and led to her entry into films.'
      ]
    },
    {
      title: 'Rise to Prominence',
      paragraphs: [
        'Samantha began her acting career with Gautham Menon\'s Telugu romance "Ye Maaya Chesave" (2010), in which she played Jessie. The performance earned her the Filmfare Award for Best Female Debut - South and a Nandi Special Jury Award.',
        'In 2012, she became only the second actress to win Filmfare\'s Best Actress awards in both Tamil and Telugu in the same year, for "Neethaane En Ponvasantham" and "Eega". Over the next decade, she balanced major commercial successes with acclaimed performances in films such as "Attarintiki Daredi", "Theri", "Rangasthalam", "Mahanati", "Oh! Baby", "Super Deluxe", and "Majili".'
      ]
    },
    {
      title: 'Breaking New Ground',
      paragraphs: [
        'Samantha made her streaming debut in "The Family Man 2" (2021), where she played Raji, a skilled operative with a complex past tied to the Sri Lankan conflict. The role widened her audience beyond theatrical cinema and earned her a Filmfare OTT Award.'
      ]
    },
    {
      title: 'Beyond Cinema',
      paragraphs: [
        'Beyond acting, Samantha founded Pratyusha Support in 2014. According to the organisation\'s official website, it focuses on medical care, menstrual dignity, and crisis support for women and children in need.',
        'She has also expanded into entrepreneurship through the fashion label Saaki, which she co-created as a separate venture outside her film work.'
      ]
    },
    {
      title: 'Personal Journey & Resilience',
      paragraphs: [
        'In 2022, Samantha publicly revealed that she had been diagnosed with myositis, an autoimmune condition. She later spoke about that period in interviews and on social media, making health and recovery a visible part of her public life.',
        'In 2024, she launched "Take 20", a health-focused podcast, presenting it as a way to share accessible wellness conversations shaped by her own experience.'
      ]
    },
    {
      title: 'Legacy in the Making',
      paragraphs: [
        'By the mid-2020s, Samantha\'s career had expanded across film, streaming, fashion, philanthropy, and production. In 2024, she starred in "Citadel: Honey Bunny", and in 2025, she made her producer debut with "Subham" under her banner Tralala Moving Pictures.',
        'That blend of mainstream success and self-directed work now defines the next phase of her career.'
      ]
    }
  ],
  quote: {
    text: 'Accepting this vulnerability is something I am still struggling with.',
    author: 'Samantha Ruth Prabhu, Instagram (2022)'
  },
  milestonesHeading: {
    kicker: 'Career Highlights',
    title: 'Milestones Through the Years',
    description: 'Key turning points across Samantha\'s artistic, philanthropic, and entrepreneurial journey.'
  },
  milestones: [
    {
      year: '2010',
      title: 'Early Career & Breakthrough',
      description: 'Made her acting debut in Ye Maaya Chesave and won the Filmfare Award for Best Female Debut - South along with a Nandi Special Jury Award.'
    },
    {
      year: '2012',
      title: 'Rise to Prominence',
      description: 'Won Filmfare Best Actress - Telugu for Eega and Best Actress - Tamil for Neethaane En Ponvasantham in the same year.'
    },
    {
      year: '2014',
      title: 'Philanthropy',
      description: 'Founded Pratyusha Support, a non-profit focused on medical care and crisis support for women and children.'
    },
    {
      year: '2013-2019',
      title: 'Leading Actress & Critical Acclaim',
      description: 'Balanced commercial hits such as Attarintiki Daredi, Theri, and Rangasthalam with acclaimed roles in Mahanati, Oh! Baby, Super Deluxe, and Majili.'
    },
    {
      year: '2021',
      title: 'Pan-India Recognition',
      description: 'Made her streaming debut in The Family Man 2, earned a Filmfare OTT Award, and expanded her reach beyond theatrical cinema.'
    },
    {
      year: '2024-2025',
      title: 'Producer, Podcaster & Streaming Lead',
      description: 'Launched the health podcast Take 20, starred in Citadel: Honey Bunny, and made her producer debut with Subham under Tralala Moving Pictures.',
      wide: true
    }
  ]
};

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sr-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel min-h-[560px]">
            <div class="sr-hero-media">
              <img
                [src]="content.heroImage"
                [alt]="content.heroAlt"
                class="object-[center_28%]"
              />
            </div>

            <div class="sr-hero-copy about-hero-copy max-w-3xl">
              <span class="sr-kicker">About</span>
              <h1 class="sr-hero-title">{{ content.heroTitle }}</h1>
              <p class="sr-hero-subtitle">
                {{ content.heroSubtitle }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div class="space-y-6 lg:sticky lg:top-28 self-start">
            <div class="sr-surface overflow-hidden">
              <img
                [src]="content.portraitImage"
                [alt]="content.portraitAlt"
                class="w-full aspect-[4/5] object-cover"
              />
            </div>

            <div class="sr-surface p-6 about-surface">
              <p class="sr-meta mb-4">{{ content.glanceTitle }}</p>
              <div class="space-y-4">
                <div *ngFor="let item of content.glanceItems">
                  <span class="sr-field-label">{{ item.label }}</span>
                  <span class="block text-lg text-[#f6ecdf]">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="sr-surface p-6 md:p-8 about-surface">
              <div class="space-y-6 text-lg leading-relaxed text-[var(--editorial-muted)]">
                <div *ngFor="let section of content.sections">
                  <h2 class="sr-card-title mb-3">{{ section.title }}</h2>
                  <p
                    *ngFor="let paragraph of section.paragraphs; let isLast = last"
                    class="sr-card-text"
                    [class.mb-4]="!isLast"
                  >
                    {{ paragraph }}
                  </p>
                </div>
              </div>
            </div>

            <blockquote class="sr-surface-soft p-6 md:p-8 about-surface">
              <p class="font-['Cormorant_Garamond'] text-3xl italic leading-tight text-[#f6ecdf]">
                "{{ content.quote.text }}"
              </p>
              <footer class="sr-meta mt-4">{{ content.quote.author }}</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section class="sr-section pb-12">
        <div class="sr-section-heading">
          <span class="sr-kicker">{{ content.milestonesHeading.kicker }}</span>
          <h2>{{ content.milestonesHeading.title }}</h2>
          <p>{{ content.milestonesHeading.description }}</p>
        </div>

        <div class="about-timeline">
          <div *ngFor="let milestone of content.milestones; let i = index"
               class="about-milestone" [class.about-milestone--wide]="milestone.wide">
            <div class="about-milestone-year">
              <span>{{ milestone.year }}</span>
              <div class="about-milestone-dot"></div>
            </div>
            <div class="sr-surface p-6 about-timeline-item sr-hover-card">
              <h3 class="sr-card-title mb-3">{{ milestone.title }}</h3>
              <p class="sr-card-text">{{ milestone.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-timeline {
      position: relative;
      padding-left: 2.5rem;
    }
    .about-timeline::before {
      content: '';
      position: absolute;
      left: 0.35rem; top: 0; bottom: 0;
      width: 1px;
      background: linear-gradient(180deg, transparent, rgba(214,169,93,0.4) 8%, rgba(214,169,93,0.4) 92%, transparent);
    }
    .about-milestone {
      position: relative;
      display: grid;
      grid-template-columns: 5rem 1fr;
      gap: 1rem;
      margin-bottom: 1.25rem;
      align-items: start;
    }
    .about-milestone:last-child { margin-bottom: 0; }
    .about-milestone--wide .sr-surface { grid-column: 1 / -1; }
    .about-milestone-year {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding-top: 1.4rem;
    }
    .about-milestone-year span {
      font-family: 'Manrope','Inter',sans-serif;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #d6a95d;
      white-space: nowrap;
    }
    .about-milestone-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: #d6a95d;
      border: 2px solid rgba(214,169,93,0.25);
      box-shadow: 0 0 0 3px rgba(214,169,93,0.1);
      flex-shrink: 0;
      position: absolute;
      left: -2.15rem;
      top: 1.4rem;
    }
    @media (max-width: 640px) {
      .about-milestone { grid-template-columns: 1fr; }
      .about-milestone-year { padding-top: 0; }
      .about-milestone-dot { display: none; }
    }
  `]
})
export class AboutComponent implements OnInit, AfterViewInit {
  content: AboutPageContent = DEFAULT_ABOUT_CONTENT;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getPageContent<Partial<AboutPageContent>>('about-page').subscribe({
      next: (content) => {
        this.content = this.mergeContent(content);
      },
      error: () => {
        this.content = DEFAULT_ABOUT_CONTENT;
      }
    });
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  private mergeContent(content: Partial<AboutPageContent>): AboutPageContent {
    return {
      ...DEFAULT_ABOUT_CONTENT,
      ...content,
      glanceItems: content.glanceItems ?? DEFAULT_ABOUT_CONTENT.glanceItems,
      sections: content.sections ?? DEFAULT_ABOUT_CONTENT.sections,
      quote: {
        ...DEFAULT_ABOUT_CONTENT.quote,
        ...(content.quote ?? {})
      },
      milestonesHeading: {
        ...DEFAULT_ABOUT_CONTENT.milestonesHeading,
        ...(content.milestonesHeading ?? {})
      },
      milestones: content.milestones ?? DEFAULT_ABOUT_CONTENT.milestones
    };
  }

  initAnimations(): void {
    gsap.from('.about-hero-copy > *', {
      duration: 1,
      y: 24,
      opacity: 0,
      stagger: 0.14,
      ease: 'power3.out'
    });

    gsap.from('.about-surface', {
      duration: 0.9,
      y: 24,
      opacity: 0,
      stagger: 0.1,
      delay: 0.2,
      ease: 'power3.out'
    });

    gsap.from('.about-timeline-item', {
      duration: 0.75,
      y: 18,
      opacity: 0,
      stagger: 0.08,
      delay: 0.35,
      ease: 'power3.out'
    });
  }
}
