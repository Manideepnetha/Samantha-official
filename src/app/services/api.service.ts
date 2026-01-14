import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// Define the interface here to match Backend model
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
  movie?: string; // Added optional property
  category?: string; // Added optional property
  description?: string;
  quote?: string;
  imageUrl?: string;
  type?: string; // Make type optional if not present in mock data
}

export interface Philanthropy {
  id?: number;
  title: string;
  description?: string;
  type?: string;
  value?: number;
  imageUrl?: string;
  icon?: string;
  date?: string; // Added optional property
  link?: string; // Added optional property
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
  type?: string; // Added optional property
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // private apiUrl = 'http://localhost:5035/api';
  private apiUrl = 'https://five-papers-follow.loca.lt/api';

  constructor(private http: HttpClient, private router: Router) { }

  // --- MOCK DATA FOR FALLBACK ---
  // Movies
  // Movies Authentication & CRUD
  private getOptions() {
    const token = this.getToken();
    return {
      headers: {
        'Authorization': `Bearer ${token || ''}`,
        'Bypass-Tunnel-Reminder': 'true'
      }
    };
  }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies`, this.getOptions());
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movies/${id}`, this.getOptions());
  }

  createMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(`${this.apiUrl}/movies`, movie, this.getOptions());
  }

  updateMovie(id: number, movie: Movie): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/movies/${id}`, movie, this.getOptions());
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/movies/${id}`, this.getOptions());
  }

  // Awards
  getAwards(): Observable<Award[]> {
    return this.http.get<Award[]>(`${this.apiUrl}/awards`);
  }

  createAward(award: Award): Observable<Award> {
    return this.http.post<Award>(`${this.apiUrl}/awards`, award, this.getHeaders());
  }

  updateAward(id: number, award: Award): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/awards/${id}`, award, this.getHeaders());
  }

  deleteAward(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/awards/${id}`, this.getHeaders());
  }

  // Philanthropy
  getPhilanthropies(): Observable<Philanthropy[]> {
    return this.http.get<Philanthropy[]>(`${this.apiUrl}/philanthropy`);
  }

  createPhilanthropy(philanthropy: Philanthropy): Observable<Philanthropy> {
    return this.http.post<Philanthropy>(`${this.apiUrl}/philanthropy`, philanthropy, this.getHeaders());
  }

  updatePhilanthropy(id: number, philanthropy: Philanthropy): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/philanthropy/${id}`, philanthropy, this.getHeaders());
  }

  deletePhilanthropy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/philanthropy/${id}`, this.getHeaders());
  }

  // News
  getNews(): Observable<NewsArticle[]> {
    return this.http.get<NewsArticle[]>(`${this.apiUrl}/news`);
  }

  createNews(news: NewsArticle): Observable<NewsArticle> {
    return this.http.post<NewsArticle>(`${this.apiUrl}/news`, news, this.getHeaders());
  }

  updateNews(id: number, news: NewsArticle): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/news/${id}`, news, this.getHeaders());
  }

  deleteNews(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/news/${id}`, this.getHeaders());
  }

  // Media Gallery
  getMediaGalleries(): Observable<MediaGallery[]> {
    return this.http.get<MediaGallery[]>(`${this.apiUrl}/mediagallery`);
  }

  createMediaGallery(media: MediaGallery): Observable<MediaGallery> {
    return this.http.post<MediaGallery>(`${this.apiUrl}/mediagallery`, media, this.getHeaders());
  }

  updateMediaGallery(id: number, media: MediaGallery): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mediagallery/${id}`, media, this.getHeaders());
  }

  deleteMediaGallery(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/mediagallery/${id}`, this.getHeaders());
  }

  // Fashion
  getFashion(): Observable<FashionItem[]> {
    return this.http.get<FashionItem[]>(`${this.apiUrl}/fashion`);
  }

  createFashion(fashion: FashionItem): Observable<FashionItem> {
    return this.http.post<FashionItem>(`${this.apiUrl}/fashion`, fashion, this.getHeaders());
  }

  updateFashion(id: number, fashion: FashionItem): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/fashion/${id}`, fashion, this.getHeaders());
  }

  deleteFashion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/fashion/${id}`, this.getHeaders());
  }

  // Auth Methods
  // ... (keep auth methods as is, login will just fail on Vercel which is expected for Admin)
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
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
