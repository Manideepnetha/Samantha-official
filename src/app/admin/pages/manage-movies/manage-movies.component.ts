import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Movie } from '../../../services/api.service';

@Component({
  selector: 'app-manage-movies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white dark:bg-charcoal rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-playfair font-bold text-gray-800 dark:text-ivory">Manage Movies</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Add, edit, or remove filmography entries</p>
        </div>
        <button (click)="openModal()" class="px-4 py-2 bg-royal-gold text-white dark:text-deep-black rounded-lg font-medium hover:bg-royal-gold/90 transition-colors flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Movie
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 dark:bg-deep-black/30 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider font-inter">
            <tr>
              <th class="px-6 py-4 font-medium">Title</th>
              <th class="px-6 py-4 font-medium">Year</th>
              <th class="px-6 py-4 font-medium">Language</th>
              <th class="px-6 py-4 font-medium">Role</th>
              <th class="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr *ngFor="let movie of movies" class="hover:bg-gray-50 dark:hover:bg-deep-black/20 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="h-10 w-8 rounded overflow-hidden bg-gray-200 flex-shrink-0 mr-3">
                    <img [src]="movie.poster" [alt]="movie.title" class="h-full w-full object-cover">
                  </div>
                  <span class="font-medium text-gray-800 dark:text-ivory">{{movie.title}}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-600 dark:text-gray-300">{{movie.year}}</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {{movie.language}}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">{{movie.role}}</td>
              <td class="px-6 py-4 text-right space-x-2">
                <button (click)="editMovie(movie)" class="text-gray-400 hover:text-royal-gold transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button (click)="deleteMovie(movie.id)" class="text-gray-400 hover:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add/Edit Modal -->
      <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-charcoal rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-800 dark:text-ivory">{{ isEditing ? 'Edit Movie' : 'Add New Movie' }}</h3>
            <button (click)="closeModal()" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input [(ngModel)]="currentMovie.title" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-deep-black text-gray-900 dark:text-ivory focus:ring-royal-gold focus:border-royal-gold">
              </div>
              
              <!-- Year -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                <input [(ngModel)]="currentMovie.year" type="number" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-deep-black text-gray-900 dark:text-ivory focus:ring-royal-gold focus:border-royal-gold">
              </div>
              
              <!-- Language -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                <select [(ngModel)]="currentMovie.language" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-deep-black text-gray-900 dark:text-ivory focus:ring-royal-gold focus:border-royal-gold">
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Multilingual">Multilingual</option>
                </select>
              </div>

               <!-- Director -->
               <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Director</label>
                <input [(ngModel)]="currentMovie.director" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-deep-black text-gray-900 dark:text-ivory focus:ring-royal-gold focus:border-royal-gold">
              </div>

               <!-- Role -->
               <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <input [(ngModel)]="currentMovie.role" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-deep-black text-gray-900 dark:text-ivory focus:ring-royal-gold focus:border-royal-gold">
              </div>

               <!-- Poster URL -->
               <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Poster Image</label>
                <div class="flex gap-2 mb-2">
                  <input [(ngModel)]="currentMovie.poster" type="text" placeholder="Paste link or upload..." class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-deep-black text-gray-900 dark:text-ivory focus:ring-royal-gold focus:border-royal-gold">
                  <button (click)="fileInput.click()" [disabled]="isUploading" class="px-4 py-2 bg-royal-gold/10 hover:bg-royal-gold/20 text-royal-gold rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap">
                    <svg *ngIf="!isUploading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <div *ngIf="isUploading" class="w-5 h-5 border-2 border-royal-gold border-t-transparent rounded-full animate-spin"></div>
                    {{ isUploading ? 'Uploading...' : 'Upload Poster' }}
                  </button>
                  <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
                </div>
                
                <!-- Poster Preview -->
                <div *ngIf="currentMovie.poster" class="mt-2 relative rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 w-32 aspect-[2/3] bg-gray-50 dark:bg-deep-black">
                  <img [src]="currentMovie.poster" class="w-full h-full object-cover" alt="Preview">
                </div>
              </div>

              <!-- Description -->
               <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea [(ngModel)]="currentMovie.description" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-deep-black text-gray-900 dark:text-ivory focus:ring-royal-gold focus:border-royal-gold"></textarea>
              </div>

              <!-- Trailer URL -->
               <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trailer URL</label>
                <input [(ngModel)]="currentMovie.trailer" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-deep-black text-gray-900 dark:text-ivory focus:ring-royal-gold focus:border-royal-gold">
              </div>

              <!-- Genre -->
               <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genres (comma separated)</label>
                <input [ngModel]="currentMovie.genre.join(', ')" (ngModelChange)="updateGenres($event)" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-deep-black text-gray-900 dark:text-ivory focus:ring-royal-gold focus:border-royal-gold">
              </div>
            </div>
          </div>
          
          <div class="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end space-x-3">
            <button (click)="closeModal()" class="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Cancel</button>
            <button (click)="saveMovie()" class="px-4 py-2 bg-royal-gold text-white dark:text-deep-black rounded-lg font-medium hover:bg-royal-gold/90 transition-colors">
              {{ isEditing ? 'Update Movie' : 'Create Movie' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ManageMoviesComponent implements OnInit {
  movies: Movie[] = [];
  isModalOpen = false;
  isEditing = false;
  isUploading = false;

  // Empty movie template
  currentMovie: Movie = this.getEmptyMovie();

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.refreshMovies();
  }

  onFileSelected(event: any): void {
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
          this.currentMovie.poster = res.secure_url;
        } else {
          alert('Upload failed. Please ensure your Cloudinary "Unsigned Upload Preset" is named "ml_default".');
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

  refreshMovies() {
    this.apiService.getMovies().subscribe(data => {
      this.movies = data;
    });
  }

  getEmptyMovie(): Movie {
    return {
      id: 0,
      title: '',
      year: new Date().getFullYear(),
      language: 'Tamil',
      genre: [],
      role: '',
      director: '',
      poster: '',
      description: '',
      trailer: '',
      releaseDate: ''
    };
  }

  openModal() {
    this.isEditing = false;
    this.currentMovie = this.getEmptyMovie();
    this.isModalOpen = true;
  }

  editMovie(movie: Movie) {
    this.isEditing = true;
    // Deep copy to avoid modifying the table before saving
    this.currentMovie = JSON.parse(JSON.stringify(movie));
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  updateGenres(value: string) {
    this.currentMovie.genre = value.split(',').map(g => g.trim()).filter(g => g.length > 0);
  }

  saveMovie() {
    if (this.isEditing) {
      this.apiService.updateMovie(this.currentMovie.id, this.currentMovie).subscribe({
        next: () => {
          this.refreshMovies();
          this.closeModal();
          alert('Movie updated successfully');
        },
        error: (err) => {
          console.error('Error updating movie:', err);
          alert('Failed to update movie');
        }
      });
    } else {
      this.apiService.createMovie(this.currentMovie).subscribe({
        next: () => {
          this.refreshMovies();
          this.closeModal();
          alert('Movie created successfully');
        },
        error: (err) => {
          console.error('Error creating movie:', err);
          alert('Failed to create movie');
        }
      });
    }
  }

  deleteMovie(id: number) {
    if (confirm('Are you sure you want to delete this movie?')) {
      this.apiService.deleteMovie(id).subscribe({
        next: () => {
          this.movies = this.movies.filter(m => m.id !== id);
          alert('Movie deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting movie:', err);
          alert('Failed to delete movie');
        }
      });
    }
  }
}
