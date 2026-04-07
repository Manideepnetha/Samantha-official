import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Movie } from '../../../services/api.service';
import { AdminImageUploadFieldComponent } from '../../components/admin-image-upload-field/admin-image-upload-field.component';

@Component({
  selector: 'app-manage-movies',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminImageUploadFieldComponent],
  template: `
    <div class="sr-admin-page">
      <div class="sr-admin-page-header">
        <div>
          <span class="sr-kicker">Filmography</span>
          <h1 class="sr-admin-title">Manage Movies</h1>
          <p class="sr-admin-subtitle">Add, refine, and curate the filmography entries that appear across the public site.</p>
        </div>
        <button (click)="openModal()" class="sr-button">Add Movie</button>
      </div>

      <div class="sr-surface sr-admin-table-wrap">
        <div class="sr-admin-table-scroll">
          <table class="sr-admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Year</th>
                <th>Language</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let movie of movies">
                <td>
                  <div class="sr-admin-media">
                    <img [src]="movie.poster" [alt]="movie.title" class="sr-admin-thumb is-poster">
                    <div>
                      <div class="sr-admin-title-cell">{{ movie.title }}</div>
                      <p class="sr-card-text mt-2 max-w-md">{{ movie.director || 'Director not added yet' }}</p>
                    </div>
                  </div>
                </td>
                <td>{{ movie.year }}</td>
                <td><span class="sr-admin-badge is-soft">{{ movie.language }}</span></td>
                <td class="max-w-sm">{{ movie.role }}</td>
                <td>
                  <div class="sr-admin-actions">
                    <button (click)="editMovie(movie)" class="sr-admin-action">Edit</button>
                    <button (click)="deleteMovie(movie.id)" class="sr-admin-action-danger">Delete</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="movies.length === 0" class="sr-admin-empty-row">
                <td colspan="5">No movies have been added yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div *ngIf="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
        <div class="sr-modal-panel w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 md:p-7">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="sr-kicker">{{ isEditing ? 'Editing' : 'Creating' }}</span>
              <h2 class="sr-card-title mt-2">{{ isEditing ? 'Edit Movie' : 'Add Movie' }}</h2>
            </div>
            <button type="button" (click)="closeModal()" class="sr-close-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label class="sr-field-label">Title</label>
              <input [(ngModel)]="currentMovie.title" type="text" class="sr-input">
            </div>
            <div>
              <label class="sr-field-label">Year</label>
              <input [(ngModel)]="currentMovie.year" type="number" class="sr-input">
            </div>
            <div>
              <label class="sr-field-label">Language</label>
              <select [(ngModel)]="currentMovie.language" class="sr-select">
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Hindi">Hindi</option>
                <option value="Multilingual">Multilingual</option>
              </select>
            </div>
            <div>
              <label class="sr-field-label">Director</label>
              <input [(ngModel)]="currentMovie.director" type="text" class="sr-input">
            </div>
            <div class="md:col-span-2">
              <label class="sr-field-label">Role</label>
              <input [(ngModel)]="currentMovie.role" type="text" class="sr-input">
            </div>
            <div class="md:col-span-2">
              <app-admin-image-upload-field
                label="Poster Image"
                [value]="currentMovie.poster"
                (valueChange)="currentMovie.poster = $event"
                placeholder="Paste poster URL"
                uploadButtonLabel="Upload Poster"
                uploadFolder="movies"
                previewAlt="Poster preview"
                previewClass="sr-admin-thumb is-poster h-48 w-32">
              </app-admin-image-upload-field>
            </div>
            <div class="md:col-span-2">
              <label class="sr-field-label">Description</label>
              <textarea [(ngModel)]="currentMovie.description" rows="4" class="sr-textarea"></textarea>
            </div>
            <div class="md:col-span-2">
              <label class="sr-field-label">Trailer URL</label>
              <input [(ngModel)]="currentMovie.trailer" type="text" class="sr-input">
            </div>
            <div class="md:col-span-2">
              <label class="sr-field-label">Genres</label>
              <input [ngModel]="currentMovie.genre.join(', ')" (ngModelChange)="updateGenres($event)" type="text" class="sr-input" placeholder="Drama, Romance, Action">
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-3">
            <button type="button" (click)="closeModal()" class="sr-button-ghost">Cancel</button>
            <button type="button" (click)="saveMovie()" class="sr-button">{{ isEditing ? 'Update Movie' : 'Create Movie' }}</button>
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

  currentMovie: Movie = this.getEmptyMovie();

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.refreshMovies();
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
