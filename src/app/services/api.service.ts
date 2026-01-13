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
  private apiUrl = 'http://localhost:5035/api';

  constructor(private http: HttpClient, private router: Router) { }

  // --- MOCK DATA FOR FALLBACK ---
  private mockMovies: Movie[] = [
    { id: 1, title: 'Maa Inti Bangaram', year: 2025, releaseDate: 'Expected 2025', language: 'Telugu', genre: ['Drama'], role: 'Lead', director: 'TBA', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1768338977/vdTawCMwiQs-HD_hz86rl.jpg', description: 'A heartwarming family drama.' },
    { id: 2, title: 'Subham', year: 2025, releaseDate: 'May 9 2025', language: 'Telugu', genre: ['Drama'], role: 'Maata', director: 'TBA', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748018718/subham-et00440249-1747030168_rsxwsc.avif', description: 'Expected May 9, 2025.' },
    { id: 3, title: 'Rakt Brahmand', year: 2025, releaseDate: '2025', language: 'Hindi', genre: ['Fantasy'], role: 'Lead', director: 'Rahi Anil Barve', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122747/20240727_100042_wgs661.jpg', description: 'A thrilling fantasy series.' },
    { id: 4, title: 'Kushi', year: 2023, releaseDate: 'Sep 1, 2023', language: 'Telugu', genre: ['Romance'], role: 'Aradhya', director: 'Shiva Nirvana', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122707/20220909_210838_vrhgsu.jpg', description: 'A love story.' },
    { id: 5, title: 'The Family Man (Season 2)', year: 2021, releaseDate: 'Jun 4, 2021', language: 'Hindi', genre: ['Action', 'Thriller'], role: 'Raji', director: 'Raj & DK', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045289/Majili_aqbpbd.jpg', description: 'A gritty web series. (Role: Cameo/Lead antagonist)' },
    { id: 6, title: 'Vinnaithaandi Varuvaayaa', year: 2010, releaseDate: 'Feb 26, 2010', language: 'Tamil', genre: ['Romance'], role: 'Jessie (Cameo)', director: 'Gautham Menon', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296812/SRP_q8wmpl.jpg', description: 'A cameo appearance.' }
  ];

  private mockNews: NewsArticle[] = [
    { id: 1, title: 'Galatta Interview', date: 'May 15, 2025', excerpt: 'Candid conversation with Baradwaj Rangan.', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748181752/1KBvNGVxuMg-HD_gvqzhe.jpg', link: '#' },
    { id: 2, title: 'Celebrating 15 Years', date: 'April 28, 2025', excerpt: 'Special Apsara Awards 2025 Promo.', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748181934/5SK0jFVolHU-HD_za0gfe.jpg', link: '#' },
    { id: 3, title: 'Health Talk', date: 'April 10, 2025', excerpt: 'Samantha on health and lifestyle.', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748182251/oeK3C-9cbVc-HD_qzprbm.jpg', link: '#' }
  ];

  private mockGallery: MediaGallery[] = [
    { id: 1, caption: 'Elegant Portrait', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045091/7fb8df223537765.67fa812e2e11a_y4wnfj.jpg', type: 'Home' },
    { id: 2, caption: 'Traditional Look', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045106/behance_download_1696836520640_z70bkf.jpg', type: 'fashion' },
    { id: 3, caption: 'Candid Moment', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045105/RDT_20230918_1518324927662270333256076_x6bzvb.png', type: 'events' },
    { id: 4, caption: 'Majili Movie', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045289/Majili_aqbpbd.jpg', type: 'films' },
    { id: 5, caption: 'Glamorous Style', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg', type: 'photoshoots' }
  ];

  private mockAwards: Award[] = [
    { id: 1, title: 'Filmfare Award', category: 'Best Debut Female', year: 2011, movie: 'Ye Maaya Chesave', description: 'For her outstanding performance as Jessie.', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748295799/5_6185746542628962570_c68nyo.jpg' },
    { id: 2, title: 'Nandi Award', category: 'Special Jury Award', year: 2013, movie: 'Eega', description: 'Recognizing her role in the blockbuster Eega.', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748295799/5_6185746542628962570_c68nyo.jpg' }
  ];

  private mockPhilanthropy: Philanthropy[] = [
    { id: 1, title: 'Pratyusha Support', description: 'Supporting healthcare for underprivileged children.', date: '2012-Present', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296812/SRP_q8wmpl.jpg', link: '#' }
  ];

  private mockFashion: FashionItem[] = [
    { id: 1, title: 'Saaki Launch', description: 'Launching her own fashion label Saaki.', date: '2020', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg', type: 'Label' }
  ];

  // Movies
  // Movies Authentication & CRUD
  private getHeaders() {
    const token = this.getToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies`)
      .pipe(catchError(() => of(this.mockMovies)));
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/movies/${id}`)
      .pipe(catchError(() => {
        const m = this.mockMovies.find(x => x.id === id);
        return m ? of(m) : of({} as Movie);
      }));
  }

  createMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(`${this.apiUrl}/movies`, movie, this.getHeaders());
  }

  updateMovie(id: number, movie: Movie): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/movies/${id}`, movie, this.getHeaders());
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/movies/${id}`, this.getHeaders());
  }

  // Awards
  getAwards(): Observable<Award[]> {
    return this.http.get<Award[]>(`${this.apiUrl}/awards`)
      .pipe(catchError(() => of(this.mockAwards)));
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
    return this.http.get<Philanthropy[]>(`${this.apiUrl}/philanthropy`)
      .pipe(catchError(() => of(this.mockPhilanthropy)));
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
    return this.http.get<NewsArticle[]>(`${this.apiUrl}/news`)
      .pipe(catchError(() => of(this.mockNews)));
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
    return this.http.get<MediaGallery[]>(`${this.apiUrl}/mediagallery`)
      .pipe(catchError(() => of(this.mockGallery)));
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
    return this.http.get<FashionItem[]>(`${this.apiUrl}/fashion`)
      .pipe(catchError(() => of(this.mockFashion)));
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
