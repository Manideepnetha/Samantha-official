import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

interface BlogPost {
  id?: number;
  title: string;
  content: string;
  summary?: string;
  coverImage?: string;
  publishedAt?: string;
  isPublished?: boolean;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sr-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel min-h-[500px]">
            <div class="sr-hero-media">
              <img
                src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008413/PAND7159_k4qlvo.jpg"
                alt="Blog"
                class="object-[center_30%]"
              />
            </div>
            <div class="sr-hero-copy max-w-3xl text-center md:text-left">
              <span class="sr-kicker">Journal</span>
              <h1 class="sr-hero-title">Samantha's Blog</h1>
              <p class="sr-hero-subtitle">
                Thoughts, stories, and reflections from Samantha's world.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section *ngIf="isLoading" class="sr-section pb-12">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div *ngFor="let i of [1,2,3,4,5,6]" class="sr-surface overflow-hidden animate-pulse">
            <div class="h-56 bg-[rgba(243,232,220,0.06)]"></div>
            <div class="space-y-3 p-6">
              <div class="h-3 w-1/3 rounded bg-[rgba(243,232,220,0.08)]"></div>
              <div class="h-5 w-3/4 rounded bg-[rgba(243,232,220,0.08)]"></div>
              <div class="h-3 w-full rounded bg-[rgba(243,232,220,0.08)]"></div>
              <div class="h-3 w-5/6 rounded bg-[rgba(243,232,220,0.08)]"></div>
            </div>
          </div>
        </div>
      </section>

      <section *ngIf="!isLoading" class="sr-section pb-12">
        <div *ngIf="featuredPost" class="mb-10">
          <div class="sr-surface overflow-hidden sr-hover-card cursor-pointer" (click)="openPost(featuredPost)">
            <div class="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
              <div class="relative h-72 overflow-hidden lg:h-full">
                <img
                  [src]="featuredPost.coverImage || 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg'"
                  [alt]="featuredPost.title"
                  class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <span class="absolute left-5 top-5 sr-chip is-active">Featured</span>
              </div>
              <div class="flex flex-col justify-center p-8 md:p-10">
                <span class="sr-meta">{{ formatDate(featuredPost.publishedAt) }}</span>
                <h2 class="sr-card-title mt-4 mb-4">{{ featuredPost.title }}</h2>
                <p class="sr-card-text mb-6">{{ featuredPost.summary || getExcerpt(featuredPost.content) }}</p>
                <button class="sr-button self-start">Read More</button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="otherPosts.length > 0">
          <div class="sr-section-heading mb-8">
            <span class="sr-kicker">More Posts</span>
            <h2>Stories & Reflections</h2>
            <p>Recent posts from the journal, preserved as-is and presented in the new site-wide visual system.</p>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article
              *ngFor="let post of otherPosts"
              class="sr-surface overflow-hidden sr-hover-card cursor-pointer"
              (click)="openPost(post)"
            >
              <div class="relative h-56 overflow-hidden">
                <img
                  [src]="post.coverImage || 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg'"
                  [alt]="post.title"
                  class="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div class="p-6">
                <span class="sr-meta">{{ formatDate(post.publishedAt) }}</span>
                <h3 class="sr-card-title mt-3 mb-3 line-clamp-2">{{ post.title }}</h3>
                <p class="sr-card-text line-clamp-3">{{ post.summary || getExcerpt(post.content) }}</p>
                <span class="sr-link mt-4">Read More</span>
              </div>
            </article>
          </div>
        </div>

        <div *ngIf="posts.length === 0" class="sr-empty-state">
          No posts yet. Check back soon for updates from Samantha.
        </div>
      </section>

      <div
        *ngIf="selectedPost"
        class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(8,4,4,0.84)] p-4 backdrop-blur-sm"
        (click)="closePost()"
      >
        <div class="sr-modal-panel relative my-8 w-full max-w-3xl" (click)="$event.stopPropagation()">
          <button (click)="closePost()" class="sr-close-button absolute right-4 top-4 z-10" aria-label="Close post">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <img
            *ngIf="selectedPost.coverImage"
            [src]="selectedPost.coverImage"
            [alt]="selectedPost.title"
            class="h-64 w-full rounded-t-[1.75rem] object-cover"
          />

          <div class="p-8 md:p-10">
            <span class="sr-meta">{{ formatDate(selectedPost.publishedAt) }}</span>
            <h2 class="sr-card-title mt-3 mb-6">{{ selectedPost.title }}</h2>
            <div class="whitespace-pre-line text-lg leading-relaxed text-[var(--editorial-muted)]">{{ selectedPost.content }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  `]
})
export class BlogComponent implements OnInit {
  posts: BlogPost[] = [];
  featuredPost: BlogPost | null = null;
  otherPosts: BlogPost[] = [];
  selectedPost: BlogPost | null = null;
  isLoading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getBlogs().subscribe({
      next: (data) => {
        this.posts = data.filter((p: any) => p.isPublished !== false);
        this.featuredPost = this.posts[0] || null;
        this.otherPosts = this.posts.slice(1);
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return dateStr; }
  }

  getExcerpt(content: string): string {
    return content?.length > 160 ? content.substring(0, 160) + '...' : content;
  }

  openPost(post: BlogPost): void {
    this.selectedPost = post;
    document.body.style.overflow = 'hidden';
  }

  closePost(): void {
    this.selectedPost = null;
    document.body.style.overflow = '';
  }
}
