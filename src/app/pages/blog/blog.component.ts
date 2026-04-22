import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import {
  BlogPostSection,
  SAMANTHA_BLOG_POSTS,
  SamanthaBlogPost
} from './samantha-blog-posts.data';

interface BlogPost {
  id?: number | string;
  title: string;
  summary: string;
  coverImage?: string;
  publishedAt?: string;
  isPublished?: boolean;
  sections: BlogPostSection[];
  discussionQuestion?: string;
  hashtags: string[];
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
                alt="Journal"
                class="object-[center_30%]"
              />
            </div>
            <div class="sr-hero-copy max-w-3xl text-center md:text-left">
              <span class="sr-kicker">Journal</span>
              <h1 class="sr-hero-title">Samantha's Journal</h1>
              <p class="sr-hero-subtitle">
                Thoughts, stories, and reflections from Samantha's world.
              </p>
              <div class="sr-hero-blog-meta">
                <span class="sr-chip is-active">{{ posts.length }} Posts</span>
                <span class="sr-chip">{{ featuredPost ? 'Featured Journal Entry' : 'Official Archive' }}</span>
              </div>
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
                  [src]="featuredPost.coverImage || fallbackCoverImage"
                  [alt]="featuredPost.title"
                  class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <span class="absolute left-5 top-5 sr-chip is-active">Featured</span>
              </div>
              <div class="flex flex-col justify-center p-8 md:p-10">
                <span class="sr-meta">{{ formatDate(featuredPost.publishedAt) }}</span>
                <h2 class="sr-card-title mt-4 mb-4">{{ featuredPost.title }}</h2>
                <p class="sr-card-text mb-6">{{ featuredPost.summary }}</p>
                <button class="sr-button self-start">Read More</button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="otherPosts.length > 0">
          <div class="sr-section-heading mb-8">
            <span class="sr-kicker">More Posts</span>
            <h2>Stories & Reflections</h2>
            <p>Personal essays, work notes, wellness reflections, and moments Samantha wants to share with fans.</p>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <article
              *ngFor="let post of otherPosts"
              class="sr-surface overflow-hidden sr-hover-card cursor-pointer"
              (click)="openPost(post)"
            >
              <div class="relative h-56 overflow-hidden">
                <img
                  [src]="post.coverImage || fallbackCoverImage"
                  [alt]="post.title"
                  class="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div class="p-6">
                <span class="sr-meta">{{ formatDate(post.publishedAt) }}</span>
                <h3 class="sr-card-title mt-3 mb-3 line-clamp-2">{{ post.title }}</h3>
                <p class="sr-card-text line-clamp-3">{{ post.summary }}</p>
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
        <div class="sr-modal-panel relative my-8 w-full max-w-4xl" (click)="$event.stopPropagation()">
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
            <h2 class="sr-card-title mt-3 mb-4">{{ selectedPost.title }}</h2>
            <p class="sr-post-lead">{{ selectedPost.summary }}</p>

            <section *ngFor="let section of selectedPost.sections" class="sr-post-section">
              <h3 class="sr-post-section-title">{{ section.heading }}</h3>
              <blockquote *ngIf="section.quote" class="sr-post-quote">{{ section.quote }}</blockquote>
              <p *ngFor="let paragraph of section.paragraphs" class="sr-post-paragraph">
                {{ paragraph }}
              </p>
            </section>

            <section *ngIf="selectedPost.discussionQuestion || selectedPost.hashtags.length > 0" class="sr-post-section sr-post-footer">
              <h3 class="sr-post-section-title">Over To You</h3>
              <p *ngIf="selectedPost.discussionQuestion" class="sr-post-paragraph">{{ selectedPost.discussionQuestion }}</p>

              <div *ngIf="selectedPost.hashtags.length > 0" class="sr-post-tags">
                <span *ngFor="let hashtag of selectedPost.hashtags" class="sr-post-tag">{{ hashtag }}</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .sr-hero-blog-meta { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .sr-post-lead { margin: 0 0 2rem; font-size: 1.08rem; line-height: 1.9; color: rgba(243, 232, 220, 0.82); }
    .sr-post-section + .sr-post-section { margin-top: 2rem; }
    .sr-post-section-title {
      margin: 0 0 1rem;
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.4rem, 2.4vw, 2rem);
      line-height: 1.05;
      color: var(--editorial-text);
    }
    .sr-post-quote {
      margin: 0 0 1rem;
      padding: 1rem 1.2rem;
      border-left: 3px solid rgba(214, 178, 140, 0.72);
      border-radius: 1rem;
      background: rgba(243, 232, 220, 0.05);
      font-style: italic;
      color: rgba(243, 232, 220, 0.88);
    }
    .sr-post-paragraph {
      margin: 0 0 1rem;
      font-size: 1rem;
      line-height: 1.9;
      color: var(--editorial-muted);
    }
    .sr-post-footer { padding-top: 0.5rem; }
    .sr-post-tags { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem; }
    .sr-post-tag {
      display: inline-flex;
      align-items: center;
      min-height: 2.1rem;
      padding: 0.45rem 0.85rem;
      border-radius: 999px;
      border: 1px solid rgba(243, 232, 220, 0.12);
      background: rgba(243, 232, 220, 0.05);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: rgba(243, 232, 220, 0.82);
    }
  `]
})
export class BlogComponent implements OnInit, OnDestroy {
  readonly fallbackCoverImage =
    'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg';

  posts: BlogPost[] = [];
  featuredPost: BlogPost | null = null;
  otherPosts: BlogPost[] = [];
  selectedPost: BlogPost | null = null;
  isLoading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getBlogs().subscribe({
      next: (data) => {
        this.setResolvedPosts(this.mergePosts(data));
        this.isLoading = false;
      },
      error: () => {
        this.setResolvedPosts(this.mergePosts([]));
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  }

  openPost(post: BlogPost): void {
    this.selectedPost = post;
    document.body.style.overflow = 'hidden';
  }

  closePost(): void {
    this.selectedPost = null;
    document.body.style.overflow = '';
  }

  private setResolvedPosts(posts: BlogPost[]): void {
    this.posts = posts;
    this.featuredPost = posts[0] || null;
    this.otherPosts = posts.slice(1);
  }

  private mergePosts(apiPosts: any[]): BlogPost[] {
    const publishedApiPosts = (Array.isArray(apiPosts) ? apiPosts : [])
      .filter(post => post?.isPublished !== false)
      .map(post => this.normalizeApiPost(post));

    const localPosts = SAMANTHA_BLOG_POSTS
      .filter(post => !publishedApiPosts.some(apiPost => this.normalizeTitle(apiPost.title) === this.normalizeTitle(post.title)))
      .map(post => this.normalizeSeedPost(post));

    return [...publishedApiPosts, ...localPosts].sort((left, right) => {
      const leftTime = left.publishedAt ? new Date(left.publishedAt).getTime() : 0;
      const rightTime = right.publishedAt ? new Date(right.publishedAt).getTime() : 0;
      return rightTime - leftTime;
    });
  }

  private normalizeApiPost(post: any): BlogPost {
    const content = typeof post?.content === 'string' ? post.content : '';
    const summary = typeof post?.summary === 'string' && post.summary.trim()
      ? post.summary.trim()
      : this.getExcerpt(content);

    return {
      id: post?.id ?? post?.title,
      title: post?.title || 'Untitled Post',
      summary,
      coverImage: post?.coverImage || this.fallbackCoverImage,
      publishedAt: post?.publishedAt,
      isPublished: post?.isPublished !== false,
      sections: this.buildSectionsFromContent(content, summary),
      discussionQuestion: '',
      hashtags: []
    };
  }

  private normalizeSeedPost(post: SamanthaBlogPost): BlogPost {
    return {
      id: post.id,
      title: post.title,
      summary: post.summary,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
      isPublished: post.isPublished,
      sections: post.sections,
      discussionQuestion: post.discussionQuestion,
      hashtags: post.hashtags
    };
  }

  private buildSectionsFromContent(content: string, summary: string): BlogPostSection[] {
    const paragraphs = content
      .split(/\n{2,}/)
      .map(paragraph => paragraph.trim())
      .filter(Boolean);

    if (paragraphs.length === 0) {
      return [{
        heading: 'Journal Entry',
        paragraphs: summary ? [summary] : ['More details for this post will be shared soon.']
      }];
    }

    return [{
      heading: 'Journal Entry',
      paragraphs
    }];
  }

  private getExcerpt(content: string): string {
    if (!content?.trim()) {
      return 'A new reflection from Samantha will be shared here soon.';
    }

    return content.length > 160 ? `${content.substring(0, 160).trim()}...` : content;
  }

  private normalizeTitle(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, ' ');
  }
}
