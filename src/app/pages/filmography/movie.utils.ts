import { Movie } from '../../services/api.service';

const FALLBACK_POSTER_URL =
  'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122621/Attarintiki_Daredi_Release_Date_Posters_21_cdba22.jpg';

export function normalizeMovie(movie: Partial<Movie>): Movie {
  return {
    id: Number(movie.id) || 0,
    title: normalizeText(movie.title, 'Untitled Project'),
    year: Number(movie.year) || new Date().getFullYear(),
    releaseDate: normalizeOptionalText(movie.releaseDate),
    language: normalizeText(movie.language, 'Language to be updated'),
    genre: normalizeGenres(movie.genre),
    role: normalizeText(movie.role, ''),
    director: normalizeText(movie.director, ''),
    poster: normalizeText(movie.poster, FALLBACK_POSTER_URL),
    description: normalizeText(movie.description, ''),
    trailer: normalizeOptionalText(movie.trailer)
  };
}

export function getMovieGenres(movie: Movie | null): string[] {
  if (!movie || !Array.isArray(movie.genre)) {
    return [];
  }

  return movie.genre.filter((genre): genre is string => typeof genre === 'string' && genre.trim().length > 0);
}

export function getMovieReleaseLabel(movie: Movie): string {
  return movie.releaseDate?.trim() || `Released in ${movie.year}`;
}

export function getMovieFallbackDescription(movie: Movie): string {
  return `${movie.title} is part of Samantha's screen journey, with more story notes to be added soon.`;
}

export function matchesMovieSearch(value: string | undefined, term: string): boolean {
  return (value || '').toLowerCase().includes(term);
}

export function isWebSeriesMovie(movie: Movie): boolean {
  return matchesMovieSearch(movie.description, 'web series');
}

export function isCameoMovie(movie: Movie): boolean {
  return matchesMovieSearch(movie.role, 'cameo') || matchesMovieSearch(movie.description, 'cameo');
}

function normalizeGenres(genres: Movie['genre'] | string | null | undefined): string[] {
  if (Array.isArray(genres)) {
    return genres
      .filter((genre): genre is string => typeof genre === 'string')
      .map(genre => genre.trim())
      .filter(Boolean);
  }

  if (typeof genres === 'string') {
    return genres.split(',').map(genre => genre.trim()).filter(Boolean);
  }

  return [];
}

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function normalizeOptionalText(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
