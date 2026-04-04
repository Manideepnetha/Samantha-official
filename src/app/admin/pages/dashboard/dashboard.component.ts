import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import { ApiService } from '../../../services/api.service';
import { forkJoin } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="sr-admin-page">
      <div class="sr-admin-page-header">
        <div>
          <span class="sr-kicker">Dashboard</span>
          <h1 class="sr-admin-title">Editorial Overview</h1>
          <p class="sr-admin-subtitle">A quick read on audience messages, content volume, philanthropy totals, and the latest portfolio updates.</p>
        </div>
      </div>

      <div class="sr-admin-stats">
        <div class="sr-surface sr-admin-stat-card">
          <span class="sr-meta">Messages</span>
          <span class="sr-admin-stat-value">{{ totalInteraction }}</span>
          <span class="sr-admin-stat-label">contact submissions recorded</span>
        </div>
        <div class="sr-surface sr-admin-stat-card">
          <span class="sr-meta">Catalog</span>
          <span class="sr-admin-stat-value">{{ totalContent }}</span>
          <span class="sr-admin-stat-label">movies, awards, and highlights live</span>
        </div>
        <div class="sr-surface sr-admin-stat-card">
          <span class="sr-meta">Awards</span>
          <span class="sr-admin-stat-value">{{ awardCount }}</span>
          <span class="sr-admin-stat-label">recognition entries in the archive</span>
        </div>
        <div class="sr-surface sr-admin-stat-card">
          <span class="sr-meta">Giving</span>
          <span class="sr-admin-stat-value">Rs. {{ totalDonations | number:'1.0-0' }}</span>
          <span class="sr-admin-stat-label">philanthropy value across tracked records</span>
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section class="sr-surface p-6 md:p-7">
          <div class="sr-admin-toolbar">
            <div>
              <span class="sr-kicker">Fan Engagement</span>
              <h2 class="sr-card-title mt-2">Message Activity</h2>
              <p class="sr-card-text mt-3">Six-month trend based on submissions coming through the contact form.</p>
            </div>
            <span class="sr-admin-badge is-accent">Live API data</span>
          </div>

          <div class="mt-8 h-[260px]">
            <canvas baseChart [data]="lineChartData" [options]="lineChartOptions" [type]="'line'"></canvas>
          </div>
        </section>

        <section class="sr-surface-soft p-6 md:p-7">
          <span class="sr-kicker">Recent</span>
          <h2 class="sr-card-title mt-2">Latest Updates</h2>
          <p class="sr-card-text mt-3">Newest portfolio additions pulled from the connected content collections.</p>

          <div class="mt-6 space-y-4" *ngIf="recentItems.length > 0">
            <div *ngFor="let item of recentItems" class="rounded-[1.3rem] border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] p-4">
              <span class="sr-meta">New entry</span>
              <p class="mt-3 font-['Cormorant_Garamond'] text-2xl leading-none text-[#f6ecdf]">{{ item.title || item.movie || 'Update' }}</p>
              <p class="sr-card-text mt-3">Added to the editorial system and ready for presentation on the main site.</p>
            </div>
          </div>

          <div *ngIf="recentItems.length === 0" class="sr-empty-state mt-6">
            No recent updates yet.
          </div>
        </section>
      </div>

      <div class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section class="sr-surface-soft p-6 md:p-7">
          <span class="sr-kicker">Impact</span>
          <h2 class="sr-card-title mt-2">Philanthropy Snapshot</h2>
          <p class="sr-card-text mt-3">A high-level view of the giving layer that powers the philanthropy storytelling on the public site.</p>

          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div class="rounded-[1.3rem] border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] p-5">
              <span class="sr-meta">Tracked value</span>
              <p class="mt-3 font-['Cormorant_Garamond'] text-4xl leading-none text-[var(--editorial-accent-strong)]">Rs. {{ totalDonations | number:'1.0-0' }}</p>
              <p class="sr-card-text mt-3">Total from the philanthropy records currently stored in the API.</p>
            </div>
            <div class="rounded-[1.3rem] border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] p-5">
              <span class="sr-meta">Audience touchpoints</span>
              <p class="mt-3 font-['Cormorant_Garamond'] text-4xl leading-none text-[#f6ecdf]">{{ totalInteraction }}</p>
              <p class="sr-card-text mt-3">Signals coming from fans and visitors reaching out through the site.</p>
            </div>
          </div>
        </section>

        <section class="sr-surface p-6 md:p-7">
          <span class="sr-kicker">Content Mix</span>
          <h2 class="sr-card-title mt-2">Portfolio Coverage</h2>
          <p class="sr-card-text mt-3">A compact content map so you can spot which sections are currently getting the most editorial attention.</p>

          <div class="mt-6 grid gap-4 sm:grid-cols-3">
            <div class="rounded-[1.3rem] border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] p-4">
              <span class="sr-meta">Movies</span>
              <p class="mt-3 font-['Cormorant_Garamond'] text-4xl leading-none text-[#f6ecdf]">{{ movieCount }}</p>
              <p class="sr-card-text mt-3">filmography entries available</p>
            </div>
            <div class="rounded-[1.3rem] border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] p-4">
              <span class="sr-meta">Awards</span>
              <p class="mt-3 font-['Cormorant_Garamond'] text-4xl leading-none text-[#f6ecdf]">{{ awardCount }}</p>
              <p class="sr-card-text mt-3">recognition items published</p>
            </div>
            <div class="rounded-[1.3rem] border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] p-4">
              <span class="sr-meta">Highlights</span>
              <p class="mt-3 font-['Cormorant_Garamond'] text-4xl leading-none text-[#f6ecdf]">{{ newsCount }}</p>
              <p class="sr-card-text mt-3">news stories currently featured</p>
            </div>
          </div>

          <div class="sr-admin-note mt-6">
            The dashboard pulls directly from the same API feeds that power the public experience, so changes made in the admin should be reflected here immediately.
          </div>
        </section>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  totalInteraction = 0;
  totalDonations = 0;
  totalContent = 0;

  movieCount = 0;
  awardCount = 0;
  newsCount = 0;

  recentItems: any[] = [];

  public lineChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Messages',
        fill: true,
        tension: 0.4,
        borderColor: '#E4C4A3',
        backgroundColor: 'rgba(228, 196, 163, 0.16)',
        pointBackgroundColor: '#E4C4A3',
        pointBorderColor: '#120907',
        pointHoverBackgroundColor: '#120907',
        pointHoverBorderColor: '#E4C4A3'
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#120907',
        titleColor: '#F6ECDF',
        bodyColor: 'rgba(243, 232, 220, 0.78)',
        borderColor: 'rgba(228, 196, 163, 0.22)',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(243, 232, 220, 0.5)' }
      },
      y: {
        grid: { color: 'rgba(228, 196, 163, 0.1)', display: true },
        ticks: { display: false },
        border: { display: false }
      }
    }
  };

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    forkJoin({
      movies: this.apiService.getMovies(),
      awards: this.apiService.getAwards(),
      philanthropy: this.apiService.getPhilanthropies(),
      news: this.apiService.getNews(),
      contacts: this.apiService.getContactMessages()
    }).subscribe({
      next: (res) => {
        this.movieCount = res.movies.length;
        this.awardCount = res.awards.length;
        this.newsCount = res.news.length;

        this.totalContent = this.movieCount + this.awardCount + this.newsCount;

        this.totalInteraction = res.contacts.length;
        this.processChartData(res.contacts);

        this.totalDonations = res.philanthropy.reduce((sum, item) => sum + (item.value || 0), 0);

        const lastMovie = res.movies.length > 0 ? res.movies[res.movies.length - 1] : null;
        const lastAward = res.awards.length > 0 ? res.awards[res.awards.length - 1] : null;

        this.recentItems = [];
        if (lastMovie) this.recentItems.push({ title: `New Movie: ${lastMovie.title}`, date: 'Just now' });
        if (lastAward) this.recentItems.push({ title: `Award: ${lastAward.title}`, date: 'Recently' });
      },
      error: (err) => {
        console.error('Failed to load dashboard stats', err);
      }
    });
  }

  processChartData(contacts: any[]) {
    const monthCounts = new Map<string, number>();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const today = new Date();
    const labels = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = months[d.getMonth()];
      labels.push(monthName);
      monthCounts.set(monthName, 0);
    }

    contacts.forEach(c => {
      if (!c.submittedAt) return;
      const d = new Date(c.submittedAt);
      const monthName = months[d.getMonth()];
      if (monthCounts.has(monthName)) {
        monthCounts.set(monthName, (monthCounts.get(monthName) || 0) + 1);
      }
    });

    const data = labels.map(label => monthCounts.get(label) || 0);

    this.lineChartData = {
      labels,
      datasets: [{
        data,
        label: 'Messages',
        fill: true,
        tension: 0.4,
        borderColor: '#E4C4A3',
        backgroundColor: 'rgba(228, 196, 163, 0.16)',
        pointBackgroundColor: '#E4C4A3',
        pointBorderColor: '#120907',
        pointHoverBackgroundColor: '#120907',
        pointHoverBorderColor: '#E4C4A3'
      }]
    };
  }
}
