import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, NewsArticle, MediaGallery, Movie } from '../../../services/api.service';

@Component({
  selector: 'app-manage-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Tabs -->
      <div class="bg-white dark:bg-charcoal rounded-lg shadow p-4 flex gap-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button 
          *ngFor="let tab of tabs" 
          (click)="activeTab = tab"
          [class.bg-royal-gold]="activeTab === tab"
          [class.text-deep-black]="activeTab === tab"
          [class.text-gray-600]="activeTab !== tab"
          [class.dark:text-gray-400]="activeTab !== tab"
          class="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-gray-100 dark:hover:bg-white/10 whitespace-nowrap"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Hero Slides (Screensaver) -->
      <div *ngIf="activeTab === 'Hero Slides'" class="bg-white dark:bg-charcoal rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-xl font-playfair font-bold text-charcoal dark:text-ivory">Hero Slides</h2>
            <p class="text-sm text-gray-500 mt-1">Manage the large images on the homepage hero section.</p>
          </div>
          <button (click)="openHeroModal()" class="px-4 py-2 bg-royal-gold text-deep-black rounded hover-lift font-medium">Add Slide</button>
        </div>
        
        <table class="w-full text-left">
          <thead>
            <tr class="text-charcoal dark:text-ivory border-b border-gray-200 dark:border-gray-700">
              <th class="p-3">Image</th>
              <th class="p-3">Role Text</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let slide of heroSlides" class="border-b border-gray-100 dark:border-gray-800">
              <td class="p-3"><img [src]="slide.imageUrl" class="w-20 h-12 object-cover rounded shadow-sm"></td>
              <td class="p-3 text-charcoal dark:text-ivory font-medium">{{ slide.caption }}</td>
              <td class="p-3">
                <button (click)="editHero(slide)" class="text-royal-gold mr-3 hover:underline">Edit</button>
                <button (click)="deleteGallery(slide.id!)" class="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
            <tr *ngIf="heroSlides.length === 0">
              <td colspan="3" class="p-8 text-center text-gray-500 italic">No dynamic slides found. Using default hardcoded slides on homepage.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Highlights (News) -->
      <div *ngIf="activeTab === 'Highlights'" class="bg-white dark:bg-charcoal rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-playfair font-bold text-charcoal dark:text-ivory">Highlights</h2>
          <button (click)="openNewsModal()" class="px-4 py-2 bg-royal-gold text-deep-black rounded hover-lift font-medium">Add Highlight</button>
        </div>
        
        <table class="w-full text-left">
          <thead>
            <tr class="text-charcoal dark:text-ivory border-b border-gray-200 dark:border-gray-700">
              <th class="p-3">Image</th>
              <th class="p-3">Date</th>
              <th class="p-3">Title</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let news of newsList" class="border-b border-gray-100 dark:border-gray-800">
              <td class="p-3"><img [src]="news.imageUrl" class="w-16 h-10 object-cover rounded"></td>
              <td class="p-3 text-gray-600 dark:text-gray-300">{{ news.date }}</td>
              <td class="p-3 text-charcoal dark:text-ivory">{{ news.title }}</td>
              <td class="p-3">
                <button (click)="editNews(news)" class="text-royal-gold mr-3">Edit</button>
                <button (click)="deleteNews(news.id!)" class="text-red-500">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Upcoming Projects (Movies >= 2025) -->
      <div *ngIf="activeTab === 'Upcoming Projects'" class="bg-white dark:bg-charcoal rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-playfair font-bold text-charcoal dark:text-ivory">Upcoming Projects (2025+)</h2>
          <button (click)="openMovieModal()" class="px-4 py-2 bg-royal-gold text-deep-black rounded hover-lift font-medium">Add Project</button>
        </div>

        <table class="w-full text-left">
          <thead>
            <tr class="text-charcoal dark:text-ivory border-b border-gray-200 dark:border-gray-700">
              <th class="p-3">Poster</th>
              <th class="p-3">Title</th>
              <th class="p-3">Year</th>
              <th class="p-3">Director</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let movie of upcomingMovies" class="border-b border-gray-100 dark:border-gray-800">
              <td class="p-3"><img [src]="movie.poster || 'assets/placeholder.jpg'" class="w-10 h-14 object-cover rounded"></td>
              <td class="p-3 text-charcoal dark:text-ivory font-medium">{{ movie.title }}</td>
              <td class="p-3 text-gray-600 dark:text-gray-300">{{ movie.year }}</td>
              <td class="p-3 text-gray-600 dark:text-gray-300">{{ movie.director }}</td>
              <td class="p-3">
                <button (click)="editMovie(movie)" class="text-royal-gold mr-3">Edit</button>
                <button (click)="deleteMovie(movie.id)" class="text-red-500">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Featured Gallery -->
      <div *ngIf="activeTab === 'Featured Gallery'" class="bg-white dark:bg-charcoal rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-playfair font-bold text-charcoal dark:text-ivory">Featured Gallery</h2>
          <button (click)="openGalleryModal()" class="px-4 py-2 bg-royal-gold text-deep-black rounded hover-lift font-medium">Add Image</button>
        </div>

        <table class="w-full text-left">
          <thead>
            <tr class="text-charcoal dark:text-ivory border-b border-gray-200 dark:border-gray-700">
              <th class="p-3">Image</th>
              <th class="p-3">Caption</th>
              <th class="p-3">Type</th>
              <th class="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let media of galleryList" class="border-b border-gray-100 dark:border-gray-800">
              <td class="p-3"><img [src]="media.imageUrl" class="w-16 h-10 object-cover rounded"></td>
              <td class="p-3 text-charcoal dark:text-ivory">{{ media.caption }}</td>
              <td class="p-3 text-gray-600 dark:text-gray-300">{{ media.type }}</td>
              <td class="p-3">
                <button (click)="editGallery(media)" class="text-royal-gold mr-3">Edit</button>
                <button (click)="deleteGallery(media.id!)" class="text-red-500">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <!-- News Modal -->
    <div *ngIf="isNewsModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-charcoal rounded-lg shadow-xl w-full max-w-lg p-6">
        <h3 class="text-xl font-bold mb-4 text-charcoal dark:text-ivory">{{ newsItem.id ? 'Edit' : 'Add' }} Highlight</h3>
        <div class="space-y-4">
          <input [(ngModel)]="newsItem.title" placeholder="Title" class="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
          <input [(ngModel)]="newsItem.date" placeholder="Date (e.g. May 15, 2025)" class="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
          <textarea [(ngModel)]="newsItem.excerpt" placeholder="Excerpt" rows="3" class="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"></textarea>
          
          <div class="flex gap-2">
            <input [(ngModel)]="newsItem.imageUrl" placeholder="Image URL" class="flex-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
            <button (click)="fileInput.click()" [disabled]="isUploading" class="px-3 py-1 bg-royal-gold/10 text-royal-gold rounded-lg text-xs font-semibold whitespace-nowrap">
              {{ isUploading ? 'Uploading...' : 'Upload' }}
            </button>
            <input #fileInput type="file" (change)="onFileSelected($event, 'news')" accept="image/*" class="hidden">
          </div>
          <div *ngIf="newsItem.imageUrl" class="mt-2 h-24 w-full rounded overflow-hidden border border-gray-200 dark:border-gray-700">
            <img [src]="newsItem.imageUrl" class="w-full h-full object-cover">
          </div>
          
          <input [(ngModel)]="newsItem.link" placeholder="Link URL" class="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button (click)="isNewsModalOpen = false" class="px-4 py-2 text-gray-600 dark:text-gray-400">Cancel</button>
          <button (click)="saveNews()" class="px-4 py-2 bg-royal-gold text-deep-black rounded font-medium">Save</button>
        </div>
      </div>
    </div>

    <!-- Movie Modal (Upcoming) -->
    <div *ngIf="isMovieModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-charcoal rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4 text-charcoal dark:text-ivory">{{ movieItem.id ? 'Edit' : 'Add' }} Project</h3>
        <div class="space-y-4">
          <input [(ngModel)]="movieItem.title" placeholder="Title" class="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
          <input [(ngModel)]="movieItem.year" type="number" placeholder="Year" class="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
          <input [(ngModel)]="movieItem.director" placeholder="Director" class="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
          <textarea [(ngModel)]="movieItem.description" placeholder="Description" rows="2" class="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"></textarea>
          
          <div class="flex gap-2">
            <input [(ngModel)]="movieItem.poster" placeholder="Poster URL" class="flex-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
            <button (click)="movieFileInput.click()" [disabled]="isUploading" class="px-3 py-1 bg-royal-gold/10 text-royal-gold rounded-lg text-xs font-semibold whitespace-nowrap">
              {{ isUploading ? 'Uploading...' : 'Upload' }}
            </button>
            <input #movieFileInput type="file" (change)="onFileSelected($event, 'movie')" accept="image/*" class="hidden">
          </div>
          <div *ngIf="movieItem.poster" class="mt-2 h-32 w-24 rounded overflow-hidden border border-gray-200 dark:border-gray-700">
            <img [src]="movieItem.poster" class="w-full h-full object-cover">
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button (click)="isMovieModalOpen = false" class="px-4 py-2 text-gray-600 dark:text-gray-400">Cancel</button>
          <button (click)="saveMovie()" class="px-4 py-2 bg-royal-gold text-deep-black rounded font-medium">Save</button>
        </div>
      </div>
    </div>

    <!-- Gallery Modal -->
    <div *ngIf="isGalleryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-charcoal rounded-lg shadow-xl w-full max-w-lg p-6">
        <h3 class="text-xl font-bold mb-4 text-charcoal dark:text-ivory">{{ galleryItem.id ? 'Edit' : 'Add' }} Image</h3>
        <div class="space-y-4">
          <input [(ngModel)]="galleryItem.caption" placeholder="Caption" class="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
          
          <div class="flex gap-2">
            <input [(ngModel)]="galleryItem.imageUrl" placeholder="Image URL" class="flex-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
            <button (click)="galleryFileInput.click()" [disabled]="isUploading" class="px-3 py-1 bg-royal-gold/10 text-royal-gold rounded-lg text-xs font-semibold whitespace-nowrap">
              {{ isUploading ? 'Uploading...' : 'Upload' }}
            </button>
            <input #galleryFileInput type="file" (change)="onFileSelected($event, 'gallery')" accept="image/*" class="hidden">
          </div>
          <div *ngIf="galleryItem.imageUrl" class="mt-2 h-24 w-full rounded overflow-hidden border border-gray-200 dark:border-gray-700">
            <img [src]="galleryItem.imageUrl" class="w-full h-full object-cover">
          </div>

          <select [(ngModel)]="galleryItem.type" class="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
            <option value="Home" class="dark:bg-charcoal">Home</option>
            <option value="General" class="dark:bg-charcoal">General</option>
          </select>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button (click)="isGalleryModalOpen = false" class="px-4 py-2 text-gray-600">Cancel</button>
          <button (click)="saveGallery()" class="px-4 py-2 bg-royal-gold text-deep-black rounded">Save</button>
        </div>
      </div>
    </div>
    <!-- Hero Modal -->
    <div *ngIf="isHeroModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-charcoal rounded-lg shadow-xl w-full max-w-lg p-6">
        <h3 class="text-xl font-bold mb-4 text-charcoal dark:text-ivory">{{ heroItem.id ? 'Edit' : 'Add' }} Hero Slide</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role Text (e.g. Actress, Philanthropist)</label>
            <input [(ngModel)]="heroItem.caption" placeholder="Role description" class="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
            <div class="flex gap-2">
              <input [(ngModel)]="heroItem.imageUrl" placeholder="Image URL" class="flex-1 p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
              <button (click)="heroFileInput.click()" [disabled]="isUploading" class="px-4 py-2 bg-royal-gold/10 text-royal-gold rounded-lg text-xs font-semibold whitespace-nowrap">
                {{ isUploading ? 'Uploading...' : 'Upload' }}
              </button>
              <input #heroFileInput type="file" (change)="onFileSelected($event, 'hero')" accept="image/*" class="hidden">
            </div>
            <div *ngIf="heroItem.imageUrl" class="mt-2 h-40 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <img [src]="heroItem.imageUrl" class="w-full h-full object-cover">
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button (click)="isHeroModalOpen = false" class="px-4 py-2 text-gray-600 dark:text-gray-400">Cancel</button>
          <button (click)="saveHero()" class="px-4 py-2 bg-royal-gold text-deep-black rounded font-medium shadow-md shadow-royal-gold/20 hover:bg-royal-gold/90">Save Slide</button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ManageHomeComponent implements OnInit {
  tabs = ['Hero Slides', 'Highlights', 'Upcoming Projects', 'Featured Gallery'];
  activeTab = 'Hero Slides';

  // Data Lists
  heroSlides: MediaGallery[] = [];
  newsList: NewsArticle[] = [];
  upcomingMovies: Movie[] = [];
  galleryList: MediaGallery[] = [];

  // Edit Items
  heroItem: MediaGallery = this.getEmptyGallery('Hero');
  newsItem: NewsArticle = this.getEmptyNews();
  movieItem: Movie = this.getEmptyMovie();
  galleryItem: MediaGallery = this.getEmptyGallery('Home');

  // Modal States
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

    // Cloudinary Upload Logic
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

  // --- News ---
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

  // --- Movies ---
  getEmptyMovie(): Movie {
    return { id: 0, title: '', year: 2026, language: 'Telugu', genre: [], role: '', director: '', poster: '', description: '' };
  }

  openMovieModal() { this.movieItem = this.getEmptyMovie(); this.isMovieModalOpen = true; }

  editMovie(item: Movie) { this.movieItem = JSON.parse(JSON.stringify(item)); this.isMovieModalOpen = true; }

  saveMovie() {
    // If genre is string for quick edit (not implemented in simple template, assume array handling or just simple)
    // For simplicity, we kept it simple in template.
    if (this.movieItem.id) {
      this.apiService.updateMovie(this.movieItem.id, this.movieItem).subscribe(() => { this.loadAll(); this.isMovieModalOpen = false; });
    } else {
      this.apiService.createMovie(this.movieItem).subscribe(() => { this.loadAll(); this.isMovieModalOpen = false; });
    }
  }

  deleteMovie(id: number) {
    if (confirm('Delete Project?')) this.apiService.deleteMovie(id).subscribe(() => this.loadAll());
  }

  // --- Gallery & Hero ---
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
