import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService, Movie } from '../../services/api.service';
import {
  getMovieFallbackDescription,
  getMovieGenres,
  getMovieReleaseLabel,
  normalizeMovie
} from './movie.utils';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="sr-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel min-h-[520px]">
            <div class="sr-hero-media">
              <img
                [src]="movie?.poster || fallbackBackdrop"
                [alt]="movie?.title || 'Film detail'"
                class="object-[center_18%]"
              />
            </div>

            <div class="sr-hero-copy max-w-4xl text-center md:text-left">
              <span class="sr-kicker">Film Detail</span>
              <h1 class="sr-hero-title">{{ movie?.title || 'Loading film details' }}</h1>
              <p class="sr-hero-subtitle">
                {{ movie ? getMovieReleaseLabel(movie) : 'Loading Samantha\\'s cinematic archive.' }}
              </p>
              <div class="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <a routerLink="/filmography" class="sr-button-ghost">Back To Filmography</a>
                <a *ngIf="movie?.trailer" [href]="movie?.trailer" target="_blank" rel="noopener noreferrer" class="sr-button">
                  Watch Trailer
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section pb-12">
        <div *ngIf="loading" class="sr-empty-state">Loading film details...</div>

        <div *ngIf="!loading && !movie" class="sr-empty-state">
          This film could not be found. Please return to the filmography and try another title.
        </div>

        <div *ngIf="movie" class="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <article class="sr-surface overflow-hidden">
            <div class="movie-detail-poster-wrap">
              <img [src]="movie.poster" [alt]="movie.title" class="movie-detail-poster" />
            </div>
          </article>

          <article class="sr-surface p-6 md:p-8">
            <span class="sr-meta">{{ movie.year }}<span *ngIf="movie.language"> / {{ movie.language }}</span></span>
            <h2 class="sr-card-title mt-3 mb-6">{{ movie.title }}</h2>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="movie-detail-card">
                <span class="sr-field-label">Role</span>
                <span class="block text-lg text-[#f6ecdf]">{{ movie.role || 'Role details coming soon' }}</span>
              </div>
              <div class="movie-detail-card">
                <span class="sr-field-label">Director</span>
                <span class="block text-lg text-[#f6ecdf]">{{ movie.director || 'Director details coming soon' }}</span>
              </div>
            </div>

            <div class="mt-5">
              <span class="sr-field-label">Genre</span>
              <div class="mt-2 flex flex-wrap gap-2">
                <span *ngFor="let genre of getGenres(movie)" class="sr-chip">{{ genre }}</span>
                <span *ngIf="getGenres(movie).length === 0" class="sr-chip">Genre details coming soon</span>
              </div>
            </div>

            <div class="mt-6">
              <span class="sr-field-label">Release</span>
              <p class="sr-card-text mt-2">{{ getMovieReleaseLabel(movie) }}</p>
            </div>

            <div class="mt-6">
              <h3 class="sr-card-title mb-3 text-[2rem]">About the Film</h3>
              <p class="sr-card-text">{{ movie.description || getMovieFallbackDescription(movie) }}</p>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
              <a routerLink="/filmography" class="sr-button-ghost">Back To Filmography</a>
              <a *ngIf="movie.trailer" [href]="movie.trailer" target="_blank" rel="noopener noreferrer" class="sr-button">
                Watch Trailer
              </a>
            </div>
          </article>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .movie-detail-poster-wrap {
      padding: 1.2rem;
      background:
        radial-gradient(circle at top, rgba(243, 232, 220, 0.08), transparent 34%),
        linear-gradient(180deg, rgba(243, 232, 220, 0.02), rgba(8, 4, 4, 0.12));
    }

    .movie-detail-poster {
      width: 100%;
      max-height: 48rem;
      border-radius: 1.5rem;
      object-fit: contain;
      object-position: center top;
      display: block;
      background: rgba(243, 232, 220, 0.04);
    }

    .movie-detail-card {
      border: 1px solid rgba(228, 196, 163, 0.14);
      border-radius: 1.15rem;
      background: rgba(243, 232, 220, 0.03);
      padding: 1rem;
    }
  `]
})
export class MovieDetailComponent implements OnInit {
  loading = true;
  movie: Movie | null = null;
  fallbackBackdrop = 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748036070/behance_download_1696968314742_bg6c1a.jpg';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const movieId = Number(params.get('id'));

      if (!movieId) {
        this.movie = null;
        this.loading = false;
        return;
      }

      this.loading = true;
      this.apiService.getMovie(movieId).subscribe({
        next: (movie) => {
          this.movie = normalizeMovie(movie);
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to load movie details', error);
          this.movie = null;
          this.loading = false;
        }
      });
    });
  }

  getGenres(movie: Movie): string[] {
    return getMovieGenres(movie);
  }

  getMovieReleaseLabel(movie: Movie): string {
    return getMovieReleaseLabel(movie);
  }

  getMovieFallbackDescription(movie: Movie): string {
    return getMovieFallbackDescription(movie);
  }
}
