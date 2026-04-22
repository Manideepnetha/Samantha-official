import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { combineLatest, Subscription } from 'rxjs';
import { ApiService, MediaGallery } from '../../services/api.service';
import { ThemeService } from '../../services/theme.service';
import { NotificationBellComponent } from '../../components/notification-bell/notification-bell.component';
import { BirthdayCountdownComponent } from '../../components/birthday-countdown/birthday-countdown.component';
import { QuoteOfTheDayComponent } from '../../components/quote-of-the-day/quote-of-the-day.component';
import { ThisDayHistoryComponent } from '../../components/this-day-history/this-day-history.component';
import { InstagramFeedEmbedComponent } from '../../components/instagram-feed-embed/instagram-feed-embed.component';
import { buildGalleryStorySets, GalleryStorySet, getFallbackGalleryStorySets } from '../gallery/gallery-story.utils';

interface HeroSlide {
  image: string;
  role: string;
  alt: string;
}

interface HomeNewsItem {
  title: string;
  date?: string;
  excerpt: string;
  image: string;
  link?: string;
  frameStyle: 'portrait' | 'landscape' | 'square';
}

interface HomeProject {
  title: string;
  type: string;
  releaseLabel: string;
  description: string;
  creditsLabel: string;
  credits: string;
  cast: string;
  image: string;
}

interface HomeGalleryImage {
  key: string;
  url: string;
  alt: string;
  caption: string;
  collectionKey: string;
  collectionTitle: string;
  collectionCount: number;
  accentTone: string;
  frameStyle: 'portrait' | 'landscape' | 'square';
}

interface HomePerformanceLayer {
  year: string;
  title: string;
  meta: string;
  role: string;
  description: string;
  highlights: string[];
  image: string;
  imageAlt: string;
  imagePosition?: string;
}

interface HomeFeatureCard {
  title: string;
  eyebrow: string;
  description: string;
  icon: 'award' | 'screen' | 'heart' | 'spark';
}

interface HomeInstagramSpotlight {
  title: string;
  description: string;
  handle: string;
  href: string;
  image: string;
  imageAlt: string;
}

interface HomeFeatureShowcaseImage {
  url: string;
  alt: string;
  caption: string;
}

interface HomePageContent {
  performanceRange: string;
  instagramSpotlight: HomeInstagramSpotlight;
  featureShowcaseImage: HomeFeatureShowcaseImage;
  performanceLayers: HomePerformanceLayer[];
  keyFeatureCards: HomeFeatureCard[];
}

const DEFAULT_HOME_CONTENT: HomePageContent = {
  performanceRange: '2010 - 2024',
  instagramSpotlight: {
    title: 'Follow Samantha on Instagram',
    description: 'Official updates, backstage glimpses, wellness notes, and campaign highlights at @samantharuthprabhuoffl.',
    handle: '@samantharuthprabhuoffl',
    href: 'https://instagram.com/samantharuthprabhuoffl',
    image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748011805/8F9A6978_1_jd2efv.jpg',
    imageAlt: 'Samantha Ruth Prabhu Instagram spotlight portrait'
  },
  featureShowcaseImage: {
    url: 'https://samantha-official-website-api.onrender.com/uploads/samantha-official-website/home/key-aspects/c3f30b347a3440389e017af2b6316a11.jpg',
    alt: 'Samantha Ruth Prabhu editorial feature portrait',
    caption: 'A cinematic portrait layer inspired by the reference design.'
  },
  performanceLayers: [
    {
      year: '2010',
      title: 'Ye Maaya Chesave',
      meta: 'Romantic Drama | Feature Film',
      role: 'Jessie',
      description: 'Samantha made her lead-screen debut as Jessie, a Malayali Christian woman in Hyderabad whose romance with Karthik drives the film.',
      highlights: [
        'Her 2010 debut role introduced her as a leading actor in Telugu cinema.',
        'Wikipedia credits the performance with winning the Filmfare Award for Best Female Debut - South.',
        'The same debut also earned her a Nandi Special Jury Award.'
      ],
      image: 'https://samantha-official-website-api.onrender.com/uploads/samantha-official-website/home/main-roles/b37d3bada8f7461e85b3e81293dec89d.JPG',
      imageAlt: 'Samantha Ruth Prabhu portrait for Ye Maaya Chesave feature',
      imagePosition: 'center 14%'
    },
    {
      year: '2012',
      title: 'Eega',
      meta: 'Fantasy Action | Feature Film',
      role: 'Bindu',
      description: 'As Bindu, a micro artist who runs an NGO, she anchors the emotional core of a revenge fantasy built around a reincarnated fly.',
      highlights: [
        'Eega won National Film Awards for Best Feature Film in Telugu and Best Special Effects.',
        'Samantha won the Filmfare Award for Best Actress - Telugu for this performance.',
        'Wikipedia lists the film among the year\'s biggest Telugu box-office successes.'
      ],
      image: 'https://samantha-official-website-api.onrender.com/uploads/samantha-official-website/home/main-roles/22104b3ab4264f048de0e15b5e0ed21d.jpg',
      imageAlt: 'Samantha Ruth Prabhu editorial image for Eega feature',
      imagePosition: 'center 18%'
    },
    {
      year: '2018',
      title: 'Mahanati',
      meta: 'Biographical Drama | Feature Film',
      role: 'Madhuravani',
      description: 'She plays journalist Madhuravani, the character whose reporting frames the rise, stardom, and tragedy of screen legend Savitri.',
      highlights: [
        'Wikipedia says the story is viewed through Madhuravani and photographer Vijay Anthony.',
        'Mahanati won the National Film Award for Best Feature Film in Telugu.',
        'The film was screened at festivals including IFFI, Shanghai, and Melbourne.'
      ],
      image: 'https://samantha-official-website-api.onrender.com/uploads/samantha-official-website/home/main-roles/5abe0c872cc0487bbceec7ff840114d6.jpg',
      imageAlt: 'Samantha Ruth Prabhu portrait for Mahanati feature',
      imagePosition: 'center 10%'
    },
    {
      year: '2019',
      title: 'Oh! Baby',
      meta: 'Fantasy Comedy | Feature Film',
      role: 'Young Savithri / Swathi',
      description: 'In a playful yet emotional fantasy, Samantha appears as young Savithri alias Swathi after a woman in her seventies suddenly regains her 24-year-old body.',
      highlights: [
        'Wikipedia lists Samantha as the winner of Critics Choice Best Actor - Female for the film.',
        'The page also records Best Actress wins for her at SIIMA and Zee Cine Awards Telugu.',
        'The story follows a grandmother rediscovering youth, music, and family from a fresh perspective.'
      ],
      image: 'https://samantha-official-website-api.onrender.com/uploads/samantha-official-website/home/main-roles/57f947a993f34f75883d6e828f6a83e1.jpg',
      imageAlt: 'Samantha Ruth Prabhu portrait for Oh Baby feature',
      imagePosition: 'center 22%'
    },
    {
      year: '2021',
      title: 'The Family Man 2',
      meta: 'Spy Thriller | Streaming Series',
      role: 'Raji',
      description: 'Her digital breakout cast her as Raji, a formidable figure in Raj & DK\'s espionage drama, bringing a harder action edge to her screen image.',
      highlights: [
        'Samantha\'s Wikipedia career page says the performance earned her a Filmfare OTT Award.',
        'The role marked her digital debut on streaming.',
        'Indian Express reported that the show also became her first major action turn, with Samantha performing her own stunts.'
      ],
      image: 'https://samantha-official-website-api.onrender.com/uploads/samantha-official-website/home/main-roles/e39a3cc4cc1a4b9caf934ebe54eb5b57.png',
      imageAlt: 'Samantha Ruth Prabhu portrait for The Family Man 2 feature',
      imagePosition: 'center 18%'
    },
    {
      year: '2024',
      title: 'Citadel: Honey Bunny',
      meta: 'Action Drama | Streaming Series',
      role: 'Honey',
      description: 'In the Citadel universe, Samantha plays Honey, a struggling actress drawn into espionage whose past resurfaces while she fights to protect her daughter Nadia.',
      highlights: [
        'Prime Video describes Honey as being pulled into a world of action, espionage, and betrayal.',
        'Samantha\'s Wikipedia page identifies Honey as Nadia Sinh\'s mother.',
        'Wikipedia also notes that this was Samantha\'s only release of 2024.'
      ],
      image: 'https://samantha-official-website-api.onrender.com/uploads/samantha-official-website/home/main-roles/b03898cf933341a29397bb9bb59ef499.jpg',
      imageAlt: 'Samantha Ruth Prabhu portrait for Citadel Honey Bunny feature',
      imagePosition: 'center 14%'
    }
  ],
  keyFeatureCards: [
    {
      title: 'Award-Winning Range',
      eyebrow: 'Four Filmfare Awards South',
      description: 'Wikipedia lists four Filmfare Awards South, two Nandi Awards, and a Tamil Nadu State Film Award, including the rare feat of winning Best Actress in Tamil and Telugu in the same year.',
      icon: 'award'
    },
    {
      title: 'Pan-South Screen Reach',
      eyebrow: 'Telugu, Tamil, and streaming audiences',
      description: 'Samantha works predominantly in Telugu and Tamil cinema and later expanded into streaming with The Family Man 2 and Citadel: Honey Bunny, broadening her audience across formats.',
      icon: 'screen'
    },
    {
      title: 'Purpose Beyond Cinema',
      eyebrow: 'Pratyusha Support foundation',
      description: 'Wikipedia and the Pratyusha Support website describe her charitable work as a medical-support initiative focused on women and children, built to turn compassion into practical care.',
      icon: 'heart'
    },
    {
      title: 'Creative Evolution',
      eyebrow: 'Digital lead to producer',
      description: 'Wikipedia notes that The Family Man 2 marked her digital debut and brought a Filmfare OTT Award, while Subham became her producer debut in 2025.',
      icon: 'spark'
    }
  ]
};

const DEFAULT_CURRENT_HIGHLIGHTS: readonly HomeNewsItem[] = [
  {
    title: 'Galatta Interview',
    date: 'May 15, 2025',
    excerpt: 'In this interview, Baradwaj Rangan has a candid conversation with Samantha for Shubham. They ate a lot, talked a lot, and had lots of fun.',
    image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748181752/1KBvNGVxuMg-HD_gvqzhe.jpg',
    link: 'https://youtu.be/1KBvNGVxuMg?si=6c4pq5wmmkIocelt',
    frameStyle: 'landscape'
  },
  {
    title: 'Celebrating 15 Years Of Samantha Promo',
    date: 'April 28, 2025',
    excerpt: 'Celebrating 15 Years Of Samantha Promo | Apsara Awards 2025 | This Saturday at 5:30PM | Zee Telugu',
    image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748181934/5SK0jFVolHU-HD_za0gfe.jpg',
    link: 'https://youtu.be/5SK0jFVolHU?si=IHIkUwZ-McsgR9Bb',
    frameStyle: 'landscape'
  },
  {
    title: 'Samantha on health, stopping junk food ads...',
    date: 'April 10, 2025',
    excerpt: 'Samantha was one of the first people who supported me when I started Label Padhega India...',
    image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748182251/oeK3C-9cbVc-HD_qzprbm.jpg',
    link: 'https://youtu.be/oeK3C-9cbVc?si=dKNuBerq_MvuxsF_',
    frameStyle: 'landscape'
  }
] as const;

const VERIFIED_UPCOMING_PROJECTS: readonly HomeProject[] = [
  {
    title: 'Maa Inti Bangaram',
    type: 'Action Family Drama | Theatrical Film',
    releaseLabel: 'May 15, 2026',
    description: 'A female-led Telugu action-family drama set in the 1980s, centered on a newly married woman whose quiet domestic life hides a violent past and a secret mission.',
    creditsLabel: 'Directed by',
    credits: 'B. V. Nandini Reddy',
    cast: 'Samantha Ruth Prabhu, Gulshan Devaiah, Diganth, Gautami, Manjusha',
    image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1768338977/vdTawCMwiQs-HD_hz86rl.jpg'
  },
  {
    title: 'Rakt Brahmand: The Bloody Kingdom',
    type: 'Fantasy Action Adventure | Netflix Series',
    releaseLabel: 'Official release date not announced',
    description: 'Netflix has officially announced the series and platform, but not a premiere date yet. The project remains in production as Raj & DK’s large-scale fantasy period series.',
    creditsLabel: 'Created by / Directed by',
    credits: 'Raj & DK / Rahi Anil Barve',
    cast: 'Aditya Roy Kapur, Samantha Ruth Prabhu, Ali Fazal, Wamiqa Gabbi, Jaideep Ahlawat',
    image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122747/20240727_100042_wgs661.jpg'
  }
] as const;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NotificationBellComponent,
    BirthdayCountdownComponent,
    QuoteOfTheDayComponent,
    ThisDayHistoryComponent,
    InstagramFeedEmbedComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  currentSlide = 0;
  currentRole = 0;
  currentPerformanceSlide = 0;
  currentNewsSlide = 0;
  isMobileMenuOpen = false;
  isDarkMode = false;
  awardCount = 12;
  private readonly visibilityChangeHandler = () => this.handleVisibilityChange();

  private roleInterval?: ReturnType<typeof setInterval>;
  private slideInterval?: ReturnType<typeof setInterval>;
  private newsInterval?: ReturnType<typeof setInterval>;
  private galleryShuffleTimer?: ReturnType<typeof setTimeout>;
  private themeSubscription?: Subscription;

  private readonly CACHE_VERSION = 'v2';
  private readonly FEATURED_GALLERY_LIMIT = 8;
  private galleryStorySets: GalleryStorySet[] = [];

  readonly debutYear = 2010;
  performanceRange = DEFAULT_HOME_CONTENT.performanceRange;
  instagramSpotlight: HomeInstagramSpotlight = DEFAULT_HOME_CONTENT.instagramSpotlight;
  featureShowcaseImage: HomeFeatureShowcaseImage = DEFAULT_HOME_CONTENT.featureShowcaseImage;
  readonly heroNavItems = [
    { label: 'ABOUT ME', route: '/about' },
    { label: 'FILMOGRAPHY', route: '/filmography' },
    { label: 'AWARDS', route: '/awards' },
    { label: 'GALLERY', route: '/gallery' },
    { label: 'FAN ZONE', route: '/fan-zone' }
  ];

  readonly secondaryNavItems = [
    { label: 'Fashion', route: '/fashion' },
    { label: 'Philanthropy', route: '/philanthropy' },
    { label: 'Journal', route: '/journal' },
    { label: 'Wallpapers', route: '/wallpapers' },
    { label: 'Fan Wall', route: '/fan-wall' },
    { label: 'Press', route: '/media' }
  ];

  readonly mobileMenuItems = [
    ...this.heroNavItems,
    ...this.secondaryNavItems
  ];

  readonly socialLinks = [
    {
      name: 'Instagram',
      handle: '@samantharuthprabhuoffl',
      href: 'https://instagram.com/samantharuthprabhuoffl',
      icon: 'instagram'
    },
    {
      name: 'Twitter',
      handle: '@samanthaprabhu2',
      href: 'https://twitter.com/samanthaprabhu2',
      icon: 'twitter'
    },
    {
      name: 'Facebook',
      handle: 'SamanthaRuthPrabhuOffl',
      href: 'https://www.facebook.com/share/1BfbgU1yKq/',
      icon: 'facebook'
    },
    {
      name: 'YouTube',
      handle: 'Official Channel',
      href: 'https://youtube.com/@samanthaofficial?si=bqXC1Es5AkFHxBAV',
      icon: 'youtube'
    }
  ];

  roles = ['Actress', 'Icon', 'Philanthropist', 'Entrepreneur', 'Producer'];

  heroSlides: HeroSlide[] = [
    {
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008414/8F9A7087_koclpw.jpg?cache=v2',
      role: 'Actress',
      alt: 'Samantha Ruth Prabhu portrait'
    },
    {
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008413/PAND7159_k4qlvo.jpg?cache=v2',
      role: 'Icon',
      alt: 'Samantha Ruth Prabhu editorial portrait'
    },
    {
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg?cache=v2',
      role: 'Philanthropist',
      alt: 'Samantha Ruth Prabhu feature portrait'
    }
  ];

  performanceLayers: HomePerformanceLayer[] = DEFAULT_HOME_CONTENT.performanceLayers;
  keyFeatureCards: HomeFeatureCard[] = DEFAULT_HOME_CONTENT.keyFeatureCards;

  latestNews: HomeNewsItem[] = [];
  upcomingProjects: HomeProject[] = [];
  featuredGallery: HomeGalleryImage[] = [];
  galleryArchiveCount = 0;
  galleryCollectionCount = 0;
  isGalleryJumbling = false;
  tickerText = '';
  tickerLink = '';
  fallbackImage = 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg?cache=v2';

  constructor(private apiService: ApiService, private themeService: ThemeService) {
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });
  }

  get currentHeroSlide(): HeroSlide {
    return this.heroSlides[this.currentSlide] ?? this.heroSlides[0];
  }

  get featuredNews(): HomeNewsItem | null {
    return this.latestNews[0] ?? null;
  }

  get newsSlideCount(): number {
    return this.latestNews.length;
  }

  get secondaryNews(): HomeNewsItem[] {
    return this.latestNews.slice(1);
  }

  get leadProject(): HomeProject | null {
    return this.upcomingProjects[0] ?? null;
  }

  get performanceSlides(): HomePerformanceLayer[] {
    return this.performanceLayers;
  }

  get performanceSlideCount(): number {
    return this.performanceLayers.length;
  }

  get remainingProjects(): HomeProject[] {
    return this.upcomingProjects.slice(1);
  }

  get canJumbleGallery(): boolean {
    return this.galleryArchiveCount > 1;
  }

  get careerYears(): number {
    return Math.max(1, new Date().getFullYear() - this.debutYear);
  }

  ngOnInit(): void {
    this.startCarousels();
    this.loadHomepageContent();
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    }
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  ngOnDestroy(): void {
    this.stopCarousels();
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    }

    if (this.galleryShuffleTimer) {
      clearTimeout(this.galleryShuffleTimer);
    }

    this.themeSubscription?.unsubscribe();
    document.body.style.overflow = '';
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  onTickerClick(): void {
    if (!this.tickerLink) {
      return;
    }

    let url = this.tickerLink;
    if (!url.startsWith('http') && !url.startsWith('/')) {
      url = `https://${url}`;
    }

    if (url.startsWith('/')) {
      window.location.href = url;
      return;
    }

    window.open(url, '_blank', 'noopener');
  }

  goToPerformanceSlide(index: number): void {
    if (this.performanceSlideCount === 0) {
      this.currentPerformanceSlide = 0;
      return;
    }

    const normalizedIndex = ((index % this.performanceSlideCount) + this.performanceSlideCount) % this.performanceSlideCount;
    this.currentPerformanceSlide = normalizedIndex;
  }

  previousPerformanceSlide(): void {
    this.goToPerformanceSlide(this.currentPerformanceSlide - 1);
  }

  nextPerformanceSlide(): void {
    this.goToPerformanceSlide(this.currentPerformanceSlide + 1);
  }

  goToNewsSlide(index: number): void {
    if (this.newsSlideCount === 0) {
      this.currentNewsSlide = 0;
      return;
    }

    const normalizedIndex = ((index % this.newsSlideCount) + this.newsSlideCount) % this.newsSlideCount;
    this.currentNewsSlide = normalizedIndex;
  }

  previousNewsSlide(): void {
    this.goToNewsSlide(this.currentNewsSlide - 1);
  }

  nextNewsSlide(): void {
    this.goToNewsSlide(this.currentNewsSlide + 1);
  }

  jumbleFeaturedGallery(): void {
    if (!this.canJumbleGallery) {
      return;
    }

    if (this.galleryStorySets.length > 0) {
      this.featuredGallery = this.buildFeaturedGallerySelection(this.galleryStorySets);
    } else {
      this.featuredGallery = this.shuffleArray([...this.featuredGallery]);
    }

    this.triggerGalleryShuffleAnimation();
  }

  trackByFeaturedGallery(_: number, image: HomeGalleryImage): string {
    return image.key;
  }

  getFeaturedGalleryLinkParams(image: HomeGalleryImage): Record<string, string> {
    return image.collectionKey ? { collection: image.collectionKey } : {};
  }

  getFeaturedGalleryCta(image: HomeGalleryImage): string {
    return image.collectionCount > 1
      ? `Open ${image.collectionCount} photo collection`
      : 'Open in official gallery';
  }

  onFeaturedGalleryImageLoad(image: HomeGalleryImage, event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) {
      return;
    }

    const width = target.naturalWidth || target.width;
    const height = target.naturalHeight || target.height;
    if (!width || !height) {
      return;
    }

    const ratio = width / height;
    image.frameStyle = ratio >= 1.12
      ? 'landscape'
      : ratio <= 0.92
        ? 'portrait'
        : 'square';
  }

  onNewsImageLoad(item: HomeNewsItem, event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) {
      return;
    }

    const width = target.naturalWidth || target.width;
    const height = target.naturalHeight || target.height;
    if (!width || !height) {
      return;
    }

    const ratio = width / height;
    item.frameStyle = ratio >= 1.12
      ? 'landscape'
      : ratio <= 0.92
        ? 'portrait'
        : 'square';
  }

  private startCarousels(): void {
    if (!this.roleInterval) {
      this.roleInterval = setInterval(() => {
        if (this.roles.length === 0) {
          return;
        }

        this.currentRole = (this.currentRole + 1) % this.roles.length;
      }, 3200);
    }

    if (!this.slideInterval) {
      this.slideInterval = setInterval(() => {
        if (this.heroSlides.length === 0) {
          return;
        }

        this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
      }, 5200);
    }

    if (!this.newsInterval) {
      this.newsInterval = setInterval(() => {
        if (this.latestNews.length <= 1) {
          return;
        }

        this.currentNewsSlide = (this.currentNewsSlide + 1) % this.latestNews.length;
      }, 6800);
    }
  }

  private loadHomepageContent(): void {
    this.apiService.getPageContentWithMetadata<Partial<HomePageContent>>('home-page', true).subscribe({
      next: ({ content, updatedAt }) => {
        const contentVersion = this.resolvePageContentVersion(updatedAt);
        const merged = this.mergeEditorialContent(content, contentVersion);
        this.performanceRange = merged.performanceRange;
        this.instagramSpotlight = merged.instagramSpotlight;
        this.featureShowcaseImage = merged.featureShowcaseImage;
        this.performanceLayers = merged.performanceLayers;
        this.keyFeatureCards = merged.keyFeatureCards;
        this.currentPerformanceSlide = 0;
      },
      error: () => {}
    });

    this.apiService.getNews().subscribe(data => {
      this.latestNews = this.buildCurrentHighlights(data);
      this.currentNewsSlide = 0;
    });

    this.apiService.getMovies().subscribe(data => {
      this.upcomingProjects = this.buildUpcomingProjects(data);
    });

    combineLatest([
      this.apiService.getGalleryCollections(true),
      this.apiService.getMediaGalleries(true)
    ]).subscribe({
      next: ([collections, mediaItems]) => {
        this.syncFeaturedGallery(buildGalleryStorySets(collections, mediaItems), mediaItems);

        const dynamicHeroSlides = mediaItems.filter(item => item.type === 'Hero');
        if (dynamicHeroSlides.length > 0) {
          this.heroSlides = dynamicHeroSlides.map(item => ({
            image: this.getCacheBustedUrl(item.imageUrl),
            role: item.caption || 'Icon',
            alt: item.altText || 'Samantha Ruth Prabhu hero portrait'
          }));

          this.roles = this.heroSlides.map(item => item.role);
          this.currentSlide = 0;
          this.currentRole = 0;
        }
      },
      error: (error) => {
        console.error('Failed to sync homepage gallery with gallery story sets', error);
        this.syncFeaturedGallery(getFallbackGalleryStorySets(), []);
      }
    });

    this.apiService.getSettings().subscribe(settings => {
      const ticker = settings.find(item => item.key === 'latest_updates_text');
      const link = settings.find(item => item.key === 'latest_updates_link');

      this.tickerText = ticker?.value || '';
      this.tickerLink = link?.value || '';
    });

    this.apiService.getAwards().subscribe(awards => {
      if (awards.length > 0) {
        this.awardCount = awards.length;
      }
    });
  }

  private mergeEditorialContent(content: Partial<HomePageContent>, cacheVersion: string): HomePageContent {
    const instagramSpotlight = {
      ...DEFAULT_HOME_CONTENT.instagramSpotlight,
      ...(content.instagramSpotlight ?? {})
    };
    const featureShowcaseImage = {
      ...DEFAULT_HOME_CONTENT.featureShowcaseImage,
      ...(content.featureShowcaseImage ?? {})
    };

    return {
      ...DEFAULT_HOME_CONTENT,
      ...content,
      instagramSpotlight: {
        ...instagramSpotlight,
        image: this.getCacheBustedUrl(instagramSpotlight.image, cacheVersion)
      },
      featureShowcaseImage: {
        ...featureShowcaseImage,
        url: this.getCacheBustedUrl(featureShowcaseImage.url, cacheVersion)
      },
      performanceLayers: this.applyCacheBusting(content.performanceLayers ?? DEFAULT_HOME_CONTENT.performanceLayers, cacheVersion),
      keyFeatureCards: content.keyFeatureCards ?? DEFAULT_HOME_CONTENT.keyFeatureCards
    };
  }

  private resolvePageContentVersion(updatedAt?: string): string {
    return updatedAt?.trim() || this.CACHE_VERSION;
  }

  private getCacheBustedUrl(url: string, version: string = this.CACHE_VERSION): string {
    if (!url) {
      return url;
    }

    const normalizedUrl = this.normalizeHomepageAssetUrl(url);
    const [path, hashFragment] = normalizedUrl.split('#', 2);
    const withoutCache = path
      .replace(/([?&])cache=[^&]*&?/i, '$1')
      .replace(/[?&]$/, '');
    const separator = withoutCache.includes('?') ? '&' : '?';
    return `${withoutCache}${separator}cache=${encodeURIComponent(version)}${hashFragment ? `#${hashFragment}` : ''}`;
  }

  private normalizeHomepageAssetUrl(url: string): string {
    const apiOrigin = this.apiService.getApiBaseOrigin();
    if (!apiOrigin) {
      return url;
    }

    if (url.startsWith('/uploads/')) {
      return `${apiOrigin}${url}`;
    }

    try {
      const parsed = new URL(url);
      if ((parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') && parsed.pathname.startsWith('/uploads/')) {
        return `${apiOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
    } catch {
      return url;
    }

    return url;
  }

  private applyCacheBusting(layers: HomePerformanceLayer[], version: string): HomePerformanceLayer[] {
    return layers.map(layer => ({
      ...layer,
      image: this.getCacheBustedUrl(layer.image, version)
    }));
  }

  private buildUpcomingProjects(movies: Array<{ title: string; poster: string }>): HomeProject[] {
    const moviePosters = new Map(
      movies.map(movie => [this.normalizeTitle(movie.title), movie.poster])
    );

    return VERIFIED_UPCOMING_PROJECTS.map(project => ({
      ...project,
      image: this.getCacheBustedUrl(
        moviePosters.get(this.normalizeTitle(project.title)) || project.image
      )
    }));
  }

  private normalizeTitle(value: string): string {
    return value.trim().toLowerCase();
  }

  private parseNewsDate(dateLabel?: string): number {
    if (!dateLabel) {
      return 0;
    }

    const parsed = Date.parse(dateLabel);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private buildCurrentHighlights(
    items: Array<{ title: string; date?: string; excerpt: string; imageUrl?: string; link?: string }>
  ): HomeNewsItem[] {
    const curatedItems = items
      .filter(item => !this.isInstagramNewsItem(item))
      .map((item, index) => ({
        index,
        item: {
          title: item.title,
          date: item.date,
          excerpt: item.excerpt,
          image: this.getCacheBustedUrl(item.imageUrl || this.fallbackImage),
          link: item.link,
          frameStyle: 'landscape' as const
        }
      }))
      .sort((left, right) => {
        const dateDifference = this.parseNewsDate(right.item.date) - this.parseNewsDate(left.item.date);
        return dateDifference !== 0 ? dateDifference : left.index - right.index;
      })
      .map(entry => entry.item);

    if (curatedItems.length > 0) {
      return curatedItems;
    }

    return DEFAULT_CURRENT_HIGHLIGHTS.map(item => ({
      ...item,
      image: this.getCacheBustedUrl(item.image),
      frameStyle: 'landscape' as const
    }));
  }

  private isInstagramNewsItem(item: { title: string; excerpt: string; imageUrl?: string; link?: string }): boolean {
    const title = item.title.toLowerCase();
    const excerpt = item.excerpt.toLowerCase();
    const imageUrl = (item.imageUrl || '').toLowerCase();
    const link = (item.link || '').toLowerCase();

    return link.includes('instagram.com/')
      || imageUrl.includes('/instagram-highlights/')
      || title.includes('instagram')
      || excerpt.includes('instagram');
  }

  private syncFeaturedGallery(storySets: GalleryStorySet[], mediaItems: MediaGallery[]): void {
    this.galleryStorySets = storySets.filter(set => set.itemCount > 0);
    this.galleryCollectionCount = this.galleryStorySets.length;
    this.galleryArchiveCount = this.galleryStorySets.reduce((sum, set) => sum + set.itemCount, 0);

    if (this.galleryArchiveCount > 0) {
      this.featuredGallery = this.buildFeaturedGallerySelection(this.galleryStorySets);
      return;
    }

    this.featuredGallery = this.buildLegacyFeaturedGallery(mediaItems);
    this.galleryArchiveCount = this.featuredGallery.length;
    this.galleryCollectionCount = this.featuredGallery.length > 0 ? 1 : 0;
  }

  private buildFeaturedGallerySelection(storySets: GalleryStorySet[]): HomeGalleryImage[] {
    const availableSets = storySets.filter(set => set.images.length > 0);
    const selectionLimit = Math.min(
      this.FEATURED_GALLERY_LIMIT,
      availableSets.reduce((sum, set) => sum + set.images.length, 0)
    );

    if (selectionLimit === 0) {
      return [];
    }

    const leadImages = this.shuffleArray(
      availableSets
        .filter(set => !!set.leadImage)
        .map(set => this.mapStoryImageToFeaturedGallery(set, set.leadImage!))
    );
    const supportingImages = this.shuffleArray(
      availableSets.flatMap(set =>
        set.images
          .filter(image => image.id !== set.leadImage?.id)
          .map(image => this.mapStoryImageToFeaturedGallery(set, image))
      )
    );

    const selection: HomeGalleryImage[] = [];

    for (const image of leadImages) {
      if (selection.length >= selectionLimit) {
        break;
      }

      selection.push(image);
    }

    for (const image of supportingImages) {
      if (selection.length >= selectionLimit) {
        break;
      }

      if (selection.some(selected => selected.key === image.key)) {
        continue;
      }

      selection.push(image);
    }

    return this.shuffleArray(selection);
  }

  private mapStoryImageToFeaturedGallery(
    set: GalleryStorySet,
    image: GalleryStorySet['images'][number]
  ): HomeGalleryImage {
    return {
      key: `${set.key}-${image.id}`,
      url: this.getCacheBustedUrl(image.imageUrl),
      alt: image.altText || image.caption || `${set.title} gallery image`,
      caption: image.caption || set.title,
      collectionKey: set.key,
      collectionTitle: set.title,
      collectionCount: set.itemCount,
      accentTone: set.accentTone,
      frameStyle: 'portrait' as const
    };
  }

  private buildLegacyFeaturedGallery(mediaItems: MediaGallery[]): HomeGalleryImage[] {
    return this.shuffleArray(
      mediaItems
        .filter(item => (item.type || '').trim().toLowerCase() !== 'hero')
        .map((item, index) => ({
          key: `legacy-${item.id ?? index}`,
          url: this.getCacheBustedUrl(item.imageUrl),
          alt: item.altText || item.caption || 'Samantha Ruth Prabhu gallery image',
          caption: item.caption,
          collectionKey: item.collectionKey?.trim() || '',
          collectionTitle: item.collectionKey?.trim() ? this.formatCollectionLabel(item.collectionKey) : 'Official Gallery',
          collectionCount: 1,
          accentTone: '#d5b18c',
          frameStyle: 'portrait' as const
        }))
    ).slice(0, this.FEATURED_GALLERY_LIMIT);
  }

  private triggerGalleryShuffleAnimation(): void {
    this.isGalleryJumbling = false;

    if (this.galleryShuffleTimer) {
      clearTimeout(this.galleryShuffleTimer);
    }

    setTimeout(() => {
      this.isGalleryJumbling = true;
      this.galleryShuffleTimer = setTimeout(() => {
        this.isGalleryJumbling = false;
      }, 720);
    });
  }

  private formatCollectionLabel(value: string): string {
    return value
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, character => character.toUpperCase());
  }

  private shuffleArray<T>(items: T[]): T[] {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
  }

  private initAnimations(): void {
    gsap.from('.hero-frame', {
      duration: 1.1,
      opacity: 0,
      y: 24,
      ease: 'power3.out'
    });

    gsap.from('.hero-copy > *', {
      duration: 1,
      opacity: 0,
      y: 24,
      stagger: 0.12,
      delay: 0.25,
      ease: 'power3.out'
    });

    gsap.from('.hero-stat', {
      duration: 0.9,
      opacity: 0,
      x: 18,
      stagger: 0.1,
      delay: 0.45,
      ease: 'power3.out'
    });

    gsap.from('.update-rail', {
      duration: 0.8,
      opacity: 0,
      y: 18,
      delay: 0.6,
      ease: 'power3.out'
    });
  }

  private stopCarousels(): void {
    if (this.roleInterval) {
      clearInterval(this.roleInterval);
      this.roleInterval = undefined;
    }

    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = undefined;
    }

    if (this.newsInterval) {
      clearInterval(this.newsInterval);
      this.newsInterval = undefined;
    }
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.stopCarousels();
      return;
    }

    this.startCarousels();
  }
}
