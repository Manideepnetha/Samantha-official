import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, SiteSetting } from '../../../services/api.service';

@Component({
  selector: 'app-manage-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sr-admin-page">
      <div class="sr-admin-page-header">
        <div>
          <span class="sr-kicker">Settings</span>
          <h1 class="sr-admin-title">Site Settings</h1>
          <p class="sr-admin-subtitle">Configure global audio behavior and homepage ticker content from the same editorial control surface.</p>
        </div>
      </div>

      <div class="sr-surface p-6 md:p-8">
        <div class="sr-admin-toolbar">
          <div>
            <span class="sr-kicker">Popup Audio</span>
            <h2 class="sr-card-title mt-2">"Do You Love Me?" Popup</h2>
          </div>
        </div>

        <div class="mt-8 space-y-8">
          <div class="grid gap-3">
            <label class="sr-field-label">'Yes' Response Audio URL</label>
            <div class="flex flex-col gap-3 md:flex-row">
              <input [(ngModel)]="yesAudio" type="text" placeholder="https://example.com/audio/love_song.mp3" class="sr-input flex-1">
              <button (click)="saveSetting('yes_audio', yesAudio)" class="sr-button whitespace-nowrap">Save</button>
            </div>
            <p *ngIf="yesAudio" class="sr-card-text">Current: {{ yesAudio }}</p>
          </div>

          <div class="grid gap-3">
            <label class="sr-field-label">'No' Response Audio URL</label>
            <div class="flex flex-col gap-3 md:flex-row">
              <input [(ngModel)]="noAudio" type="text" placeholder="https://example.com/audio/sad_song.mp3" class="sr-input flex-1">
              <button (click)="saveSetting('no_audio', noAudio)" class="sr-button-outline whitespace-nowrap">Save</button>
            </div>
            <p *ngIf="noAudio" class="sr-card-text">Current: {{ noAudio }}</p>
          </div>

          <div class="grid gap-3">
            <label class="sr-field-label">'Enter Site' Audio URL</label>
            <div class="flex flex-col gap-3 md:flex-row">
              <input [(ngModel)]="enterAudio" type="text" placeholder="https://example.com/audio/enter_site.mp3" class="sr-input flex-1">
              <button (click)="saveSetting('enter_site_audio', enterAudio)" class="sr-button-outline whitespace-nowrap">Save</button>
            </div>
            <p *ngIf="enterAudio" class="sr-card-text">Current: {{ enterAudio }}</p>
          </div>

          <div class="sr-divider"></div>

          <div class="space-y-5">
            <div>
              <span class="sr-kicker">Ticker</span>
              <h3 class="sr-card-title mt-2">Latest Updates Strip</h3>
              <p class="sr-card-text mt-3">Control the scrolling homepage message and its destination link. Leave the text empty if you want the ticker hidden.</p>
            </div>

            <div class="grid gap-3">
              <label class="sr-field-label">Ticker Text</label>
              <div class="flex flex-col gap-3 md:flex-row">
                <input [(ngModel)]="tickerText" type="text" placeholder="Breaking News: Samantha wins Best Actress!" class="sr-input flex-1">
                <button (click)="saveSetting('latest_updates_text', tickerText)" class="sr-button whitespace-nowrap">Save Text</button>
              </div>
            </div>

            <div class="grid gap-3">
              <label class="sr-field-label">Destination URL</label>
              <div class="flex flex-col gap-3 md:flex-row">
                <input [(ngModel)]="tickerLink" type="text" placeholder="https://youtube.com/watch?v=..." class="sr-input flex-1">
                <button (click)="saveSetting('latest_updates_link', tickerLink)" class="sr-button-outline whitespace-nowrap">Save Link</button>
              </div>
            </div>

            <div class="sr-admin-note">
              <p *ngIf="tickerText">Current Text: {{ tickerText }}</p>
              <p *ngIf="tickerLink" class="mt-2">Current Link: {{ tickerLink }}</p>
              <p *ngIf="!tickerText && !tickerLink">No ticker content has been saved yet.</p>
            </div>
          </div>

          <div class="sr-admin-note">
            Tip: Host audio files on a public cloud URL such as Cloudinary, Dropbox, or S3, then paste the direct link here so the popup can stream them reliably.
          </div>
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
