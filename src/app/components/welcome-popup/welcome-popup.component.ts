import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
    selector: 'app-welcome-popup',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed inset-0 z-[9999] overflow-hidden font-serif cursor-none select-none bg-black" *ngIf="isVisible">
      
      <!-- LAYER 1: The Dark Room (Background) -->
      <!-- A clearly visible but desaturated/dim version of the image so the screen isn't just empty black -->
      <div class="absolute inset-0 z-0 opacity-30 grayscale filter contrast-125">
          <img 
            src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1768292203/samantha-irumbu-thirai-abhimanyudu-2018-wallpaper-532f8727be82e75426caaac4642ddf5a_amxj8k.jpg" 
            alt="Samantha Dark" 
            class="w-full h-full object-cover"
          />
      </div>

      <!-- LAYER 2: The Spotlight Reveal (Foreground) -->
      <!-- This layer is FULL COLOR and hidden by a mask. The mask follows the mouse. -->
      <div #spotlightLayer class="absolute inset-0 z-10"
           [style.mask-image]="'radial-gradient(circle ' + spotRadius + 'px at ' + mouseX + 'px ' + mouseY + 'px, black 0%, transparent 100%)'"
           [style.-webkit-mask-image]="'radial-gradient(circle ' + spotRadius + 'px at ' + mouseX + 'px ' + mouseY + 'px, black 0%, transparent 100%)'">
         
         <img 
            src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1768292203/samantha-irumbu-thirai-abhimanyudu-2018-wallpaper-532f8727be82e75426caaac4642ddf5a_amxj8k.jpg" 
            alt="Samantha Light" 
            class="w-full h-full object-cover brightness-110 saturate-125"
         />
         
         <!-- Content visible only in the light -->
         <div class="absolute inset-0 flex flex-col items-center justify-center">
            <h1 class="text-center">
                <span class="block text-xl md:text-3xl tracking-[1em] text-royal-gold uppercase mb-6 drop-shadow-lg font-cinzel">Do You</span>
                <span class="block text-6xl md:text-9xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-gold font-cinzel">
                    LOVE ME?
                </span>
            </h1>
         </div>

         <!-- Golden Dust Motes overlay (only visible in light) -->
         <canvas #dustCanvas class="absolute inset-0 pointer-events-none mix-blend-screen"></canvas>
      </div>

      <!-- LAYER 3: Interaction UI (Always faintly visible) -->
      <div class="absolute bottom-20 inset-x-0 z-50 flex justify-center gap-24 pointer-events-auto">
          
          <!-- YES -->
          <button #yesBtn 
             class="group relative px-12 py-4 border border-white/20 hover:border-yellow-500/80 transition-all duration-500 rounded-sm overflow-hidden"
             (mouseenter)="onHover('yes')"
             (mouseleave)="onLeave()"
             (click)="choose('yes')">
             <div class="absolute inset-0 bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <span class="relative z-10 text-white font-cinzel tracking-[0.3em] group-hover:text-yellow-400 transition-colors duration-300">YES</span>
          </button>

          <!-- NO -->
          <button #noBtn 
             class="group relative px-12 py-4 border border-white/10 hover:border-white/40 transition-all duration-500 rounded-sm"
             (mouseenter)="onHover('no')"
             (mouseleave)="onLeave()"
             (click)="choose('no')">
             <span class="relative z-10 text-white/50 font-cinzel tracking-[0.3em] group-hover:text-white transition-colors duration-300">NO</span>
          </button>

      </div>

      <!-- Custom Cursor Outline (Follows mouse outside mask) -->
      <div #cursorRing class="pointer-events-none fixed top-0 left-0 w-12 h-12 rounded-full border border-white/30 z-[100] transition-transform duration-75"></div>

      <!-- Audio -->
      <audio #audioQuestion src="assets/audio/question.mp3" preload="auto"></audio>
      <audio #audioYes src="assets/audio/response_yes.mp3" preload="auto"></audio>
      <audio #audioNo src="assets/audio/response_no.mp3" preload="auto"></audio>

      <!-- Font -->
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap" rel="stylesheet">
    </div>
  `,
    styles: [`
    .font-cinzel { font-family: 'Cinzel', serif; }
    .text-royal-gold { color: #D4AF37; }
    .drop-shadow-gold { filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.5)); }
  `]
})
export class WelcomePopupComponent implements OnInit, AfterViewInit, OnDestroy {
    @Output() close = new EventEmitter<void>();

    @ViewChild('dustCanvas') dustCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('cursorRing') cursorRing!: ElementRef;
    @ViewChild('spotlightLayer') spotlightLayer!: ElementRef;

    @ViewChild('audioQuestion') audioQuestion!: ElementRef<HTMLAudioElement>;
    @ViewChild('audioYes') audioYes!: ElementRef<HTMLAudioElement>;
    @ViewChild('audioNo') audioNo!: ElementRef<HTMLAudioElement>;

    isVisible = true;
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    spotRadius = 300; // Initial radius

    ctx!: CanvasRenderingContext2D;
    particles: DustParticle[] = [];
    animationFrameId: any;
    mouseListener: any;

    ngOnInit() {
        document.body.style.overflow = 'hidden';
    }

    ngAfterViewInit() {
        this.initCanvas();
        this.initInteraction();

        // Intro: Light starts small and closed
        this.spotRadius = 0;
        gsap.to(this, { spotRadius: 300, duration: 2.5, ease: 'power2.out', delay: 0.5 });

        setTimeout(() => {
            this.audioQuestion.nativeElement.play().catch(() => { });
        }, 1000);

        this.loop();
    }

    ngOnDestroy() {
        document.body.style.overflow = '';
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        if (this.mouseListener) window.removeEventListener('mousemove', this.mouseListener);
        window.removeEventListener('resize', this.onResize);
    }

    // --- 1. Canvas (Dust Motes) ---
    initCanvas() {
        this.ctx = this.dustCanvas.nativeElement.getContext('2d')!;
        this.onResize();
        window.addEventListener('resize', () => this.onResize());

        // Create lots of small dust
        for (let i = 0; i < 80; i++) this.particles.push(new DustParticle(window.innerWidth, window.innerHeight));
    }

    onResize() {
        if (this.dustCanvas) {
            this.dustCanvas.nativeElement.width = window.innerWidth;
            this.dustCanvas.nativeElement.height = window.innerHeight;
        }
    }

    // --- 2. Interaction ---
    initInteraction() {
        this.mouseListener = (e: MouseEvent) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            gsap.to(this.cursorRing.nativeElement, {
                x: this.mouseX - 24,
                y: this.mouseY - 24,
                duration: 0.1
            });
        };
        window.addEventListener('mousemove', this.mouseListener);
    }

    loop() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Only verify distance against "light" logic implicitly by mask, but for canvas we draw all.
        // The canvas itself is masked by the parent div! So we don't need complex distance checks.
        // The dust will only appear where the light is. Perfect.

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.update();
            p.draw(this.ctx);
        }
        this.animationFrameId = requestAnimationFrame(() => this.loop());
    }

    onHover(type: 'yes' | 'no') {
        if (type === 'yes') {
            // Focus light
            gsap.to(this, { spotRadius: 500, duration: 1, ease: 'power2.out' });
            gsap.to(this.cursorRing.nativeElement, { scale: 1.5, borderColor: '#D4AF37' });
        }
    }

    onLeave() {
        gsap.to(this, { spotRadius: 300, duration: 1, ease: 'power2.out' });
        gsap.to(this.cursorRing.nativeElement, { scale: 1, borderColor: 'rgba(255,255,255,0.3)' });
    }

    choose(choice: 'yes' | 'no') {
        const audio = choice === 'yes' ? this.audioYes.nativeElement : this.audioNo.nativeElement;
        audio.play();

        if (choice === 'yes') {
            // LIGHTS ON: Expand radius to fill screen
            gsap.to(this, {
                spotRadius: Math.max(window.innerWidth, window.innerHeight) * 1.5,
                duration: 2,
                ease: 'power2.inOut',
                onComplete: () => this.finish()
            });

            // Fade out UI
            gsap.to(['button', '.text-center'], { opacity: 0, duration: 0.5 });

        } else {
            // BLACKOUT: Shrink radius to 0
            gsap.to(this, { spotRadius: 0, duration: 0.8, ease: 'power2.in' });
            gsap.to(this.cursorRing.nativeElement, { opacity: 0, duration: 0.2 });
            setTimeout(() => this.finish(), 1500);
        }
    }

    finish() {
        this.isVisible = false;
        this.close.emit();
    }
}

class DustParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;

    constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
        this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap
        if (this.x < 0) this.x = window.innerWidth;
        if (this.x > window.innerWidth) this.x = 0;
        if (this.y < 0) this.y = window.innerHeight;
        if (this.y > window.innerHeight) this.y = 0;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(255, 255, 200, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
