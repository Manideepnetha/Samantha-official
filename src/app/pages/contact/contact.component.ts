import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-ivory dark:bg-deep-black">
      <!-- Hero Section -->
      <section class="relative h-[40vh] overflow-hidden">
        <div class="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Contact" 
            class="w-full h-full object-cover object-center" 
          />
          <div class="absolute inset-0 bg-gradient-to-b from-deep-black/80 to-deep-black/40"></div>
        </div>
        
        <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">Contact</span>
          <h1 class="text-4xl md:text-6xl font-playfair font-bold text-ivory mb-6 text-shadow">Get In Touch</h1>
          <p class="text-xl md:text-2xl text-ivory/90 font-lora italic max-w-3xl">Reach out to Samantha's team for inquiries, collaborations, and more.</p>
        </div>
      </section>

      <!-- Contact Tabs & Forms -->
      <section class="py-16 bg-ivory dark:bg-deep-black">
        <div class="container mx-auto px-4 max-w-6xl">
          <!-- Tabs -->
          <div class="flex flex-wrap justify-center mb-12 border-b border-gray-200 dark:border-gray-700">
            <button 
              *ngFor="let tab of tabs" 
              (click)="activeTab = tab.id"
              [class.text-royal-gold]="activeTab === tab.id"
              [class.border-royal-gold]="activeTab === tab.id"
              [class.border-transparent]="activeTab !== tab.id"
              class="px-6 py-4 font-playfair text-lg border-b-2 transition-colors"
              [class.text-charcoal]="activeTab !== tab.id"
              [class.dark:text-ivory]="activeTab !== tab.id"
            >
              {{tab.label}}
            </button>
          </div>

          <!-- Fan Inquiries Form -->
          <div *ngIf="activeTab === 'fans'" class="max-w-3xl mx-auto">
            <h2 class="text-2xl font-playfair font-bold mb-6 text-charcoal dark:text-ivory text-center">Fan Inquiries</h2>
            
            <form [formGroup]="fanForm" (ngSubmit)="submitFanForm()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label for="name" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    formControlName="name"
                    class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                    [class.border-red-500]="fanForm.get('name')?.invalid && fanForm.get('name')?.touched"
                  >
                  <div *ngIf="fanForm.get('name')?.invalid && fanForm.get('name')?.touched" class="mt-1 text-sm text-red-500">
                    Name is required
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="email" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    formControlName="email"
                    class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                    [class.border-red-500]="fanForm.get('email')?.invalid && fanForm.get('email')?.touched"
                  >
                  <div *ngIf="fanForm.get('email')?.invalid && fanForm.get('email')?.touched" class="mt-1 text-sm text-red-500">
                    Please enter a valid email address
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label for="subject" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  formControlName="subject"
                  class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                >
              </div>
              
              <div class="form-group">
                <label for="message" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Message</label>
                <textarea 
                  id="message" 
                  formControlName="message"
                  rows="6" 
                  class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all resize-none"
                  [class.border-red-500]="fanForm.get('message')?.invalid && fanForm.get('message')?.touched"
                ></textarea>
                <div *ngIf="fanForm.get('message')?.invalid && fanForm.get('message')?.touched" class="mt-1 text-sm text-red-500">
                  Message is required
                </div>
              </div>
              
              <div class="flex items-center">
                <input 
                  id="newsletter" 
                  type="checkbox" 
                  formControlName="newsletter"
                  class="w-4 h-4 rounded border-gray-300 focus:ring-royal-gold text-royal-gold"
                >
                <label for="newsletter" class="ml-2 text-sm text-gray-600 dark:text-gray-400">Subscribe to newsletter for updates</label>
              </div>
              
              <button 
                type="submit" 
                class="w-full md:w-auto md:px-8 py-3 bg-royal-gold text-deep-black rounded-lg font-inter font-medium hover-lift hover:shadow-royal-gold/50 transition-all"
                [disabled]="fanForm.invalid || isSubmitting"
              >
                <span *ngIf="!isSubmitting">Send Message</span>
                <span *ngIf="isSubmitting">Sending...</span>
              </button>
              
              <div *ngIf="formSubmitted" class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-3 rounded">
                Thank you for your message! We'll get back to you soon.
              </div>
            </form>
          </div>

          <!-- Media Inquiries -->
          <div *ngIf="activeTab === 'media'" class="max-w-3xl mx-auto">
            <h2 class="text-2xl font-playfair font-bold mb-6 text-charcoal dark:text-ivory text-center">Media Inquiries</h2>
            
            <form [formGroup]="mediaForm" (ngSubmit)="submitMediaForm()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label for="media-name" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Your Name</label>
                  <input 
                    type="text" 
                    id="media-name" 
                    formControlName="name"
                    class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                  >
                </div>
                
                <div class="form-group">
                  <label for="media-email" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Email Address</label>
                  <input 
                    type="email" 
                    id="media-email" 
                    formControlName="email"
                    class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                  >
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label for="media-outlet" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Media Outlet</label>
                  <input 
                    type="text" 
                    id="media-outlet" 
                    formControlName="mediaOutlet"
                    class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                  >
                </div>
                
                <div class="form-group">
                  <label for="media-type" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Media Type</label>
                  <select 
                    id="media-type" 
                    formControlName="mediaType"
                    class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                  >
                    <option value="">Select Type</option>
                    <option value="print">Print</option>
                    <option value="digital">Digital</option>
                    <option value="television">Television</option>
                    <option value="radio">Radio/Podcast</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label for="media-subject" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Subject</label>
                <input 
                  type="text" 
                  id="media-subject" 
                  formControlName="subject"
                  class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                >
              </div>
              
              <div class="form-group">
                <label for="media-message" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Message</label>
                <textarea 
                  id="media-message" 
                  formControlName="message"
                  rows="6" 
                  class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all resize-none"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="media-deadline" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Request Deadline (if any)</label>
                <input 
                  type="date" 
                  id="media-deadline" 
                  formControlName="deadline"
                  class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                >
              </div>
              
              <button 
                type="submit" 
                class="w-full md:w-auto md:px-8 py-3 bg-royal-gold text-deep-black rounded-lg font-inter font-medium hover-lift hover:shadow-royal-gold/50 transition-all"
                [disabled]="mediaForm.invalid || isSubmitting"
              >
                <span *ngIf="!isSubmitting">Send Request</span>
                <span *ngIf="isSubmitting">Sending...</span>
              </button>
              
              <div *ngIf="formSubmitted" class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-3 rounded">
                Thank you for your inquiry! Our team will review and respond as soon as possible.
              </div>
            </form>
          </div>

          <!-- Business/Brand Inquiries -->
          <div *ngIf="activeTab === 'business'" class="max-w-3xl mx-auto">
            <h2 class="text-2xl font-playfair font-bold mb-6 text-charcoal dark:text-ivory text-center">Business Inquiries</h2>
            
            <form [formGroup]="businessForm" (ngSubmit)="submitBusinessForm()" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label for="business-name" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Your Name</label>
                  <input 
                    type="text" 
                    id="business-name" 
                    formControlName="name"
                    class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                  >
                </div>
                
                <div class="form-group">
                  <label for="business-email" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Email Address</label>
                  <input 
                    type="email" 
                    id="business-email" 
                    formControlName="email"
                    class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                  >
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                  <label for="business-company" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Company Name</label>
                  <input 
                    type="text" 
                    id="business-company" 
                    formControlName="company"
                    class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                  >
                </div>
                
                <div class="form-group">
                  <label for="business-type" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Inquiry Type</label>
                  <select 
                    id="business-type" 
                    formControlName="inquiryType"
                    class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                  >
                    <option value="">Select Type</option>
                    <option value="endorsement">Brand Endorsement</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="appearance">Event Appearance</option>
                    <option value="acting">Acting Role</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label for="business-subject" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Subject</label>
                <input 
                  type="text" 
                  id="business-subject" 
                  formControlName="subject"
                  class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                >
              </div>
              
              <div class="form-group">
                <label for="business-message" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Proposal Details</label>
                <textarea 
                  id="business-message" 
                  formControlName="message"
                  rows="6" 
                  class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all resize-none"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="business-budget" class="block mb-2 text-sm font-medium text-charcoal dark:text-ivory">Budget Range (Optional)</label>
                <select 
                  id="business-budget" 
                  formControlName="budget"
                  class="w-full px-4 py-3 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-gold focus:border-royal-gold outline-none transition-all"
                >
                  <option value="">Select Budget Range</option>
                  <option value="under25k">Under $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="100k-250k">$100,000 - $250,000</option>
                  <option value="250k+">$250,000+</option>
                  <option value="discuss">To be discussed</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                class="w-full md:w-auto md:px-8 py-3 bg-royal-gold text-deep-black rounded-lg font-inter font-medium hover-lift hover:shadow-royal-gold/50 transition-all"
                [disabled]="businessForm.invalid || isSubmitting"
              >
                <span *ngIf="!isSubmitting">Submit Proposal</span>
                <span *ngIf="isSubmitting">Submitting...</span>
              </button>
              
              <div *ngIf="formSubmitted" class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-3 rounded">
                Thank you for your business inquiry! Our team will review your proposal and get back to you shortly.
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- Contact Info -->
      <section class="py-16 bg-white dark:bg-charcoal">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Management Contact -->
            <div class="text-center p-6 bg-ivory dark:bg-deep-black rounded-lg hover-lift">
              <div class="w-16 h-16 bg-royal-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-royal-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Management</h3>
              <p class="text-charcoal/70 dark:text-ivory/70 mb-4">For official management inquiries only</p>
              <a href="mailto:management&#64;samantharuthprabhu.com" class="text-royal-gold hover:underline">management&#64;samantharuthprabhu.com</a>
            </div>
            
            <!-- PR Contact -->
            <div class="text-center p-6 bg-ivory dark:bg-deep-black rounded-lg hover-lift">
              <div class="w-16 h-16 bg-royal-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-royal-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Press & Media</h3>
              <p class="text-charcoal/70 dark:text-ivory/70 mb-4">For media requests and press information</p>
              <a href="mailto:press&#64;samantharuthprabhu.com" class="text-royal-gold hover:underline">press&#64;samantharuthprabhu.com</a>
            </div>
            
            <!-- Business Contact -->
            <div class="text-center p-6 bg-ivory dark:bg-deep-black rounded-lg hover-lift">
              <div class="w-16 h-16 bg-royal-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-royal-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Business Inquiries</h3>
              <p class="text-charcoal/70 dark:text-ivory/70 mb-4">For endorsements and business proposals</p>
              <a href="mailto:business&#64;samantharuthprabhu.com" class="text-royal-gold hover:underline">business&#64;samantharuthprabhu.com</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class ContactComponent {
  tabs = [
    { id: 'fans', label: 'Fan Inquiries' },
    { id: 'media', label: 'Media Requests' },
    { id: 'business', label: 'Business Inquiries' }
  ];
  
  activeTab: string = 'fans';
  isSubmitting: boolean = false;
  formSubmitted: boolean = false;
  
  fanForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl(''),
    message: new FormControl('', [Validators.required]),
    newsletter: new FormControl(false)
  });
  
  mediaForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    mediaOutlet: new FormControl('', [Validators.required]),
    mediaType: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
    deadline: new FormControl('')
  });
  
  businessForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    company: new FormControl('', [Validators.required]),
    inquiryType: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
    budget: new FormControl('')
  });

  submitFanForm(): void {
    if (this.fanForm.valid) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.formSubmitted = true;
        this.fanForm.reset();
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          this.formSubmitted = false;
        }, 5000);
      }, 1500);
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.fanForm.controls).forEach(key => {
        const control = this.fanForm.get(key);
        control?.markAsTouched();
      });
    }
  }
  
  submitMediaForm(): void {
    if (this.mediaForm.valid) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.formSubmitted = true;
        this.mediaForm.reset();
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          this.formSubmitted = false;
        }, 5000);
      }, 1500);
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.mediaForm.controls).forEach(key => {
        const control = this.mediaForm.get(key);
        control?.markAsTouched();
      });
    }
  }
  
  submitBusinessForm(): void {
    if (this.businessForm.valid) {
      this.isSubmitting = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;
        this.formSubmitted = true;
        this.businessForm.reset();
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          this.formSubmitted = false;
        }, 5000);
      }, 1500);
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.businessForm.controls).forEach(key => {
        const control = this.businessForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}