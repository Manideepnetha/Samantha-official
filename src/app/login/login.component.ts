import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('loginCard', { static: false }) loginCard!: ElementRef;
  @ViewChild('logoElement', { static: false }) logoElement!: ElementRef;
  @ViewChild('formElements', { static: false }) formElements!: ElementRef;
  
  loginForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Form initialization
  }

  ngAfterViewInit(): void {
    this.initializeAnimations();
  }

  initializeAnimations(): void {
    // Set initial states
    gsap.set([this.loginCard.nativeElement, this.logoElement.nativeElement], {
      opacity: 0,
      y: 50,
      scale: 0.9
    });

    // Create entrance timeline
    const tl = gsap.timeline({ delay: 0.2 });
    
    tl.to(this.loginCard.nativeElement, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)"
    })
    .to(this.logoElement.nativeElement, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4")
    .from('.form-field', {
      opacity: 0,
      y: 30,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.3")
    .from('.welcome-text', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.2");

    // Add continuous floating animation
    gsap.to('.floating-initials', {
      y: -10,
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });
  }

  onInputFocus(event: Event): void {
    const input = event.target as HTMLInputElement;
    const label = input.nextElementSibling as HTMLElement;
    
    gsap.to(label, {
      scale: 0.85,
      y: -8,
      color: '#c084fc',
      duration: 0.3,
      ease: "power2.out"
    });
  }

  onInputBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    const label = input.nextElementSibling as HTMLElement;
    
    if (!input.value) {
      gsap.to(label, {
        scale: 1,
        y: 0,
        color: 'rgba(255, 255, 255, 0.7)',
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      // Animate button
      gsap.to('.submit-button', {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });

      // Simulate login process
      setTimeout(() => {
        this.isLoading = false;
        console.log('Login attempt:', this.loginForm.value);
        // Add your authentication logic here
      }, 2000);
    } else {
      // Shake animation for invalid form
      gsap.to(this.loginCard.nativeElement, {
        keyframes: [
          { x: -10 },
          { x: 10 },
          { x: -10 },
          { x: 10 },
          { x: 0 }
        ],
        duration: 0.5,
        ease: "power2.inOut"
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} must be at least 6 characters`;
    }
    return '';
  }
} 