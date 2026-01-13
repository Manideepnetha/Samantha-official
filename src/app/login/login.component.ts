import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen w-full relative overflow-hidden font-inter text-white flex flex-col justify-between">
      
      <!-- Background Image -->
      <div class="absolute inset-0 z-0">
          <div class="absolute inset-0 bg-black/60 z-10"></div> <!-- Dark Overlay -->
          <img src="assets/images/samantha-login-bg.jpg" alt="Background" class="w-full h-full object-cover object-[50%_25%] filter contrast-110">
      </div>

      <!-- Top Navigation (Visual Only) -->
      <header class="relative z-20 w-full px-8 py-6 flex justify-between items-center opacity-0 -translate-y-4 header-anim">
          <div class="flex items-center gap-2">
              <span class="text-xl font-bold font-playfair tracking-wider">SAMANTHA</span>
              <span class="w-1 h-1 bg-royal-gold rounded-full"></span>
              <span class="text-xs uppercase tracking-widest text-royal-gold">Admin</span>
          </div>
          <nav class="hidden md:flex gap-8 text-sm font-medium text-gray-300">
              <a href="#" class="hover:text-white transition-colors">Login</a>
              <a href="#" class="hover:text-white transition-colors">About Us</a>
              <a href="#" class="hover:text-white transition-colors">Register</a>
              <a href="#" class="hover:text-white transition-colors">Contact</a>
          </nav>
      </header>

      <!-- Main Content -->
      <main class="relative z-20 flex-1 flex flex-col items-center justify-center p-4">
          
          <div #loginContainer class="w-full max-w-[450px] flex flex-col items-center opacity-0 translate-y-10">
              
              <!-- Shield Logo (Replica of reference but with 'S') -->
              <div class="mb-10 relative group">
                  <div class="absolute inset-0 bg-royal-gold blur-[30px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <div class="w-20 h-24 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 clip-shield flex items-center justify-center relative z-10 shadow-2xl">
                       <span class="font-playfair text-4xl font-bold text-white drop-shadow-lg">S</span>
                  </div>
              </div>

              <!-- Form -->
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="w-full space-y-6">
                  
                  <!-- Email/Username -->
                  <div class="relative group">
                      <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/50 group-focus-within:text-white transition-colors">
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                      </div>
                      <input type="email" formControlName="email" 
                             class="w-full bg-white/10 border border-white/10 rounded-full py-4 pl-14 pr-6 text-white placeholder-white/50 focus:outline-none focus:bg-black/40 focus:border-white/30 transition-all duration-300 backdrop-blur-sm"
                             placeholder="Username">
                  </div>

                  <!-- Password -->
                  <div class="relative group">
                      <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/50 group-focus-within:text-white transition-colors">
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path></svg>
                      </div>
                      <input type="password" formControlName="password" 
                             class="w-full bg-white/10 border border-white/10 rounded-full py-4 pl-14 pr-6 text-white placeholder-white/50 focus:outline-none focus:bg-black/40 focus:border-white/30 transition-all duration-300 backdrop-blur-sm"
                             placeholder="Password">
                  </div>

                  <!-- Submit Button -->
                  <button type="submit" [disabled]="isLoading"
                          class="w-full bg-[#ff4b5c] hover:bg-[#ff3649] text-white font-bold tracking-wider uppercase py-4 rounded-full shadow-lg shadow-red-900/40 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed">
                      <span *ngIf="!isLoading">Get Started</span>
                      <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
                        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      </span>
                  </button>

                  <!-- Links -->
                  <div class="flex justify-between items-center text-sm px-2">
                      <label class="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white transition-colors">
                          <input type="checkbox" class="rounded bg-white/10 border-white/20 text-red-500 focus:ring-0">
                          <span>Keep Logged In</span>
                      </label>
                      <a href="#" class="text-gray-300 hover:text-white transition-colors">Forgot Password?</a>
                  </div>

                  <div class="flex justify-between items-center text-xs font-bold tracking-wider pt-6 border-t border-white/10 mt-6">
                      <a href="#" class="text-white hover:text-[#ff4b5c] transition-colors uppercase">Create Account</a>
                      <a href="#" class="text-white hover:text-[#ff4b5c] transition-colors uppercase">Need Help?</a>
                  </div>

              </form>
          </div>
      </main>

      <!-- Footer -->
      <footer class="relative z-20 w-full px-8 py-6 flex justify-between items-center text-xs text-gray-400 opacity-0 translate-y-4 header-anim">
          <div class="flex gap-6">
              <a href="#" class="hover:text-white">About Us</a>
              <a href="#" class="hover:text-white">Privacy Policy</a>
              <a href="#" class="hover:text-white">Terms Of Use</a>
          </div>
          <p>&copy; 2024 Samantha Official. Design inspired by W3Layouts</p>
      </footer>

    </div>
  `,
  styles: [`
    .clip-shield {
        clip-path: polygon(50% 0%, 100% 15%, 85% 100%, 50% 100%, 15% 100%, 0% 15%);
    }
  `]
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('loginContainer') loginContainer!: ElementRef;

  loginForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngAfterViewInit(): void {
    const tl = gsap.timeline();

    // 1. Header/Footer fade in
    tl.to('.header-anim', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.2
    });

    // 2. Main Login Container slide up
    tl.to(this.loginContainer.nativeElement, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
    }, "-=0.8");
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.apiService.login({ email, password }).subscribe({
        next: () => {
          gsap.to(this.loginContainer.nativeElement, {
            scale: 0.9,
            opacity: 0,
            duration: 0.3,
            onComplete: () => { this.router.navigate(['/admin/dashboard']); }
          });
        },
        error: (err) => {
          this.isLoading = false;
          gsap.fromTo(this.loginContainer.nativeElement,
            { x: -10 },
            { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'none' }
          );
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      gsap.fromTo(this.loginContainer.nativeElement,
        { x: -10 },
        { x: 10, duration: 0.1, repeat: 5, yoyo: true, ease: 'none' }
      );
    }
  }
}