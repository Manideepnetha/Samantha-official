import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, NewsArticle, MediaGallery, Movie } from '../../../services/api.service';

@Component({
  selector: 'app-manage-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sr-admin-page">
      <div class="sr-admin-page-header">
        <div>
          <span class="sr-kicker">Homepage</span>
          <h1 class="sr-admin-title">Manage Home Screen</h1>
          <p class="sr-admin-subtitle">Control the hero reel, highlight cards, upcoming projects, and featured gallery moments from one editorial workspace.</p>
        </div>
      </div>

      <div class="sr-tabbar">
        <button
          *ngFor="let tab of tabs"
          (click)="activeTab = tab"
          [class.is-active]="activeTab === tab"
          class="sr-tab"
        >
          {{ tab }}
        </button>
      </div>

      <section *ngIf="activeTab === 'Hero Slides'" class="sr-surface p-6 md:p-7">
        <div class="sr-admin-toolbar">
          <div>
            <span class="sr-kicker">Hero</span>
            <h2 class="sr-card-title mt-2">Hero Slides</h2>
            <p class="sr-card-text mt-3">Manage the large visual frames and role text that set the tone on the homepage.</p>
          </div>
          <button (click)="openHeroModal()" class="sr-button">Add Slide</button>
        </div>

        <div class="sr-admin-table-scroll mt-6">
          <table class="sr-admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Role Text</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let slide of heroSlides">
                <td><img [src]="slide.imageUrl" class="sr-admin-thumb" alt="Slide"></td>
                <td class="sr-admin-title-cell">{{ slide.caption }}</td>
                <td>
                  <div class="sr-admin-actions">
                    <button (click)="editHero(slide)" class="sr-admin-action">Edit</button>
                    <button (click)="deleteGallery(slide.id!)" class="sr-admin-action-danger">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="heroSlides.length === 0" class="sr-admin-empty-row">
                <td colspan="3">No dynamic hero slides yet. The homepage will fall back to its default slides.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section *ngIf="activeTab === 'Highlights'" class="sr-surface p-6 md:p-7">
        <div class="sr-admin-toolbar">
          <div>
            <span class="sr-kicker">Highlights</span>
            <h2 class="sr-card-title mt-2">Homepage Highlights</h2>
            <p class="sr-card-text mt-3">Pick the stories and headlines that should feel freshest on the landing page.</p>
          </div>
          <button (click)="openNewsModal()" class="sr-button">Add Highlight</button>
        </div>

        <div class="sr-admin-table-scroll mt-6">
          <table class="sr-admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Date</th>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let news of newsList">
                <td><img [src]="news.imageUrl" class="sr-admin-thumb" alt="Highlight"></td>
                <td>{{ news.date }}</td>
                <td class="sr-admin-title-cell">{{ news.title }}</td>
                <td>
                  <div class="sr-admin-actions">
                    <button (click)="editNews(news)" class="sr-admin-action">Edit</button>
                    <button (click)="deleteNews(news.id!)" class="sr-admin-action-danger">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="newsList.length === 0" class="sr-admin-empty-row">
                <td colspan="4">No homepage highlights yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section *ngIf="activeTab === 'Upcoming Projects'" class="sr-surface p-6 md:p-7">
        <div class="sr-admin-toolbar">
          <div>
            <span class="sr-kicker">Projects</span>
            <h2 class="sr-card-title mt-2">Upcoming Projects</h2>
            <p class="sr-card-text mt-3">Feature upcoming films and collaborations that deserve priority placement on the homepage.</p>
          </div>
          <button (click)="openMovieModal()" class="sr-button">Add Project</button>
        </div>

        <div class="sr-admin-table-scroll mt-6">
          <table class="sr-admin-table">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Year</th>
                <th>Director</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let movie of upcomingMovies">
                <td><img [src]="movie.poster || 'assets/placeholder.jpg'" class="sr-admin-thumb is-poster" alt="Poster"></td>
                <td class="sr-admin-title-cell">{{ movie.title }}</td>
                <td>{{ movie.year }}</td>
                <td>{{ movie.director }}</td>
                <td>
                  <div class="sr-admin-actions">
                    <button (click)="editMovie(movie)" class="sr-admin-action">Edit</button>
                    <button (click)="deleteMovie(movie.id)" class="sr-admin-action-danger">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="upcomingMovies.length === 0" class="sr-admin-empty-row">
                <td colspan="5">No upcoming projects are being featured right now.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section *ngIf="activeTab === 'Featured Gallery'" class="sr-surface p-6 md:p-7">
        <div class="sr-admin-toolbar">
          <div>
            <span class="sr-kicker">Gallery</span>
            <h2 class="sr-card-title mt-2">Featured Gallery</h2>
            <p class="sr-card-text mt-3">Choose the stills and portraits that should appear in the homepage showcase.</p>
          </div>
          <button (click)="openGalleryModal()" class="sr-button">Add Image</button>
        </div>

        <div class="sr-admin-table-scroll mt-6">
          <table class="sr-admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Caption</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let media of galleryList">
                <td><img [src]="media.imageUrl" class="sr-admin-thumb" alt="Gallery"></td>
                <td class="sr-admin-title-cell">{{ media.caption }}</td>
                <td><span class="sr-admin-badge is-accent">{{ media.type }}</span></td>
                <td>
                  <div class="sr-admin-actions">
                    <button (click)="editGallery(media)" class="sr-admin-action">Edit</button>
                    <button (click)="deleteGallery(media.id!)" class="sr-admin-action-danger">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="galleryList.length === 0" class="sr-admin-empty-row">
                <td colspan="4">No featured gallery images yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div *ngIf="isNewsModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
        <div class="sr-modal-panel w-full max-w-2xl p-6 md:p-7">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="sr-kicker">{{ newsItem.id ? 'Editing' : 'Creating' }}</span>
              <h3 class="sr-card-title mt-2">{{ newsItem.id ? 'Edit Highlight' : 'Add Highlight' }}</h3>
            </div>
            <button type="button" (click)="isNewsModalOpen = false" class="sr-close-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-6 space-y-4">
            <div>
              <label class="sr-field-label">Title</label>
              <input [(ngModel)]="newsItem.title" class="sr-input">
            </div>
            <div>
              <label class="sr-field-label">Date</label>
              <input [(ngModel)]="newsItem.date" class="sr-input" placeholder="May 15, 2025">
            </div>
            <div>
              <label class="sr-field-label">Excerpt</label>
              <textarea [(ngModel)]="newsItem.excerpt" rows="4" class="sr-textarea"></textarea>
            </div>
            <div>
              <label class="sr-field-label">Image</label>
              <div class="flex flex-col gap-3 md:flex-row">
                <input [(ngModel)]="newsItem.imageUrl" class="sr-input flex-1" placeholder="Image URL">
                <button type="button" (click)="fileInput.click()" [disabled]="isUploading" class="sr-button-outline whitespace-nowrap px-5">{{ isUploading ? 'Uploading...' : 'Upload' }}</button>
                <input #fileInput type="file" (change)="onFileSelected($event, 'news')" accept="image/*" class="hidden">
              </div>
              <div *ngIf="newsItem.imageUrl" class="mt-4 overflow-hidden rounded-[1.3rem] border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] p-3">
                <img [src]="newsItem.imageUrl" class="sr-admin-thumb h-40 w-full max-w-md" alt="Preview">
              </div>
            </div>
            <div>
              <label class="sr-field-label">Link URL</label>
              <input [(ngModel)]="newsItem.link" class="sr-input">
            </div>
          </div>
          <div class="mt-8 flex justify-end gap-3">
            <button type="button" (click)="isNewsModalOpen = false" class="sr-button-ghost">Cancel</button>
            <button type="button" (click)="saveNews()" class="sr-button">Save</button>
          </div>
        </div>
      </div>

      <div *ngIf="isMovieModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
        <div class="sr-modal-panel w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 md:p-7">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="sr-kicker">{{ movieItem.id ? 'Editing' : 'Creating' }}</span>
              <h3 class="sr-card-title mt-2">{{ movieItem.id ? 'Edit Project' : 'Add Project' }}</h3>
            </div>
            <button type="button" (click)="isMovieModalOpen = false" class="sr-close-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-6 space-y-4">
            <div>
              <label class="sr-field-label">Title</label>
              <input [(ngModel)]="movieItem.title" class="sr-input">
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="sr-field-label">Year</label>
                <input [(ngModel)]="movieItem.year" type="number" class="sr-input">
              </div>
              <div>
                <label class="sr-field-label">Director</label>
                <input [(ngModel)]="movieItem.director" class="sr-input">
              </div>
            </div>
            <div>
              <label class="sr-field-label">Description</label>
              <textarea [(ngModel)]="movieItem.description" rows="4" class="sr-textarea"></textarea>
            </div>
            <div>
              <label class="sr-field-label">Poster</label>
              <div class="flex flex-col gap-3 md:flex-row">
                <input [(ngModel)]="movieItem.poster" class="sr-input flex-1" placeholder="Poster URL">
                <button type="button" (click)="movieFileInput.click()" [disabled]="isUploading" class="sr-button-outline whitespace-nowrap px-5">{{ isUploading ? 'Uploading...' : 'Upload' }}</button>
                <input #movieFileInput type="file" (change)="onFileSelected($event, 'movie')" accept="image/*" class="hidden">
              </div>
              <div *ngIf="movieItem.poster" class="mt-4 overflow-hidden rounded-[1.3rem] border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] p-3">
                <img [src]="movieItem.poster" class="sr-admin-thumb is-poster h-52 w-36" alt="Preview">
              </div>
            </div>
          </div>
          <div class="mt-8 flex justify-end gap-3">
            <button type="button" (click)="isMovieModalOpen = false" class="sr-button-ghost">Cancel</button>
            <button type="button" (click)="saveMovie()" class="sr-button">Save</button>
          </div>
        </div>
      </div>

      <div *ngIf="isGalleryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
        <div class="sr-modal-panel w-full max-w-2xl p-6 md:p-7">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="sr-kicker">{{ galleryItem.id ? 'Editing' : 'Creating' }}</span>
              <h3 class="sr-card-title mt-2">{{ galleryItem.id ? 'Edit Image' : 'Add Image' }}</h3>
            </div>
            <button type="button" (click)="isGalleryModalOpen = false" class="sr-close-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-6 space-y-4">
            <div>
              <label class="sr-field-label">Caption</label>
              <input [(ngModel)]="galleryItem.caption" class="sr-input">
            </div>
            <div>
              <label class="sr-field-label">Image</label>
              <div class="flex flex-col gap-3 md:flex-row">
                <input [(ngModel)]="galleryItem.imageUrl" class="sr-input flex-1" placeholder="Image URL">
                <button type="button" (click)="galleryFileInput.click()" [disabled]="isUploading" class="sr-button-outline whitespace-nowrap px-5">{{ isUploading ? 'Uploading...' : 'Upload' }}</button>
                <input #galleryFileInput type="file" (change)="onFileSelected($event, 'gallery')" accept="image/*" class="hidden">
              </div>
              <div *ngIf="galleryItem.imageUrl" class="mt-4 overflow-hidden rounded-[1.3rem] border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] p-3">
                <img [src]="galleryItem.imageUrl" class="sr-admin-thumb h-40 w-full max-w-md" alt="Preview">
              </div>
            </div>
            <div>
              <label class="sr-field-label">Type</label>
              <select [(ngModel)]="galleryItem.type" class="sr-select">
                <option value="Home">Home</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
          <div class="mt-8 flex justify-end gap-3">
            <button type="button" (click)="isGalleryModalOpen = false" class="sr-button-ghost">Cancel</button>
            <button type="button" (click)="saveGallery()" class="sr-button">Save</button>
          </div>
        </div>
      </div>

      <div *ngIf="isHeroModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
        <div class="sr-modal-panel w-full max-w-2xl p-6 md:p-7">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="sr-kicker">{{ heroItem.id ? 'Editing' : 'Creating' }}</span>
              <h3 class="sr-card-title mt-2">{{ heroItem.id ? 'Edit Hero Slide' : 'Add Hero Slide' }}</h3>
            </div>
            <button type="button" (click)="isHeroModalOpen = false" class="sr-close-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-6 space-y-4">
            <div>
              <label class="sr-field-label">Role Text</label>
              <input [(ngModel)]="heroItem.caption" class="sr-input" placeholder="Actress, Producer, Philanthropist">
            </div>
            <div>
              <label class="sr-field-label">Image</label>
              <div class="flex flex-col gap-3 md:flex-row">
                <input [(ngModel)]="heroItem.imageUrl" class="sr-input flex-1" placeholder="Image URL">
                <button type="button" (click)="heroFileInput.click()" [disabled]="isUploading" class="sr-button-outline whitespace-nowrap px-5">{{ isUploading ? 'Uploading...' : 'Upload' }}</button>
                <input #heroFileInput type="file" (change)="onFileSelected($event, 'hero')" accept="image/*" class="hidden">
              </div>
              <div *ngIf="heroItem.imageUrl" class="mt-4 overflow-hidden rounded-[1.3rem] border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] p-3">
                <img [src]="heroItem.imageUrl" class="sr-admin-thumb h-48 w-full max-w-md" alt="Preview">
              </div>
            </div>
          </div>
          <div class="mt-8 flex justify-end gap-3">
            <button type="button" (click)="isHeroModalOpen = false" class="sr-button-ghost">Cancel</button>
            <button type="button" (click)="saveHero()" class="sr-button">Save Slide</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ManageHomeComponent implements OnInit {
  tabs = ['Hero Slides', 'Highlights', 'Upcoming Projects', 'Featured Gallery'];
  activeTab = 'Hero Slides';

  heroSlides: MediaGallery[] = [];
  newsList: NewsArticle[] = [];
  upcomingMovies: Movie[] = [];
  galleryList: MediaGallery[] = [];

  heroItem: MediaGallery = this.getEmptyGallery('Hero');
  newsItem: NewsArticle = this.getEmptyNews();
  movieItem: Movie = this.getEmptyMovie();
  galleryItem: MediaGallery = this.getEmptyGallery('Home');

  isHeroModalOpen = false;
  isNewsModalOpen = false;
  isMovieModalOpen = false;
  isGalleryModalOpen = false;
  isUploading = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadAll();
  }

  onFileSelected(event: any, type: 'news' | 'movie' | 'gallery' | 'hero'): void {
    const file = event.target.files[0];
    if (!file) return;

    this.isUploading = true;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');
    formData.append('cloud_name', 'dpnd6ve1e');

    fetch(`https://api.cloudinary.com/v1_1/dpnd6ve1e/image/upload`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        if (res.secure_url) {
          if (type === 'news') this.newsItem.imageUrl = res.secure_url;
          if (type === 'movie') this.movieItem.poster = res.secure_url;
          if (type === 'gallery') this.galleryItem.imageUrl = res.secure_url;
          if (type === 'hero') this.heroItem.imageUrl = res.secure_url;
        } else {
          alert('Upload failed. Check Cloudinary settings.');
        }
      })
      .catch(err => {
        console.error('Upload error:', err);
        alert('Error connecting to Cloudinary.');
      })
      .finally(() => {
        this.isUploading = false;
      });
  }

  loadAll() {
    this.apiService.getNews().subscribe(data => this.newsList = data);
    this.apiService.getMovies().subscribe(data => this.upcomingMovies = data.filter(m => m.year >= 2025));
    this.apiService.getMediaGalleries().subscribe(data => {
      this.heroSlides = data.filter(g => g.type === 'Hero');
      this.galleryList = data.filter(g => g.type === 'Home');
    });
  }

  getEmptyNews(): NewsArticle { return { title: '', excerpt: '', date: '', imageUrl: '', link: '' }; }

  openNewsModal() { this.newsItem = this.getEmptyNews(); this.isNewsModalOpen = true; }

  editNews(item: NewsArticle) { this.newsItem = { ...item }; this.isNewsModalOpen = true; }

  saveNews() {
    if (this.newsItem.id) {
      this.apiService.updateNews(this.newsItem.id, this.newsItem).subscribe(() => { this.loadAll(); this.isNewsModalOpen = false; });
    } else {
      this.apiService.createNews(this.newsItem).subscribe(() => { this.loadAll(); this.isNewsModalOpen = false; });
    }
  }

  deleteNews(id: number) {
    if (confirm('Delete?')) this.apiService.deleteNews(id).subscribe(() => this.loadAll());
  }

  getEmptyMovie(): Movie {
    return { id: 0, title: '', year: 2026, language: 'Telugu', genre: [], role: '', director: '', poster: '', description: '' };
  }

  openMovieModal() { this.movieItem = this.getEmptyMovie(); this.isMovieModalOpen = true; }

  editMovie(item: Movie) { this.movieItem = JSON.parse(JSON.stringify(item)); this.isMovieModalOpen = true; }

  saveMovie() {
    if (this.movieItem.id) {
      this.apiService.updateMovie(this.movieItem.id, this.movieItem).subscribe(() => { this.loadAll(); this.isMovieModalOpen = false; });
    } else {
      this.apiService.createMovie(this.movieItem).subscribe(() => { this.loadAll(); this.isMovieModalOpen = false; });
    }
  }

  deleteMovie(id: number) {
    if (confirm('Delete Project?')) this.apiService.deleteMovie(id).subscribe(() => this.loadAll());
  }

  getEmptyGallery(type: string = 'Home'): MediaGallery { return { caption: '', imageUrl: '', type: type }; }

  openHeroModal() { this.heroItem = this.getEmptyGallery('Hero'); this.isHeroModalOpen = true; }

  editHero(item: MediaGallery) { this.heroItem = { ...item }; this.isHeroModalOpen = true; }

  saveHero() {
    if (this.heroItem.id) {
      this.apiService.updateMediaGallery(this.heroItem.id, this.heroItem).subscribe(() => { this.loadAll(); this.isHeroModalOpen = false; });
    } else {
      this.apiService.createMediaGallery(this.heroItem).subscribe(() => { this.loadAll(); this.isHeroModalOpen = false; });
    }
  }

  openGalleryModal() { this.galleryItem = this.getEmptyGallery('Home'); this.isGalleryModalOpen = true; }

  editGallery(item: MediaGallery) { this.galleryItem = { ...item }; this.isGalleryModalOpen = true; }

  saveGallery() {
    if (this.galleryItem.id) {
      this.apiService.updateMediaGallery(this.galleryItem.id, this.galleryItem).subscribe(() => { this.loadAll(); this.isGalleryModalOpen = false; });
    } else {
      this.apiService.createMediaGallery(this.galleryItem).subscribe(() => { this.loadAll(); this.isGalleryModalOpen = false; });
    }
  }

  deleteGallery(id: number) {
    if (confirm('Delete Image?')) this.apiService.deleteMediaGallery(id).subscribe(() => this.loadAll());
  }
}
