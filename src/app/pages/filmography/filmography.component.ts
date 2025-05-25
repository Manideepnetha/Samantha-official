import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
                </ng-container>
                <ng-template #normalPosterBg>
                  <img [src]="series.poster" [alt]="series.title"
                    class="w-full h-full transition-transform duration-500 group-hover:scale-110 object-cover" />
                </ng-template>
                <div class="absolute inset-0 bg-gradient-to-t from-deep-black/90 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span class="text-royal-gold font-inter text-sm">{{series.year}} • {{series.language}}</span>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">{{series.title}}</h3>
                  <p class="text-ivory/80 text-sm mb-4">{{series.role}}</p>
                  <span class="inline-block px-3 py-1 bg-royal-gold/20 text-royal-gold rounded-full text-xs mb-2">Web Series</span>
                  <button class="mt-auto px-4 py-2 bg-royal-gold text-deep-black rounded font-inter font-medium hover:bg-royal-gold/90 transition-colors" (click)="openMovieDetails(series)">View Details</button>
                </div>
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
  movies: Movie[] = [
    { id: 1, title: 'Ye Maaya Chesave', year: 2010, releaseDate: '2010-02-26', language: 'Telugu', genre: ['Romance', 'Drama'], role: 'Jessie', director: 'Gautham Vasudev Menon', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122619/big_72182_2b57b25f6b78309614a6d526b9419b5a_q3uhir.jpg', description: 'Released February 26, 2010.', trailer: '' },
    { id: 2, title: 'Vinnaithaandi Varuvaayaa', year: 2010, releaseDate: '2010-02-26', language: 'Tamil', genre: ['Romance', 'Drama'], role: 'Cameo', director: 'Gautham Vasudev Menon', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748156999/O_My_Friend_Telugu_Movie_Images_ccvjle.jpg', description: 'Cameo. Released February 26, 2010.', trailer: '' },
    { id: 3, title: 'Baana Kaathadi', year: 2010, releaseDate: '2010-08-06', language: 'Tamil', genre: ['Drama'], role: 'Priya', director: 'Badri Venkatesh', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122620/MV5BMTJiODNjYjMtZmQxNC00Zjk0LTgyMjUtNGUzMmJiYzJjMjMyXkEyXkFqcGdeQXVyODk1MzE5NDA_._V1__h5q6lx.jpg', description: 'Released August 6, 2010.', trailer: '' },
    { id: 4, title: 'Moscowin Kavery', year: 2010, releaseDate: '2010-08-27', language: 'Tamil', genre: ['Romance'], role: 'Kaveri', director: 'Ravi Varman', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122620/moscowin_kaveri_posters_03_b5zkab.jpg', description: 'Released August 27, 2010.', trailer: '' },
    { id: 5, title: 'Brindavanam', year: 2010, releaseDate: '2010-10-14', language: 'Telugu', genre: ['Romance', 'Drama'], role: 'Indu', director: 'Vamsi Paidipally', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122618/brindavanamwp_6_murgci.jpg', description: 'Released October 14, 2010.', trailer: '' },
    { id: 6, title: 'Nadunisi Naaygal', year: 2011, language: 'Tamil', genre: ['Thriller'], role: 'Cameo', director: 'Gautham Vasudev Menon', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748157293/MV5BOTgxOTUyYTktYzQ3NC00MGIwLThiNWMtMjgxOTM4N2EyMzZkXkEyXkFqcGc_._V1__rlnnmi.jpg', description: 'Cameo. Released February 18, 2011.', trailer: '' },
    { id: 7, title: 'Dookudu', year: 2011, language: 'Telugu', genre: ['Action', 'Comedy'], role: 'Prashanthi', director: 'Srinu Vaitla', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122619/Picsart_25-05-24_13-12-39-407_jsfgqk.jpg', description: 'Released September 23, 2011.', trailer: '' },
    { 
      id: 8, 
      title: 'Eega / Naan Ee', 
      year: 2012, 
      language: 'Telugu, Tamil', 
      genre: ['Fantasy', 'Action'], 
      role: 'Bindu', 
      director: 'S. S. Rajamouli', 
      poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122620/C_23673_dmfo9e.jpg', 
      description: 'Released July 6, 2012. Telugu version titled "Eega", Tamil version titled "Naan Ee".', 
      trailer: '' 
    },
    { 
      id: 9, 
      title: 'Neethane En Ponvasantham / Yeto Vellipoyindhi Manasu', 
      year: 2012, 
      language: 'Tamil, Telugu', 
      genre: ['Romance', 'Drama'], 
      role: 'Nithya', 
      director: 'Gautham Vasudev Menon', 
      poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122620/C50nIOvXMAAV5EB_pconzm.jpg', 
      description: 'Released December 14, 2012. Tamil version titled "Neethane En Ponvasantham", Telugu version titled "Yeto Vellipoyindhi Manasu".', 
      trailer: '' 
    },
    { id: 10, title: 'Seethamma Vakitlo Sirimalle Chettu', year: 2013, language: 'Telugu', genre: ['Drama'], role: 'Geetha', director: 'Srikanth Addala', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122620/155803_403954009689964_477256738_n_jcokmy.jpg', description: 'Released January 11, 2013.', trailer: '' },
    { id: 11, title: 'Jabardasth', year: 2013, language: 'Telugu', genre: ['Comedy'], role: 'Shreya', director: 'B. V. Nandini Reddy', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122620/Jabardasth-telugu-movie-songs-lyrics_jyzdsa.jpg', description: 'Released February 22, 2013.', trailer: '' },
    { id: 12, title: 'Attarintiki Daredi', year: 2013, language: 'Telugu', genre: ['Drama', 'Comedy'], role: 'Sashi', director: 'Trivikram Srinivas', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122621/Attarintiki_Daredi_Release_Date_Posters_21_cdba22.jpg', description: 'Released September 27, 2013.', trailer: '' },
    { id: 13, title: 'Ramayya Vasthavayya', year: 2013, language: 'Telugu', genre: ['Action', 'Drama'], role: 'Akkam', director: 'Harish Shankar', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122621/1600862506.Ramayya_Vastavayya__21_zybu6u.jpg', description: 'Released October 11, 2013.', trailer: '' },
    { id: 14, title: 'Manam', year: 2014, language: 'Telugu', genre: ['Drama', 'Fantasy'], role: 'Anjali', director: 'Vikram Kumar', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122619/Manam_Movie_release_date_Posters_1_vdkoet.jpg', description: 'Released May 23, 2014.', trailer: '' },
    { id: 15, title: 'Autonagar Surya', year: 2014, language: 'Telugu', genre: ['Action', 'Drama'], role: 'Siri', director: 'Deva Katta', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122619/Autonagar_Surya_Movie_New_Wallpapers_1_pcdxpo.jpg', description: 'Released June 27, 2014.', trailer: '' },
    { id: 16, title: 'Alludu Seenu', year: 2014, language: 'Telugu', genre: ['Action', 'Comedy'], role: 'Cameo', director: 'V. V. Vinayak', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122621/0Alludu_Srinu_profile_j45i0m.png', description: 'Cameo. Released July 24, 2014.', trailer: '' },
    { id: 17, title: 'Anjaan', year: 2014, language: 'Tamil', genre: ['Action', 'Thriller'], role: 'Jeeva', director: 'N. Lingusamy', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122619/suriya_samantha_anjaan_movie_first_look_posters_wallpapers_57d4c8e_vltwnp.jpg', description: 'Released August 15, 2014.', trailer: '' },
    { id: 18, title: 'Rabhasa', year: 2014, language: 'Telugu', genre: ['Action', 'Comedy'], role: 'Indu', director: 'Santosh Srinivas', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122619/rabhasa_movie_wallpapers_jr_ntr_samantha_07031d8_byb8bb.jpg', description: 'Released August 29, 2014.', trailer: '' },
    { id: 19, title: 'Kaththi', year: 2014, language: 'Tamil', genre: ['Action', 'Drama'], role: 'Ankitha', director: 'A. R. Murugadoss', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122619/f0f76f373519ae46b739b1b78a4f9473_xrxmvb.jpg', description: 'Released October 22, 2014.', trailer: '' },
    { id: 20, title: 'S/O Satyamurthy', year: 2015, language: 'Telugu', genre: ['Drama'], role: 'Subbalakshmi', director: 'Trivikram Srinivas', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122619/rabhasa_movie_wallpapers_jr_ntr_samantha_07031d8_byb8bb.jpg', description: 'Released April 9, 2015.', trailer: '' },
    { id: 21, title: '10 Endrathukulla', year: 2015, language: 'Tamil', genre: ['Action'], role: 'Shakeela', director: 'Vijay Milton', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122746/DK88z6_V4AACGK9_bqulmu.jpg', description: 'Released October 21, 2015.', trailer: '' },
    { id: 22, title: 'Thanga Magan', year: 2015, language: 'Tamil', genre: ['Drama'], role: 'Yamuna', director: 'Velraj', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122621/MV5BYjQ1ODViNTYtZThlNi00NTZiLWE4MDYtMmUyYjUyMjExNjc1XkEyXkFqcGdeQXVyNjkwOTg4MTA_._V1__ngbmsh.jpg', description: 'Released December 18, 2015.', trailer: '' },
    { id: 23, title: 'Bangalore Naatkal', year: 2016, language: 'Tamil', genre: ['Drama'], role: 'Ammu', director: 'Bommarillu Bhaskar', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122611/CZt2J-JWwAI88-x_uckon3.jpg', description: 'Released February 5, 2016.', trailer: '' },
    { id: 24, title: 'Theri', year: 2016, language: 'Tamil', genre: ['Action', 'Drama'], role: 'Annie', director: 'Atlee', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122611/8121rYGgVUL._RI__b0twdx.jpg', description: 'Released April 14, 2016.', trailer: '' },
    { id: 25, title: '24', year: 2016, language: 'Tamil', genre: ['Sci-Fi', 'Thriller'], role: 'Sathya', director: 'Vikram Kumar', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122612/DV-UDMzW0AAaqFe_f1kxlh.jpg', description: 'Released May 6, 2016.', trailer: '' },
    { id: 26, title: 'Brahmotsavam', year: 2016, language: 'Telugu', genre: ['Drama'], role: 'Kavya', director: 'Srikanth Addala', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122621/brahmotsavam_ver2_xlg_z15nvm.jpg', description: 'Released May 20, 2016.', trailer: '' },
    { id: 27, title: 'A Aa', year: 2016, language: 'Telugu', genre: ['Romance', 'Drama'], role: 'Anasuya', director: 'Trivikram Srinivas', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122616/a_aa_movie_audio_release_posters_nithin_samantha_6a8d956_fb34nz.jpg', description: 'Released June 2, 2016.', trailer: '' },
    { id: 28, title: 'Janatha Garage', year: 2016, language: 'Telugu', genre: ['Action', 'Drama'], role: 'Sita', director: 'Koratala Siva', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122613/Picsart_25-05-24_13-41-54-759_evq9pl.jpg', description: 'Released September 1, 2016.', trailer: '' },
    { id: 29, title: 'Raju Gari Gadhi 2', year: 2017, language: 'Telugu', genre: ['Horror', 'Thriller'], role: 'Amrutha', director: 'Ohmkar', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122613/MV5BZTQyYzE1MjgtMDE0Yi00MWFiLTgxMTMtNTAxN2NjNDg5N2RkXkEyXkFqcGdeQXVyNTYyODAxNDg_._V1__e2jqbk.jpg', description: 'Released October 13, 2017.', trailer: '' },
    { id: 30, title: 'Mersal', year: 2017, language: 'Tamil', genre: ['Action', 'Thriller'], role: 'Anu Pallavi', director: 'Atlee', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122621/SAVE_20210802_170503_jq6g94.jpg', description: 'Released October 18, 2017.', trailer: '' },
    { id: 31, title: 'Rangasthalam', year: 2018, language: 'Telugu', genre: ['Action', 'Drama'], role: 'Ramalakshmi', director: 'Sukumar', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122621/20221129_184521_jfb7tz.jpg', description: 'Released March 30, 2018.', trailer: '' },
    { id: 32, title: 'Mahanati', year: 2018, language: 'Telugu', genre: ['Biography', 'Drama'], role: 'Madhuravani', director: 'Nag Ashwin', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122748/Restored-2_fxrn2v.jpg', description: 'Released May 9, 2018.', trailer: '' },
    { id: 33, title: 'Irumbu Thirai', year: 2018, language: 'Tamil', genre: ['Action', 'Thriller'], role: 'Rathi Devi', director: 'P. S. Mithran', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122614/02-Vishal-Abhimanyudu-Movie-First-Look-ULTRA-HD-Posters-WallPapers_fckvhc.jpg', description: 'Released May 11, 2018.', trailer: '' },
    { id: 34, title: 'Seemaraja', year: 2018, language: 'Tamil', genre: ['Action', 'Comedy'], role: 'Suthanthira Selvi', director: 'Ponram', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122614/Dy3RDcMV4AASUPO_sujrw7.jpg', description: 'Released September 13, 2018.', trailer: '' },
    { id: 35, title: 'U Turn', year: 2018, language: 'Tamil', genre: ['Thriller'], role: 'Rachana', director: 'Pawan Kumar', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122617/IMG_20220413_132933_iacqws.jpg', description: 'Released September 13, 2018.', trailer: '' },
    { id: 36, title: 'Super Deluxe', year: 2019, language: 'Tamil', genre: ['Drama', 'Thriller'], role: 'Vaembu', director: 'Thiagarajan Kumararaja', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122622/Super_Deluxe_xnzav8.jpg', description: 'Released March 29, 2019.', trailer: '' },
    { id: 37, title: 'Majili', year: 2019, language: 'Telugu', genre: ['Romance', 'Drama'], role: 'Sravani', director: 'Shiva Nirvana', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122614/20230129_232410_u1vi0t.jpg', description: 'Released April 5, 2019.', trailer: '' },
    { id: 38, title: 'Oh! Baby', year: 2019, language: 'Telugu', genre: ['Fantasy', 'Comedy', 'Drama'], role: 'Savitri / Baby', director: 'B. V. Nandini Reddy', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122622/IMG_20210816_134153_snv5io.jpg', description: 'Released July 5, 2019.', trailer: '' },
    { id: 39, title: 'Manmadhudu 2', year: 2019, language: 'Telugu', genre: ['Romance', 'Comedy'], role: 'Avanthika', director: 'Rahul Ravindran', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748156903/tnm_import_sites_default_files_Nag-samantha_nrslzs.avif', description: 'Released August 9, 2019.', trailer: '' },
    { id: 40, title: 'Jaanu', year: 2020, language: 'Telugu', genre: ['Romance', 'Drama'], role: 'Jaanu', director: 'C. Prem Kumar', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122619/Picsart_25-05-24_13-38-39-468_j8y5qf.jpg', description: 'Released February 7, 2020.', trailer: '' },
    { id: 41, title: 'Pushpa: The Rise', year: 2021, language: 'Telugu', genre: ['Action', 'Drama'], role: 'Special Appearance', director: 'Sukumar', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122616/IMG_20211208_214018_nawid7.jpg', description: 'Special appearance. Released December 17, 2021.', trailer: '' },
    { id: 42, title: 'Kaathuvaakula Rendu Kaadhal', year: 2022, language: 'Tamil', genre: ['Romance', 'Comedy'], role: 'Khatija', director: 'Vignesh Shivan', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122617/IMG_20220527_124415_mxmev1.jpg', description: 'Released April 28, 2022.', trailer: '' },
    { id: 43, title: 'Yashoda', year: 2022, language: 'Telugu', genre: ['Action', 'Thriller'], role: 'Yashoda', director: 'Hari–Harish', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122614/Picsart_22-09-08_22-58-25-225_zupgqe.jpg', description: 'Released November 11, 2022.', trailer: '' },
    { id: 44, title: 'Shaakuntalam', year: 2023, language: 'Telugu', genre: ['Mythology', 'Drama', 'Romance'], role: 'Shakuntala', director: 'Gunasekhar', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122615/PicsArt_04-28-01.30.05_jdpk8h.jpg', description: 'Released April 14, 2023.', trailer: '' },
    { id: 45, title: 'Kushi', year: 2023, language: 'Telugu', genre: ['Romance', 'Comedy', 'Drama'], role: 'Aradhya', director: 'Shiva Nirvana', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122707/20220909_210838_vrhgsu.jpg', description: 'Released September 1, 2023.', trailer: '' },
    { id: 46, title: 'Subham', year: 2025, language: 'Telugu', genre: ['Drama'], role: 'TBA', director: 'TBA', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748018718/subham-et00440249-1747030168_rsxwsc.avif', description: 'Expected May 9, 2025.', trailer: '' },
    { id: 47, title: 'Maa Inti Bangaram', year: 2025, releaseDate: '2025-12-31', language: 'Telugu', genre: ['Drama'], role: 'TBA', director: 'TBA', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122616/Picsart_24-12-11_00-02-55-486_vk48af.png', description: 'Expected 2025.', trailer: '' },
    { id: 48, title: 'SVSC', year: 2013, language: 'Telugu', genre: ['Drama', 'Comedy'], role: 'Geetha', director: 'Srikanth Addala', poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122620/155803_403954009689964_477256738_n_jcokmy.jpg', description: 'Released January 11, 2013.', trailer: '' }
  ];

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

  webSeries: Movie[] = [
    {
      id: 1,
      title: 'The Family Man (Season 2)',
      year: 2021,
      language: 'Hindi',
      genre: ['Action', 'Thriller', 'Drama'],
      role: 'Raji',
      director: 'Raj & DK',
      poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122617/IMG_20210808_132006_uoe7py.jpg',
      description: 'Web series. Released June 4, 2021. Samantha plays Raji in the acclaimed second season.',
      trailer: ''
    },
    {
      id: 2,
      title: 'Citadel: Honey Bunny',
      year: 2024,
      language: 'Hindi',
      genre: ['Spy', 'Thriller'],
      role: 'TBA',
      director: 'Raj & DK',
      poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122749/Picsart_24-11-07_07-15-26-570_tgv1zm.jpg',
      description: 'Web series. Scheduled for release November 6, 2024.',
      trailer: ''
    },
    {
      id: 3,
      title: 'Rakt Brahmand: The Bloody Kingdom',
      year: 2025,
      language: 'Hindi',
      genre: ['Crime', 'Drama'],
      role: 'TBA',
      director: 'TBA',
      poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748122747/20240727_100042_wgs661.jpg',
      description: 'Web series. Scheduled for release in 2025.',
      trailer: ''
    }
  ];

  constructor() {}

  ngOnInit(): void {
    this.initializeFilters();
    
    // Separate cameo movies first
    this.cameoMovies = this.movies.filter(movie => 
      (movie.role.toLowerCase().includes('cameo') || 
       movie.role.toLowerCase().includes('special appearance') ||
       movie.title === 'Manmadhudu 2') &&
      movie.title !== 'Alludu Seenu' &&
      movie.title !== 'Pushpa: The Rise'
    );
    
    // Remove cameo movies from main list (except the specified ones)
    this.movies = this.movies.filter(movie => 
      (!movie.role.toLowerCase().includes('cameo') && 
       !movie.role.toLowerCase().includes('special appearance') &&
       movie.title !== 'Manmadhudu 2') ||
      movie.title === 'Alludu Seenu' ||
      movie.title === 'Pushpa: The Rise'
    );
    
    this.filteredMovies = [...this.movies];
    this.applyFilters();
  }

  initializeFilters(): void {
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
    
    switch(sortBy) {
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