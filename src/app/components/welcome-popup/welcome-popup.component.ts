import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import {
  ENTRY_EXPERIENCE_COMPLETED_STORAGE_KEY,
  LEGACY_ENTRY_EXPERIENCE_STORAGE_KEYS
} from './entry-experience.storage';

interface CelebrationConfettiPiece {
  left: string;
  delay: string;
  duration: string;
  rotation: string;
  color: string;
  width: string;
  height: string;
}

interface CelebrationFirework {
  top: string;
  left: string;
  size: string;
  delay: string;
  color: string;
}

interface CelebrationSparkle {
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

@Component({
  selector: 'app-welcome-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-popup.component.html',
  styleUrls: ['./welcome-popup.component.css']
})
export class WelcomePopupComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  readonly primaryPhotoUrl = 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1777361483/samantha-official-website/welcome-popup/welcome-popup-birthday_qtcxlk.jpg';
  readonly fallbackPhotoUrl = 'assets/images/samantha-login.png';
  readonly fireworkRays = Array.from({ length: 12 }, (_, index) => `${index * 30}deg`);
  readonly confettiPieces = this.buildConfettiPieces();
  readonly fireworkBursts = this.buildFireworkBursts();
  readonly sparkles = this.buildSparkles();

  isVisible = true;
  photoUrl = this.primaryPhotoUrl;

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isVisible) {
      this.onEnterSite();
    }
  }

  onPhotoError(): void {
    if (this.photoUrl === this.fallbackPhotoUrl) {
      return;
    }

    this.photoUrl = this.fallbackPhotoUrl;
  }

  onEnterSite(): void {
    localStorage.setItem(ENTRY_EXPERIENCE_COMPLETED_STORAGE_KEY, 'true');
    LEGACY_ENTRY_EXPERIENCE_STORAGE_KEYS.forEach(key => {
      if (key !== ENTRY_EXPERIENCE_COMPLETED_STORAGE_KEY) {
        localStorage.removeItem(key);
      }
    });
    this.closePopup();
  }

  private closePopup(): void {
    this.isVisible = false;
    document.body.style.overflow = '';
    this.close.emit();
  }

  private buildConfettiPieces(): CelebrationConfettiPiece[] {
    const palette = ['#f4d39a', '#ffb38a', '#f6f0e8', '#ffd2c2', '#ffd974', '#ffe9b5'];

    return Array.from({ length: 22 }, (_, index) => ({
      left: `${4 + ((index * 9) % 92)}%`,
      delay: `${(index % 6) * 0.45}s`,
      duration: `${5.6 + (index % 5) * 0.55}s`,
      rotation: `${-30 + (index % 7) * 12}deg`,
      color: palette[index % palette.length],
      width: `${8 + (index % 4) * 2}px`,
      height: `${18 + (index % 5) * 4}px`
    }));
  }

  private buildFireworkBursts(): CelebrationFirework[] {
    return [
      { top: '11%', left: '15%', size: '138px', delay: '0s', color: '#ffd480' },
      { top: '18%', left: '82%', size: '118px', delay: '0.75s', color: '#ff9c7a' },
      { top: '67%', left: '13%', size: '110px', delay: '1.45s', color: '#fff3d9' },
      { top: '74%', left: '79%', size: '130px', delay: '2.15s', color: '#ffd8a8' }
    ];
  }

  private buildSparkles(): CelebrationSparkle[] {
    return [
      { top: '9%', left: '34%', size: '12px', delay: '0.2s', duration: '3.4s' },
      { top: '20%', left: '61%', size: '10px', delay: '1.2s', duration: '4.1s' },
      { top: '28%', left: '10%', size: '8px', delay: '0.9s', duration: '3.8s' },
      { top: '40%', left: '88%', size: '11px', delay: '1.8s', duration: '4s' },
      { top: '57%', left: '22%', size: '9px', delay: '2.2s', duration: '3.6s' },
      { top: '70%', left: '49%', size: '14px', delay: '0.6s', duration: '4.4s' },
      { top: '82%', left: '66%', size: '9px', delay: '1.6s', duration: '3.7s' },
      { top: '86%', left: '28%', size: '8px', delay: '2.5s', duration: '4.2s' }
    ];
  }
}
