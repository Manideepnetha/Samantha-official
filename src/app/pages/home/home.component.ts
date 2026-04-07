import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ApiService } from '../../services/api.service';

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
}

interface HomeProject {
  title: string;
  type: string;
  releaseDate?: string;
  description: string;
  director: string;
  image: string;
}

interface HomeGalleryImage {
  url: string;
  alt: string;
  caption: string;
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
    url: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg',
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
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008414/8F9A7087_koclpw.jpg',
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
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008413/PAND7159_k4qlvo.jpg',
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
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg',
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
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748010072/8F9A7985_m86vsc.jpg',
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
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748011805/8F9A6978_1_jd2efv.jpg',
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
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg',
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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  currentSlide = 0;
  currentRole = 0;
  isMobileMenuOpen = false;
  awardCount = 12;

  private roleInterval?: ReturnType<typeof setInterval>;
  private slideInterval?: ReturnType<typeof setInterval>;

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
    { label: 'Blog', route: '/blog' },
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
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008414/8F9A7087_koclpw.jpg',
      role: 'Actress',
      alt: 'Samantha Ruth Prabhu portrait'
    },
    {
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008413/PAND7159_k4qlvo.jpg',
      role: 'Icon',
      alt: 'Samantha Ruth Prabhu editorial portrait'
    },
    {
      image: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg',
      role: 'Philanthropist',
      alt: 'Samantha Ruth Prabhu feature portrait'
    }
  ];

  performanceLayers: HomePerformanceLayer[] = DEFAULT_HOME_CONTENT.performanceLayers;
  keyFeatureCards: HomeFeatureCard[] = DEFAULT_HOME_CONTENT.keyFeatureCards;

  latestNews: HomeNewsItem[] = [];
  upcomingProjects: HomeProject[] = [];
  featuredGallery: HomeGalleryImage[] = [];
  tickerText = '';
  tickerLink = '';

  constructor(private apiService: ApiService) { }

  get currentHeroSlide(): HeroSlide {
    return this.heroSlides[this.currentSlide] ?? this.heroSlides[0];
  }

  get featuredNews(): HomeNewsItem | null {
    return this.latestNews[0] ?? null;
  }

  get secondaryNews(): HomeNewsItem[] {
    return this.latestNews.slice(1);
  }

  get leadProject(): HomeProject | null {
    return this.upcomingProjects[0] ?? null;
  }

  get remainingProjects(): HomeProject[] {
    return this.upcomingProjects.slice(1);
  }

  get careerYears(): number {
    return Math.max(1, new Date().getFullYear() - this.debutYear);
  }

  ngOnInit(): void {
    this.startCarousels();
    this.loadHomepageContent();
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  ngOnDestroy(): void {
    if (this.roleInterval) {
      clearInterval(this.roleInterval);
    }

    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }

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

  private startCarousels(): void {
    this.roleInterval = setInterval(() => {
      if (this.roles.length === 0) {
        return;
      }

      this.currentRole = (this.currentRole + 1) % this.roles.length;
    }, 3200);

    this.slideInterval = setInterval(() => {
      if (this.heroSlides.length === 0) {
        return;
      }

      this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
    }, 5200);
  }

  private loadHomepageContent(): void {
    this.apiService.getPageContent<Partial<HomePageContent>>('home-page').subscribe({
      next: (content) => {
        const merged = this.mergeEditorialContent(content);
        this.performanceRange = merged.performanceRange;
        this.instagramSpotlight = merged.instagramSpotlight;
        this.featureShowcaseImage = merged.featureShowcaseImage;
        this.performanceLayers = merged.performanceLayers;
        this.keyFeatureCards = merged.keyFeatureCards;
      },
      error: () => {}
    });

    this.apiService.getNews().subscribe(data => {
      this.latestNews = data.map(item => ({
        title: item.title,
        date: item.date,
        excerpt: item.excerpt,
        image: item.imageUrl || 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748181752/1KBvNGVxuMg-HD_gvqzhe.jpg',
        link: item.link
      }));
    });

    this.apiService.getMovies().subscribe(data => {
      this.upcomingProjects = data
        .filter(movie => movie.year >= 2025)
        .map(movie => ({
          title: movie.title,
          type: movie.genre?.[0] || 'Feature Film',
          releaseDate: movie.releaseDate,
          description: movie.description,
          director: movie.director,
          image: movie.title.toLowerCase().includes('bangaram')
            ? 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1768338977/vdTawCMwiQs-HD_hz86rl.jpg'
            : (movie.poster || 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748010072/8F9A7985_m86vsc.jpg')
        }));
    });

    this.apiService.getMediaGalleries().subscribe(data => {
      const nonHeroGallery = data.filter(item => !item.type || item.type === 'Home');
      const featuredGallery = nonHeroGallery.length > 0
        ? nonHeroGallery
        : data.filter(item => item.type !== 'Hero');

      this.featuredGallery = featuredGallery.map(item => ({
        url: item.imageUrl,
        alt: item.altText || item.caption || 'Samantha Ruth Prabhu gallery image',
        caption: item.caption
      }));

      const dynamicHeroSlides = data.filter(item => item.type === 'Hero');
      if (dynamicHeroSlides.length > 0) {
        this.heroSlides = dynamicHeroSlides.map(item => ({
          image: item.imageUrl,
          role: item.caption || 'Icon',
          alt: item.altText || 'Samantha Ruth Prabhu hero portrait'
        }));

        this.roles = this.heroSlides.map(item => item.role);
        this.currentSlide = 0;
        this.currentRole = 0;
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

  private mergeEditorialContent(content: Partial<HomePageContent>): HomePageContent {
    return {
      ...DEFAULT_HOME_CONTENT,
      ...content,
      instagramSpotlight: {
        ...DEFAULT_HOME_CONTENT.instagramSpotlight,
        ...(content.instagramSpotlight ?? {})
      },
      featureShowcaseImage: {
        ...DEFAULT_HOME_CONTENT.featureShowcaseImage,
        ...(content.featureShowcaseImage ?? {})
      },
      performanceLayers: content.performanceLayers ?? DEFAULT_HOME_CONTENT.performanceLayers,
      keyFeatureCards: content.keyFeatureCards ?? DEFAULT_HOME_CONTENT.keyFeatureCards
    };
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
}
