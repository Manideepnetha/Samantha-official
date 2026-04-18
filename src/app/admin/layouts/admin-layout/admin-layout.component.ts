import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sr-page selection:bg-[var(--editorial-accent)] selection:text-[#24130f]">
      <div class="sr-admin-shell">
        <aside
          [class.w-72]="isSidebarOpen"
          [class.w-24]="!isSidebarOpen"
          class="sr-admin-sidebar transition-all duration-300"
        >
          <div class="sr-admin-brand" [class.justify-center]="!isSidebarOpen">
            <span class="sr-admin-brand-mark">S</span>
            <div *ngIf="isSidebarOpen">
              <span class="sr-admin-brand-title">Samantha</span>
              <span class="sr-admin-brand-subtitle">Editorial Admin</span>
            </div>
          </div>

          <nav class="flex-1 overflow-y-auto scrollbar-hide pb-6">
            <div class="sr-admin-nav-group">
              <span *ngIf="isSidebarOpen" class="sr-admin-nav-label">Overview</span>
              <a routerLink="/admin/dashboard" routerLinkActive="is-active" class="sr-admin-nav-link">
                <svg class="w-6 h-6 min-w-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                <span *ngIf="isSidebarOpen">Dashboard</span>
              </a>
            </div>

            <div class="sr-admin-nav-group">
              <span *ngIf="isSidebarOpen" class="sr-admin-nav-label">Content</span>
              <div class="flex flex-col gap-2">
                <a *ngFor="let item of menuItems" [routerLink]="item.link" routerLinkActive="is-active" class="sr-admin-nav-link">
                  <span class="w-6 h-6 min-w-[24px] flex items-center justify-center" [innerHTML]="item.icon"></span>
                  <span *ngIf="isSidebarOpen">{{ item.label }}</span>
                </a>
              </div>
            </div>
          </nav>

          <div class="border-t border-[rgba(228,196,163,0.12)] p-4">
            <button
              (click)="logout()"
              class="w-full rounded-[1.35rem] border border-[rgba(228,196,163,0.14)] bg-[rgba(243,232,220,0.04)] px-3 py-3 text-left transition-colors hover:bg-[rgba(243,232,220,0.08)]"
              [class.flex]="true"
              [class.items-center]="true"
              [class.justify-center]="!isSidebarOpen"
              [class.gap-3]="isSidebarOpen"
            >
              <div class="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(228,196,163,0.18)] bg-[rgba(243,232,220,0.05)] font-['Cormorant_Garamond'] text-xl text-[var(--editorial-accent-strong)]">A</div>
              <div *ngIf="isSidebarOpen" class="min-w-0 flex-1">
                <p class="truncate font-['Cormorant_Garamond'] text-xl text-[#f6ecdf]">Admin User</p>
                <p class="truncate font-['Manrope'] text-xs uppercase tracking-[0.18em] text-[rgba(243,232,220,0.48)]">Sign out</p>
              </div>
              <svg *ngIf="isSidebarOpen" class="h-4 w-4 text-[rgba(243,232,220,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </aside>

        <div class="sr-admin-main" [style.marginLeft]="isSidebarOpen ? '18rem' : '6rem'">
          <header class="sr-admin-topbar">
            <div class="flex items-center gap-4">
              <button (click)="toggleSidebar()" class="sr-close-button">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
              </button>
              <div class="hidden md:block">
                <span class="sr-meta">Admin</span>
                <p class="mt-2 font-['Cormorant_Garamond'] text-3xl leading-none text-[#f6ecdf]">Editorial Control Room</p>
              </div>
            </div>

            <div class="sr-admin-topbar-search hidden md:block flex-1 max-w-xl px-4 py-3">
              <div class="flex items-center gap-3 font-['Manrope'] text-sm text-[rgba(243,232,220,0.58)]">
                <svg class="w-4 h-4 text-[var(--editorial-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <span>Manage stories, imagery, and highlights across the site.</span>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div *ngIf="syncMessage || syncError" class="hidden lg:block max-w-[240px] text-right">
                <p *ngIf="syncMessage" class="font-['Manrope'] text-xs uppercase tracking-[0.18em] text-[rgba(228,196,163,0.72)]">{{ syncMessage }}</p>
                <p *ngIf="syncError" class="font-['Manrope'] text-xs uppercase tracking-[0.18em] text-[#f4aaa0]">{{ syncError }}</p>
              </div>
              <button
                type="button"
                (click)="syncContent()"
                [disabled]="isSyncing"
                class="inline-flex items-center gap-2 rounded-full border border-[rgba(228,196,163,0.18)] bg-[rgba(243,232,220,0.05)] px-4 py-2.5 font-['Manrope'] text-xs uppercase tracking-[0.22em] text-[#f6ecdf] transition-colors hover:bg-[rgba(243,232,220,0.1)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <svg class="h-4 w-4" [class.animate-spin]="isSyncing" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m14.836 2A8.001 8.001 0 005.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-13.837-2m13.837 2H15"></path></svg>
                <span>{{ isSyncing ? 'Syncing...' : 'Sync Content' }}</span>
              </button>
              <button class="sr-close-button relative" title="Contact messages">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                <span *ngIf="unreadCount > 0" class="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--editorial-accent-strong)] px-1 text-[10px] font-bold text-[#24130f]">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
                <span *ngIf="unreadCount === 0" class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#d98b87]"></span>
              </button>
            </div>
          </header>

          <main class="sr-admin-content">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
  `]
})
export class AdminLayoutComponent {
  isSidebarOpen = true;
  unreadCount = 0;
  isSyncing = false;
  syncMessage = '';
  syncError = '';

  constructor(private apiService: ApiService) {
    // Load unread contact message count
    this.apiService.getContactMessages().subscribe({
      next: (msgs) => {
        const lastSeen = parseInt(localStorage.getItem('srp_last_seen_msg_count') || '0', 10);
        this.unreadCount = Math.max(0, msgs.length - lastSeen);
      },
      error: () => {}
    });
  }

  menuItems = [
    {
      label: 'Home Page',
      link: '/admin/home',
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>'
    },
    {
      label: 'Movies',
      link: '/admin/movies',
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>'
    },
    {
      label: 'Awards',
      link: '/admin/awards',
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>'
    },
    {
      label: 'Fashion',
      link: '/admin/fashion',
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>'
    },
    {
      label: 'Gallery',
      link: '/admin/gallery',
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
    },
    {
      label: 'Fan Zone',
      link: '/admin/fan-zone',
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.868v4.264a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"></path></svg>'
    },
    {
      label: 'Fan Wall',
      link: '/admin/fan-wall',
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h8M8 14h5m-7 7l1.3-3.9A8 8 0 1119 19.7L15.1 21H6a2 2 0 01-2-2v-1z"></path></svg>'
    },
    {
      label: 'Philanthropy',
      link: '/admin/philanthropy',
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>'
    },
    {
      label: 'Settings',
      link: '/admin/settings',
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>'
    },
    {
      label: 'News',
      link: '/admin/news',
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>'
    },
  ];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  syncContent() {
    if (this.isSyncing) {
      return;
    }

    this.isSyncing = true;
    this.syncError = '';
    this.syncMessage = 'Refreshing database content...';

    this.apiService.syncSiteContent().subscribe({
      next: (result: {
        pageContentBlocksSynced?: number;
        philanthropyRecordsSynced?: number;
        fanCreationsSynced?: number;
        galleryCollectionsSynced?: number;
        galleryImagesBackfilled?: number;
      }) => {
        this.isSyncing = false;
        const summary = [
          result.pageContentBlocksSynced ? `${result.pageContentBlocksSynced} page blocks` : '',
          result.galleryCollectionsSynced ? `${result.galleryCollectionsSynced} gallery sets` : '',
          result.galleryImagesBackfilled ? `${result.galleryImagesBackfilled} gallery image updates` : '',
          result.fanCreationsSynced ? `${result.fanCreationsSynced} fan entries` : '',
          result.philanthropyRecordsSynced ? `${result.philanthropyRecordsSynced} philanthropy records` : ''
        ].filter(Boolean).join(', ');

        this.syncMessage = summary ? `Sync complete: ${summary}. Reloading...` : 'Content synced. Reloading view...';
        setTimeout(() => window.location.reload(), 1100);
      },
      error: (error: unknown) => {
        this.isSyncing = false;
        this.syncMessage = '';
        this.syncError = this.getErrorMessage(error, 'Sync failed. Please sign in again or try once more.');
      }
    });
  }

  logout() {
    this.apiService.logout();
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null) {
      const errorRecord = error as {
        error?: { message?: string };
        message?: string;
        status?: number;
      };

      if (errorRecord.status === 401 || errorRecord.status === 403) {
        return 'Your admin session has expired. Please sign in again.';
      }

      if (errorRecord.error?.message) {
        return errorRecord.error.message;
      }

      if (errorRecord.message) {
        return errorRecord.message;
      }
    }

    return fallback;
  }
}
