import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration, ChartType } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="space-y-8 animate-float">
      
      <!-- Welcome Section -->
      <div class="flex items-end justify-between">
         <div>
            <h2 class="text-3xl font-playfair font-bold text-white mb-2">Welcome back, Admin</h2>
            <p class="text-admin-text-muted">Here's what's happening with your website today.</p>
         </div>
         <div class="flex gap-3">
            <button class="px-4 py-2 bg-admin-card border border-admin-border text-admin-text-main rounded-lg hover:border-admin-accent transition-colors text-sm">Download Report</button>
            <button class="px-4 py-2 bg-admin-accent text-white rounded-lg shadow-neon hover:bg-opacity-90 transition-all text-sm font-medium">Create Campaign</button>
         </div>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <!-- Card 1 -->
         <div class="bg-admin-card border border-admin-border p-6 rounded-2xl relative overflow-hidden group hover:border-admin-accent/50 transition-all duration-300">
            <div class="absolute inset-0 bg-gradient-to-br from-admin-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-admin-dark rounded-lg text-admin-accent">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                    <span class="text-xs font-medium text-admin-success bg-admin-success/10 px-2 py-1 rounded-full">+12.5%</span>
                </div>
                <h3 class="text-3xl font-bold text-white mb-1">12,345</h3>
                <p class="text-sm text-admin-text-muted">Total Visitors</p>
            </div>
         </div>

         <!-- Card 2 -->
         <div class="bg-admin-card border border-admin-border p-6 rounded-2xl relative overflow-hidden group hover:border-admin-warning/50 transition-all duration-300">
            <div class="absolute inset-0 bg-gradient-to-br from-admin-warning/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-admin-dark rounded-lg text-admin-warning">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </div>
                    <span class="text-xs font-medium text-admin-success bg-admin-success/10 px-2 py-1 rounded-full">+8.2%</span>
                </div>
                <h3 class="text-3xl font-bold text-white mb-1">45.2k</h3>
                <p class="text-sm text-admin-text-muted">Page Views</p>
            </div>
         </div>

         <!-- Card 3 -->
         <div class="bg-admin-card border border-admin-border p-6 rounded-2xl relative overflow-hidden group hover:border-royal-gold/50 transition-all duration-300">
             <div class="absolute inset-0 bg-gradient-to-br from-royal-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-admin-dark rounded-lg text-royal-gold">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <span class="text-xs font-medium text-admin-danger bg-admin-danger/10 px-2 py-1 rounded-full">-2.4%</span>
                </div>
                <h3 class="text-3xl font-bold text-white mb-1">$12.4k</h3>
                <p class="text-sm text-admin-text-muted">Ad Revenue</p>
             </div>
         </div>

         <!-- Card 4 -->
         <div class="bg-admin-card border border-admin-border p-6 rounded-2xl relative overflow-hidden group hover:border-admin-success/50 transition-all duration-300">
             <div class="absolute inset-0 bg-gradient-to-br from-admin-success/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-admin-dark rounded-lg text-admin-success">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </div>
                    <span class="text-xs font-medium text-admin-success bg-admin-success/10 px-2 py-1 rounded-full">+24%</span>
                </div>
                <h3 class="text-3xl font-bold text-white mb-1">98.5%</h3>
                <p class="text-sm text-admin-text-muted">Uptime</p>
             </div>
         </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Chart -->
          <div class="lg:col-span-2 bg-admin-card border border-admin-border rounded-2xl p-6">
              <div class="flex justify-between items-center mb-6">
                  <h3 class="text-lg font-bold text-white">Traffic Overview</h3>
                  <select class="bg-admin-dark border border-admin-border text-admin-text-muted text-sm rounded-lg px-3 py-1 focus:outline-none">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>This Year</option>
                  </select>
              </div>
              <div class="h-[300px] w-full">
                  <canvas baseChart
                    [data]="lineChartData"
                    [options]="lineChartOptions"
                    [type]="'line'">
                  </canvas>
              </div>
          </div>

          <!-- Secondary Chart -->
          <div class="bg-admin-card border border-admin-border rounded-2xl p-6 flex flex-col">
              <h3 class="text-lg font-bold text-white mb-6">Device Usage</h3>
              <div class="h-[250px] w-full flex-1 flex items-center justify-center relative">
                   <canvas baseChart
                    [data]="doughnutChartData"
                    [options]="doughnutChartOptions"
                    [type]="'doughnut'">
                  </canvas>
                  <!-- Center Text Overlay -->
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div class="text-center mt-2">
                          <p class="text-2xl font-bold text-white">85%</p>
                          <p class="text-xs text-admin-text-muted">Mobile</p>
                      </div>
                  </div>
              </div>
              <div class="mt-6 space-y-3">
                  <div class="flex justify-between items-center">
                      <div class="flex items-center gap-2">
                          <span class="w-3 h-3 rounded-full bg-admin-accent"></span>
                          <span class="text-sm text-admin-text-muted">Mobile</span>
                      </div>
                      <span class="text-sm font-medium text-white">65%</span>
                  </div>
                   <div class="flex justify-between items-center">
                      <div class="flex items-center gap-2">
                          <span class="w-3 h-3 rounded-full bg-admin-warning"></span>
                          <span class="text-sm text-admin-text-muted">Desktop</span>
                      </div>
                      <span class="text-sm font-medium text-white">25%</span>
                  </div>
                   <div class="flex justify-between items-center">
                      <div class="flex items-center gap-2">
                          <span class="w-3 h-3 rounded-full bg-admin-success"></span>
                          <span class="text-sm text-admin-text-muted">Tablet</span>
                      </div>
                      <span class="text-sm font-medium text-white">10%</span>
                  </div>
              </div>
          </div>
      </div>

      <!-- Recent Activity Table -->
      <div class="bg-admin-card border border-admin-border rounded-2xl overflow-hidden">
          <div class="p-6 border-b border-admin-border flex justify-between items-center">
              <h3 class="text-lg font-bold text-white">Recent Activity</h3>
              <button class="text-sm text-admin-accent hover:text-white transition-colors">View All</button>
          </div>
          <div class="overflow-x-auto">
              <table class="w-full text-left">
                  <thead class="bg-admin-dark text-admin-text-muted text-xs uppercase tracking-wider">
                      <tr>
                          <th class="px-6 py-4 font-medium">User</th>
                          <th class="px-6 py-4 font-medium">Action</th>
                          <th class="px-6 py-4 font-medium">Date</th>
                          <th class="px-6 py-4 font-medium">Status</th>
                          <th class="px-6 py-4 font-medium text-right"></th>
                      </tr>
                  </thead>
                  <tbody class="divide-y divide-admin-border text-sm">
                      <tr class="hover:bg-admin-glass transition-colors group">
                          <td class="px-6 py-4 text-white font-medium flex items-center gap-3">
                              <div class="w-8 h-8 rounded-full bg-gray-700"></div>
                              Sarah Johnson
                          </td>
                          <td class="px-6 py-4 text-admin-text-muted">Updated Gallery</td>
                          <td class="px-6 py-4 text-admin-text-muted">2 mins ago</td>
                          <td class="px-6 py-4">
                              <span class="px-2 py-1 rounded-full text-xs font-medium bg-admin-success/10 text-admin-success border border-admin-success/20">Completed</span>
                          </td>
                          <td class="px-6 py-4 text-right">
                              <button class="text-admin-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                              </button>
                          </td>
                      </tr>
                      <tr class="hover:bg-admin-glass transition-colors group">
                          <td class="px-6 py-4 text-white font-medium flex items-center gap-3">
                              <div class="w-8 h-8 rounded-full bg-gray-700"></div>
                              Mike Chen
                          </td>
                          <td class="px-6 py-4 text-admin-text-muted">Added New Movie</td>
                          <td class="px-6 py-4 text-admin-text-muted">1 hour ago</td>
                          <td class="px-6 py-4">
                              <span class="px-2 py-1 rounded-full text-xs font-medium bg-admin-warning/10 text-admin-warning border border-admin-warning/20">Pending</span>
                          </td>
                          <td class="px-6 py-4 text-right">
                              <button class="text-admin-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                              </button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  `
})
export class DashboardComponent {

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Sessions',
        fill: true,
        tension: 0.4, // Smooth curves
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1'
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'Conversions',
        fill: true,
        tension: 0.4,
        borderColor: '#D4AF37', // Royal Gold
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        pointBackgroundColor: '#D4AF37',
        pointBorderColor: '#fff',
      }
    ]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#141414',
        titleColor: '#fff',
        bodyColor: '#9ca3af',
        borderColor: '#333',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { display: false, color: '#333' },
        ticks: { color: '#9ca3af' }
      },
      y: {
        grid: { color: '#333', display: true }, // dashed?
        ticks: { color: '#9ca3af' },
        border: { display: false }
      }
    }
  };


  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Mobile', 'Desktop', 'Tablet'],
    datasets: [
      {
        data: [350, 450, 100],
        backgroundColor: ['#6366f1', '#f59e0b', '#10b981'],
        hoverBackgroundColor: ['#4f46e5', '#d97706', '#059669'],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%', // Thinner ring
    plugins: {
      legend: { display: false }
    }
  };

}
