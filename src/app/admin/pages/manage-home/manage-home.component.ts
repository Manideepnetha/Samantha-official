import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService, MediaGallery, Movie, NewsArticle, UploadedMediaAsset } from '../../../services/api.service';
import { AdminImageUploadFieldComponent } from '../../components/admin-image-upload-field/admin-image-upload-field.component';

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

interface HomeEditorialContent {
  performanceRange: string;
  instagramSpotlight: HomeInstagramSpotlight;
  featureShowcaseImage: HomeFeatureShowcaseImage;
  performanceLayers: HomePerformanceLayer[];
  keyFeatureCards: HomeFeatureCard[];
}

const DEFAULT_EDITORIAL_CONTENT: HomeEditorialContent = {
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
    }
  ],
  keyFeatureCards: [
    {
      title: 'Award-Winning Range',
      eyebrow: 'Four Filmfare Awards South',
      description: 'Four Filmfare Awards South and recognition across commercial and critically acclaimed work.',
      icon: 'award'
    },
    {
      title: 'Purpose Beyond Cinema',
      eyebrow: 'Pratyusha Support foundation',
      description: 'A public-facing philanthropy story built around support for women and children.',
      icon: 'heart'
    }
  ]
};

@Component({
  selector: 'app-manage-home',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminImageUploadFieldComponent],
  template: `
    <div class="sr-admin-page">
      <div class="sr-admin-page-header">
        <div>
          <span class="sr-kicker">Homepage</span>
          <h1 class="sr-admin-title">Manage Home Screen</h1>
          <p class="sr-admin-subtitle">Manage the homepage collections and the editorial sections that were previously missing from the admin panel.</p>
        </div>
      </div>

      <div class="sr-tabbar">
        <button *ngFor="let tab of tabs" (click)="activeTab = tab" [class.is-active]="activeTab === tab" class="sr-tab">
          {{ tab }}
        </button>
      </div>

      <section *ngIf="activeTab === 'Hero Slides'" class="sr-surface p-6 md:p-7">
        <div class="sr-admin-toolbar">
          <div>
            <span class="sr-kicker">Hero</span>
            <h2 class="sr-card-title mt-2">Hero Slides</h2>
          </div>
          <button (click)="resetHeroForm()" class="sr-button">New Slide</button>
        </div>
        <div class="sr-admin-table-scroll mt-6">
          <table class="sr-admin-table">
            <thead><tr><th>Image</th><th>Role Text</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let slide of heroSlides">
                <td><img [src]="slide.imageUrl" class="sr-admin-thumb" alt="Slide"></td>
                <td class="sr-admin-title-cell">{{ slide.caption }}</td>
                <td><div class="sr-admin-actions"><button (click)="editHero(slide)" class="sr-admin-action">Edit</button><button (click)="deleteGallery(slide.id!)" class="sr-admin-action-danger">Delete</button></div></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <input [(ngModel)]="heroItem.caption" class="sr-input" placeholder="Role text">
          <button (click)="saveHero()" class="sr-button">{{ heroItem.id ? 'Update Slide' : 'Save Slide' }}</button>
        </div>
        <div class="mt-4">
          <app-admin-image-upload-field
            label="Hero Image"
            [value]="heroItem.imageUrl"
            (valueChange)="heroItem.imageUrl = $event"
            (uploadCompleted)="persistEditedHeroImage()"
            placeholder="Hero image URL"
            uploadButtonLabel="Upload Hero Image"
            bulkButtonLabel="Bulk Upload Slides"
            helperText="Bulk upload creates one hero slide per file using the filename as the role text."
            uploadFolder="home/hero"
            [allowBulk]="true"
            previewAlt="Hero slide preview"
            (bulkUploaded)="handleHeroBulkUpload($event)">
          </app-admin-image-upload-field>
        </div>
      </section>

      <section *ngIf="activeTab === 'Highlights'" class="sr-surface p-6 md:p-7">
        <div class="sr-admin-toolbar">
          <div>
            <span class="sr-kicker">Highlights</span>
            <h2 class="sr-card-title mt-2">Homepage Highlights</h2>
          </div>
          <button (click)="resetNewsForm()" class="sr-button">New Highlight</button>
        </div>
        <div class="sr-admin-table-scroll mt-6">
          <table class="sr-admin-table">
            <thead><tr><th>Title</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let news of newsList">
                <td class="sr-admin-title-cell">{{ news.title }}</td>
                <td>{{ news.date }}</td>
                <td><div class="sr-admin-actions"><button (click)="editNews(news)" class="sr-admin-action">Edit</button><button (click)="deleteNews(news.id!)" class="sr-admin-action-danger">Delete</button></div></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-6 space-y-4">
          <input [(ngModel)]="newsItem.title" class="sr-input" placeholder="Title">
          <input [(ngModel)]="newsItem.date" class="sr-input" placeholder="May 15, 2025">
          <textarea [(ngModel)]="newsItem.excerpt" rows="4" class="sr-textarea" placeholder="Excerpt"></textarea>
          <app-admin-image-upload-field
            label="Highlight Image"
            [value]="newsItem.imageUrl || ''"
            (valueChange)="newsItem.imageUrl = $event"
            (uploadCompleted)="persistEditedHomeHighlightImage()"
            placeholder="Image URL"
            uploadButtonLabel="Upload Highlight Image"
            uploadFolder="home/highlights"
            previewAlt="Highlight preview">
          </app-admin-image-upload-field>
          <input [(ngModel)]="newsItem.link" class="sr-input" placeholder="Link URL">
          <button (click)="saveNews()" class="sr-button">{{ newsItem.id ? 'Update Highlight' : 'Save Highlight' }}</button>
        </div>
      </section>

      <section *ngIf="activeTab === 'Upcoming Projects'" class="sr-surface p-6 md:p-7">
        <div class="sr-admin-toolbar">
          <div>
            <span class="sr-kicker">Projects</span>
            <h2 class="sr-card-title mt-2">Upcoming Projects</h2>
          </div>
          <button (click)="resetMovieForm()" class="sr-button">New Project</button>
        </div>
        <div class="sr-admin-table-scroll mt-6">
          <table class="sr-admin-table">
            <thead><tr><th>Title</th><th>Year</th><th>Director</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let movie of upcomingMovies">
                <td class="sr-admin-title-cell">{{ movie.title }}</td>
                <td>{{ movie.year }}</td>
                <td>{{ movie.director }}</td>
                <td><div class="sr-admin-actions"><button (click)="editMovie(movie)" class="sr-admin-action">Edit</button><button (click)="deleteMovie(movie.id)" class="sr-admin-action-danger">Delete</button></div></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-6 space-y-4">
          <input [(ngModel)]="movieItem.title" class="sr-input" placeholder="Title">
          <div class="grid gap-4 md:grid-cols-2">
            <input [(ngModel)]="movieItem.year" type="number" class="sr-input" placeholder="Year">
            <input [(ngModel)]="movieItem.director" class="sr-input" placeholder="Director">
          </div>
          <textarea [(ngModel)]="movieItem.description" rows="4" class="sr-textarea" placeholder="Description"></textarea>
          <app-admin-image-upload-field
            label="Poster Image"
            [value]="movieItem.poster"
            (valueChange)="movieItem.poster = $event"
            (uploadCompleted)="persistEditedHomeProjectPoster()"
            placeholder="Poster URL"
            uploadButtonLabel="Upload Poster"
            uploadFolder="home/projects"
            previewAlt="Project poster preview"
            previewClass="sr-admin-thumb is-poster h-48 w-32">
          </app-admin-image-upload-field>
          <button (click)="saveMovie()" class="sr-button">{{ movieItem.id ? 'Update Project' : 'Save Project' }}</button>
        </div>
      </section>

      <section *ngIf="activeTab === 'Featured Gallery'" class="sr-surface p-6 md:p-7">
        <div class="sr-admin-toolbar">
          <div>
            <span class="sr-kicker">Gallery</span>
            <h2 class="sr-card-title mt-2">Featured Gallery</h2>
          </div>
          <button (click)="resetGalleryForm()" class="sr-button">New Image</button>
        </div>
        <div class="sr-admin-table-scroll mt-6">
          <table class="sr-admin-table">
            <thead><tr><th>Caption</th><th>Type</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let media of galleryList">
                <td class="sr-admin-title-cell">{{ media.caption }}</td>
                <td>{{ media.type }}</td>
                <td><div class="sr-admin-actions"><button (click)="editGallery(media)" class="sr-admin-action">Edit</button><button (click)="deleteGallery(media.id!)" class="sr-admin-action-danger">Delete</button></div></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-6 space-y-4">
          <input [(ngModel)]="galleryItem.caption" class="sr-input" placeholder="Caption">
          <app-admin-image-upload-field
            label="Featured Image"
            [value]="galleryItem.imageUrl"
            (valueChange)="galleryItem.imageUrl = $event"
            (uploadCompleted)="persistEditedFeaturedGalleryImage()"
            placeholder="Image URL"
            uploadButtonLabel="Upload Image"
            bulkButtonLabel="Bulk Upload Images"
            helperText="Bulk upload creates one featured gallery item per file using the filename as the caption."
            uploadFolder="home/featured-gallery"
            [allowBulk]="true"
            previewAlt="Featured gallery preview"
            (bulkUploaded)="handleFeaturedGalleryBulkUpload($event)">
          </app-admin-image-upload-field>
          <select [(ngModel)]="galleryItem.type" class="sr-select"><option value="Home">Home</option><option value="General">General</option></select>
          <button (click)="saveGallery()" class="sr-button">{{ galleryItem.id ? 'Update Image' : 'Save Image' }}</button>
        </div>
      </section>

      <section *ngIf="activeTab === 'Main Roles'" class="sr-surface p-6 md:p-7">
        <div class="sr-admin-toolbar">
          <div><span class="sr-kicker">Main Roles</span><h2 class="sr-card-title mt-2">Performance Layers</h2></div>
          <button (click)="saveMainRolesSection()" class="sr-button">
            {{ editingPerformanceIndex === null ? 'Save Section' : 'Apply Edit & Save Section' }}
          </button>
        </div>
        <p class="sr-card-text mt-4">
          {{ editingPerformanceIndex === null
            ? 'Use the form below to add a new role. To replace an existing role image, click Edit on that row first.'
            : 'You are editing an existing role. Upload the new image and click Update Role or Apply Edit & Save Section.' }}
        </p>
        <input [(ngModel)]="editorialContent.performanceRange" class="sr-input mt-6" placeholder="Career range">
        <div class="sr-admin-table-scroll mt-6">
          <table class="sr-admin-table">
            <thead><tr><th>Year</th><th>Title</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let layer of editorialContent.performanceLayers; let i = index">
                <td>{{ layer.year }}</td>
                <td class="sr-admin-title-cell">{{ layer.title }}</td>
                <td>{{ layer.role }}</td>
                <td><div class="sr-admin-actions"><button (click)="editPerformanceLayer(i)" class="sr-admin-action">Edit</button><button (click)="deletePerformanceLayer(i)" class="sr-admin-action-danger">Delete</button></div></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-6 space-y-4">
          <div class="grid gap-4 md:grid-cols-2">
            <input [(ngModel)]="performanceLayerForm.year" class="sr-input" placeholder="Year">
            <input [(ngModel)]="performanceLayerForm.role" class="sr-input" placeholder="Role">
          </div>
          <input [(ngModel)]="performanceLayerForm.title" class="sr-input" placeholder="Title">
          <input [(ngModel)]="performanceLayerForm.meta" class="sr-input" placeholder="Meta">
          <textarea [(ngModel)]="performanceLayerForm.description" rows="4" class="sr-textarea" placeholder="Description"></textarea>
          <textarea [(ngModel)]="performanceHighlightsText" rows="4" class="sr-textarea" placeholder="One highlight per line"></textarea>
          <app-admin-image-upload-field
            label="Role Image"
            [value]="performanceLayerForm.image"
            (valueChange)="performanceLayerForm.image = $event"
            (uploadCompleted)="persistEditedPerformanceLayerImage()"
            placeholder="Image URL"
            uploadButtonLabel="Upload Role Image"
            uploadFolder="home/main-roles"
            previewAlt="Role image preview">
          </app-admin-image-upload-field>
          <input [(ngModel)]="performanceLayerForm.imageAlt" class="sr-input" placeholder="Image alt text">
          <input [(ngModel)]="performanceLayerForm.imagePosition" class="sr-input" placeholder="Image position">
          <button (click)="savePerformanceLayer()" class="sr-button">{{ editingPerformanceIndex === null ? 'Add Role' : 'Update Role' }}</button>
        </div>
      </section>

      <section *ngIf="activeTab === 'Key Aspects'" class="sr-surface p-6 md:p-7">
        <div class="sr-admin-toolbar">
          <div><span class="sr-kicker">Key Aspects</span><h2 class="sr-card-title mt-2">Highlighting Key Aspects</h2></div>
          <button (click)="saveKeyAspectsSection()" class="sr-button">
            {{ editingFeatureCardIndex === null ? 'Save Section' : 'Apply Edit & Save Section' }}
          </button>
        </div>
        <div class="mt-6 grid gap-6 lg:grid-cols-2">
          <div class="space-y-4">
            <input [(ngModel)]="editorialContent.instagramSpotlight.title" class="sr-input" placeholder="Spotlight title">
            <textarea [(ngModel)]="editorialContent.instagramSpotlight.description" rows="4" class="sr-textarea" placeholder="Spotlight description"></textarea>
            <input [(ngModel)]="editorialContent.instagramSpotlight.handle" class="sr-input" placeholder="Handle">
            <input [(ngModel)]="editorialContent.instagramSpotlight.href" class="sr-input" placeholder="Spotlight link">
            <app-admin-image-upload-field
              label="Spotlight Image"
              [value]="editorialContent.instagramSpotlight.image"
              (valueChange)="editorialContent.instagramSpotlight.image = $event"
              (uploadCompleted)="persistInstagramSpotlightImage()"
              placeholder="Spotlight image URL"
              uploadButtonLabel="Upload Spotlight Image"
              uploadFolder="home/key-aspects"
              previewAlt="Instagram spotlight preview">
            </app-admin-image-upload-field>
          </div>
          <div class="space-y-4">
            <app-admin-image-upload-field
              label="Showcase Image"
              [value]="editorialContent.featureShowcaseImage.url"
              (valueChange)="editorialContent.featureShowcaseImage.url = $event"
              (uploadCompleted)="persistFeatureShowcaseImage()"
              placeholder="Showcase image URL"
              uploadButtonLabel="Upload Showcase Image"
              uploadFolder="home/key-aspects"
              previewAlt="Feature showcase preview">
            </app-admin-image-upload-field>
            <input [(ngModel)]="editorialContent.featureShowcaseImage.alt" class="sr-input" placeholder="Showcase alt text">
            <textarea [(ngModel)]="editorialContent.featureShowcaseImage.caption" rows="4" class="sr-textarea" placeholder="Showcase caption"></textarea>
          </div>
        </div>
        <div class="sr-admin-table-scroll mt-6">
          <table class="sr-admin-table">
            <thead><tr><th>Title</th><th>Eyebrow</th><th>Icon</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let card of editorialContent.keyFeatureCards; let i = index">
                <td class="sr-admin-title-cell">{{ card.title }}</td>
                <td>{{ card.eyebrow }}</td>
                <td>{{ card.icon }}</td>
                <td><div class="sr-admin-actions"><button (click)="editFeatureCard(i)" class="sr-admin-action">Edit</button><button (click)="deleteFeatureCard(i)" class="sr-admin-action-danger">Delete</button></div></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-6 space-y-4">
          <input [(ngModel)]="featureCardForm.title" class="sr-input" placeholder="Card title">
          <input [(ngModel)]="featureCardForm.eyebrow" class="sr-input" placeholder="Card eyebrow">
          <textarea [(ngModel)]="featureCardForm.description" rows="4" class="sr-textarea" placeholder="Card description"></textarea>
          <select [(ngModel)]="featureCardForm.icon" class="sr-select"><option value="award">award</option><option value="screen">screen</option><option value="heart">heart</option><option value="spark">spark</option></select>
          <button (click)="saveFeatureCard()" class="sr-button">{{ editingFeatureCardIndex === null ? 'Add Card' : 'Update Card' }}</button>
        </div>
      </section>

      <div *ngIf="editorialMessage || editorialError" class="sr-admin-note mt-6">
        <p *ngIf="editorialMessage">{{ editorialMessage }}</p>
        <p *ngIf="editorialError" class="text-[#f4aaa0]">{{ editorialError }}</p>
      </div>
    </div>
  `,
  styles: []
})
export class ManageHomeComponent implements OnInit {
  tabs = ['Hero Slides', 'Highlights', 'Upcoming Projects', 'Featured Gallery', 'Main Roles', 'Key Aspects'];
  activeTab = 'Hero Slides';

  heroSlides: MediaGallery[] = [];
  newsList: NewsArticle[] = [];
  upcomingMovies: Movie[] = [];
  galleryList: MediaGallery[] = [];

  heroItem: MediaGallery = this.getEmptyGallery('Hero');
  newsItem: NewsArticle = this.getEmptyNews();
  movieItem: Movie = this.getEmptyMovie();
  galleryItem: MediaGallery = this.getEmptyGallery('Home');

  homePageContent: Record<string, unknown> = {};
  editorialContent: HomeEditorialContent = this.getDefaultEditorialContent();
  performanceLayerForm: HomePerformanceLayer = this.getEmptyPerformanceLayer();
  performanceHighlightsText = '';
  featureCardForm: HomeFeatureCard = this.getEmptyFeatureCard();
  editingPerformanceIndex: number | null = null;
  editingFeatureCardIndex: number | null = null;
  editorialMessage = '';
  editorialError = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.apiService.getNews().subscribe(data => this.newsList = data);
    this.apiService.getMovies().subscribe(data => this.upcomingMovies = data.filter(movie => movie.year >= 2025));
    this.apiService.getMediaGalleries().subscribe(data => {
      this.heroSlides = data.filter(item => item.type === 'Hero');
      this.galleryList = data.filter(item => item.type === 'Home');
    });
    this.loadEditorialContent();
  }

  loadEditorialContent(): void {
    this.apiService.getPageContent<Record<string, unknown>>('home-page', true).subscribe({
      next: (content) => {
        this.homePageContent = content ?? {};
        this.editorialContent = this.mergeEditorialContent(content ?? {});
      },
      error: () => {
        this.homePageContent = {};
        this.editorialContent = this.getDefaultEditorialContent();
      }
    });
  }

  saveEditorialContent(successMessage: string): void {
    const payload = {
      ...this.homePageContent,
      performanceRange: this.editorialContent.performanceRange,
      instagramSpotlight: { ...this.editorialContent.instagramSpotlight },
      featureShowcaseImage: { ...this.editorialContent.featureShowcaseImage },
      performanceLayers: this.editorialContent.performanceLayers.map(layer => ({ ...layer, highlights: [...layer.highlights] })),
      keyFeatureCards: this.editorialContent.keyFeatureCards.map(card => ({ ...card }))
    };

    this.editorialMessage = '';
    this.editorialError = '';

    this.apiService.upsertPageContent('home-page', payload).subscribe({
      next: () => {
        this.homePageContent = payload;
        this.editorialMessage = successMessage;
      },
      error: (err) => {
        console.error('Failed to save homepage editorial content', err);
        this.editorialError = 'Unable to save homepage editorial content right now.';
      }
    });
  }

  saveMainRolesSection(): void {
    if (this.editingPerformanceIndex !== null) {
      this.applyPerformanceLayerEdit();
    }

    this.saveEditorialContent('Main roles updated.');
  }

  saveKeyAspectsSection(): void {
    if (this.editingFeatureCardIndex !== null) {
      this.applyFeatureCardEdit();
    }

    this.saveEditorialContent('Key aspects updated.');
  }

  persistInstagramSpotlightImage(): void {
    this.saveEditorialContent('Key aspects updated.');
  }

  persistFeatureShowcaseImage(): void {
    this.saveEditorialContent('Key aspects updated.');
  }

  resetHeroForm(): void {
    this.heroItem = this.getEmptyGallery('Hero');
  }

  editHero(item: MediaGallery): void {
    this.heroItem = { ...item };
  }

  handleHeroBulkUpload(assets: UploadedMediaAsset[]): void {
    if (assets.length === 0) {
      return;
    }

    const requests = assets.map(asset => {
      const caption = this.formatUploadLabel(asset.fileName);
      return this.apiService.createMediaGallery({
        caption,
        imageUrl: asset.url,
        type: 'Hero',
        altText: caption
      });
    });

    forkJoin(requests).subscribe({
      next: () => {
        this.loadAll();
        this.resetHeroForm();
        alert(`${assets.length} hero slide${assets.length === 1 ? '' : 's'} uploaded successfully.`);
      },
      error: (error) => {
        console.error('Failed to save hero slides after upload', error);
        alert('Some hero slides could not be saved.');
      }
    });
  }

  saveHero(): void {
    if (this.heroItem.id) {
      this.apiService.updateMediaGallery(this.heroItem.id, this.heroItem).subscribe(() => {
        this.loadAll();
        this.resetHeroForm();
      });
      return;
    }

    this.apiService.createMediaGallery(this.heroItem).subscribe(() => {
      this.loadAll();
      this.resetHeroForm();
    });
  }

  persistEditedHeroImage(): void {
    if (!this.heroItem.id || !this.heroItem.caption.trim()) {
      return;
    }

    this.apiService.updateMediaGallery(this.heroItem.id, this.heroItem).subscribe({
      next: () => this.loadAll(),
      error: (error) => {
        console.error('Failed to auto-save uploaded hero image', error);
        alert('The hero image uploaded, but the slide was not saved automatically. Please click Update Slide.');
      }
    });
  }

  resetNewsForm(): void {
    this.newsItem = this.getEmptyNews();
  }

  editNews(item: NewsArticle): void {
    this.newsItem = { ...item };
  }

  saveNews(): void {
    if (this.newsItem.id) {
      this.apiService.updateNews(this.newsItem.id, this.newsItem).subscribe(() => {
        this.loadAll();
        this.resetNewsForm();
      });
      return;
    }

    this.apiService.createNews(this.newsItem).subscribe(() => {
      this.loadAll();
      this.resetNewsForm();
    });
  }

  persistEditedHomeHighlightImage(): void {
    if (!this.newsItem.id || !this.newsItem.title.trim()) {
      return;
    }

    this.apiService.updateNews(this.newsItem.id, this.newsItem).subscribe({
      next: () => this.loadAll(),
      error: (error) => {
        console.error('Failed to auto-save uploaded homepage highlight image', error);
        alert('The image uploaded, but the highlight was not saved automatically. Please click Update Highlight.');
      }
    });
  }

  deleteNews(id: number): void {
    if (confirm('Delete this highlight?')) {
      this.apiService.deleteNews(id).subscribe(() => this.loadAll());
    }
  }

  resetMovieForm(): void {
    this.movieItem = this.getEmptyMovie();
  }

  editMovie(item: Movie): void {
    this.movieItem = JSON.parse(JSON.stringify(item));
  }

  saveMovie(): void {
    if (this.movieItem.id) {
      this.apiService.updateMovie(this.movieItem.id, this.movieItem).subscribe(() => {
        this.loadAll();
        this.resetMovieForm();
      });
      return;
    }

    this.apiService.createMovie(this.movieItem).subscribe(() => {
      this.loadAll();
      this.resetMovieForm();
    });
  }

  persistEditedHomeProjectPoster(): void {
    if (!this.movieItem.id || !this.movieItem.title.trim()) {
      return;
    }

    this.apiService.updateMovie(this.movieItem.id, this.movieItem).subscribe({
      next: () => this.loadAll(),
      error: (error) => {
        console.error('Failed to auto-save uploaded homepage project poster', error);
        alert('The poster uploaded, but the project was not saved automatically. Please click Update Project.');
      }
    });
  }

  deleteMovie(id: number): void {
    if (confirm('Delete this project?')) {
      this.apiService.deleteMovie(id).subscribe(() => this.loadAll());
    }
  }

  resetGalleryForm(): void {
    this.galleryItem = this.getEmptyGallery('Home');
  }

  editGallery(item: MediaGallery): void {
    this.galleryItem = { ...item };
  }

  handleFeaturedGalleryBulkUpload(assets: UploadedMediaAsset[]): void {
    if (assets.length === 0) {
      return;
    }

    const type = this.galleryItem.type || 'Home';
    const requests = assets.map(asset => {
      const caption = this.formatUploadLabel(asset.fileName);
      return this.apiService.createMediaGallery({
        caption,
        imageUrl: asset.url,
        type,
        altText: caption
      });
    });

    forkJoin(requests).subscribe({
      next: () => {
        this.loadAll();
        this.resetGalleryForm();
        alert(`${assets.length} featured image${assets.length === 1 ? '' : 's'} uploaded successfully.`);
      },
      error: (error) => {
        console.error('Failed to save featured gallery uploads', error);
        alert('Some featured gallery images could not be saved.');
      }
    });
  }

  saveGallery(): void {
    if (this.galleryItem.id) {
      this.apiService.updateMediaGallery(this.galleryItem.id, this.galleryItem).subscribe(() => {
        this.loadAll();
        this.resetGalleryForm();
      });
      return;
    }

    this.apiService.createMediaGallery(this.galleryItem).subscribe(() => {
      this.loadAll();
      this.resetGalleryForm();
    });
  }

  persistEditedFeaturedGalleryImage(): void {
    if (!this.galleryItem.id || !this.galleryItem.caption.trim()) {
      return;
    }

    this.apiService.updateMediaGallery(this.galleryItem.id, this.galleryItem).subscribe({
      next: () => this.loadAll(),
      error: (error) => {
        console.error('Failed to auto-save uploaded featured gallery image', error);
        alert('The image uploaded, but the gallery entry was not saved automatically. Please click Update Image.');
      }
    });
  }

  deleteGallery(id: number): void {
    if (confirm('Delete this image?')) {
      this.apiService.deleteMediaGallery(id).subscribe(() => this.loadAll());
    }
  }

  editPerformanceLayer(index: number): void {
    const layer = this.editorialContent.performanceLayers[index];
    this.performanceLayerForm = { ...layer, highlights: [...layer.highlights] };
    this.performanceHighlightsText = layer.highlights.join('\n');
    this.editingPerformanceIndex = index;
  }

  persistEditedPerformanceLayerImage(): void {
    if (this.editingPerformanceIndex === null) {
      return;
    }

    const layer = this.buildPerformanceLayerFromForm();
    this.editorialContent.performanceLayers = this.editorialContent.performanceLayers.map((item, index) =>
      index === this.editingPerformanceIndex ? layer : item
    );
    this.saveEditorialContent('Main roles updated.');
  }

  savePerformanceLayer(): void {
    const layer = this.buildPerformanceLayerFromForm();

    if (this.editingPerformanceIndex === null) {
      this.editorialContent.performanceLayers = [...this.editorialContent.performanceLayers, layer];
    } else {
      this.editorialContent.performanceLayers = this.editorialContent.performanceLayers.map((item, index) => index === this.editingPerformanceIndex ? layer : item);
    }

    this.performanceLayerForm = this.getEmptyPerformanceLayer();
    this.performanceHighlightsText = '';
    this.editingPerformanceIndex = null;
    this.saveEditorialContent('Main roles updated.');
  }

  deletePerformanceLayer(index: number): void {
    if (!confirm('Delete this performance layer?')) {
      return;
    }

    this.editorialContent.performanceLayers = this.editorialContent.performanceLayers.filter((_, currentIndex) => currentIndex !== index);
    this.saveEditorialContent('Main roles updated.');
  }

  editFeatureCard(index: number): void {
    this.featureCardForm = { ...this.editorialContent.keyFeatureCards[index] };
    this.editingFeatureCardIndex = index;
  }

  saveFeatureCard(): void {
    const card = this.buildFeatureCardFromForm();

    if (this.editingFeatureCardIndex === null) {
      this.editorialContent.keyFeatureCards = [...this.editorialContent.keyFeatureCards, card];
    } else {
      this.editorialContent.keyFeatureCards = this.editorialContent.keyFeatureCards.map((item, index) => index === this.editingFeatureCardIndex ? card : item);
    }

    this.featureCardForm = this.getEmptyFeatureCard();
    this.editingFeatureCardIndex = null;
    this.saveEditorialContent('Key aspects updated.');
  }

  deleteFeatureCard(index: number): void {
    if (!confirm('Delete this key aspect card?')) {
      return;
    }

    this.editorialContent.keyFeatureCards = this.editorialContent.keyFeatureCards.filter((_, currentIndex) => currentIndex !== index);
    this.saveEditorialContent('Key aspects updated.');
  }

  private getEmptyNews(): NewsArticle {
    return { title: '', excerpt: '', date: '', imageUrl: '', link: '' };
  }

  private getEmptyMovie(): Movie {
    return { id: 0, title: '', year: 2026, language: 'Telugu', genre: [], role: '', director: '', poster: '', description: '' };
  }

  private getEmptyGallery(type: string): MediaGallery {
    return { caption: '', imageUrl: '', type };
  }

  private buildPerformanceLayerFromForm(): HomePerformanceLayer {
    return {
      ...this.performanceLayerForm,
      year: this.performanceLayerForm.year.trim(),
      title: this.performanceLayerForm.title.trim(),
      meta: this.performanceLayerForm.meta.trim(),
      role: this.performanceLayerForm.role.trim(),
      description: this.performanceLayerForm.description.trim(),
      image: this.performanceLayerForm.image.trim(),
      imageAlt: this.performanceLayerForm.imageAlt.trim(),
      imagePosition: (this.performanceLayerForm.imagePosition || '').trim(),
      highlights: this.performanceHighlightsText.split('\n').map(item => item.trim()).filter(Boolean)
    };
  }

  private applyPerformanceLayerEdit(): void {
    if (this.editingPerformanceIndex === null) {
      return;
    }

    const layer = this.buildPerformanceLayerFromForm();
    this.editorialContent.performanceLayers = this.editorialContent.performanceLayers.map((item, index) => index === this.editingPerformanceIndex ? layer : item);
    this.performanceLayerForm = this.getEmptyPerformanceLayer();
    this.performanceHighlightsText = '';
    this.editingPerformanceIndex = null;
  }

  private buildFeatureCardFromForm(): HomeFeatureCard {
    return {
      title: this.featureCardForm.title.trim(),
      eyebrow: this.featureCardForm.eyebrow.trim(),
      description: this.featureCardForm.description.trim(),
      icon: this.featureCardForm.icon
    };
  }

  private applyFeatureCardEdit(): void {
    if (this.editingFeatureCardIndex === null) {
      return;
    }

    const card = this.buildFeatureCardFromForm();
    this.editorialContent.keyFeatureCards = this.editorialContent.keyFeatureCards.map((item, index) => index === this.editingFeatureCardIndex ? card : item);
    this.featureCardForm = this.getEmptyFeatureCard();
    this.editingFeatureCardIndex = null;
  }

  private getEmptyPerformanceLayer(): HomePerformanceLayer {
    return { year: '', title: '', meta: '', role: '', description: '', highlights: [], image: '', imageAlt: '', imagePosition: '' };
  }

  private getEmptyFeatureCard(): HomeFeatureCard {
    return { title: '', eyebrow: '', description: '', icon: 'award' };
  }

  private getDefaultEditorialContent(): HomeEditorialContent {
    return {
      performanceRange: DEFAULT_EDITORIAL_CONTENT.performanceRange,
      instagramSpotlight: { ...DEFAULT_EDITORIAL_CONTENT.instagramSpotlight },
      featureShowcaseImage: { ...DEFAULT_EDITORIAL_CONTENT.featureShowcaseImage },
      performanceLayers: DEFAULT_EDITORIAL_CONTENT.performanceLayers.map(layer => ({ ...layer, highlights: [...layer.highlights] })),
      keyFeatureCards: DEFAULT_EDITORIAL_CONTENT.keyFeatureCards.map(card => ({ ...card }))
    };
  }

  private mergeEditorialContent(content: Record<string, unknown>): HomeEditorialContent {
    const defaults = this.getDefaultEditorialContent();
    const performanceLayers = Array.isArray(content['performanceLayers']) ? content['performanceLayers'] as HomePerformanceLayer[] : defaults.performanceLayers;
    const keyFeatureCards = Array.isArray(content['keyFeatureCards']) ? content['keyFeatureCards'] as HomeFeatureCard[] : defaults.keyFeatureCards;

    return {
      performanceRange: typeof content['performanceRange'] === 'string' ? content['performanceRange'] : defaults.performanceRange,
      instagramSpotlight: {
        ...defaults.instagramSpotlight,
        ...(typeof content['instagramSpotlight'] === 'object' && content['instagramSpotlight'] !== null ? content['instagramSpotlight'] as HomeInstagramSpotlight : {})
      },
      featureShowcaseImage: {
        ...defaults.featureShowcaseImage,
        ...(typeof content['featureShowcaseImage'] === 'object' && content['featureShowcaseImage'] !== null ? content['featureShowcaseImage'] as HomeFeatureShowcaseImage : {})
      },
      performanceLayers: performanceLayers.map(layer => ({ ...layer, highlights: Array.isArray(layer.highlights) ? [...layer.highlights] : [] })),
      keyFeatureCards: keyFeatureCards.map(card => ({ ...card }))
    };
  }

  private formatUploadLabel(fileName: string): string {
    const cleaned = fileName
      .replace(/\.[^.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleaned) {
      return 'Home Image';
    }

    return cleaned.replace(/\b\w/g, char => char.toUpperCase());
  }
}
