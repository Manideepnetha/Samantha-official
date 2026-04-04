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
  heroTitle: 'The Journey of Samantha',
  heroSubtitle: 'An inspiring tale of passion, perseverance, and purpose.',
  portraitImage: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748010072/8F9A7985_m86vsc.jpg',
  portraitAlt: 'Samantha Ruth Prabhu',
  glanceTitle: 'At a Glance',
  glanceItems: [
    { label: 'Full Name', value: 'Samantha Ruth Prabhu' },
    { label: 'Born', value: 'April 28, 1987' },
    { label: 'Nationality', value: 'Indian' },
    { label: 'Languages', value: 'Tamil, Telugu, English, Hindi' },
    { label: 'Debut Film', value: 'Ye Maaya Chesave (2010)' },
    { label: 'Notable Awards', value: '4 Filmfare Awards South' }
  ],
  sections: [
    {
      title: 'Overview',
      paragraphs: [
        'Samantha Ruth Prabhu stands as one of Indian cinema\'s most versatile and acclaimed actresses, with a career spanning over a decade across Tamil and Telugu film industries. Born in Chennai to a Telugu father and a Malayali mother, Samantha\'s journey to stardom is a testament to her unwavering determination and exceptional talent.'
      ]
    },
    {
      title: 'Early Life & Education',
      paragraphs: [
        'Raised in Chennai, Samantha completed her schooling at Holy Angels Anglo Indian Higher Secondary School and pursued a degree in Commerce at Stella Maris College. Her entry into the entertainment industry began through modeling during her college days, where her natural presence in front of the camera caught the attention of filmmakers.'
      ]
    },
    {
      title: 'Rise to Prominence',
      paragraphs: [
        'Samantha\'s cinematic journey began with Gautham Menon\'s Telugu romantic drama "Ye Maaya Chesave" (2010), where her portrayal of Jessie, a complex character torn between love and family obligations, immediately established her as a performer of remarkable depth. This debut earned her the Filmfare Award for Best Female Debut - South, marking the beginning of an illustrious career.',
        'What followed was a series of powerful performances across diverse genres - from the heartwrenching "Eega" (2012) to the socially conscious "Mahanati" (2018). Her versatility shone through in commercial blockbusters like "Theri" (2016) and critically acclaimed films such as "Super Deluxe" (2019). With each role, Samantha pushed boundaries and challenged herself, refusing to be typecast.'
      ]
    },
    {
      title: 'Breaking New Ground',
      paragraphs: [
        'Samantha\'s career took a revolutionary turn with her digital debut in "The Family Man 2" (2021), where she portrayed Raji, a Sri Lankan Tamil liberation fighter. This performance showcased her incredible range and commitment to her craft, earning unprecedented acclaim across India and internationally.'
      ]
    },
    {
      title: 'Beyond Cinema',
      paragraphs: [
        'While her on-screen presence continues to captivate audiences, Samantha\'s influence extends far beyond cinema. In 2012, she established the Pratyusha Foundation, focusing on providing medical support, education, and other essential services to underprivileged women and children.',
        'As an entrepreneur, she launched her own fashion label, Saaki, which reflects her personal style philosophy of blending tradition with contemporary aesthetics. The brand embodies her commitment to sustainable fashion and ethical business practices.'
      ]
    },
    {
      title: 'Personal Journey & Resilience',
      paragraphs: [
        'In 2022, Samantha revealed her diagnosis with Myositis, an autoimmune condition. With characteristic courage, she has shared her health journey openly, becoming an inspiration for millions facing similar challenges. Her candor about personal struggles has redefined celebrity vulnerability in the Indian context.',
        'Throughout personal and professional challenges, Samantha has maintained an unwavering commitment to her craft and her causes, emerging stronger with each chapter of her life.'
      ]
    },
    {
      title: 'Legacy in the Making',
      paragraphs: [
        'As she continues to evolve as an artist, activist, and entrepreneur, Samantha Ruth Prabhu\'s legacy is characterized by her refusal to conform to industry norms and her determination to use her platform for meaningful change. Her journey represents the changing face of Indian cinema - one that embraces authenticity, diversity, and social responsibility.',
        'With upcoming international projects and growing global recognition, Samantha stands at the threshold of a new chapter that promises to further cement her position as one of India\'s most significant cultural ambassadors.'
      ]
    }
  ],
  quote: {
    text: 'I believe in constantly reinventing myself and never settling for what\'s comfortable. Growth happens outside your comfort zone.',
    author: 'Samantha Ruth Prabhu'
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
      description: 'Made her film debut with Ye Maaya Chesave (Telugu) and Vinnaithaandi Varuvaayaa (Tamil). Her performance won her the Filmfare Award for Best Female Debut - South and a Nandi Award.'
    },
    {
      year: '2012',
      title: 'Rise to Prominence',
      description: 'Starred in the critically acclaimed Eega (Best Actress - Telugu) and Neethaane En Ponvasantham (Best Actress - Tamil), winning top honors in both languages in the same year.'
    },
    {
      year: '2014',
      title: 'Philanthropy',
      description: 'Founded the Pratyusha Support Foundation, providing medical support to underprivileged women and children.'
    },
    {
      year: '2013-2019',
      title: 'Leading Actress & Critical Acclaim',
      description: 'Delivered commercial hits like Attarintiki Daredi, Mersal, and Rangasthalam. Won Filmfare for A Aa (2016) and earned acclaim for roles in Mahanati, Oh! Baby, and Majili.'
    },
    {
      year: '2021',
      title: 'Pan-India Recognition',
      description: 'Made her digital debut as Raji in The Family Man 2, winning the Filmfare OTT Award for Best Actress. Performed the chart-topping Oo Antava in Pushpa: The Rise.'
    },
    {
      year: '2023-2024',
      title: 'Producer & Global Ventures',
      description: 'Launched Tralala Moving Pictures with its first production Subham. Starred in Citadel: Honey Bunny (2024) and launched the "Take 20" podcast advocating for health after her myositis diagnosis.'
    },
    {
      year: '2025-2026',
      title: 'Legacy & New Beginnings',
      description: 'Celebrated 15 years in cinema and entered a new phase focused on projects with deeper personal meaning, balancing work with well-being and long-term impact.',
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

        <div class="grid gap-5 md:grid-cols-2">
          <div
            *ngFor="let milestone of content.milestones"
            class="sr-surface p-6 about-timeline-item"
            [ngClass]="milestone.wide ? 'md:col-span-2' : null"
          >
            <span class="sr-meta">{{ milestone.year }}</span>
            <h3 class="sr-card-title mt-3 mb-3">{{ milestone.title }}</h3>
            <p class="sr-card-text">{{ milestone.description }}</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
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
