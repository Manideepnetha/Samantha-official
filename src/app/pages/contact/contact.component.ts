import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, ContactMessage } from '../../services/api.service';

type ContactTabId = 'fans' | 'media' | 'business';

interface ContactTab {
  id: ContactTabId;
  label: string;
}

interface ContactDirectContactsHeading {
  kicker: string;
  title: string;
  description: string;
}

interface ContactDirectContact {
  title: string;
  description: string;
  email: string;
  icon: string;
}

interface ContactPageContent {
  heroImage: string;
  heroAlt: string;
  heroTitle: string;
  heroSubtitle: string;
  tabs: ContactTab[];
  directContactsHeading: ContactDirectContactsHeading;
  directContacts: ContactDirectContact[];
}

const DEFAULT_CONTACT_CONTENT: ContactPageContent = {
  heroImage: 'https://images.pexels.com/photos/1416530/pexels-photo-1416530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  heroAlt: 'Contact',
  heroTitle: 'Get In Touch',
  heroSubtitle: 'Reach out to Samantha\'s team for inquiries, collaborations, and more.',
  tabs: [
    { id: 'fans', label: 'Fan Inquiries' },
    { id: 'media', label: 'Media Requests' },
    { id: 'business', label: 'Business Inquiries' }
  ],
  directContactsHeading: {
    kicker: 'Direct Contacts',
    title: 'Reach the Right Team',
    description: 'Management, media, and business channels remain available exactly as before, now presented in the same premium theme.'
  },
  directContacts: [
    {
      title: 'Management',
      description: 'For official management inquiries only',
      email: 'management@samantharuthprabhu.com',
      icon: 'management'
    },
    {
      title: 'Press & Media',
      description: 'For media requests and press information',
      email: 'press@samantharuthprabhu.com',
      icon: 'press'
    },
    {
      title: 'Business Inquiries',
      description: 'For endorsements and business proposals',
      email: 'business@samantharuthprabhu.com',
      icon: 'business'
    }
  ]
};

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="sr-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel min-h-[500px]">
            <div class="sr-hero-media">
              <img
                [src]="content.heroImage"
                [alt]="content.heroAlt"
                class="object-center"
              />
            </div>

            <div class="sr-hero-copy max-w-3xl text-center md:text-left">
              <span class="sr-kicker">Contact</span>
              <h1 class="sr-hero-title">{{ content.heroTitle }}</h1>
              <p class="sr-hero-subtitle">
                {{ content.heroSubtitle }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="sr-tabbar justify-center">
          <button
            *ngFor="let tab of content.tabs"
            type="button"
            (click)="activeTab = tab.id"
            class="sr-tab"
            [class.is-active]="activeTab === tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
      </section>

      <section class="sr-section">
        <div *ngIf="activeTab === 'fans'" class="sr-surface p-6 md:p-8 max-w-4xl mx-auto">
          <div class="mb-8 text-center">
            <span class="sr-kicker justify-center">Fan Inquiries</span>
            <h2 class="sr-card-title">Send a Message</h2>
          </div>

          <form [formGroup]="fanForm" (ngSubmit)="submitFanForm()" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label for="name" class="sr-field-label">Your Name</label>
                <input id="name" type="text" formControlName="name" class="sr-input" />
                <div *ngIf="fanForm.get('name')?.invalid && fanForm.get('name')?.touched" class="mt-2 text-sm text-red-300">
                  Name is required
                </div>
              </div>

              <div>
                <label for="email" class="sr-field-label">Email Address</label>
                <input id="email" type="email" formControlName="email" class="sr-input" />
                <div *ngIf="fanForm.get('email')?.invalid && fanForm.get('email')?.touched" class="mt-2 text-sm text-red-300">
                  Please enter a valid email address
                </div>
              </div>
            </div>

            <div>
              <label for="subject" class="sr-field-label">Subject</label>
              <input id="subject" type="text" formControlName="subject" class="sr-input" />
            </div>

            <div>
              <label for="message" class="sr-field-label">Message</label>
              <textarea id="message" formControlName="message" rows="6" class="sr-textarea"></textarea>
              <div *ngIf="fanForm.get('message')?.invalid && fanForm.get('message')?.touched" class="mt-2 text-sm text-red-300">
                Message is required
              </div>
            </div>

            <label class="flex items-center gap-3 text-sm text-[var(--editorial-muted)]">
              <input id="newsletter" type="checkbox" formControlName="newsletter" class="h-4 w-4 rounded border-[rgba(228,196,163,0.2)] bg-transparent text-[var(--editorial-accent)]" />
              Subscribe to newsletter for updates
            </label>

            <button type="submit" class="sr-button" [disabled]="fanForm.invalid || submittingTab === 'fans'">
              <span *ngIf="submittingTab !== 'fans'">Send Message</span>
              <span *ngIf="submittingTab === 'fans'">Sending...</span>
            </button>

            <div *ngIf="submittedTab === 'fans'" class="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-100">
              Thank you for your message! We&apos;ll get back to you soon.
            </div>
            <div *ngIf="submitError && activeTab === 'fans'" class="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-100">
              {{ submitError }}
            </div>
          </form>
        </div>

        <div *ngIf="activeTab === 'media'" class="sr-surface p-6 md:p-8 max-w-4xl mx-auto">
          <div class="mb-8 text-center">
            <span class="sr-kicker justify-center">Media Requests</span>
            <h2 class="sr-card-title">Press & Interview Inquiries</h2>
          </div>

          <form [formGroup]="mediaForm" (ngSubmit)="submitMediaForm()" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label for="media-name" class="sr-field-label">Your Name</label>
                <input id="media-name" type="text" formControlName="name" class="sr-input" />
              </div>
              <div>
                <label for="media-email" class="sr-field-label">Email Address</label>
                <input id="media-email" type="email" formControlName="email" class="sr-input" />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label for="media-outlet" class="sr-field-label">Media Outlet</label>
                <input id="media-outlet" type="text" formControlName="mediaOutlet" class="sr-input" />
              </div>
              <div>
                <label for="media-type" class="sr-field-label">Media Type</label>
                <select id="media-type" formControlName="mediaType" class="sr-select">
                  <option value="">Select Type</option>
                  <option value="print">Print</option>
                  <option value="digital">Digital</option>
                  <option value="television">Television</option>
                  <option value="radio">Radio/Podcast</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label for="media-subject" class="sr-field-label">Subject</label>
              <input id="media-subject" type="text" formControlName="subject" class="sr-input" />
            </div>

            <div>
              <label for="media-message" class="sr-field-label">Message</label>
              <textarea id="media-message" formControlName="message" rows="6" class="sr-textarea"></textarea>
            </div>

            <div>
              <label for="media-deadline" class="sr-field-label">Request Deadline</label>
              <input id="media-deadline" type="date" formControlName="deadline" class="sr-input" />
            </div>

            <button type="submit" class="sr-button" [disabled]="mediaForm.invalid || submittingTab === 'media'">
              <span *ngIf="submittingTab !== 'media'">Send Request</span>
              <span *ngIf="submittingTab === 'media'">Sending...</span>
            </button>

            <div *ngIf="submittedTab === 'media'" class="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-100">
              Thank you for your inquiry! Our team will review and respond as soon as possible.
            </div>
            <div *ngIf="submitError && activeTab === 'media'" class="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-100">
              {{ submitError }}
            </div>
          </form>
        </div>

        <div *ngIf="activeTab === 'business'" class="sr-surface p-6 md:p-8 max-w-4xl mx-auto">
          <div class="mb-8 text-center">
            <span class="sr-kicker justify-center">Business Inquiries</span>
            <h2 class="sr-card-title">Partnerships & Proposals</h2>
          </div>

          <form [formGroup]="businessForm" (ngSubmit)="submitBusinessForm()" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label for="business-name" class="sr-field-label">Your Name</label>
                <input id="business-name" type="text" formControlName="name" class="sr-input" />
              </div>
              <div>
                <label for="business-email" class="sr-field-label">Email Address</label>
                <input id="business-email" type="email" formControlName="email" class="sr-input" />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label for="business-company" class="sr-field-label">Company Name</label>
                <input id="business-company" type="text" formControlName="company" class="sr-input" />
              </div>
              <div>
                <label for="business-type" class="sr-field-label">Inquiry Type</label>
                <select id="business-type" formControlName="inquiryType" class="sr-select">
                  <option value="">Select Type</option>
                  <option value="endorsement">Brand Endorsement</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="appearance">Event Appearance</option>
                  <option value="acting">Acting Role</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label for="business-subject" class="sr-field-label">Subject</label>
              <input id="business-subject" type="text" formControlName="subject" class="sr-input" />
            </div>

            <div>
              <label for="business-message" class="sr-field-label">Proposal Details</label>
              <textarea id="business-message" formControlName="message" rows="6" class="sr-textarea"></textarea>
            </div>

            <div>
              <label for="business-budget" class="sr-field-label">Budget Range</label>
              <select id="business-budget" formControlName="budget" class="sr-select">
                <option value="">Select Budget Range</option>
                <option value="under25k">Under $25,000</option>
                <option value="25k-50k">$25,000 - $50,000</option>
                <option value="50k-100k">$50,000 - $100,000</option>
                <option value="100k-250k">$100,000 - $250,000</option>
                <option value="250k+">$250,000+</option>
                <option value="discuss">To be discussed</option>
              </select>
            </div>

            <button type="submit" class="sr-button" [disabled]="businessForm.invalid || submittingTab === 'business'">
              <span *ngIf="submittingTab !== 'business'">Submit Proposal</span>
              <span *ngIf="submittingTab === 'business'">Submitting...</span>
            </button>

            <div *ngIf="submittedTab === 'business'" class="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-100">
              Thank you for your business inquiry! Our team will review your proposal and get back to you shortly.
            </div>
            <div *ngIf="submitError && activeTab === 'business'" class="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-100">
              {{ submitError }}
            </div>
          </form>
        </div>
      </section>

      <section class="sr-section pb-12">
        <div class="sr-section-heading">
          <span class="sr-kicker">{{ content.directContactsHeading.kicker }}</span>
          <h2>{{ content.directContactsHeading.title }}</h2>
          <p>{{ content.directContactsHeading.description }}</p>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div *ngFor="let contact of content.directContacts" class="sr-surface p-6 text-center sr-hover-card">
            <div class="sr-icon-ring mx-auto mb-4">
              <svg *ngIf="contact.icon === 'management'" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <svg *ngIf="contact.icon === 'press'" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <svg *ngIf="contact.icon === 'business'" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="sr-card-title mb-2">{{ contact.title }}</h3>
            <p class="sr-card-text mb-4">{{ contact.description }}</p>
            <a [href]="'mailto:' + contact.email" class="sr-link mx-auto">{{ contact.email }}</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class ContactComponent implements OnInit {
  content: ContactPageContent = DEFAULT_CONTACT_CONTENT;
  activeTab: ContactTabId = 'fans';
  submittingTab: ContactTabId | null = null;
  submittedTab: ContactTabId | null = null;
  submitError = '';

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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getPageContent<Partial<ContactPageContent>>('contact-page', true).subscribe({
      next: (content) => {
        this.content = this.mergeContent(content);
      },
      error: () => {
        this.content = DEFAULT_CONTACT_CONTENT;
      }
    });
  }

  submitFanForm(): void {
    this.submitContact(
      'fans',
      this.fanForm,
      'Fan inquiry',
      {
        newsletter: !!this.fanForm.value.newsletter
      },
      () => this.fanForm.reset({
        name: '',
        email: '',
        subject: '',
        message: '',
        newsletter: false
      })
    );
  }

  submitMediaForm(): void {
    this.submitContact(
      'media',
      this.mediaForm,
      'Media request',
      {
        mediaOutlet: this.mediaForm.value.mediaOutlet ?? '',
        mediaType: this.mediaForm.value.mediaType ?? '',
        deadline: this.mediaForm.value.deadline ?? ''
      },
      () => this.mediaForm.reset({
        name: '',
        email: '',
        mediaOutlet: '',
        mediaType: '',
        subject: '',
        message: '',
        deadline: ''
      })
    );
  }

  submitBusinessForm(): void {
    this.submitContact(
      'business',
      this.businessForm,
      'Business inquiry',
      {
        company: this.businessForm.value.company ?? '',
        inquiryType: this.businessForm.value.inquiryType ?? '',
        budget: this.businessForm.value.budget ?? ''
      },
      () => this.businessForm.reset({
        name: '',
        email: '',
        company: '',
        inquiryType: '',
        subject: '',
        message: '',
        budget: ''
      })
    );
  }

  private submitContact(
    tabId: ContactTabId,
    form: FormGroup,
    fallbackSubject: string,
    metadata: Record<string, unknown>,
    resetForm: () => void
  ): void {
    if (form.invalid) {
      this.markFormTouched(form);
      return;
    }

    this.submittingTab = tabId;
    this.submittedTab = null;
    this.submitError = '';

    const rawValue = form.getRawValue() as Record<string, string | boolean | null>;
    const message: ContactMessage = {
      name: String(rawValue['name'] ?? ''),
      email: String(rawValue['email'] ?? ''),
      subject: String(rawValue['subject'] ?? '').trim() || fallbackSubject,
      message: String(rawValue['message'] ?? ''),
      category: tabId,
      metadataJson: JSON.stringify(metadata)
    };

    this.apiService.submitContactMessage(message).subscribe({
      next: () => {
        this.submittingTab = null;
        this.submittedTab = tabId;
        resetForm();
        setTimeout(() => {
          if (this.submittedTab === tabId) {
            this.submittedTab = null;
          }
        }, 5000);
      },
      error: () => {
        this.submittingTab = null;
        this.submitError = 'We could not send this message right now. Please try again in a moment.';
      }
    });
  }

  private markFormTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.markAsTouched();
    });
  }

  private mergeContent(content: Partial<ContactPageContent>): ContactPageContent {
    return {
      ...DEFAULT_CONTACT_CONTENT,
      ...content,
      tabs: content.tabs ?? DEFAULT_CONTACT_CONTENT.tabs,
      directContactsHeading: {
        ...DEFAULT_CONTACT_CONTENT.directContactsHeading,
        ...(content.directContactsHeading ?? {})
      },
      directContacts: content.directContacts ?? DEFAULT_CONTACT_CONTENT.directContacts
    };
  }
}
