import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface Movie {
  id: number;
  title: string;
  year: number;
  releaseDate?: string;
  language: string;
  genre: string[];
  role: string;
  director: string;
  poster: string;
  description: string;
  trailer?: string;
}

@Component({
  selector: 'app-filmography',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-ivory dark:bg-deep-black">
      <!-- Hero Section -->
      <section class="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div class="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748036070/behance_download_1696968314742_bg6c1a.jpg" 
            alt="Filmography" 
            class="w-full h-full object-cover object-[center_30%]" 
          />
          <div class="absolute inset-0 bg-gradient-to-b from-deep-black/80 to-deep-black/40"></div>
        </div>
        
        <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">Filmography</span>
          <h1 class="text-4xl md:text-6xl font-playfair font-bold text-ivory mb-6 text-shadow">Cinematic Journey</h1>
          <p class="text-xl md:text-2xl text-ivory/90 font-lora italic max-w-3xl">Exploring the diverse roles and captivating performances across languages and genres.</p>
        </div>
      </section>

      <!-- Filters Section -->
      <section class="py-10 bg-white dark:bg-charcoal shadow-md relative z-20">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <!-- Search -->
            <div class="relative w-full md:w-64">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input 
                type="search" 
                [(ngModel)]="searchTerm"
                (ngModelChange)="applyFilters()"
                placeholder="Search movies..." 
                class="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-deep-black text-charcoal dark:text-ivory focus:ring-royal-gold focus:border-royal-gold"
              >
            </div>

            <!-- Filters -->
            <div class="flex flex-col sm:flex-row gap-4 md:gap-6">
              <!-- Language Filter -->
              <select 
                [(ngModel)]="selectedLanguage"
                (ngModelChange)="applyFilters()"
                class="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-deep-black text-charcoal dark:text-ivory focus:ring-royal-gold focus:border-royal-gold"
              >
                <option value="">All Languages</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Hindi">Hindi</option>
                <option value="Multilingual">Multilingual</option>
              </select>

              <!-- Year Filter -->
              <select 
                [(ngModel)]="selectedYear"
                (ngModelChange)="applyFilters()"
                class="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-deep-black text-charcoal dark:text-ivory focus:ring-royal-gold focus:border-royal-gold"
              >
                <option value="">All Years</option>
                <option *ngFor="let year of availableYears" [value]="year">{{year}}</option>
              </select>

              <!-- Genre Filter -->
              <select 
                [(ngModel)]="selectedGenre"
                (ngModelChange)="applyFilters()"
                class="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-deep-black text-charcoal dark:text-ivory focus:ring-royal-gold focus:border-royal-gold"
              >
                <option value="">All Genres</option>
                <option *ngFor="let genre of availableGenres" [value]="genre">{{genre}}</option>
              </select>

              <!-- Sort -->
              <select 
                [(ngModel)]="sortBy"
                (ngModelChange)="applyFilters()"
                class="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-deep-black text-charcoal dark:text-ivory focus:ring-royal-gold focus:border-royal-gold"
              >
                <option value="year_desc">Newest First</option>
                <option value="year_asc">Oldest First</option>
                <option value="title_asc">A-Z</option>
                <option value="title_desc">Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- Movies Grid -->
      <section class="py-16 bg-ivory dark:bg-deep-black">
        <div class="container mx-auto px-4">
          <!-- Results info -->
          <div class="mb-8 text-charcoal dark:text-ivory">
            <h2 class="text-3xl md:text-4xl font-playfair font-bold mb-2">Films</h2>
            <p>Showing {{filteredMovies.length}} of {{movies.length}} films</p>
          </div>

          <!-- Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div *ngFor="let movie of filteredMovies" class="movie-card group relative rounded-lg overflow-hidden shadow-lg hover-lift">
              <!-- Poster -->
              <div class="relative aspect-[2/3] overflow-hidden">
                <img 
                  [src]="movie.poster" 
                  [alt]="movie.title" 
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                
                <!-- Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-deep-black/90 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span class="text-royal-gold font-inter text-sm">{{movie.year}} • {{movie.language}}</span>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">{{movie.title}}</h3>
                  <p class="text-ivory/80 text-sm mb-4">{{movie.role}}</p>
                  <button 
                    class="mt-auto px-4 py-2 bg-royal-gold text-deep-black rounded font-inter font-medium hover:bg-royal-gold/90 transition-colors"
                    (click)="openMovieDetails(movie)"
                  >
                    View Details
                  </button>
                </div>
              </div>
              
              <!-- Basic Info (Visible on Mobile) -->
              <div class="sm:hidden bg-white dark:bg-charcoal p-4">
                <span class="text-royal-gold font-inter text-sm">{{movie.year}} • {{movie.language}}</span>
                <h3 class="font-playfair text-lg font-bold text-charcoal dark:text-ivory">{{movie.title}}</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 text-sm">{{movie.role}}</p>
              </div>
            </div>
          </div>

          <!-- No Results Message -->
          <div *ngIf="filteredMovies.length === 0" class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-playfair font-bold text-charcoal dark:text-ivory mb-2">No Movies Found</h3>
            <p class="text-charcoal/70 dark:text-ivory/70">Try adjusting your filters to find what you're looking for.</p>
          </div>
        </div>
      </section>

      <!-- Web Series Section -->
      <section class="py-16 bg-ivory dark:bg-deep-black">
        <div class="container mx-auto px-4">
          <div class="mb-8 text-charcoal dark:text-ivory">
            <h2 class="text-3xl md:text-4xl font-playfair font-bold mb-2">Web Series</h2>
            <p>Showing {{webSeries.length}} web series</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div *ngFor="let series of webSeries" class="movie-card group relative rounded-lg overflow-hidden shadow-lg hover-lift">
              <div class="relative aspect-[2/3] overflow-hidden">
                <ng-container *ngIf="series.title === 'The Family Man (Season 2)'; else normalPosterBg">
                  <img [src]="series.poster" [alt]="series.title + ' blurred background'"
                    class="absolute inset-0 w-full h-full object-cover scale-110 blur-lg opacity-60 z-0" />
                  <img [src]="series.poster" [alt]="series.title"
                    class="relative w-full h-full transition-transform duration-500 group-hover:scale-110 object-cover rounded-lg shadow-lg z-10" />
                  <div class="absolute inset-0 bg-gradient-to-t from-deep-black/90 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-20">
                    <span class="text-royal-gold font-inter text-sm">{{series.year}} • {{series.language}}</span>
                    <h3 class="font-playfair text-xl font-bold text-ivory mb-2">{{series.title}}</h3>
                    <p class="text-ivory/80 text-sm mb-4">{{series.role}}</p>
                    <span class="inline-block px-3 py-1 bg-royal-gold/20 text-royal-gold rounded-full text-xs mb-2">Web Series</span>
                    <button class="mt-auto px-4 py-2 bg-royal-gold text-deep-black rounded font-inter font-medium hover:bg-royal-gold/90 transition-colors" (click)="openMovieDetails(series)">View Details</button>
                  </div>
                </ng-container>
                <ng-template #normalPosterBg>
                  <img [src]="series.poster" [alt]="series.title"
                    class="w-full h-full transition-transform duration-500 group-hover:scale-110 object-cover" />
                  <div class="absolute inset-0 bg-gradient-to-t from-deep-black/90 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span class="text-royal-gold font-inter text-sm">{{series.year}} • {{series.language}}</span>
                    <h3 class="font-playfair text-xl font-bold text-ivory mb-2">{{series.title}}</h3>
                    <p class="text-ivory/80 text-sm mb-4">{{series.role}}</p>
                    <span class="inline-block px-3 py-1 bg-royal-gold/20 text-royal-gold rounded-full text-xs mb-2">Web Series</span>
                    <button class="mt-auto px-4 py-2 bg-royal-gold text-deep-black rounded font-inter font-medium hover:bg-royal-gold/90 transition-colors" (click)="openMovieDetails(series)">View Details</button>
                  </div>
                </ng-template>
              </div>
              <div class="sm:hidden bg-white dark:bg-charcoal p-4">
                <span class="text-royal-gold font-inter text-sm">{{series.year}} • {{series.language}}</span>
                <h3 class="font-playfair text-lg font-bold text-charcoal dark:text-ivory">{{series.title}}</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 text-sm">{{series.role}}</p>
                <span class="inline-block px-3 py-1 bg-royal-gold/20 text-royal-gold rounded-full text-xs mt-2">Web Series</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Cameo Appearances Section -->
      <section class="py-16 bg-ivory dark:bg-deep-black" *ngIf="cameoMovies.length > 0">
        <div class="container mx-auto px-4">
          <div class="mb-8 text-charcoal dark:text-ivory">
            <h2 class="text-3xl md:text-4xl font-playfair font-bold mb-2">Cameo Appearances</h2>
            <p>Showing {{cameoMovies.length}} cameo appearances</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div *ngFor="let movie of cameoMovies" class="movie-card group relative rounded-lg overflow-hidden shadow-lg hover-lift">
              <div class="relative aspect-[2/3] overflow-hidden">
                <img 
                  [src]="movie.poster" 
                  [alt]="movie.title" 
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                
                <div class="absolute inset-0 bg-gradient-to-t from-deep-black/90 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span class="text-royal-gold font-inter text-sm">{{movie.year}} • {{movie.language}}</span>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">{{movie.title}}</h3>
                  <p class="text-ivory/80 text-sm mb-4">{{movie.role}}</p>
                  <span class="inline-block px-3 py-1 bg-royal-gold/20 text-royal-gold rounded-full text-xs mb-2">Cameo</span>
                  <button 
                    class="mt-auto px-4 py-2 bg-royal-gold text-deep-black rounded font-inter font-medium hover:bg-royal-gold/90 transition-colors"
                    (click)="openMovieDetails(movie)"
                  >
                    View Details
                  </button>
                </div>
              </div>
              
              <div class="sm:hidden bg-white dark:bg-charcoal p-4">
                <span class="text-royal-gold font-inter text-sm">{{movie.year}} • {{movie.language}}</span>
                <h3 class="font-playfair text-lg font-bold text-charcoal dark:text-ivory">{{movie.title}}</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 text-sm">{{movie.role}}</p>
                <span class="inline-block px-3 py-1 bg-royal-gold/20 text-royal-gold rounded-full text-xs mt-2">Cameo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Movie Details Modal -->
      <div *ngIf="selectedMovie" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-black/80 backdrop-blur-sm">
        <div class="relative bg-white dark:bg-charcoal rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Close Button -->
          <button 
            (click)="closeMovieDetails()" 
            class="absolute top-4 right-4 text-charcoal/60 dark:text-ivory/60 hover:text-royal-gold"
            aria-label="Close details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Poster -->
            <div class="aspect-[2/3] rounded-t-lg md:rounded-l-lg md:rounded-tr-none overflow-hidden">
              <img [src]="selectedMovie.poster" [alt]="selectedMovie.title" class="w-full h-full object-cover" />
            </div>

            <!-- Details -->
            <div class="p-6 md:pr-8 md:py-8">
              <span class="text-royal-gold font-inter text-sm">{{selectedMovie.year}} • {{selectedMovie.language}}</span>
              <h2 class="font-playfair text-2xl font-bold text-charcoal dark:text-ivory mt-2 mb-4">{{selectedMovie.title}}</h2>
              
              <div class="space-y-4 mb-6">
                <div>
                  <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">Role</span>
                  <span class="block font-medium text-charcoal dark:text-ivory">{{selectedMovie.role}}</span>
                </div>
                
                <div>
                  <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">Director</span>
                  <span class="block font-medium text-charcoal dark:text-ivory">{{selectedMovie.director}}</span>
                </div>
                
                <div>
                  <span class="block text-sm font-medium text-gray-500 dark:text-gray-400">Genre</span>
                  <div class="flex flex-wrap gap-2 mt-1">
                    <span *ngFor="let genre of selectedMovie.genre" class="px-3 py-1 bg-royal-gold/10 text-royal-gold rounded-full text-xs">
                      {{genre}}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="mb-8">
                <h3 class="font-playfair text-lg font-bold mb-2 text-charcoal dark:text-ivory">About the Film</h3>
                <p class="text-charcoal/80 dark:text-ivory/80">{{selectedMovie.description}}</p>
              </div>
              
              <div *ngIf="selectedMovie.trailer" class="mt-auto">
                <a [href]="selectedMovie.trailer" target="_blank" class="inline-flex items-center px-4 py-2 bg-royal-gold text-deep-black rounded font-inter font-medium hover:bg-royal-gold/90 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Trailer
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Modal animations */
    @keyframes modal-fade-in {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    
    .modal-container {
      animation: modal-fade-in 0.3s ease-out forwards;
    }
  `]
})
export class FilmographyComponent implements OnInit {
  movies: Movie[] = [];
  webSeries: Movie[] = [];
  filteredMovies: Movie[] = [];
  cameoMovies: Movie[] = [];
  selectedMovie: Movie | null = null;

  // Filter values
  searchTerm: string = '';
  selectedLanguage: string = '';
  selectedYear: number | string = '';
  selectedGenre: string = '';
  sortBy: string = 'year_desc';

  // Available filter options
  availableYears: number[] = [];
  availableGenres: string[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchMovies();
  }

  fetchMovies() {
    this.apiService.getMovies().subscribe({
      next: (data) => {
        // Separate Web Series and Movies
        this.webSeries = data.filter(m => m.description.toLowerCase().includes('web series'));
        this.movies = data.filter(m => !m.description.toLowerCase().includes('web series'));

        // Extract Cameos (if any specific logic needed, or just keep them in movies list but filter for display?)
        // The original template had a separate section for Cameos, let's filter them too if needed.
        // Original code: `cameoMovies: Movie[] = [];` but it wasn't populated in the snippet I saw?
        // Ah, I missed looking at `ngOnInit` in the previous `view_file`.
        // Let's assume cameos are just movies with Role="Cameo" or similar?
        // In the seed data: "Vinnaithaandi Varuvaayaa" -> Role: "Cameo".

        this.cameoMovies = this.movies.filter(m => m.role.toLowerCase().includes('cameo') || m.description.toLowerCase().includes('cameo'));
        // Remove cameos from main movies list if they are in a separate section
        this.movies = this.movies.filter(m => !m.role.toLowerCase().includes('cameo') && !m.description.toLowerCase().includes('cameo'));

        this.extractFilterOptions();
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      }
    });
  }

  extractFilterOptions(): void {
    // Extract unique years
    const years = new Set<number>();
    this.movies.forEach(movie => years.add(movie.year));
    this.availableYears = Array.from(years).sort((a, b) => b - a); // Sort years descending

    // Extract unique genres
    const genres = new Set<string>();
    this.movies.forEach(movie => {
      movie.genre.forEach(genre => genres.add(genre));
    });
    this.availableGenres = Array.from(genres).sort();
  }

  applyFilters(): void {
    let result = [...this.movies];

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(movie =>
        movie.title.toLowerCase().includes(term) ||
        movie.role.toLowerCase().includes(term) ||
        movie.director.toLowerCase().includes(term)
      );
    }

    // Apply language filter
    if (this.selectedLanguage) {
      result = result.filter(movie => movie.language === this.selectedLanguage);
    }

    // Apply year filter
    if (this.selectedYear) {
      result = result.filter(movie => movie.year === Number(this.selectedYear));
    }

    // Apply genre filter
    if (this.selectedGenre) {
      result = result.filter(movie =>
        movie.genre.some(genre => genre === this.selectedGenre)
      );
    }

    // Apply sorting
    result = this.sortMovies(result, this.sortBy);

    this.filteredMovies = result;
  }

  sortMovies(movies: Movie[], sortBy: string): Movie[] {
    const sorted = [...movies];

    switch (sortBy) {
      case 'year_desc':
        return sorted.sort((a, b) => (b.releaseDate || `${b.year}`) > (a.releaseDate || `${a.year}`) ? 1 : -1);
      case 'year_asc':
        return sorted.sort((a, b) => (a.releaseDate || `${a.year}`) > (b.releaseDate || `${b.year}`) ? 1 : -1);
      case 'title_asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title_desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  }

  openMovieDetails(movie: Movie): void {
    this.selectedMovie = movie;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeMovieDetails(): void {
    this.selectedMovie = null;
    document.body.style.overflow = ''; // Re-enable scrolling
  }
}