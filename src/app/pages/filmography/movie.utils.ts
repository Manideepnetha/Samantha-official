import { Movie, MovieDownloadAsset } from '../../services/api.service';

export const FALLBACK_POSTER_URL =
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
    trailer: normalizeOptionalText(movie.trailer),
    downloadAssets: normalizeDownloadAssets(movie.downloadAssets)
  };
}

export function getMovieGenres(movie: Movie | null): string[] {
  if (!movie || !Array.isArray(movie.genre)) {
    return [];
  }

  return movie.genre.filter((genre): genre is string => typeof genre === 'string' && genre.trim().length > 0);
}

export function getMovieLanguages(movie: Movie | null): string[] {
  if (!movie || typeof movie.language !== 'string') {
    return [];
  }

  return movie.language
    .split(',')
    .map((language) => language.trim())
    .filter(Boolean);
}

export function isMultilingualMovie(movie: Movie | null): boolean {
  return getMovieLanguages(movie).length > 1;
}

export function matchesMovieLanguage(movie: Movie | null, selectedLanguage: string): boolean {
  if (!selectedLanguage) {
    return true;
  }

  if (selectedLanguage === 'Multilingual') {
    return isMultilingualMovie(movie);
  }

  return getMovieLanguages(movie).includes(selectedLanguage);
}

export function getMovieReleaseLabel(movie: Movie): string {
  return movie.releaseDate?.trim() || `Released in ${movie.year}`;
}

export function getMovieSortValue(movie: Movie): number {
  const releaseDate = movie.releaseDate?.trim();
  if (releaseDate && /^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) {
    const parsed = Date.parse(releaseDate);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return Date.UTC(movie.year, 0, 1);
}

export function getMovieFallbackDescription(movie: Movie): string {
  return `${movie.title} is part of Samantha's screen journey, with more story notes to be added soon.`;
}

export function matchesMovieSearch(value: string | undefined, term: string): boolean {
  return normalizeSearchValue(value).includes(normalizeSearchValue(term));
}

export function isWebSeriesMovie(movie: Movie): boolean {
  return matchesMovieSearch(movie.description, 'web series');
}

export function isCameoMovie(movie: Movie): boolean {
  return APPEARANCE_KEYWORDS.some((keyword) =>
    matchesMovieSearch(movie.role, keyword) || matchesMovieSearch(movie.description, keyword)
  );
}

export function getMovieAppearanceLabel(movie: Movie): string {
  if (matchesMovieSearch(movie.role, 'special appearance') || matchesMovieSearch(movie.description, 'special appearance')) {
    return 'Special Appearance';
  }

  if (matchesMovieSearch(movie.role, 'guest appearance') || matchesMovieSearch(movie.description, 'guest appearance')) {
    return 'Guest Appearance';
  }

  return 'Cameo';
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

function normalizeDownloadAssets(value: unknown): MovieDownloadAsset[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const assets = value
    .map((asset) => {
      if (!asset || typeof asset !== 'object') {
        return null;
      }

      const label = normalizeText((asset as { label?: unknown }).label, '');
      const url = normalizeOptionalText((asset as { url?: unknown }).url);
      if (!label || !url) {
        return null;
      }

      return { label, url };
    })
    .filter((asset): asset is MovieDownloadAsset => asset !== null);

  return assets.length > 0 ? assets : undefined;
}

function normalizeSearchValue(value: string | undefined): string {
  return (value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

const APPEARANCE_KEYWORDS = ['cameo', 'special appearance', 'guest appearance'];
