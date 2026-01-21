import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
import { ApiService, Movie, Award, Philanthropy, NewsArticle } from '../../../services/api.service';
import { forkJoin } from 'rxjs';

Chart.register(...registerables);

@Component({
   selector: 'app-dashboard',
   standalone: true,
   imports: [CommonModule, BaseChartDirective],
   template: `
    <!-- Top Header / Welcome -->
    <div class="mb-8 flex justify-between items-end">
       <div>
         <h1 class="text-4xl font-playfair font-bold text-admin-text-main">Overview</h1>
         <p class="text-admin-text-muted mt-1">Welcome back, Samantha. Official Portfolio Status.</p>
       </div>
       <div class="flex gap-4">
          <div class="flex -space-x-3">
             <img class="w-10 h-10 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=Admin+User&background=D4AF37&color=fff" alt="">
          </div>
          <button class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md text-gray-400 hover:text-admin-accent transition-colors border border-gray-100">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
          </button>
       </div>
    </div>

    <!-- BENTO GRID LAYOUT -->
    <div class="grid grid-cols-12 gap-8">
      
      <!-- CARD 1: Fan Engagement (Light Theme) -->
      <!-- Wide Top Left -->
      <div class="col-span-12 lg:col-span-8 bg-white rounded-[2.5rem] p-8 text-admin-text-main relative overflow-hidden group border border-admin-border shadow-sm">
         <!-- Background Abstract -->
         <div class="absolute top-0 right-0 w-64 h-64 bg-admin-accent/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

         <div class="flex justify-between items-start mb-8 relative z-10">
            <div>
               <h3 class="text-lg font-medium text-admin-accent mb-1 font-playfair">Fan Engagement</h3>
               <p class="text-xs text-admin-text-muted">Real-time Stats</p>
            </div>
            <select class="bg-gray-50 border border-gray-200 text-sm rounded-full px-4 py-1 text-admin-text-main focus:ring-0 cursor-pointer hover:bg-gray-100 transition-colors">
               <option class="text-black">Monthly</option>
               <option class="text-black">Weekly</option>
            </select>
         </div>

         <div class="flex items-end gap-12 relative z-10">
            <div>
               <div class="flex items-center gap-2 mb-2">
                 <h2 class="text-5xl font-playfair font-bold text-admin-text-main">{{ totalInteraction }}</h2>
                 <div class="w-8 h-8 rounded-full bg-admin-accent text-white flex items-center justify-center transform -rotate-45">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                 </div>
               </div>
               <p class="text-admin-text-muted p-1">Total Messages</p>
            </div>
            
            <!-- Chart Area (Wide) -->
            <div class="flex-1 h-[180px] w-full">
                <canvas baseChart
                  [data]="lineChartData"
                  [options]="lineChartOptions"
                  [type]="'line'">
                </canvas>
            </div>
         </div>
      </div>

      <!-- CARD 2: Right Column Stack -->
      <div class="col-span-12 lg:col-span-4 flex flex-col gap-6">
         
         <!-- 2A: News Articles (White/Clean) -->
         <div class="bg-white rounded-[2.5rem] p-6 shadow-sm border border-admin-border flex items-center justify-between">
            <div class="flex items-center gap-4">
               <div class="w-12 h-12 rounded-full bg-admin-accent/10 text-admin-accent flex items-center justify-center border border-admin-accent/20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
               </div>
               <div>
                  <h4 class="font-bold text-admin-text-main font-playfair">News Articles</h4>
                  <p class="text-xs text-admin-text-muted">{{ newsCount }} published</p>
               </div>
            </div>
         </div>

         <!-- 2B: Upcoming (Light/Gold) -->
         <div class="flex-1 bg-white rounded-[2.5rem] p-6 relative overflow-hidden flex flex-col justify-between border border-admin-border shadow-sm">
            <div class="flex justify-between items-start">
               <h3 class="font-bold text-admin-text-main font-playfair">Upcoming</h3>
               <span class="w-8 h-8 rounded-full bg-admin-accent flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
               </span>
            </div>
            <div class="mt-4 space-y-3">
               <!-- Dynamic Recent Updates -->
               <div *ngFor="let item of recentItems; let i = index" class="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div class="text-xs text-admin-text-muted mb-1">New Update</div>
                  <div class="font-bold text-admin-text-main truncate font-playfair">{{ item.title || item.movie || 'Update' }}</div>
               </div>
               <div *ngIf="recentItems.length === 0" class="text-sm text-gray-500">No recent updates</div>
            </div>
         </div>

      </div>

      <!-- CARD 3: Impact Overview (Gold Text on White or Gold Background? User said 'remove dark theme'. White card with Gold accents is safest "Official Light" look, but fully Gold card is premium.) -->
      <!-- Let's try White Card with Gold Gradient Text/Borders for elegance -->
      <div class="col-span-12 lg:col-span-7 bg-white rounded-[2.5rem] p-8 text-admin-text-main relative border border-admin-border shadow-sm">
         <div class="absolute top-4 right-4 flex gap-2">
            <button class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-600">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
         </div>

         <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 rounded-2xl bg-admin-accent flex items-center justify-center shadow-lg shadow-admin-accent/30">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 class="text-xl font-bold font-playfair">Impact Overview</h3>
         </div>

         <div class="grid grid-cols-2 gap-8 items-end">
            <div>
               <p class="text-sm font-medium opacity-80 mb-1">Donations Raised</p>
               <h2 class="text-4xl font-playfair font-bold text-admin-accent">₹{{ totalDonations | number:'1.0-0' }}</h2>
               <div class="text-xs mt-2 font-medium bg-gray-100 inline-block px-2 py-1 rounded-lg text-gray-600">Target: ₹10,00,000</div>
            </div>
            
            <!-- Simple Semi-Circle Gauge Visual -->
            <div class="relative h-24 flex items-end justify-center">
               <div class="w-40 h-20 rounded-t-full bg-gray-100 relative overflow-hidden">
                  <div class="absolute bottom-0 left-0 w-full h-full bg-admin-accent origin-bottom transform rotate-45 transition-transform duration-1000"></div>
               </div>
               <div class="absolute bottom-0 w-4 h-4 bg-white rounded-full z-10 border-2 border-admin-accent"></div>
            </div>
         </div>
      </div>

      <!-- CARD 4: Content Forecast -->
      <!-- Bottom Right -->
      <div class="col-span-12 lg:col-span-5 bg-white border border-admin-border rounded-[2.5rem] p-8 text-admin-text-main relative overflow-hidden shadow-sm">
         <div class="flex justify-between items-start mb-6">
            <div>
               <p class="text-xs text-gray-400 uppercase tracking-widest font-bold">Content Reach</p>
               <h3 class="text-3xl font-bold mt-1 font-playfair">{{ totalContent | number:'1.0-0' }}</h3>
            </div>
            <div class="w-8 h-8 rounded-full bg-admin-accent/10 flex items-center justify-center text-admin-accent transform rotate-45">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </div>
         </div>

         <div class="space-y-6 relative">
             <div class="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gray-100"></div>
             
             <div class="relative pl-6">
                <div class="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-admin-accent bg-white"></div>
                <p class="text-xs text-gray-500 font-bold mb-1">Movies</p>
                <p class="font-medium text-sm">{{ movieCount }} Films Released</p>
                <div class="mt-2 text-xs bg-admin-accent/10 text-admin-accent inline-block px-2 py-0.5 rounded">Active</div>
             </div>

             <div class="relative pl-6">
                <div class="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-admin-accent bg-white"></div>
                <p class="text-xs text-gray-500 font-bold mb-1">Awards</p>
                <p class="font-medium text-sm">{{ awardCount }} Awards Won</p>
             </div>
         </div>
         
         <div class="absolute bottom-0 right-0 left-0 h-16 opacity-10">
             <svg viewBox="0 0 100 20" class="w-full h-full" preserveAspectRatio="none">
                 <path d="M0 20 L0 15 Q10 10 20 15 T40 10 T60 15 T80 5 T100 10 V20 Z" fill="#D4AF37" />
             </svg>
         </div>
      </div>

    </div>
  `,
   styles: [`
    /* No custom CSS needed, utilizing Tailwind arbitrary values */
  `]
})
export class DashboardComponent implements OnInit {

   // Stats
   totalInteraction = 0;
   totalDonations = 0;
   totalContent = 0;

   movieCount = 0;
   awardCount = 0;
   newsCount = 0;

   recentItems: any[] = [];

   // Chart Properties (Light Theme)
   public lineChartData: ChartConfiguration['data'] = {
      labels: [],
      datasets: [
         {
            data: [],
            label: 'Messages',
            fill: true,
            tension: 0.4,
            borderColor: '#D4AF37', // Official Royal Gold
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            pointBackgroundColor: '#D4AF37',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#D4AF37'
         }
      ]
   };

   public lineChartOptions: ChartConfiguration['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
         legend: { display: false },
         tooltip: {
            backgroundColor: '#FFFFFF', // White tooltip
            titleColor: '#111827',     // Dark title
            bodyColor: '#4B5563',      // Gray body
            borderColor: '#E5E7EB',
            borderWidth: 1,
            padding: 10
         }
      },
      scales: {
         x: {
            grid: { display: false },
            ticks: { color: '#9CA3AF' } // Gray-400
         },
         y: {
            grid: { color: '#F3F4F6', display: true }, // Light grid lines
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
            // 1. Counts
            this.movieCount = res.movies.length;
            this.awardCount = res.awards.length;
            this.newsCount = res.news.length;

            // 2. Total Content
            this.totalContent = this.movieCount + this.awardCount + this.newsCount;

            // 3. Real Fan Engagement (Contact Messages)
            this.totalInteraction = res.contacts.length;
            this.processChartData(res.contacts);

            // 4. Donations
            this.totalDonations = res.philanthropy.reduce((sum, item) => sum + (item.value || 0), 0);

            // 5. Recent Items
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
      // Group messages by Month (Last 6 months logic)
      const monthCounts = new Map<string, number>();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      // Initialize current month and prev 5
      const today = new Date();
      const labels = [];
      for (let i = 5; i >= 0; i--) {
         const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
         const monthName = months[d.getMonth()];
         labels.push(monthName);
         monthCounts.set(monthName, 0);
      }

      // Sort contacts into buckets
      contacts.forEach(c => {
         if (!c.submittedAt) return;
         const d = new Date(c.submittedAt);
         const monthName = months[d.getMonth()];
         if (monthCounts.has(monthName)) {
            monthCounts.set(monthName, (monthCounts.get(monthName) || 0) + 1);
         }
      });

      const data = labels.map(label => monthCounts.get(label) || 0);

      // Update Chart with Official Colors
      this.lineChartData = {
         labels: labels,
         datasets: [{
            data: data,
            label: 'Messages',
            fill: true,
            tension: 0.4,
            borderColor: '#D4AF37',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            pointBackgroundColor: '#D4AF37',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#D4AF37'
         }]
      };
   }
}
