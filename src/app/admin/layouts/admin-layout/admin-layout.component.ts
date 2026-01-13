import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-admin-dark text-admin-text-main font-inter selection:bg-admin-accent selection:text-white flex overflow-hidden">
      
      <!-- Sidebar -->
      <aside [class.w-64]="isSidebarOpen" [class.w-20]="!isSidebarOpen" 
             class="fixed left-0 top-0 h-full bg-admin-card/50 backdrop-blur-xl border-r border-admin-border z-50 transition-all duration-300 flex flex-col">
        
        <!-- Brand -->
        <div class="h-20 flex items-center justify-center border-b border-admin-border relative overflow-hidden group">
            <div [class.opacity-0]="!isSidebarOpen" class="absolute transition-opacity duration-300">
                <h1 class="font-playfair font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-royal-gold to-white tracking-wider">SAMANTHA</h1>
            </div>
             <div [class.opacity-0]="isSidebarOpen" class="absolute transition-opacity duration-300">
                <span class="font-playfair font-bold text-2xl text-royal-gold">S</span>
            </div>
            <!-- Glow effect -->
            <div class="absolute inset-0 bg-admin-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3 scrollbar-hide">
          
          <div *ngIf="isSidebarOpen" class="px-3 mb-2 text-xs font-semibold text-admin-text-muted uppercase tracking-wider">Overview</div>

          <a routerLink="/admin/dashboard" routerLinkActive="bg-admin-accent text-white shadow-neon" 
             class="flex items-center px-3 py-3 rounded-xl text-admin-text-muted hover:bg-admin-glass hover:text-white transition-all group relative overflow-hidden">
            <svg class="w-6 h-6 min-w-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            <span [class.opacity-0]="!isSidebarOpen" [class.translate-x-10]="!isSidebarOpen" class="ml-3 font-medium transition-all duration-300 whitespace-nowrap">Dashboard</span>
            <div class="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </a>

          <div *ngIf="isSidebarOpen" class="px-3 mt-6 mb-2 text-xs font-semibold text-admin-text-muted uppercase tracking-wider">Content</div>

          <!-- Menu Application Items -->
          <ng-container *ngFor="let item of menuItems">
             <a [routerLink]="item.link" routerLinkActive="bg-admin-accent text-white shadow-neon"
                class="flex items-center px-3 py-3 rounded-xl text-admin-text-muted hover:bg-admin-glass hover:text-white transition-all group relative overflow-hidden">
                <span class="w-6 h-6 min-w-[24px] flex items-center justify-center min-h-[24px]" [innerHTML]="item.icon"></span>
                <span [class.opacity-0]="!isSidebarOpen" [class.translate-x-10]="!isSidebarOpen" class="ml-3 font-medium transition-all duration-300 whitespace-nowrap">{{ item.label }}</span>
             </a>
          </ng-container>

        </nav>

        <!-- User Profile (Bottom) -->
         <div class="p-4 border-t border-admin-border bg-admin-card/30 backdrop-blur-md">
           <button (click)="logout()" class="flex items-center w-full px-2 py-2 rounded-lg hover:bg-admin-glass transition-colors group">
              <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-royal-gold to-yellow-200 p-[1px]">
                  <div class="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-royal-gold">AD</div>
              </div>
              <div [class.opacity-0]="!isSidebarOpen" [class.w-0]="!isSidebarOpen" class="ml-3 text-left overflow-hidden transition-all duration-300">
                  <p class="text-sm font-medium text-white truncate">Admin User</p>
                  <p class="text-xs text-admin-text-muted truncate">admin&#64;samantha.com</p>
              </div>
              <svg *ngIf="isSidebarOpen" class="w-4 h-4 ml-auto text-admin-text-muted group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
           </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div [class.ml-64]="isSidebarOpen" [class.ml-20]="!isSidebarOpen" class="flex-1 flex flex-col min-h-screen transition-all duration-300 relative">
        
         <!-- Background Ambient Glow -->
         <div class="absolute top-0 left-0 w-full h-[500px] bg-admin-accent/5 blur-[100px] pointer-events-none z-0"></div>

         <!-- Topbar -->
         <header class="h-20 sticky top-0 z-40 px-8 flex items-center justify-between backdrop-blur-md bg-admin-dark/80 border-b border-admin-border/50">
            <!-- Sidebar Toggle & Breadcrumb -->
            <div class="flex items-center gap-6">
                <button (click)="toggleSidebar()" class="p-2 rounded-lg text-admin-text-muted hover:text-white hover:bg-admin-glass transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                </button>
                <div class="hidden md:flex items-center text-sm font-medium text-admin-text-muted">
                    <span class="text-admin-accent">Admin</span>
                    <span class="mx-2">/</span>
                    <span class="text-white">Dashboard</span>
                </div>
            </div>

            <!-- Global Search -->
            <div class="flex-1 max-w-xl mx-8 hidden md:block group">
                <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-admin-accent transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input type="text" placeholder="Search anything (cmd + k)" 
                           class="w-full bg-admin-card border border-admin-border text-admin-text-main rounded-xl py-2.5 pl-12 pr-4 focus:outline-none focus:border-admin-accent focus:ring-1 focus:ring-admin-accent transition-all placeholder:text-gray-600">
                </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-4">
                <button class="p-2 relative rounded-lg text-admin-text-muted hover:text-white hover:bg-admin-glass transition-all">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    <span class="absolute top-2 right-2 w-2 h-2 bg-admin-danger rounded-full border border-admin-dark animate-pulse"></span>
                </button>
            </div>
         </header>

         <!-- Main View -->
         <main class="flex-1 p-8 overflow-y-auto relative z-10">
            <router-outlet></router-outlet>
         </main>

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
      label: 'Philanthropy',
      link: '/admin/philanthropy',
      icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>'
    },
  ];

  constructor(private apiService: ApiService) { }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.apiService.logout();
  }
}
