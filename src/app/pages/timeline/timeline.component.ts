import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Award, ApiService, Movie } from '../../services/api.service';
import { TIMELINE_MILESTONES } from '../../data/fan-experience.data';

type TimelineFilter = 'all' | 'movies' | 'awards';

interface TimelineEntry {
  year: number;
  title: string;
  description: string;
  meta: string;
  kind: 'Movie' | 'Award' | 'Milestone';
  imageUrl: string;
  route: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="sr-page timeline-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel">
            <div class="sr-hero-media">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg" alt="Career timeline cover" />
            </div>
            <div class="sr-hero-copy">
              <span class="sr-kicker">Timeline</span>
              <h1 class="sr-hero-title">A year-by-year path from breakout promise to enduring screen icon.</h1>
              <p class="sr-hero-subtitle">
                Scroll through films, awards, and turning points from 2010 to the present, mapped into one cinematic timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="sr-tabbar timeline-filters">
          <button type="button" class="sr-tab" [class.is-active]="activeFilter === 'all'" (click)="setFilter('all')">All</button>
          <button type="button" class="sr-tab" [class.is-active]="activeFilter === 'movies'" (click)="setFilter('movies')">Movies</button>
          <button type="button" class="sr-tab" [class.is-active]="activeFilter === 'awards'" (click)="setFilter('awards')">Awards</button>
        </div>

        <div class="timeline-list">
          <article
            *ngFor="let entry of filteredEntries; let i = index"
            class="timeline-entry"
            [class.is-reversed]="i % 2 === 1"
          >
            <div class="timeline-side">
              <span class="timeline-year">{{ entry.year }}</span>
              <span class="timeline-kind">{{ entry.kind }}</span>
            </div>

            <div class="timeline-card sr-surface timeline-observe">
              <img [src]="entry.imageUrl" [alt]="entry.title" loading="lazy" />
              <div class="timeline-copy">
                <span class="sr-kicker">{{ entry.meta }}</span>
                <h2>{{ entry.title }}</h2>
                <p>{{ entry.description }}</p>
                <a [routerLink]="entry.route" class="sr-link">Explore</a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .timeline-page {
      padding-bottom: 5rem;
    }

    .timeline-filters {
      width: fit-content;
      margin-bottom: 2rem;
    }

    .timeline-list {
      position: relative;
      display: grid;
      gap: 1.6rem;
    }

    .timeline-list::before {
      content: "";
      position: absolute;
      left: 5.4rem;
      top: 0;
      bottom: 0;
      width: 1px;
      background: linear-gradient(180deg, rgba(228, 196, 163, 0.12), rgba(228, 196, 163, 0.3), rgba(228, 196, 163, 0.12));
    }

    .timeline-entry {
      display: grid;
      grid-template-columns: 7rem minmax(0, 1fr);
      gap: 1rem;
      align-items: start;
    }

    .timeline-entry.is-reversed .timeline-card {
      grid-template-columns: minmax(0, 1fr) minmax(260px, 0.7fr);
    }

    .timeline-entry.is-reversed .timeline-card img {
      order: 2;
    }

    .timeline-entry.is-reversed .timeline-copy {
      order: 1;
    }

    .timeline-side {
      position: sticky;
      top: 7rem;
      display: grid;
      gap: 0.35rem;
      padding-top: 1.2rem;
      text-align: center;
    }

    .timeline-year {
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: 2.8rem;
      line-height: 0.9;
      color: var(--editorial-accent);
    }

    .timeline-kind {
      font-family: "Manrope", "Inter", sans-serif;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(243, 232, 220, 0.56);
    }

    .timeline-card {
      display: grid;
      grid-template-columns: minmax(260px, 0.7fr) minmax(0, 1fr);
      overflow: hidden;
      border-radius: 1.8rem;
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.55s ease, transform 0.55s ease;
    }

    .timeline-card.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .timeline-card img {
      width: 100%;
      height: 100%;
      min-height: 18rem;
      object-fit: cover;
      background: rgba(243, 232, 220, 0.03);
    }

    .timeline-copy {
      padding: 1.5rem;
    }

    .timeline-copy h2 {
      margin: 0;
      font-family: "Cormorant Garamond", "Playfair Display", serif;
      font-size: clamp(2.1rem, 4vw, 3.2rem);
      font-weight: 500;
      line-height: 0.94;
      color: #f6ecdf;
    }

    .timeline-copy p {
      margin: 0.85rem 0 0;
      font-family: "Manrope", "Inter", sans-serif;
      line-height: 1.8;
      color: var(--editorial-muted);
    }

    @media (max-width: 900px) {
      .timeline-list::before {
        left: 1.35rem;
      }

      .timeline-entry {
        grid-template-columns: 1fr;
      }

      .timeline-side {
        position: relative;
        top: 0;
        padding-top: 0;
        text-align: left;
        padding-left: 2.35rem;
      }

      .timeline-card,
      .timeline-entry.is-reversed .timeline-card {
        grid-template-columns: 1fr;
      }

      .timeline-entry.is-reversed .timeline-card img,
      .timeline-entry.is-reversed .timeline-copy {
        order: initial;
      }
    }
  `]
})
export class TimelineComponent implements OnInit, AfterViewInit, OnDestroy {
  activeFilter: TimelineFilter = 'all';
  entries: TimelineEntry[] = [];
  private observer: IntersectionObserver | null = null;

  constructor(private apiService: ApiService, private elementRef: ElementRef<HTMLElement>) {}

  get filteredEntries(): TimelineEntry[] {
    if (this.activeFilter === 'movies') {
      return this.entries.filter(entry => entry.kind === 'Movie');
    }

    if (this.activeFilter === 'awards') {
      return this.entries.filter(entry => entry.kind === 'Award');
    }

    return this.entries;
  }

  ngOnInit(): void {
    this.loadEntries();
  }

  ngAfterViewInit(): void {
    this.createObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  setFilter(filter: TimelineFilter): void {
    this.activeFilter = filter;
    queueMicrotask(() => this.observeCards());
  }

  private loadEntries(): void {
    this.apiService.getMovies().subscribe({
      next: (movies) => {
        this.entries = this.buildEntries(movies);
        queueMicrotask(() => this.observeCards());
      }
    });

    this.apiService.getAwards().subscribe({
      next: (awards) => {
        this.entries = this.buildEntries(undefined, awards);
        queueMicrotask(() => this.observeCards());
      }
    });
  }

  private buildEntries(movies?: Movie[], awards?: Award[]): TimelineEntry[] {
    const existingMovies = movies ?? this.entries
      .filter(entry => entry.kind === 'Movie')
      .map(entry => ({
        year: entry.year,
        title: entry.title,
        description: entry.description,
        genre: [entry.meta],
        role: '',
        director: '',
        poster: entry.imageUrl,
        language: '',
        id: 0
      } as Movie));

    const existingAwards = awards ?? this.entries
      .filter(entry => entry.kind === 'Award')
      .map(entry => ({
        year: entry.year,
        title: entry.title,
        description: entry.description,
        imageUrl: entry.imageUrl,
        type: 'Timeline'
      } as Award));

    const movieEntries = existingMovies.map(movie => ({
      year: movie.year,
      title: movie.title,
      description: movie.description,
      meta: movie.role ? `Movie · ${movie.role}` : 'Movie',
      kind: 'Movie',
      imageUrl: movie.poster,
      route: movie.id ? `/filmography/${movie.id}` : '/filmography'
    } satisfies TimelineEntry));

    const awardEntries = existingAwards
      .filter(award => award.type === 'Timeline')
      .map(award => ({
        year: award.year,
        title: award.title,
        description: award.description || award.quote || 'A major recognition in Samantha’s career timeline.',
        meta: 'Award',
        kind: 'Award',
        imageUrl: award.imageUrl || 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg',
        route: '/awards'
      } satisfies TimelineEntry));

    const milestoneEntries = TIMELINE_MILESTONES.map(milestone => ({
      year: milestone.year,
      title: milestone.title,
      description: milestone.description,
      meta: 'Milestone',
      kind: 'Milestone',
      imageUrl: milestone.imageUrl,
      route: '/about'
    } satisfies TimelineEntry));

    return [...movieEntries, ...awardEntries, ...milestoneEntries]
      .sort((left, right) => right.year - left.year || this.kindRank(left.kind) - this.kindRank(right.kind));
  }

  private kindRank(kind: TimelineEntry['kind']): number {
    return kind === 'Milestone' ? 0 : kind === 'Movie' ? 1 : 2;
  }

  private createObserver(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          this.observer?.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.18
    });

    this.observeCards();
  }

  private observeCards(): void {
    const cards = this.elementRef.nativeElement.querySelectorAll('.timeline-observe');
    cards.forEach(card => this.observer?.observe(card));
  }
}
