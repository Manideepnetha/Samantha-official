import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of, concat, EMPTY, throwError } from 'rxjs';
import { tap, shareReplay, map, catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { clearStoredAuth, getStoredToken, hasValidSession, isTokenExpired } from './auth-session.utils';

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
  downloadAssets?: MovieDownloadAsset[];
}

export interface MovieDownloadAsset {
  label: string;
  url: string;
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
  collectionKey?: string;
  displayOrder?: number;
}

export interface GalleryCollection {
  id?: number;
  key: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  coverImageUrl?: string;
  accentTone?: string;
  sortOrder: number;
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

export interface QuizSubmission {
  name: string;
  email: string;
  city?: string | null;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
}

export interface QuizCheckResponse {
  played: boolean;
  score: number;
}

export interface QuizLeaderboardEntry {
  rank: number;
  name: string;
  city: string;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  submittedAt: string;
}

export interface FanCreation {
  id?: number;
  title: string;
  creatorName: string;
  type: 'Poster' | 'Video' | 'Illustration';
  description?: string;
  imageUrl: string;
  mediaUrl?: string;
  dateLabel?: string;
  platform?: string;
  isFeatured?: boolean;
}

export interface UploadedMediaAsset {
  url: string;
  publicId: string;
  fileName: string;
  format: string;
  width: number;
  height: number;
}

export interface PageContentEnvelope<T> {
  content: T;
  updatedAt?: string;
}

export interface VisitorEntrySubmission {
  clientVisitorId: string;
  name: string;
  socialMediaId?: string;
  source?: string;
}

export interface VisitorEntry {
  id: number;
  clientVisitorId: string;
  name: string;
  socialMediaId?: string;
  source?: string;
  userAgent?: string;
  ipAddress?: string;
  firstCompletedAt: string;
  lastCompletedAt: string;
  isFirstVisit?: boolean;
}

export interface FanWallMessage {
  id?: number;
  name: string;
  city?: string;
  message: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
  createdAt?: string;
}

export interface FanPollVoteRequest {
  optionKey: string;
  clientId: string;
}

export interface FanPollOptionResult {
  optionKey: string;
  label: string;
  votes: number;
  percentage: number;
}

export interface FanPollResult {
  pollKey: string;
  title: string;
  totalVotes: number;
  hasVoted: boolean;
  userOptionKey?: string | null;
  options: FanPollOptionResult[];
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user?: AuthenticatedUser;
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
  private galleryCollectionsCache$: Observable<GalleryCollection[]> | null = null;
  private fashionCache$: Observable<FashionItem[]> | null = null;
  private settingsCache$: Observable<SiteSetting[]> | null = null;
  private fanCreationsCache$: Observable<FanCreation[]> | null = null;
  private pageContentCache = new Map<string, Observable<PageContentEnvelope<unknown>>>();

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
      const { hostname, origin, port } = window.location;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        if (port === '5035') {
          return `${origin}/api`;
        }

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

  private getPageContentStorageKeys(key: string): string[] {
    return [`pagecontent_v2_${key}`, `pagecontent_${key}`];
  }

  private loadCachedPageContentEnvelope<T>(key: string): PageContentEnvelope<T> | null {
    const [currentStorageKey, legacyStorageKey] = this.getPageContentStorageKeys(key);
    const cachedEnvelope = this.loadFromStorage<PageContentEnvelope<T>>(currentStorageKey);

    if (cachedEnvelope && typeof cachedEnvelope === 'object' && 'content' in cachedEnvelope) {
      return cachedEnvelope;
    }

    const legacyContent = this.loadFromStorage<T>(legacyStorageKey);
    if (legacyContent === null) {
      return null;
    }

    return { content: legacyContent };
  }

  private savePageContentEnvelope<T>(key: string, entry: PageContentEnvelope<T>) {
    const [currentStorageKey, legacyStorageKey] = this.getPageContentStorageKeys(key);
    this.saveToStorage(currentStorageKey, entry);
    this.removeFromStorage(legacyStorageKey);
  }

  private clearPageContentCache(key?: string) {
    if (key) {
      this.pageContentCache.delete(key);
      const storageKeys = this.getPageContentStorageKeys(key);
      storageKeys.forEach(storageKey => this.removeFromStorage(storageKey));
      return;
    }

    this.pageContentCache.clear();
    Object.keys(localStorage)
      .filter(storageKey =>
        storageKey.startsWith('cache_pagecontent_')
        || storageKey.startsWith('cache_pagecontent_v2_'))
      .forEach(storageKey => localStorage.removeItem(storageKey));
  }

  private extractPageContentUpdatedAt<T>(response: HttpResponse<T>): string | undefined {
    return response.headers.get('X-Content-Updated-At')
      ?? response.headers.get('Last-Modified')
      ?? undefined;
  }

  // Helper to clear cache (call on create/update/delete)
  private clearCache(key: 'movies' | 'awards' | 'philanthropy' | 'news' | 'media' | 'galleryCollections' | 'fashion' | 'settings' | 'fanCreations') {
    // We clear both memory cache and storage cache to ensure fresh fetch
    this.removeFromStorage(key);
    switch (key) {
      case 'movies': this.moviesCache$ = null; break;
      case 'awards': this.awardsCache$ = null; break;
      case 'philanthropy': this.philanthropyCache$ = null; break;
      case 'news': this.newsCache$ = null; break;
      case 'media': this.mediaCache$ = null; break;
      case 'galleryCollections': this.galleryCollectionsCache$ = null; break;
      case 'fashion': this.fashionCache$ = null; break;
      case 'settings': this.settingsCache$ = null; break;
      case 'fanCreations': this.fanCreationsCache$ = null; break;
    }
  }

  private finalizeContentMutation<T>(request$: Observable<T>): Observable<T> {
    return request$.pipe(
      tap(() => this.clearAllCachedContent())
    );
  }

  clearAllCachedContent() {
    this.moviesCache$ = null;
    this.awardsCache$ = null;
    this.philanthropyCache$ = null;
    this.newsCache$ = null;
    this.mediaCache$ = null;
    this.galleryCollectionsCache$ = null;
    this.fashionCache$ = null;
    this.settingsCache$ = null;
    this.fanCreationsCache$ = null;
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
    return this.finalizeContentMutation(
      this.http.post<Movie>(`${this.apiUrl}/movies`, movie, this.getOptions())
    );
  }

  updateMovie(id: number, movie: Movie): Observable<void> {
    this.clearCache('movies');
    return this.finalizeContentMutation(
      this.http.put<void>(`${this.apiUrl}/movies/${id}`, movie, this.getOptions())
    );
  }

  deleteMovie(id: number): Observable<void> {
    this.clearCache('movies');
    return this.finalizeContentMutation(
      this.http.delete<void>(`${this.apiUrl}/movies/${id}`, this.getOptions())
    );
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
    return this.finalizeContentMutation(
      this.http.post<Award>(`${this.apiUrl}/awards`, award, this.getOptions())
    );
  }

  updateAward(id: number, award: Award): Observable<void> {
    this.clearCache('awards');
    return this.finalizeContentMutation(
      this.http.put<void>(`${this.apiUrl}/awards/${id}`, award, this.getOptions())
    );
  }

  deleteAward(id: number): Observable<void> {
    this.clearCache('awards');
    return this.finalizeContentMutation(
      this.http.delete<void>(`${this.apiUrl}/awards/${id}`, this.getOptions())
    );
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
    return this.finalizeContentMutation(
      this.http.post<Philanthropy>(`${this.apiUrl}/philanthropy`, philanthropy, this.getOptions())
    );
  }

  updatePhilanthropy(id: number, philanthropy: Philanthropy): Observable<void> {
    this.clearCache('philanthropy');
    return this.finalizeContentMutation(
      this.http.put<void>(`${this.apiUrl}/philanthropy/${id}`, philanthropy, this.getOptions())
    );
  }

  deletePhilanthropy(id: number): Observable<void> {
    this.clearCache('philanthropy');
    return this.finalizeContentMutation(
      this.http.delete<void>(`${this.apiUrl}/philanthropy/${id}`, this.getOptions())
    );
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
    return this.finalizeContentMutation(
      this.http.post<NewsArticle>(`${this.apiUrl}/news`, news, this.getOptions())
    );
  }

  updateNews(id: number, news: NewsArticle): Observable<void> {
    this.clearCache('news');
    return this.finalizeContentMutation(
      this.http.put<void>(`${this.apiUrl}/news/${id}`, news, this.getOptions())
    );
  }

  deleteNews(id: number): Observable<void> {
    this.clearCache('news');
    return this.finalizeContentMutation(
      this.http.delete<void>(`${this.apiUrl}/news/${id}`, this.getOptions())
    );
  }

  // --- MEDIA GALLERY ---
  getMediaGalleries(forceRefresh = false): Observable<MediaGallery[]> {
    const cached = this.loadFromStorage<MediaGallery[]>('media');

    if (!this.mediaCache$ || forceRefresh) {
      this.mediaCache$ = this.http.get<MediaGallery[]>(`${this.apiUrl}/mediagallery`)
        .pipe(
          tap(data => this.saveToStorage('media', data)),
          retry({ count: 2, delay: 1000 }),
          catchError(error => {
            if (cached) {
              console.warn('Media gallery request failed. Falling back to cached media data.', error);
              return EMPTY;
            }

            return throwError(() => error);
          }),
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
    return this.finalizeContentMutation(
      this.http.post<MediaGallery>(`${this.apiUrl}/mediagallery`, media, this.getOptions())
    );
  }

  updateMediaGallery(id: number, media: MediaGallery): Observable<void> {
    this.clearCache('media');
    return this.finalizeContentMutation(
      this.http.put<void>(`${this.apiUrl}/mediagallery/${id}`, media, this.getOptions())
    );
  }

  deleteMediaGallery(id: number): Observable<void> {
    this.clearCache('media');
    return this.finalizeContentMutation(
      this.http.delete<void>(`${this.apiUrl}/mediagallery/${id}`, this.getOptions())
    );
  }

  // --- GALLERY COLLECTIONS ---
  getGalleryCollections(forceRefresh = false): Observable<GalleryCollection[]> {
    const cached = this.loadFromStorage<GalleryCollection[]>('galleryCollections');

    if (!this.galleryCollectionsCache$ || forceRefresh) {
      this.galleryCollectionsCache$ = this.http.get<GalleryCollection[]>(`${this.apiUrl}/gallerycollections`, this.getPublicOptions())
        .pipe(
          tap(data => this.saveToStorage('galleryCollections', data)),
          retry({ count: 2, delay: 1000 }),
          catchError(error => {
            if (cached) {
              console.warn('Gallery collections request failed. Falling back to cached gallery collections.', error);
              return EMPTY;
            }

            return throwError(() => error);
          }),
          shareReplay(1)
        );
    }

    if (cached) {
      return concat(of(cached), this.galleryCollectionsCache$);
    }

    return this.galleryCollectionsCache$;
  }

  createGalleryCollection(collection: GalleryCollection): Observable<GalleryCollection> {
    this.clearCache('galleryCollections');
    return this.finalizeContentMutation(
      this.http.post<GalleryCollection>(`${this.apiUrl}/gallerycollections`, collection, this.getOptions())
    );
  }

  updateGalleryCollection(id: number, collection: GalleryCollection): Observable<void> {
    this.clearCache('galleryCollections');
    this.clearCache('media');
    return this.finalizeContentMutation(
      this.http.put<void>(`${this.apiUrl}/gallerycollections/${id}`, collection, this.getOptions())
    );
  }

  deleteGalleryCollection(id: number): Observable<void> {
    this.clearCache('galleryCollections');
    this.clearCache('media');
    return this.finalizeContentMutation(
      this.http.delete<void>(`${this.apiUrl}/gallerycollections/${id}`, this.getOptions())
    );
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
    return this.finalizeContentMutation(
      this.http.post<FashionItem>(`${this.apiUrl}/fashion`, fashion, this.getOptions())
    );
  }

  updateFashion(id: number, fashion: FashionItem): Observable<void> {
    this.clearCache('fashion');
    return this.finalizeContentMutation(
      this.http.put<void>(`${this.apiUrl}/fashion/${id}`, fashion, this.getOptions())
    );
  }

  deleteFashion(id: number): Observable<void> {
    this.clearCache('fashion');
    return this.finalizeContentMutation(
      this.http.delete<void>(`${this.apiUrl}/fashion/${id}`, this.getOptions())
    );
  }

  // --- FAN CREATIONS ---
  getFanCreations(): Observable<FanCreation[]> {
    const cached = this.loadFromStorage<FanCreation[]>('fanCreations');

    if (!this.fanCreationsCache$) {
      this.fanCreationsCache$ = this.http.get<FanCreation[]>(`${this.apiUrl}/fancreations`, this.getPublicOptions())
        .pipe(
          tap(data => this.saveToStorage('fanCreations', data)),
          shareReplay(1)
        );
    }

    if (cached) {
      return concat(of(cached), this.fanCreationsCache$);
    }

    return this.fanCreationsCache$;
  }

  createFanCreation(item: FanCreation): Observable<FanCreation> {
    this.clearCache('fanCreations');
    return this.finalizeContentMutation(
      this.http.post<FanCreation>(`${this.apiUrl}/fancreations`, item, this.getOptions())
    );
  }

  updateFanCreation(id: number, item: FanCreation): Observable<void> {
    this.clearCache('fanCreations');
    return this.finalizeContentMutation(
      this.http.put<void>(`${this.apiUrl}/fancreations/${id}`, item, this.getOptions())
    );
  }

  deleteFanCreation(id: number): Observable<void> {
    this.clearCache('fanCreations');
    return this.finalizeContentMutation(
      this.http.delete<void>(`${this.apiUrl}/fancreations/${id}`, this.getOptions())
    );
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
    return this.finalizeContentMutation(
      this.http.post<SiteSetting>(`${this.apiUrl}/settings`, setting, this.getOptions())
    );
  }

  // --- PAGE CONTENT ---
  getPageContentWithMetadata<T>(key: string, forceRefresh = false): Observable<PageContentEnvelope<T>> {
    const cached = this.loadCachedPageContentEnvelope<T>(key);

    if (!this.pageContentCache.has(key) || forceRefresh) {
      const request$ = this.http.get<T>(`${this.apiUrl}/pagecontent/${encodeURIComponent(key)}`, {
        ...this.getPublicOptions(),
        observe: 'response' as const
      }).pipe(
        map((response: HttpResponse<T>) => ({
          content: response.body as T,
          updatedAt: this.extractPageContentUpdatedAt(response)
        })),
        tap(entry => this.savePageContentEnvelope(key, entry)),
        catchError(error => {
          if (cached) {
            console.warn(`Page content request failed for ${key}. Falling back to cached page content.`, error);
            return of(cached);
          }

          return throwError(() => error);
        }),
        shareReplay(1)
      );

      this.pageContentCache.set(key, request$ as Observable<PageContentEnvelope<unknown>>);
    }

    const request$ = this.pageContentCache.get(key) as Observable<PageContentEnvelope<T>>;
    if (forceRefresh) {
      return request$;
    }

    if (cached) {
      return concat(of(cached), request$);
    }

    return request$;
  }

  getPageContent<T>(key: string, forceRefresh = false): Observable<T> {
    return this.getPageContentWithMetadata<T>(key, forceRefresh).pipe(
      map(entry => entry.content)
    );
  }

  upsertPageContent<T>(key: string, content: T): Observable<any> {
    this.clearPageContentCache(key);
    return this.finalizeContentMutation(
      this.http.post(`${this.apiUrl}/pagecontent/${encodeURIComponent(key)}`, content, this.getOptions())
    );
  }

  syncSiteContent(): Observable<any> {
    return this.http.post(`${this.apiUrl}/contentsync/refresh`, {}, this.getOptions())
      .pipe(tap(() => this.clearAllCachedContent()));
  }

  uploadImage(file: File, folder?: string): Observable<UploadedMediaAsset> {
    return this.uploadImages([file], folder).pipe(
      map(results => results[0])
    );
  }

  uploadImages(files: File[], folder?: string): Observable<UploadedMediaAsset[]> {
    const formData = new FormData();

    files.forEach(file => formData.append('files', file, file.name));

    if (folder?.trim()) {
      formData.append('folder', folder.trim());
    }

    return this.http.post<UploadedMediaAsset[]>(`${this.apiUrl}/uploads/images`, formData, this.getOptions());
  }

  // --- VISITOR ENTRY TRACKING ---
  recordVisitorEntry(payload: VisitorEntrySubmission): Observable<VisitorEntry> {
    return this.http.post<VisitorEntry>(`${this.apiUrl}/visitorentries`, payload, this.getPublicOptions());
  }

  getVisitorEntries(): Observable<VisitorEntry[]> {
    return this.http.get<VisitorEntry[]>(`${this.apiUrl}/visitorentries`, this.getOptions());
  }

  // --- FAN WALL ---
  getFanWallMessages(): Observable<FanWallMessage[]> {
    return this.http.get<FanWallMessage[]>(`${this.apiUrl}/fanwall`, this.getPublicOptions());
  }

  submitFanWallMessage(message: FanWallMessage): Observable<FanWallMessage> {
    return this.http.post<FanWallMessage>(`${this.apiUrl}/fanwall`, message, this.getPublicOptions());
  }

  getAdminFanWallMessages(): Observable<FanWallMessage[]> {
    return this.http.get<FanWallMessage[]>(`${this.apiUrl}/fanwall/admin`, this.getOptions());
  }

  updateFanWallMessageStatus(id: number, status: NonNullable<FanWallMessage['status']>): Observable<FanWallMessage> {
    return this.http.put<FanWallMessage>(`${this.apiUrl}/fanwall/${id}/status`, { status }, this.getOptions());
  }

  deleteFanWallMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/fanwall/${id}`, this.getOptions());
  }

  // --- FAN POLLS ---
  getFanPollResult(pollKey: string, clientId?: string): Observable<FanPollResult> {
    const query = clientId?.trim() ? `?clientId=${encodeURIComponent(clientId.trim())}` : '';
    return this.http.get<FanPollResult>(`${this.apiUrl}/fanpoll/${encodeURIComponent(pollKey)}${query}`, this.getPublicOptions());
  }

  submitFanPollVote(pollKey: string, payload: FanPollVoteRequest): Observable<FanPollResult> {
    return this.http.post<FanPollResult>(`${this.apiUrl}/fanpoll/${encodeURIComponent(pollKey)}/vote`, payload, this.getPublicOptions());
  }

  // --- QUIZ ---
  checkQuizStatus(email: string): Observable<QuizCheckResponse> {
    return this.http.get<QuizCheckResponse>(`${this.apiUrl}/quiz/check?email=${encodeURIComponent(email.trim())}`, this.getPublicOptions());
  }

  submitQuizEntry(entry: QuizSubmission): Observable<QuizLeaderboardEntry> {
    return this.http.post<QuizLeaderboardEntry>(`${this.apiUrl}/quiz/submit`, entry, this.getPublicOptions());
  }

  getQuizLeaderboard(): Observable<QuizLeaderboardEntry[]> {
    return this.http.get<QuizLeaderboardEntry[]>(`${this.apiUrl}/quiz/leaderboard`, this.getPublicOptions());
  }

  getQuizPlayerEntry(email: string): Observable<QuizLeaderboardEntry> {
    return this.http.get<QuizLeaderboardEntry>(`${this.apiUrl}/quiz/entry?email=${encodeURIComponent(email.trim())}`, this.getPublicOptions());
  }

  // --- AUTH ---
  login(credentials: { email: string, password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response: LoginResponse) => {
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
    clearStoredAuth();
    this.clearAllCachedContent();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return hasValidSession();
  }

  getToken(): string | null {
    const token = getStoredToken();

    if (isTokenExpired(token)) {
      clearStoredAuth();
      return null;
    }

    return token;
  }
}
