import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-welcome-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="isVisible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" (click)="closePopup()"></div>

      <!-- Modal Content -->
      <div class="relative z-10 bg-white dark:bg-charcoal w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded shadow-2xl overflow-hidden border-2 border-white animate-fade-in-up">
        
        <!-- Close Button -->
        <button (click)="closePopup()" class="absolute top-4 right-4 text-white/70 hover:text-white z-20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Left Side: Image -->
        <div class="relative h-72 md:h-auto">
          <img 
            src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296812/SRP_q8wmpl.jpg" 
            alt="Welcome" 
            class="w-full h-full object-cover object-top"
          />
        </div>

        <!-- Right Side: Content -->
        <div class="p-8 md:p-12 bg-[#1a1a1a] text-white flex flex-col justify-center items-center text-center relative">
           <!-- Font Link -->
           <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
          
          <!-- Logo/Header -->
          <h2 class="font-playfair text-3xl font-bold uppercase tracking-widest mb-2 leading-none text-white/90">
            Samantha<br>Official
          </h2>
          
          <!-- Question State -->
          <div *ngIf="!selection" class="w-full flex flex-col items-center animate-fade-in-up">
              <h3 class="text-3xl md:text-4xl font-cinzel font-bold mb-8 mt-10 text-royal-gold tracking-wider leading-tight">
                Do You<br>Love Me?
              </h3>
              
              <div class="flex gap-6 justify-center w-full mt-4">
                <button (click)="selectOption('yes')" class="group relative px-8 py-3 bg-transparent border border-white/30 hover:border-royal-gold rounded transition-all duration-300 overflow-hidden">
                   <div class="absolute inset-0 bg-royal-gold/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                   <span class="relative font-cinzel font-bold tracking-widest text-[#d4af37]">YES</span>
                </button>
                
                <button (click)="selectOption('no')" class="group relative px-8 py-3 bg-transparent border border-white/30 hover:border-white/60 rounded transition-all duration-300">
                   <span class="relative font-cinzel font-bold tracking-widest text-white/70 group-hover:text-white">NO</span>
                </button>
              </div>
          </div>

          <!-- Yes State -->
          <div *ngIf="selection === 'yes'" class="animate-fade-in-up mt-8">
              <div class="text-6xl mb-4 animate-bounce">❤️</div>
              <h3 class="text-2xl font-cinzel text-[#d4af37] mb-2">I Love You Too!</h3>
              <p class="text-white/60 text-sm mb-6">Welcome to the community.</p>
              <button (click)="onEnterSite()" class="px-6 py-2 bg-white/10 hover:bg-white/20 rounded text-sm tracking-widest transition-colors">ENTER SITE</button>
          </div>

           <!-- No State -->
           <div *ngIf="selection === 'no'" class="animate-fade-in-up mt-8">
              <div class="text-6xl mb-4 animate-pulse">💔</div>
              <h3 class="text-xl font-cinzel text-white/50 mb-6">Oh... implies you are missing out.</h3>
              <button (click)="onEnterSite()" class="underline text-white/30 hover:text-white/80 transition-colors text-sm">Enter Site Anyway</button>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
    .font-cinzel { font-family: 'Cinzel', serif; }
    .font-playfair { font-family: 'Playfair Display', serif; }
    .text-royal-gold { color: #D4AF37; }
  `]
})
export class WelcomePopupComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  isVisible = true;
  selection: 'yes' | 'no' | null = null;

  yesAudioUrl = '';
  noAudioUrl = '';
  enterAudioUrl = '';

  private currentAudio: HTMLAudioElement | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    // Prevent body scroll when popup is open
    document.body.style.overflow = 'hidden';

    // Load Audio Settings
    this.apiService.getSettings().subscribe(settings => {
      const yes = settings.find(s => s.key === 'yes_audio');
      const no = settings.find(s => s.key === 'no_audio');
      const enter = settings.find(s => s.key === 'enter_site_audio');
      if (yes) this.yesAudioUrl = yes.value;
      if (no) this.noAudioUrl = no.value;
      if (enter) this.enterAudioUrl = enter.value;
    });
  }

  stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  selectOption(option: 'yes' | 'no') {
    this.selection = option;

    // Stop previous audio
    this.stopAudio();

    // Play Audio
    const url = option === 'yes' ? this.yesAudioUrl : this.noAudioUrl;
    if (url) {
      this.currentAudio = new Audio(url);
      this.currentAudio.play().catch(e => console.error('Audio play failed', e));
    }
  }

  onEnterSite() {
    // Stop previous audio (e.g. Yes/No response audio)
    this.stopAudio();

    // Play Enter Site Audio if available
    if (this.enterAudioUrl) {
      this.currentAudio = new Audio(this.enterAudioUrl);
      this.currentAudio.play().catch(e => console.error('Audio play failed', e));
    }
    this.closePopup();
  }

  closePopup() {
    this.isVisible = false;
    document.body.style.overflow = '';
    this.close.emit();
  }
}

