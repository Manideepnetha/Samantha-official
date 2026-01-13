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
      <div class="bg-white dark:bg-charcoal rounded-lg shadow p-4 flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button 
          *ngFor="let tab of tabs" 
          (click)="activeTab = tab"
          [class.bg-royal-gold]="activeTab === tab"
          [class.text-deep-black]="activeTab === tab"
          [class.text-gray-600]="activeTab !== tab"
          [class.dark:text-gray-400]="activeTab !== tab"
          class="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
        >
          {{ tab }}
        </button>
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
          <input [(ngModel)]="newsItem.title" placeholder="Title" class="w-full p-2 border rounded bg-transparent dark:text-ivory">
          <input [(ngModel)]="newsItem.date" placeholder="Date (e.g. May 15, 2025)" class="w-full p-2 border rounded bg-transparent dark:text-ivory">
          <textarea [(ngModel)]="newsItem.excerpt" placeholder="Excerpt" rows="3" class="w-full p-2 border rounded bg-transparent dark:text-ivory"></textarea>
          <input [(ngModel)]="newsItem.imageUrl" placeholder="Image URL" class="w-full p-2 border rounded bg-transparent dark:text-ivory">
          <input [(ngModel)]="newsItem.link" placeholder="Link URL" class="w-full p-2 border rounded bg-transparent dark:text-ivory">
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button (click)="isNewsModalOpen = false" class="px-4 py-2 text-gray-600">Cancel</button>
          <button (click)="saveNews()" class="px-4 py-2 bg-royal-gold text-deep-black rounded">Save</button>
        </div>
      </div>
    </div>

    <!-- Movie Modal -->
    <div *ngIf="isMovieModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-charcoal rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-xl font-bold mb-4 text-charcoal dark:text-ivory">{{ movieItem.id ? 'Edit' : 'Add' }} Project</h3>
        <div class="space-y-4">
          <input [(ngModel)]="movieItem.title" placeholder="Title" class="w-full p-2 border rounded bg-transparent dark:text-ivory">
          <input [(ngModel)]="movieItem.year" type="number" placeholder="Year" class="w-full p-2 border rounded bg-transparent dark:text-ivory">
          <input [(ngModel)]="movieItem.director" placeholder="Director" class="w-full p-2 border rounded bg-transparent dark:text-ivory">
          <textarea [(ngModel)]="movieItem.description" placeholder="Description" rows="2" class="w-full p-2 border rounded bg-transparent dark:text-ivory"></textarea>
           <!-- Minimal fields for quick add -->
           <input [(ngModel)]="movieItem.language" placeholder="Language" class="w-full p-2 border rounded bg-transparent dark:text-ivory">
           <input [(ngModel)]="movieItem.role" placeholder="Role" class="w-full p-2 border rounded bg-transparent dark:text-ivory">
           <input [(ngModel)]="movieItem.poster" placeholder="Poster URL" class="w-full p-2 border rounded bg-transparent dark:text-ivory">
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button (click)="isMovieModalOpen = false" class="px-4 py-2 text-gray-600">Cancel</button>
          <button (click)="saveMovie()" class="px-4 py-2 bg-royal-gold text-deep-black rounded">Save</button>
        </div>
      </div>
    </div>

    <!-- Gallery Modal -->
    <div *ngIf="isGalleryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-charcoal rounded-lg shadow-xl w-full max-w-lg p-6">
        <h3 class="text-xl font-bold mb-4 text-charcoal dark:text-ivory">{{ galleryItem.id ? 'Edit' : 'Add' }} Image</h3>
        <div class="space-y-4">
          <input [(ngModel)]="galleryItem.caption" placeholder="Caption" class="w-full p-2 border rounded bg-transparent dark:text-ivory">
          <input [(ngModel)]="galleryItem.imageUrl" placeholder="Image URL" class="w-full p-2 border rounded bg-transparent dark:text-ivory">
          <select [(ngModel)]="galleryItem.type" class="w-full p-2 border rounded bg-transparent dark:text-ivory">
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
  `,
    styles: []
})
export class ManageHomeComponent implements OnInit {
    tabs = ['Highlights', 'Upcoming Projects', 'Featured Gallery'];
    activeTab = 'Highlights';

    // Data Lists
    newsList: NewsArticle[] = [];
    upcomingMovies: Movie[] = [];
    galleryList: MediaGallery[] = [];

    // Edit Items
    newsItem: NewsArticle = this.getEmptyNews();
    movieItem: Movie = this.getEmptyMovie();
    galleryItem: MediaGallery = this.getEmptyGallery();

    // Modal States
    isNewsModalOpen = false;
    isMovieModalOpen = false;
    isGalleryModalOpen = false;

    constructor(private apiService: ApiService) { }

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll() {
        this.apiService.getNews().subscribe(data => this.newsList = data);
        this.apiService.getMovies().subscribe(data => this.upcomingMovies = data.filter(m => m.year >= 2025));
        this.apiService.getMediaGalleries().subscribe(data => this.galleryList = data);
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

    // --- Gallery ---
    getEmptyGallery(): MediaGallery { return { caption: '', imageUrl: '', type: 'Home' }; }

    openGalleryModal() { this.galleryItem = this.getEmptyGallery(); this.isGalleryModalOpen = true; }

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
