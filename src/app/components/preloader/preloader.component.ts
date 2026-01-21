import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-preloader',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed inset-0 z-[10000] bg-ivory dark:bg-deep-black flex flex-col items-center justify-center transition-all duration-700">
      
      <!-- Logo Container -->
      <div class="relative w-24 h-24 mb-6">
         <!-- Main Logo Image -->
         <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748007968/8F9A7052_blcxqk.jpg" 
              class="w-full h-full rounded-full object-cover animate-pulse-slow border-2 border-royal-gold shadow-2xl"
              alt="Loading..." />
         
         <!-- Orbital Ring 1 -->
         <div class="absolute inset-0 rounded-full border-2 border-royal-gold/30 animate-spin-slow"></div>
         <!-- Orbital Ring 2 (Counter-rotate) -->
         <div class="absolute -inset-2 rounded-full border border-royal-gold/20 animate-spin-reverse"></div>
      </div>

      <!-- Text Loading -->
      <div class="text-center">
        <h2 class="font-playfair text-2xl font-bold text-charcoal dark:text-ivory tracking-widest mb-2 animate-fade-in-up">
          SAMANTHA
        </h2>
        <div class="flex items-center justify-center space-x-1">
          <span class="w-1.5 h-1.5 bg-royal-gold rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span class="w-1.5 h-1.5 bg-royal-gold rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span class="w-1.5 h-1.5 bg-royal-gold rounded-full animate-bounce"></span>
        </div>
        <p class="font-inter text-xs text-royal-gold mt-4 uppercase tracking-[0.2em] opacity-80">
          Initializing Experience
        </p>
      </div>

    </div>
  `,
    styles: [`
    .animate-pulse-slow {
      animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    .animate-spin-slow {
      animation: spin 8s linear infinite;
    }

    .animate-spin-reverse {
      animation: spin 12s linear infinite reverse;
    }

    .animate-fade-in-up {
      animation: fadeInUp 1s ease-out;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(0.95); }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class PreloaderComponent { }
