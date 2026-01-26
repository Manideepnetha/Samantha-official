import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Philanthropy } from '../../services/api.service';

@Component({
  selector: 'app-philanthropy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-ivory dark:bg-deep-black">
      <!-- Hero Section -->
      <section class="relative h-[50vh] overflow-hidden">
       <div class="absolute bottom-[-500px] left-0 right-0">
          <img 
            src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748288170/96372bg8_1_lm3v2w.jpg" 
            alt="Philanthropy" 
            class="w-full h-full object-cover object-center" 
          />
          <div class="absolute inset-0 bg-gradient-to-b from-deep-black/80 to-deep-black/40"></div>
        </div>
        
        <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">Giving Back</span>
          <h1 class="text-4xl md:text-6xl font-playfair font-bold text-ivory mb-6 text-shadow">Making a Difference</h1>
          <p class="text-xl md:text-2xl text-ivory/90 font-lora italic max-w-3xl">Empowering communities and creating positive change through the Pratyusha Foundation.</p>
        </div>
      </section>

      <!-- Mission Statement -->
      <section class="py-20 bg-ivory dark:bg-deep-black">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl md:text-4xl font-playfair font-bold text-charcoal dark:text-ivory mb-8">Our Mission</h2>
            <p class="text-xl font-lora text-charcoal/80 dark:text-ivory/80 leading-relaxed mb-12">
              The Pratyusha Foundation is committed to creating sustainable change in the lives of underprivileged women and children through education, healthcare, and skill development programs.
            </p>
            
            <!-- Impact Numbers (Hardcoded) -->
            <!-- Impact Numbers (Dynamic) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div *ngFor="let stat of stats" class="p-6 bg-white dark:bg-charcoal rounded-lg hover-lift text-center">
                <div class="text-5xl text-royal-gold mb-4">{{stat.icon}}</div>
                <div class="text-4xl font-playfair font-bold text-charcoal dark:text-ivory mb-2">{{ stat.currentValue || 0 | number:'1.0-0' }}</div>
                <div class="text-charcoal/80 dark:text-ivory/80">{{stat.title}}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Initiatives (Dynamic) -->
      <section class="py-20 bg-white dark:bg-charcoal">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl md:text-4xl font-playfair font-bold text-center text-charcoal dark:text-ivory mb-16">Key Initiatives</h2>
          
          <!-- Loading State -->
          <div *ngIf="initiatives.length === 0" class="text-center text-charcoal/50 dark:text-ivory/50">
             Loading initiatives...
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div *ngFor="let item of initiatives" class="bg-ivory dark:bg-deep-black p-8 rounded-lg hover-lift">
               <div class="w-16 h-16 bg-royal-gold/10 rounded-full flex items-center justify-center mb-6">
                 <span class="text-3xl text-royal-gold">{{item.icon}}</span>
               </div>
               <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">{{item.title}}</h3>
               <p class="text-charcoal/80 dark:text-ivory/80 mb-6">{{item.description}}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Success Stories (Dynamic) -->
      <section class="py-20 bg-ivory dark:bg-deep-black">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl md:text-4xl font-playfair font-bold text-center text-charcoal dark:text-ivory mb-16">Success Stories</h2>
          
          <!-- Show loading state or placeholder if needed -->
          <div *ngIf="stories.length === 0" class="text-center text-charcoal/50 dark:text-ivory/50">
            Loading stories...
          </div>

          <div class="flex flex-col items-center gap-12">
            <div *ngFor="let story of stories" class="bg-white dark:bg-charcoal p-10 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-2xl transform hover:scale-[1.01]">
              <img *ngIf="story.imageUrl" [src]="story.imageUrl" [alt]="story.title" class="w-full h-64 object-cover rounded-lg mb-6" />
              <h3 class="font-playfair text-2xl font-bold mb-4 text-charcoal dark:text-ivory">{{ story.title }}</h3>
              <p class="text-charcoal/80 dark:text-ivory/80 mb-6 leading-relaxed whitespace-pre-line">
                {{ story.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Get Involved -->
      <section class="py-20 bg-white dark:bg-charcoal">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl md:text-4xl font-playfair font-bold text-charcoal dark:text-ivory mb-8">Get Involved</h2>
            <p class="text-xl font-lora text-charcoal/80 dark:text-ivory/80 leading-relaxed mb-12">
              Join us in our mission to create positive change. Every contribution, big or small, makes a difference in someone's life.
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-ivory dark:bg-deep-black p-8 rounded-lg hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">Donate</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-6">
                  Support our initiatives through monetary contributions. Every donation helps us reach more lives.
                </p>
                <a href="https://pratyushasupport.org/hdfc/pay.php" target="_blank" class="px-6 py-3 bg-royal-gold text-deep-black rounded-full font-inter font-medium hover:bg-royal-gold/90 transition-all">
                  Make a Donation
                </a>
              </div>

              <div class="bg-ivory dark:bg-deep-black p-8 rounded-lg hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-4 text-charcoal dark:text-ivory">Volunteer</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-6">
                  Join our volunteer program and contribute your time and skills to make a difference.
                </p>
                <a href="https://pratyushasupport.org/" target="_blank" class="px-6 py-3 bg-transparent border border-royal-gold text-royal-gold rounded-full font-inter font-medium hover:bg-royal-gold/10 transition-all">
                  Join as Volunteer
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class PhilanthropyComponent implements OnInit {
  // Dynamic Content
  stories: Philanthropy[] = [];
  initiatives: Philanthropy[] = [];
  stats: (Philanthropy & { currentValue?: number })[] = [];
  isLoading = true;

  private animationDuration = 2000; // milliseconds
  private animationStep = 10; // milliseconds

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Default/Fallback Data
    const defaultStats: (Philanthropy & { currentValue?: number })[] = [
      { id: 1, title: 'Lives Touched', value: 10000, icon: '❤️', type: 'Stat', currentValue: 0 },
      { id: 2, title: 'Surgeries Funded', value: 150, icon: '🏥', type: 'Stat', currentValue: 0 },
      { id: 3, title: 'Health Camps', value: 50, icon: '🩺', type: 'Stat', currentValue: 0 }
    ];

    const defaultInitiatives: Philanthropy[] = [
      {
        title: 'Healthcare Support',
        description: 'Providing financial aid for critical medical treatments and surgeries for underprivileged children and women.',
        icon: '🏥',
        type: 'Initiative'
      },
      {
        title: 'Child Welfare',
        description: 'Ensuring proper nutrition, vaccination, and healthcare for infants and children.',
        icon: '👶',
        type: 'Initiative'
      },
      {
        title: 'Women Empowerment',
        description: 'Supporting skill development and vocational training to help women become financially independent.',
        icon: '👩‍🎓',
        type: 'Initiative'
      },
      {
        title: 'Community Outreach',
        description: 'Organizing health camps and awareness drives in rural and underserved communities.',
        icon: '🤝',
        type: 'Initiative'
      }
    ];

    const defaultStories: Philanthropy[] = [
      {
        title: 'A New Lease on Life',
        description: 'Little Ananya was diagnosed with a congenital heart defect. Through the foundation, she received the life-saving surgery she needed and is now a healthy, active child.',
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        type: 'Story'
      },
      {
        title: 'Empowering Lakshmi',
        description: 'Lakshmi, a single mother, joined our tailoring vocational program. Today, she runs her own boutique and supports her family with dignity.',
        imageUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        type: 'Story'
      }
    ];

    // Initialize with defaults immediately (loading state handles UI flicker if needed, 
    // but here we want to show something if API fails or returns nothing)
    this.stats = defaultStats;
    this.initiatives = defaultInitiatives;
    this.stories = defaultStories;

    // Fetch All Data
    this.apiService.getPhilanthropies().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          const apiStories = data.filter(i => i.type === 'Story');
          const apiInitiatives = data.filter(i => i.type === 'Initiative');
          const apiStats = data.filter(i => i.type === 'Stat');

          if (apiStories.length > 0) this.stories = apiStories;
          if (apiInitiatives.length > 0) this.initiatives = apiInitiatives;
          if (apiStats.length > 0) {
            this.stats = apiStats.map(s => ({ ...s, currentValue: 0 }));
          }
        }
        this.isLoading = false;
        // Trigger animations for stats after loading (whether default or api)
        this.stats.forEach(stat => this.animateStat(stat));
      },
      error: (err) => {
        console.error('Failed to load philanthropy data', err);
        this.isLoading = false;
        // Run animations on defaults
        this.stats.forEach(stat => this.animateStat(stat));
      }
    });
  }

  animateStat(stat: Philanthropy & { currentValue?: number }): void {
    const target = stat.value || 0;
    const increment = Math.ceil(target / (this.animationDuration / this.animationStep));

    const timer = setInterval(() => {
      stat.currentValue = (stat.currentValue || 0) + increment;
      if (stat.currentValue >= target) {
        stat.currentValue = target;
        clearInterval(timer);
      }
    }, this.animationStep);
  }
}