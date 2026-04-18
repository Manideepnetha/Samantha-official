import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, Movie } from '../../services/api.service';
import {
  FALLBACK_POSTER_URL,
  getMovieAppearanceLabel,
  getMovieGenres,
  getMovieLanguages,
  getMovieSortValue,
  isCameoMovie,
  isMultilingualMovie,
  isWebSeriesMovie,
  matchesMovieLanguage,
  matchesMovieSearch,
  normalizeMovie
} from './movie.utils';

@Component({
  selector: 'app-filmography',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="sr-page filmography-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel min-h-[500px] lg:min-h-[560px]">
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

              <div class="film-hero-metrics" *ngIf="!isLoading && totalTitles > 0">
                <span class="film-hero-pill">{{ totalTitles }} Titles</span>
                <span class="film-hero-pill">{{ availableLanguages.length }} Languages</span>
                <span class="film-hero-pill">{{ archiveRangeLabel }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="sr-surface film-filter-panel">
          <div class="film-filter-header">
            <div class="film-filter-copy">
              <span class="sr-kicker">Archive Navigator</span>
              <h2 class="film-filter-title">Browse by era, language, and genre</h2>
              <p class="film-filter-text">
                A tighter editorial layout keeps the archive easier to scan while still feeling premium and cinematic.
              </p>
            </div>

            <div class="film-filter-stats" *ngIf="!isLoading && totalTitles > 0">
              <div class="film-stat">
                <span class="film-stat-value">{{ totalTitles }}</span>
                <span class="film-stat-label">Titles</span>
              </div>
              <div class="film-stat">
                <span class="film-stat-value">{{ availableLanguages.length }}</span>
                <span class="film-stat-label">Languages</span>
              </div>
              <div class="film-stat">
                <span class="film-stat-value">{{ availableYears.length }}</span>
                <span class="film-stat-label">Years</span>
              </div>
            </div>
          </div>

          <div class="film-filter-grid">
            <div class="film-filter-search">
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
              <select [(ngModel)]="selectedLanguage" (ngModelChange)="applyFilters()" class="film-select">
                <option value="">All Languages</option>
                <option *ngFor="let language of availableLanguages" [value]="language">{{ language }}</option>
              </select>
            </div>

            <div>
              <label class="sr-field-label">Year</label>
              <select [(ngModel)]="selectedYear" (ngModelChange)="applyFilters()" class="film-select">
                <option value="">All Years</option>
                <option *ngFor="let year of availableYears" [value]="year">{{ year }}</option>
              </select>
            </div>

            <div>
              <label class="sr-field-label">Genre</label>
              <select [(ngModel)]="selectedGenre" (ngModelChange)="applyFilters()" class="film-select">
                <option value="">All Genres</option>
                <option *ngFor="let genre of availableGenres" [value]="genre">{{ genre }}</option>
              </select>
            </div>

            <div>
              <label class="sr-field-label">Sort</label>
              <select [(ngModel)]="sortBy" (ngModelChange)="applyFilters()" class="film-select">
                <option value="year_desc">Newest First</option>
                <option value="year_asc">Oldest First</option>
                <option value="title_asc">A - Z</option>
                <option value="title_desc">Z - A</option>
              </select>
            </div>
          </div>

          <div class="film-filter-footer" *ngIf="hasActiveFilters">
            <p class="film-filter-status">
              {{ totalFilteredResults }} title{{ totalFilteredResults === 1 ? '' : 's' }} match the current filters.
            </p>
            <button type="button" class="sr-button-ghost film-clear-button" (click)="clearFilters()">
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="sr-section-heading">
          <span class="sr-kicker">Films</span>
          <h2>Feature Film Archive</h2>
          <p *ngIf="isLoading">Loading the current film collection...</p>
          <p *ngIf="!isLoading">Showing {{ filteredMovies.length }} of {{ movies.length }} films from the current collection.</p>
        </div>

        <div *ngIf="filteredMovies.length > 0" class="film-grid">
          <article *ngFor="let movie of filteredMovies" class="sr-surface sr-hover-card group film-card">
            <a
              class="film-card-poster"
              [routerLink]="['/filmography', movie.id]"
              [attr.aria-label]="'View details for ' + movie.title"
            >
              <img
                [src]="movie.poster"
                [alt]="movie.title"
                class="film-card-image transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                (error)="handlePosterError(movie, $event)"
              />
              <div class="film-card-overlay"></div>
              <div class="film-card-badges">
                <span class="sr-chip film-card-chip">{{ movie.language }}</span>
                <span class="film-year-badge">{{ getYearBadge(movie) }}</span>
              </div>
            </a>
            <div class="film-card-body">
              <span class="sr-meta film-card-meta">{{ getCardMeta(movie, 'Feature Film') }}</span>
              <h3 class="film-card-title">{{ movie.title }}</h3>
              <p class="sr-card-text film-card-role">{{ movie.role || 'Role to be announced' }}</p>
              <p class="film-card-detail" *ngIf="movie.director">Directed by {{ movie.director }}</p>
              <a class="sr-button w-full text-center film-card-button" [routerLink]="['/filmography', movie.id]">View Details</a>
            </div>
          </article>
        </div>

        <div *ngIf="isLoading" class="sr-empty-state mt-6">
          Loading filmography...
        </div>

        <div *ngIf="!isLoading && loadError" class="sr-empty-state mt-6">
          We could not load the filmography right now. Please refresh and try again.
        </div>

        <div *ngIf="!isLoading && !loadError && filteredMovies.length === 0" class="sr-empty-state mt-6">
          {{ totalFilteredResults === 0
            ? 'No titles found. Try adjusting your filters to find what you are looking for.'
            : 'No feature films match the current filters. Matching web series or special-appearance results may still appear below.' }}
        </div>
      </section>

      <section class="sr-section" *ngIf="filteredWebSeries.length > 0">
        <div class="sr-section-heading">
          <span class="sr-kicker">Streaming</span>
          <h2>Web Series</h2>
          <p>Showing {{ filteredWebSeries.length }} of {{ webSeries.length }} web series.</p>
        </div>

        <div class="film-grid">
          <article *ngFor="let series of filteredWebSeries" class="sr-surface sr-hover-card group film-card">
            <a
              class="film-card-poster"
              [routerLink]="['/filmography', series.id]"
              [attr.aria-label]="'View details for ' + series.title"
            >
              <img
                [src]="series.poster"
                [alt]="series.title"
                class="film-card-image transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                (error)="handlePosterError(series, $event)"
              />
              <div class="film-card-overlay"></div>
              <div class="film-card-badges">
                <span class="sr-chip film-card-chip is-active">Web Series</span>
                <span class="film-year-badge">{{ getYearBadge(series) }}</span>
              </div>
            </a>
            <div class="film-card-body">
              <span class="sr-meta film-card-meta">{{ getCardMeta(series, 'Web Series', true) }}</span>
              <h3 class="film-card-title">{{ series.title }}</h3>
              <p class="sr-card-text film-card-role">{{ series.role || 'Role to be announced' }}</p>
              <p class="film-card-detail" *ngIf="series.director">Directed by {{ series.director }}</p>
              <a class="sr-button w-full text-center film-card-button" [routerLink]="['/filmography', series.id]">View Details</a>
            </div>
          </article>
        </div>
      </section>

      <section class="sr-section pb-12" *ngIf="filteredCameoMovies.length > 0">
        <div class="sr-section-heading">
          <span class="sr-kicker">Special Appearances</span>
          <h2>Cameos & Special Appearances</h2>
          <p>Showing {{ filteredCameoMovies.length }} of {{ cameoMovies.length }} special appearances.</p>
        </div>

        <div class="film-grid">
          <article *ngFor="let movie of filteredCameoMovies" class="sr-surface sr-hover-card group film-card">
            <a
              class="film-card-poster"
              [routerLink]="['/filmography', movie.id]"
              [attr.aria-label]="'View details for ' + movie.title"
            >
              <img
                [src]="movie.poster"
                [alt]="movie.title"
                class="film-card-image transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
                (error)="handlePosterError(movie, $event)"
              />
              <div class="film-card-overlay"></div>
              <div class="film-card-badges">
                <span class="sr-chip film-card-chip">{{ getAppearanceLabel(movie) }}</span>
                <span class="film-year-badge">{{ getYearBadge(movie) }}</span>
              </div>
            </a>
            <div class="film-card-body">
              <span class="sr-meta film-card-meta">{{ getCardMeta(movie, 'Special Appearance', true) }}</span>
              <h3 class="film-card-title">{{ movie.title }}</h3>
              <p class="sr-card-text film-card-role">{{ movie.role || 'Role to be announced' }}</p>
              <p class="film-card-detail" *ngIf="movie.director">Directed by {{ movie.director }}</p>
              <a class="sr-button w-full text-center film-card-button" [routerLink]="['/filmography', movie.id]">View Details</a>
            </div>
          </article>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .film-select {
      width: 100%;
      padding: 0.95rem 2.5rem 0.95rem 1rem;
      border: 1px solid rgba(228, 196, 163, 0.18);
      border-radius: 1rem;
      background-color: #1a0d0a;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23d6a95d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.85rem center;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      color: #f4ebdf;
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.95rem;
      cursor: pointer;
      transition: border-color 200ms, background-color 200ms;
      outline: none;
    }

    .film-select:hover {
      border-color: rgba(228, 196, 163, 0.4);
      background-color: #221108;
    }

    .film-select:focus {
      border-color: rgba(214, 169, 93, 0.6);
      box-shadow: 0 0 0 3px rgba(214, 169, 93, 0.12);
      background-color: #221108;
    }

    .film-select option {
      background-color: #1a0d0a;
      color: #f4ebdf;
      padding: 0.5rem;
    }

    .film-hero-metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 1.6rem;
    }

    .film-hero-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 2.5rem;
      padding: 0.55rem 0.95rem;
      border: 1px solid rgba(244, 235, 223, 0.16);
      border-radius: 999px;
      background: rgba(11, 5, 4, 0.28);
      backdrop-filter: blur(14px);
      color: #f4ebdf;
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .film-filter-panel {
      padding: clamp(1.25rem, 2vw, 1.75rem);
      border-radius: 2rem;
      background:
        linear-gradient(180deg, rgba(245, 229, 214, 0.08), rgba(17, 9, 7, 0.96)),
        rgba(18, 10, 8, 0.94);
    }

    .film-filter-header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.5rem;
      margin-bottom: 1.4rem;
    }

    .film-filter-copy {
      max-width: 36rem;
    }

    .film-filter-title {
      margin: 0;
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: clamp(1.9rem, 3vw, 2.9rem);
      font-weight: 500;
      line-height: 0.96;
      letter-spacing: -0.03em;
      color: #f6ecdf;
    }

    .film-filter-text {
      margin: 0.85rem 0 0;
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.98rem;
      line-height: 1.8;
      color: rgba(243, 232, 220, 0.72);
    }

    .film-filter-stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.9rem;
      min-width: min(100%, 21rem);
      flex: 1 1 21rem;
    }

    .film-stat {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.95rem 1rem;
      border: 1px solid rgba(228, 196, 163, 0.14);
      border-radius: 1.2rem;
      background: rgba(243, 232, 220, 0.03);
      box-shadow: inset 0 1px 0 rgba(255, 247, 240, 0.03);
    }

    .film-stat-value {
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: 2rem;
      line-height: 0.95;
      color: #f6ecdf;
    }

    .film-stat-label {
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(243, 232, 220, 0.58);
    }

    .film-filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
      gap: 1rem;
    }

    .film-filter-search {
      min-width: 0;
    }

    .film-filter-footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 1.25rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(228, 196, 163, 0.12);
    }

    .film-filter-status {
      margin: 0;
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.92rem;
      line-height: 1.6;
      color: rgba(243, 232, 220, 0.7);
    }

    .film-clear-button {
      min-height: 2.9rem;
      padding: 0.75rem 1.15rem;
      border: 1px solid rgba(228, 196, 163, 0.18);
      background: rgba(243, 232, 220, 0.02);
    }

    .film-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
      gap: 1.35rem;
      align-items: stretch;
    }

    .film-card {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      border-radius: 1.55rem;
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(17, 9, 7, 0.98)),
        rgba(20, 11, 9, 0.96);
      box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
    }

    .film-card-poster {
      position: relative;
      display: block;
      height: clamp(18.5rem, 32vw, 23rem);
      overflow: hidden;
      background: #140907;
    }

    .film-card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .film-card-overlay {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(8, 4, 4, 0.08) 0%, rgba(8, 4, 4, 0.12) 42%, rgba(8, 4, 4, 0.72) 100%),
        radial-gradient(circle at top, rgba(240, 192, 138, 0.12), transparent 42%);
      pointer-events: none;
    }

    .film-card-badges {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 1rem;
    }

    .film-card-chip {
      min-height: 2.2rem;
      max-width: calc(100% - 4.5rem);
      padding: 0.45rem 0.85rem;
      overflow: hidden;
      border-color: rgba(244, 235, 223, 0.18);
      background: rgba(8, 4, 4, 0.42);
      color: #f4ebdf;
      white-space: nowrap;
      text-overflow: ellipsis;
      backdrop-filter: blur(12px);
      font-size: 0.72rem;
      letter-spacing: 0.12em;
    }

    .film-year-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 2.2rem;
      padding: 0.45rem 0.72rem;
      border: 1px solid rgba(244, 235, 223, 0.18);
      border-radius: 999px;
      background: rgba(8, 4, 4, 0.42);
      color: #f4ebdf;
      backdrop-filter: blur(12px);
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.76rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .film-card-body {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 0.85rem;
      padding: 1.15rem 1.15rem 1.25rem;
    }

    .film-card-meta {
      font-size: 0.68rem;
      letter-spacing: 0.14em;
      color: rgba(228, 196, 163, 0.86);
    }

    .film-card-title {
      margin: 0;
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: clamp(1.45rem, 2vw, 2rem);
      font-weight: 500;
      line-height: 0.98;
      color: #f4ebdf;
      display: -webkit-box;
      overflow: hidden;
      min-height: 2.05em;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .film-card-role {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.7;
      color: rgba(243, 232, 220, 0.74);
      display: -webkit-box;
      overflow: hidden;
      min-height: 3.25em;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .film-card-detail {
      margin: 0;
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(243, 232, 220, 0.48);
    }

    .film-card-button {
      margin-top: auto;
      min-height: 3rem;
      font-size: 0.78rem;
      box-shadow: 0 14px 28px rgba(212, 177, 140, 0.16);
    }

    @media (min-width: 1100px) {
      .film-filter-search {
        grid-column: span 2;
      }
    }

    @media (max-width: 900px) {
      .film-filter-panel {
        border-radius: 1.65rem;
      }

      .film-filter-header {
        margin-bottom: 1.2rem;
      }
    }

    @media (max-width: 640px) {
      .film-hero-metrics {
        gap: 0.55rem;
      }

      .film-hero-pill {
        min-height: 2.3rem;
        font-size: 0.68rem;
        letter-spacing: 0.12em;
      }

      .film-card-poster {
        height: 21rem;
      }

      .film-filter-footer {
        align-items: stretch;
      }

      .film-clear-button {
        width: 100%;
      }
    }
  `]
})
export class FilmographyComponent implements OnInit, OnDestroy {
  readonly posterFallbackUrl = FALLBACK_POSTER_URL;
  movies: Movie[] = [];
  webSeries: Movie[] = [];
  filteredMovies: Movie[] = [];
  cameoMovies: Movie[] = [];
  filteredWebSeries: Movie[] = [];
  filteredCameoMovies: Movie[] = [];
  isLoading = true;
  loadError = false;

  searchTerm: string = '';
  selectedLanguage: string = '';
  selectedYear: number | string = '';
  selectedGenre: string = '';
  sortBy: string = 'year_desc';

  availableLanguages: string[] = [];
  availableYears: number[] = [];
  availableGenres: string[] = [];

  // Custom dropdown state kept for potential future use.
  openDropdown: string | null = null;

  readonly sortOptions = [
    { value: 'year_desc', label: 'Newest First' },
    { value: 'year_asc', label: 'Oldest First' },
    { value: 'title_asc', label: 'A - Z' },
    { value: 'title_desc', label: 'Z - A' },
  ];

  readonly sortLabels: Record<string, string> = {
    year_desc: 'Newest First',
    year_asc: 'Oldest First',
    title_asc: 'A - Z',
    title_desc: 'Z - A',
  };

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openDropdown = null;
  }

  toggleDropdown(name: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openDropdown = this.openDropdown === name ? null : name;
  }

  closeDropdown(name: string): void {
    if (this.openDropdown === name) {
      this.openDropdown = null;
    }
  }

  selectFilter(type: string, value: string | number): void {
    switch (type) {
      case 'language':
        this.selectedLanguage = String(value);
        break;
      case 'year':
        this.selectedYear = value;
        break;
      case 'genre':
        this.selectedGenre = String(value);
        break;
      case 'sort':
        this.sortBy = String(value);
        break;
    }

    this.openDropdown = null;
    this.applyFilters();
  }

  constructor(private apiService: ApiService) {}

  ngOnDestroy(): void {}

  get totalFilteredResults(): number {
    return this.filteredMovies.length + this.filteredWebSeries.length + this.filteredCameoMovies.length;
  }

  get totalTitles(): number {
    return this.movies.length + this.webSeries.length + this.cameoMovies.length;
  }

  get archiveRangeLabel(): string {
    if (this.availableYears.length === 0) {
      return 'Archive Updating';
    }

    const newestYear = this.availableYears[0];
    const oldestYear = this.availableYears[this.availableYears.length - 1];
    return newestYear === oldestYear ? `${oldestYear}` : `${oldestYear} - ${newestYear}`;
  }

  get hasActiveFilters(): boolean {
    return Boolean(
      this.searchTerm.trim() ||
      this.selectedLanguage ||
      this.selectedYear ||
      this.selectedGenre ||
      this.sortBy !== 'year_desc'
    );
  }

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies(): void {
    this.isLoading = true;
    this.loadError = false;

    this.apiService.getMovies().subscribe({
      next: (data) => {
        const normalizedMovies = data.map((movie) => this.normalizeMovie(movie));
        this.webSeries = normalizedMovies.filter((movie) => isWebSeriesMovie(movie));
        this.movies = normalizedMovies.filter((movie) => !isWebSeriesMovie(movie));

        this.cameoMovies = this.movies.filter((movie) => isCameoMovie(movie));
        this.movies = this.movies.filter((movie) => !isCameoMovie(movie));

        this.extractFilterOptions();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
        this.isLoading = false;
        this.loadError = true;
      }
    });
  }

  extractFilterOptions(): void {
    const allTitles = [...this.movies, ...this.webSeries, ...this.cameoMovies];
    const years = new Set<number>();
    const languages = new Set<string>();
    const genres = new Set<string>();
    let hasMultilingualTitles = false;

    allTitles.forEach((movie) => {
      years.add(movie.year);
      getMovieLanguages(movie).forEach((language) => languages.add(language));
      this.getGenres(movie).forEach((genre) => genres.add(genre));

      if (isMultilingualMovie(movie)) {
        hasMultilingualTitles = true;
      }
    });

    this.availableLanguages = Array.from(languages).sort((a, b) => a.localeCompare(b));
    if (hasMultilingualTitles) {
      this.availableLanguages.push('Multilingual');
    }

    this.availableYears = Array.from(years).sort((a, b) => b - a);
    this.availableGenres = Array.from(genres).sort();

    if (this.selectedLanguage && !this.availableLanguages.includes(this.selectedLanguage)) {
      this.selectedLanguage = '';
    }

    if (this.selectedYear && !this.availableYears.includes(Number(this.selectedYear))) {
      this.selectedYear = '';
    }

    if (this.selectedGenre && !this.availableGenres.includes(this.selectedGenre)) {
      this.selectedGenre = '';
    }
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredMovies = this.filterMovieCollection(this.movies, term);
    this.filteredWebSeries = this.filterMovieCollection(this.webSeries, term);
    this.filteredCameoMovies = this.filterMovieCollection(this.cameoMovies, term);
  }

  sortMovies(movies: Movie[], sortBy: string): Movie[] {
    const sorted = [...movies];

    switch (sortBy) {
      case 'year_desc':
        return sorted.sort((a, b) => this.compareReleaseOrder(b, a));
      case 'year_asc':
        return sorted.sort((a, b) => this.compareReleaseOrder(a, b));
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

  getCardMeta(movie: Movie, fallbackLabel: string, includeLanguage: boolean = false): string {
    const parts: string[] = [];

    if (includeLanguage && movie.language.trim()) {
      parts.push(movie.language.trim());
    }

    const genres = this.getGenres(movie).slice(0, includeLanguage ? 1 : 2);
    parts.push(...genres);

    return parts.length > 0 ? parts.join(' / ') : fallbackLabel;
  }

  getAppearanceLabel(movie: Movie): string {
    return getMovieAppearanceLabel(movie);
  }

  getYearBadge(movie: Movie): string {
    return /to be announced|tba/i.test(movie.releaseDate || '') ? 'TBA' : String(movie.year);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedLanguage = '';
    this.selectedYear = '';
    this.selectedGenre = '';
    this.sortBy = 'year_desc';
    this.applyFilters();
  }

  handlePosterError(movie: Movie, event?: Event): void {
    if (movie.poster === this.posterFallbackUrl) {
      return;
    }

    movie.poster = this.posterFallbackUrl;

    const image = event?.target;
    if (image instanceof HTMLImageElement) {
      image.src = this.posterFallbackUrl;
    }
  }

  private filterMovieCollection(movies: Movie[], term: string): Movie[] {
    let result = [...movies];

    if (term) {
      result = result.filter((movie) =>
        matchesMovieSearch(movie.title, term) ||
        matchesMovieSearch(movie.role, term) ||
        matchesMovieSearch(movie.director, term) ||
        matchesMovieSearch(movie.language, term) ||
        this.getGenres(movie).some((genre) => matchesMovieSearch(genre, term))
      );
    }

    result = result.filter((movie) => matchesMovieLanguage(movie, this.selectedLanguage));

    if (this.selectedYear) {
      result = result.filter((movie) => movie.year === Number(this.selectedYear));
    }

    if (this.selectedGenre) {
      result = result.filter((movie) =>
        this.getGenres(movie).some((genre) => genre === this.selectedGenre)
      );
    }

    return this.sortMovies(result, this.sortBy);
  }

  private compareReleaseOrder(left: Movie, right: Movie): number {
    const releaseDifference = getMovieSortValue(left) - getMovieSortValue(right);
    if (releaseDifference !== 0) {
      return releaseDifference;
    }

    const yearDifference = left.year - right.year;
    if (yearDifference !== 0) {
      return yearDifference;
    }

    return left.title.localeCompare(right.title);
  }

  private normalizeMovie(movie: Partial<Movie>): Movie {
    return normalizeMovie(movie);
  }
}
