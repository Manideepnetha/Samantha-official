import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, concat } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface Movie {
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

export interface Award {
  id: number;
  title: string;
  year: number;
  movie?: string;
  category?: string;
  description?: string;
  quote?: string;
  imageUrl?: string;
  type?: string;
}

export interface Philanthropy {
  id?: number;
  title: string;
  description?: string;
  type?: string;
  value?: number;
  imageUrl?: string;
  icon?: string;
  date?: string;
  link?: string;
}

export interface NewsArticle {
  id?: number;
  title: string;
  excerpt: string;
  imageUrl?: string;
  link?: string;
  date?: string;
}

export interface MediaGallery {
  id?: number;
  caption: string;
  imageUrl: string;
  altText?: string;
  type: string;
  date?: string;
}

export interface FashionItem {
  id?: number;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  link?: string;
  type?: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  category?: string;
  metadataJson?: string;
  submittedAt?: string;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = this.resolveApiUrl();

  // --- CACHE VARIABLES ---
  private moviesCache$: Observable<Movie[]> | null = null;
  private awardsCache$: Observable<Award[]> | null = null;
  private philanthropyCache$: Observable<Philanthropy[]> | null = null;
  private newsCache$: Observable<NewsArticle[]> | null = null;
  private mediaCache$: Observable<MediaGallery[]> | null = null;
  private fashionCache$: Observable<FashionItem[]> | null = null;
  private settingsCache$: Observable<SiteSetting[]> | null = null;
  private pageContentCache = new Map<string, Observable<unknown>>();

  constructor(private http: HttpClient, private router: Router) { }

  private getOptions() {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Bypass-Tunnel-Reminder': 'true'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return {
      headers
    };
  }

  private getPublicOptions() {
    return {
      headers: {
        'Bypass-Tunnel-Reminder': 'true'
      }
    };
  }

  private resolveApiUrl(): string {
    if (typeof window !== 'undefined') {
      const { hostname } = window.location;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5035/api';
      }
    }

    return 'https://samantha-official-website-api.onrender.com/api';
  }

  // --- STORAGE HELPERS ---
  private saveToStorage(key: string, data: any) {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }

  private loadFromStorage<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  }

  private removeFromStorage(key: string) {
    localStorage.removeItem(`cache_${key}`);
  }

  private clearPageContentCache(key?: string) {
    if (key) {
      this.pageContentCache.delete(key);
      this.removeFromStorage(`pagecontent_${key}`);
      return;
    }

    this.pageContentCache.clear();
    Object.keys(localStorage)
      .filter(storageKey => storageKey.startsWith('cache_pagecontent_'))
      .forEach(storageKey => localStorage.removeItem(storageKey));
  }

  // Helper to clear cache (call on create/update/delete)
  private clearCache(key: 'movies' | 'awards' | 'philanthropy' | 'news' | 'media' | 'fashion' | 'settings') {
    // We clear both memory cache and storage cache to ensure fresh fetch
    this.removeFromStorage(key);
    switch (key) {
      case 'movies': this.moviesCache$ = null; break;
      case 'awards': this.awardsCache$ = null; break;
      case 'philanthropy': this.philanthropyCache$ = null; break;
      case 'news': this.newsCache$ = null; break;
      case 'media': this.mediaCache$ = null; break;
      case 'fashion': this.fashionCache$ = null; break;
      case 'settings': this.settingsCache$ = null; break;
    }
  }

  clearAllCachedContent() {
    this.moviesCache$ = null;
    this.awardsCache$ = null;
    this.philanthropyCache$ = null;
    this.newsCache$ = null;
    this.mediaCache$ = null;
    this.fashionCache$ = null;
    this.settingsCache$ = null;
    this.clearPageContentCache();

    Object.keys(localStorage)
      .filter(key => key.startsWith('cache_'))
      .forEach(key => localStorage.removeItem(key));
  }

  // --- MOVIES ---
  getMovies(): Observable<Movie[]> {
    // Stale-While-Revalidate Pattern
    const cached = this.loadFromStorage<Movie[]>('movies');

    // Always setup the network request (shared)
    if (!this.moviesCache$) {
      this.moviesCache$ = this.http.get<Movie[]>(`${this.apiUrl}/movies`, this.getOptions())
        .pipe(
          tap(data => this.saveToStorage('movies', data)),
          shareReplay(1)
        );
    }

    // If we have cached data, return it first, then the network response
    if (cached) {
      return concat(of(cached), this.moviesCache$);
    }

    return this.moviesCache$;
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movies/${id}`, this.getOptions());
  }

  createMovie(movie: Movie): Observable<Movie> {
    this.clearCache('movies');
    return this.http.post<Movie>(`${this.apiUrl}/movies`, movie, this.getOptions());
  }

  updateMovie(id: number, movie: Movie): Observable<void> {
    this.clearCache('movies');
    return this.http.put<void>(`${this.apiUrl}/movies/${id}`, movie, this.getOptions());
  }

  deleteMovie(id: number): Observable<void> {
    this.clearCache('movies');
    return this.http.delete<void>(`${this.apiUrl}/movies/${id}`, this.getOptions());
  }

  // --- AWARDS ---
  getAwards(): Observable<Award[]> {
    if (!this.awardsCache$) {
      this.awardsCache$ = this.http.get<Award[]>(`${this.apiUrl}/awards`)
        .pipe(shareReplay(1));
    }
    return this.awardsCache$;
  }

  createAward(award: Award): Observable<Award> {
    this.clearCache('awards');
    return this.http.post<Award>(`${this.apiUrl}/awards`, award, this.getOptions());
  }

  updateAward(id: number, award: Award): Observable<void> {
    this.clearCache('awards');
    return this.http.put<void>(`${this.apiUrl}/awards/${id}`, award, this.getOptions());
  }

  deleteAward(id: number): Observable<void> {
    this.clearCache('awards');
    return this.http.delete<void>(`${this.apiUrl}/awards/${id}`, this.getOptions());
  }

  // --- PHILANTHROPY ---
  getPhilanthropies(): Observable<Philanthropy[]> {
    if (!this.philanthropyCache$) {
      this.philanthropyCache$ = this.http.get<Philanthropy[]>(`${this.apiUrl}/philanthropy`)
        .pipe(shareReplay(1));
    }
    return this.philanthropyCache$;
  }

  createPhilanthropy(philanthropy: Philanthropy): Observable<Philanthropy> {
    this.clearCache('philanthropy');
    return this.http.post<Philanthropy>(`${this.apiUrl}/philanthropy`, philanthropy, this.getOptions());
  }

  updatePhilanthropy(id: number, philanthropy: Philanthropy): Observable<void> {
    this.clearCache('philanthropy');
    return this.http.put<void>(`${this.apiUrl}/philanthropy/${id}`, philanthropy, this.getOptions());
  }

  deletePhilanthropy(id: number): Observable<void> {
    this.clearCache('philanthropy');
    return this.http.delete<void>(`${this.apiUrl}/philanthropy/${id}`, this.getOptions());
  }

  // --- NEWS ---
  getNews(): Observable<NewsArticle[]> {
    const cached = this.loadFromStorage<NewsArticle[]>('news');

    if (!this.newsCache$) {
      this.newsCache$ = this.http.get<NewsArticle[]>(`${this.apiUrl}/news`)
        .pipe(
          tap(data => this.saveToStorage('news', data)),
          shareReplay(1)
        );
    }

    if (cached) {
      return concat(of(cached), this.newsCache$);
    }
    return this.newsCache$;
  }

  createNews(news: NewsArticle): Observable<NewsArticle> {
    this.clearCache('news');
    return this.http.post<NewsArticle>(`${this.apiUrl}/news`, news, this.getOptions());
  }

  updateNews(id: number, news: NewsArticle): Observable<void> {
    this.clearCache('news');
    return this.http.put<void>(`${this.apiUrl}/news/${id}`, news, this.getOptions());
  }

  deleteNews(id: number): Observable<void> {
    this.clearCache('news');
    return this.http.delete<void>(`${this.apiUrl}/news/${id}`, this.getOptions());
  }

  // --- MEDIA GALLERY ---
  getMediaGalleries(): Observable<MediaGallery[]> {
    const cached = this.loadFromStorage<MediaGallery[]>('media');

    if (!this.mediaCache$) {
      this.mediaCache$ = this.http.get<MediaGallery[]>(`${this.apiUrl}/mediagallery`)
        .pipe(
          tap(data => this.saveToStorage('media', data)),
          shareReplay(1)
        );
    }

    if (cached) {
      return concat(of(cached), this.mediaCache$);
    }
    return this.mediaCache$;
  }

  createMediaGallery(media: MediaGallery): Observable<MediaGallery> {
    this.clearCache('media');
    return this.http.post<MediaGallery>(`${this.apiUrl}/mediagallery`, media, this.getOptions());
  }

  updateMediaGallery(id: number, media: MediaGallery): Observable<void> {
    this.clearCache('media');
    return this.http.put<void>(`${this.apiUrl}/mediagallery/${id}`, media, this.getOptions());
  }

  deleteMediaGallery(id: number): Observable<void> {
    this.clearCache('media');
    return this.http.delete<void>(`${this.apiUrl}/mediagallery/${id}`, this.getOptions());
  }

  // --- FASHION ---
  getFashion(): Observable<FashionItem[]> {
    if (!this.fashionCache$) {
      this.fashionCache$ = this.http.get<FashionItem[]>(`${this.apiUrl}/fashion`)
        .pipe(shareReplay(1));
    }
    return this.fashionCache$;
  }

  createFashion(fashion: FashionItem): Observable<FashionItem> {
    this.clearCache('fashion');
    return this.http.post<FashionItem>(`${this.apiUrl}/fashion`, fashion, this.getOptions());
  }

  updateFashion(id: number, fashion: FashionItem): Observable<void> {
    this.clearCache('fashion');
    return this.http.put<void>(`${this.apiUrl}/fashion/${id}`, fashion, this.getOptions());
  }

  deleteFashion(id: number): Observable<void> {
    this.clearCache('fashion');
    return this.http.delete<void>(`${this.apiUrl}/fashion/${id}`, this.getOptions());
  }

  // --- CONTACTS ---
  submitContactMessage(message: ContactMessage): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(`${this.apiUrl}/contact`, message, this.getPublicOptions());
  }

  getContactMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${this.apiUrl}/contact`, this.getOptions());
  }

  // --- BLOGS ---
  getBlogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/blogs`);
  }

  // --- SITE SETTINGS ---
  getSettings(): Observable<SiteSetting[]> {
    const cached = this.loadFromStorage<SiteSetting[]>('settings');

    if (!this.settingsCache$) {
      this.settingsCache$ = this.http.get<SiteSetting[]>(`${this.apiUrl}/settings`, this.getOptions())
        .pipe(
          tap(data => this.saveToStorage('settings', data)),
          shareReplay(1)
        );
    }

    if (cached) {
      return concat(of(cached), this.settingsCache$);
    }
    return this.settingsCache$;
  }

  getSetting(key: string): Observable<SiteSetting> {
    return this.http.get<SiteSetting>(`${this.apiUrl}/settings/${key}`, this.getOptions());
  }

  upsertSetting(setting: SiteSetting): Observable<SiteSetting> {
    this.clearCache('settings');
    return this.http.post<SiteSetting>(`${this.apiUrl}/settings`, setting, this.getOptions());
  }

  // --- PAGE CONTENT ---
  getPageContent<T>(key: string): Observable<T> {
    const storageKey = `pagecontent_${key}`;
    const cached = this.loadFromStorage<T>(storageKey);

    if (!this.pageContentCache.has(key)) {
      const request$ = this.http.get<T>(`${this.apiUrl}/pagecontent/${encodeURIComponent(key)}`, this.getPublicOptions())
        .pipe(
          tap(data => this.saveToStorage(storageKey, data)),
          shareReplay(1)
        );

      this.pageContentCache.set(key, request$);
    }

    const request$ = this.pageContentCache.get(key) as Observable<T>;
    if (cached) {
      return concat(of(cached), request$);
    }

    return request$;
  }

  upsertPageContent<T>(key: string, content: T): Observable<any> {
    this.clearPageContentCache(key);
    return this.http.post(`${this.apiUrl}/pagecontent/${encodeURIComponent(key)}`, content, this.getOptions());
  }

  syncSiteContent(): Observable<any> {
    return this.http.post(`${this.apiUrl}/contentsync/refresh`, {}, this.getOptions())
      .pipe(tap(() => this.clearAllCachedContent()));
  }

  // --- AUTH ---
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response: any) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            if (response.user) {
              localStorage.setItem('user', JSON.stringify(response.user));
            }
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.clearAllCachedContent();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
