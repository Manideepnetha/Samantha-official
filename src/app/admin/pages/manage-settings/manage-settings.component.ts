import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, SiteSetting } from '../../../services/api.service';

@Component({
  selector: 'app-manage-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-playfair font-bold text-admin-text-main">Site Settings</h1>
        <p class="text-admin-text-muted mt-2">Configure global website behavior and assets.</p>
      </div>

      <div class="bg-admin-card rounded-2xl shadow-sm border border-admin-border p-8 max-w-3xl">
        <h2 class="text-xl font-bold text-admin-text-main mb-6 border-b border-gray-100 pb-2">"Do You Love Me?" Popup Audio</h2>
        
        <div class="space-y-6">
          <!-- Yes Audio -->
          <div>
            <label class="block text-sm font-semibold text-gray-600 mb-2">
              'Yes' Response Audio URL
              <span class="text-xs font-normal text-gray-400 ml-2">(Plays when user clicks YES)</span>
            </label>
            <div class="flex gap-2">
              <input [(ngModel)]="yesAudio" type="text" placeholder="https://example.com/audio/love_song.mp3" 
                     class="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-admin-text-main focus:border-admin-accent focus:ring-1 focus:ring-admin-accent outline-none transition-all">
              <button (click)="saveSetting('yes_audio', yesAudio)" 
                      class="px-6 py-2 bg-admin-accent text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors shadow-md">
                Save
              </button>
            </div>
            <p *ngIf="yesAudio" class="mt-2 text-xs text-green-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Current: {{ yesAudio }}
            </p>
          </div>

          <!-- No Audio -->
          <div>
            <label class="block text-sm font-semibold text-gray-600 mb-2">
              'No' Response Audio URL
              <span class="text-xs font-normal text-gray-400 ml-2">(Plays when user clicks NO)</span>
            </label>
            <div class="flex gap-2">
              <input [(ngModel)]="noAudio" type="text" placeholder="https://example.com/audio/sad_song.mp3" 
                     class="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-admin-text-main focus:border-admin-accent focus:ring-1 focus:ring-admin-accent outline-none transition-all">
              <button (click)="saveSetting('no_audio', noAudio)" 
                      class="px-6 py-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-black transition-colors shadow-md">
                Save
              </button>
            </div>
             <p *ngIf="noAudio" class="mt-2 text-xs text-green-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Current: {{ noAudio }}
            </p>
          </div>

          <!-- Enter Site Anyway Audio -->
          <div>
            <label class="block text-sm font-semibold text-gray-600 mb-2">
              'Enter Site' Audio URL
              <span class="text-xs font-normal text-gray-400 ml-2">(Plays when user clicks 'Enter Site Anyway')</span>
            </label>
            <div class="flex gap-2">
              <input [(ngModel)]="enterAudio" type="text" placeholder="https://example.com/audio/enter_site.mp3" 
                     class="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-admin-text-main focus:border-admin-accent focus:ring-1 focus:ring-admin-accent outline-none transition-all">
              <button (click)="saveSetting('enter_site_audio', enterAudio)" 
                      class="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-md">
                Save
              </button>
            </div>
             <p *ngIf="enterAudio" class="mt-2 text-xs text-green-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Current: {{ enterAudio }}
            </p>
          </div>
          
           <!-- Latest Updates Ticker -->
          <div>
            <label class="block text-sm font-semibold text-gray-600 mb-2">
              Latest Updates Ticker
              <span class="text-xs font-normal text-gray-400 ml-2">(Scrolling text on Home Page. Leave text empty to hide.)</span>
            </label>
            
            <!-- Ticker Text -->
            <div class="flex gap-2 mb-3">
              <input [(ngModel)]="tickerText" type="text" placeholder="Breaking News: Samantha wins Best Actress! Watch the interview now." 
                     class="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-admin-text-main focus:border-admin-accent focus:ring-1 focus:ring-admin-accent outline-none transition-all">
              <button (click)="saveSetting('latest_updates_text', tickerText)" 
                      class="px-6 py-2 bg-royal-gold text-deep-black font-bold rounded-lg hover:bg-yellow-600 transition-colors shadow-md">
                Save Text
              </button>
            </div>

            <!-- Ticker Link -->
             <label class="block text-xs font-semibold text-gray-500 mb-1 ml-1">
              Destination URL (Optional)
            </label>
            <div class="flex gap-2">
              <input [(ngModel)]="tickerLink" type="text" placeholder="https://youtube.com/watch?v=..." 
                     class="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-admin-text-main focus:border-admin-accent focus:ring-1 focus:ring-admin-accent outline-none transition-all">
              <button (click)="saveSetting('latest_updates_link', tickerLink)" 
                      class="px-6 py-2 bg-gray-700 text-white font-bold rounded-lg hover:bg-black transition-colors shadow-md text-sm">
                Save Link
              </button>
            </div>

             <div class="mt-2 text-xs text-green-600">
                <p *ngIf="tickerText" class="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Current Text: {{ tickerText }}
                </p>
                <p *ngIf="tickerLink" class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  Current Link: {{ tickerLink }}
                </p>
             </div>
          </div>

        </div>

        <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
           <p class="text-sm text-blue-800 font-medium">💡 Tip: Upload your audio files to a cloud service (like Cloudinary, Dropbox, or AWS S3) and paste the direct public link here.</p>
        </div>
      </div>
    </div>
  `
})
export class ManageSettingsComponent implements OnInit {

  yesAudio = '';
  noAudio = '';
  enterAudio = '';
  tickerText = '';
  tickerLink = '';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.apiService.getSettings().subscribe({
      next: (settings) => {
        const yes = settings.find(s => s.key === 'yes_audio');
        const no = settings.find(s => s.key === 'no_audio');
        const enter = settings.find(s => s.key === 'enter_site_audio');
        const ticker = settings.find(s => s.key === 'latest_updates_text');
        const link = settings.find(s => s.key === 'latest_updates_link');

        if (yes) this.yesAudio = yes.value;
        if (no) this.noAudio = no.value;
        if (enter) this.enterAudio = enter.value;
        if (ticker) this.tickerText = ticker.value;
        if (link) this.tickerLink = link.value;
      },
      error: (err) => console.error('Failed to load settings', err)
    });
  }

  saveSetting(key: string, value: string) {
    if (!value) return;

    // We pass 0 as ID since upsert logic in backend handles it based on key
    const setting: SiteSetting = { id: 0, key, value };

    this.apiService.upsertSetting(setting).subscribe({
      next: () => {
        const nameMap: { [key: string]: string } = {
          'yes_audio': 'Yes Audio',
          'no_audio': 'No Audio',
          'enter_site_audio': 'Enter Site Audio',
          'latest_updates_text': 'Ticker Text',
          'latest_updates_link': 'Ticker Link'
        };
        alert(`${nameMap[key] || 'Setting'} saved successfully!`);
        this.loadSettings();
      },
      error: (err) => {
        console.error('Failed to save setting', err);
        alert('Error saving setting');
      }
    });
  }
}
