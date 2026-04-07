import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, Movie } from '../../services/api.service';
import {
  getMovieGenres,
  isCameoMovie,
  isWebSeriesMovie,
  matchesMovieSearch,
  normalizeMovie
} from './movie.utils';

@Component({
  selector: 'app-filmography',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="sr-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel min-h-[560px]">
            <div class="sr-hero-media">
              <img
                src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748036070/behance_download_1696968314742_bg6c1a.jpg"
                alt="Filmography"
                class="object-[center_30%]"
              />
            </div>

            <div class="sr-hero-copy max-w-4xl text-center md:text-left">
              <span class="sr-kicker">Filmography</span>
              <h1 class="sr-hero-title">Cinematic Journey</h1>
              <p class="sr-hero-subtitle">
                Exploring the diverse roles and captivating performances across languages and genres.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="sr-surface p-5">
          <div class="grid grid-cols-1 gap-4 xl:grid-cols-[280px_repeat(4,minmax(0,1fr))]">
            <div>
              <label class="sr-field-label">Search</label>
              <input
                type="search"
                [(ngModel)]="searchTerm"
                (ngModelChange)="applyFilters()"
                placeholder="Search movies..."
                class="sr-input"
              >
            </div>

            <div>
              <label class="sr-field-label">Language</label>
              <select [(ngModel)]="selectedLanguage" (ngModelChange)="applyFilters()" class="sr-select">
                <option value="">All Languages</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Hindi">Hindi</option>
                <option value="Multilingual">Multilingual</option>
              </select>
            </div>

            <div>
              <label class="sr-field-label">Year</label>
              <select [(ngModel)]="selectedYear" (ngModelChange)="applyFilters()" class="sr-select">
                <option value="">All Years</option>
                <option *ngFor="let year of availableYears" [value]="year">{{year}}</option>
              </select>
            </div>

            <div>
              <label class="sr-field-label">Genre</label>
              <select [(ngModel)]="selectedGenre" (ngModelChange)="applyFilters()" class="sr-select">
                <option value="">All Genres</option>
                <option *ngFor="let genre of availableGenres" [value]="genre">{{genre}}</option>
              </select>
            </div>

            <div>
              <label class="sr-field-label">Sort</label>
              <select [(ngModel)]="sortBy" (ngModelChange)="applyFilters()" class="sr-select">
                <option value="year_desc">Newest First</option>
                <option value="year_asc">Oldest First</option>
                <option value="title_asc">A-Z</option>
                <option value="title_desc">Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="sr-section-heading">
          <span class="sr-kicker">Films</span>
          <h2>Feature Film Archive</h2>
          <p>Showing {{filteredMovies.length}} of {{movies.length}} films from the current collection.</p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div *ngFor="let movie of filteredMovies" class="sr-surface overflow-hidden sr-hover-card group">
            <div class="relative aspect-[2/3] overflow-hidden">
              <img
                [src]="movie.poster"
                [alt]="movie.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[rgba(8,4,4,0.82)] via-transparent to-transparent"></div>
              <div class="absolute left-4 top-4 sr-chip">{{movie.language}}</div>
            </div>
            <div class="p-5">
              <span class="sr-meta">{{movie.year}}<span *ngIf="movie.releaseDate"> / {{movie.releaseDate}}</span></span>
              <h3 class="sr-card-title mt-3 mb-2">{{movie.title}}</h3>
              <p class="sr-card-text mb-4">{{movie.role}}</p>
              <a class="sr-button w-full text-center" [routerLink]="['/filmography', movie.id]">View Details</a>
            </div>
          </div>
        </div>

        <div *ngIf="filteredMovies.length === 0" class="sr-empty-state mt-6">
          No movies found. Try adjusting your filters to find what you're looking for.
        </div>
      </section>

      <section class="sr-section" *ngIf="webSeries.length > 0">
        <div class="sr-section-heading">
          <span class="sr-kicker">Streaming</span>
          <h2>Web Series</h2>
          <p>Showing {{webSeries.length}} web series.</p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div *ngFor="let series of webSeries" class="sr-surface overflow-hidden sr-hover-card group">
            <div class="relative aspect-[2/3] overflow-hidden">
              <img [src]="series.poster" [alt]="series.title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div class="absolute inset-0 bg-gradient-to-t from-[rgba(8,4,4,0.82)] via-transparent to-transparent"></div>
              <div class="absolute left-4 top-4 sr-chip is-active">Web Series</div>
            </div>
            <div class="p-5">
              <span class="sr-meta">{{series.year}} / {{series.language}}</span>
              <h3 class="sr-card-title mt-3 mb-2">{{series.title}}</h3>
              <p class="sr-card-text mb-4">{{series.role}}</p>
              <a class="sr-button w-full text-center" [routerLink]="['/filmography', series.id]">View Details</a>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section pb-12" *ngIf="cameoMovies.length > 0">
        <div class="sr-section-heading">
          <span class="sr-kicker">Special Appearances</span>
          <h2>Cameo Performances</h2>
          <p>Showing {{cameoMovies.length}} cameo appearances.</p>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <div *ngFor="let movie of cameoMovies" class="sr-surface overflow-hidden sr-hover-card group">
            <div class="relative aspect-[2/3] overflow-hidden">
              <img [src]="movie.poster" [alt]="movie.title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div class="absolute inset-0 bg-gradient-to-t from-[rgba(8,4,4,0.82)] via-transparent to-transparent"></div>
              <div class="absolute left-4 top-4 sr-chip">Cameo</div>
            </div>
            <div class="p-5">
              <span class="sr-meta">{{movie.year}} / {{movie.language}}</span>
              <h3 class="sr-card-title mt-3 mb-2">{{movie.title}}</h3>
              <p class="sr-card-text mb-4">{{movie.role}}</p>
              <a class="sr-button w-full text-center" [routerLink]="['/filmography', movie.id]">View Details</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class FilmographyComponent implements OnInit {
  movies: Movie[] = [];
  webSeries: Movie[] = [];
  filteredMovies: Movie[] = [];
  cameoMovies: Movie[] = [];

  searchTerm: string = '';
  selectedLanguage: string = '';
  selectedYear: number | string = '';
  selectedGenre: string = '';
  sortBy: string = 'year_desc';

  availableYears: number[] = [];
  availableGenres: string[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchMovies();
  }

  fetchMovies() {
    this.apiService.getMovies().subscribe({
      next: (data) => {
        const normalizedMovies = data.map(movie => this.normalizeMovie(movie));
        this.webSeries = normalizedMovies.filter(movie => isWebSeriesMovie(movie));
        this.movies = normalizedMovies.filter(movie => !isWebSeriesMovie(movie));

        this.cameoMovies = this.movies.filter(movie => isCameoMovie(movie));
        this.movies = this.movies.filter(movie => !isCameoMovie(movie));

        this.extractFilterOptions();
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      }
    });
  }

  extractFilterOptions(): void {
    const years = new Set<number>();
    this.movies.forEach(movie => years.add(movie.year));
    this.availableYears = Array.from(years).sort((a, b) => b - a);

    const genres = new Set<string>();
    this.movies.forEach(movie => {
      this.getGenres(movie).forEach(genre => genres.add(genre));
    });
    this.availableGenres = Array.from(genres).sort();
  }

  applyFilters(): void {
    let result = [...this.movies];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(movie =>
        matchesMovieSearch(movie.title, term) ||
        matchesMovieSearch(movie.role, term) ||
        matchesMovieSearch(movie.director, term)
      );
    }

    if (this.selectedLanguage) {
      result = result.filter(movie => movie.language === this.selectedLanguage);
    }

    if (this.selectedYear) {
      result = result.filter(movie => movie.year === Number(this.selectedYear));
    }

    if (this.selectedGenre) {
      result = result.filter(movie =>
        this.getGenres(movie).some(genre => genre === this.selectedGenre)
      );
    }

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

  getGenres(movie: Movie | null): string[] {
    return getMovieGenres(movie);
  }

  private normalizeMovie(movie: Partial<Movie>): Movie {
    return normalizeMovie(movie);
  }
}
