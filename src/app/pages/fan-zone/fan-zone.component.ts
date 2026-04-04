import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number; // index
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface PlayerInfo {
  name: string;
  email: string;
  city: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  city: string;
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  submittedAt: string;
}

type Screen = 'landing' | 'register' | 'quiz' | 'result' | 'leaderboard';

const QUESTIONS: Question[] = [
  // Easy (10 pts each)
  { id: 1, text: 'What is Samantha Ruth Prabhu\'s birth name?', options: ['Samantha Akkineni', 'Samantha Ruth Prabhu', 'Samantha Naga Chaitanya', 'Samantha Daggubati'], correct: 1, difficulty: 'easy', points: 10 },
  { id: 2, text: 'In which city was Samantha born?', options: ['Hyderabad', 'Chennai', 'Bengaluru', 'Mumbai'], correct: 1, difficulty: 'easy', points: 10 },
  { id: 3, text: 'Which was Samantha\'s debut film?', options: ['Ye Maaya Chesave', 'Brindavanam', 'Dookudu', 'Eega'], correct: 0, difficulty: 'easy', points: 10 },
  { id: 4, text: 'Samantha played the iconic role of Raji in which web series?', options: ['Mirzapur', 'The Family Man 2', 'Sacred Games', 'Panchayat'], correct: 1, difficulty: 'easy', points: 10 },
  { id: 5, text: 'What is the name of Samantha\'s production company?', options: ['S Productions', 'Tralala Moving Images', 'SRP Films', 'Ruth Studios'], correct: 1, difficulty: 'easy', points: 10 },
  // Medium (20 pts each)
  { id: 6, text: 'Samantha was diagnosed with which autoimmune condition in 2022?', options: ['Lupus', 'Myositis', 'Rheumatoid Arthritis', 'Multiple Sclerosis'], correct: 1, difficulty: 'medium', points: 20 },
  { id: 7, text: 'Which director directed Samantha in "Ye Maaya Chesave"?', options: ['Trivikram Srinivas', 'Gautham Vasudev Menon', 'Sukumar', 'Rajamouli'], correct: 1, difficulty: 'medium', points: 20 },
  { id: 8, text: 'Samantha\'s item number "Oo Antava" was from which film?', options: ['Pushpa: The Rise', 'RRR', 'KGF Chapter 2', 'Vikram'], correct: 0, difficulty: 'medium', points: 20 },
  { id: 9, text: 'Which award did Samantha win for "The Family Man 2"?', options: ['National Film Award', 'Filmfare OTT Award', 'IIFA Award', 'Screen Award'], correct: 1, difficulty: 'medium', points: 20 },
  { id: 10, text: 'Samantha\'s philanthropic initiative "Pratyusha Support" focuses on?', options: ['Animal welfare', 'Women empowerment & mental health', 'Child education', 'Environmental conservation'], correct: 1, difficulty: 'medium', points: 20 },
  // Hard (30 pts each)
  { id: 11, text: 'In which year did Samantha make her Bollywood debut?', options: ['2017', '2019', '2021', '2023'], correct: 2, difficulty: 'hard', points: 30 },
  { id: 12, text: 'Samantha\'s character name in "Majili" was?', options: ['Divya', 'Pooja', 'Sravani', 'Ananya'], correct: 2, difficulty: 'hard', points: 30 },
  { id: 13, text: 'Which Hollywood film did Samantha appear in?', options: ['Citadel', 'Extraction', 'The Gray Man', 'Bullet Train'], correct: 0, difficulty: 'hard', points: 30 },
  { id: 14, text: 'Samantha\'s fitness brand is called?', options: ['S10 Fitness', 'Ruth Fit', 'Samantha Wellness', 'Fit with Sam'], correct: 0, difficulty: 'hard', points: 30 },
  { id: 15, text: 'In "Shakuntalam", Samantha played the role of which mythological character?', options: ['Draupadi', 'Shakuntala', 'Sita', 'Radha'], correct: 1, difficulty: 'hard', points: 30 },
];

const TOTAL_TIME = 90; // seconds per quiz session

@Component({
  selector: 'app-fan-zone',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="min-h-screen bg-[#0d0a05] font-inter overflow-x-hidden">

  <!-- ══════════════════════════════════════════ -->
  <!-- LANDING SCREEN                             -->
  <!-- ══════════════════════════════════════════ -->
  <div *ngIf="screen === 'landing'" class="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
    <!-- Background -->
    <div class="absolute inset-0 overflow-hidden">
      <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008414/8F9A7087_koclpw.jpg"
           class="w-full h-full object-cover object-top opacity-20" alt="" />
      <div class="absolute inset-0 bg-gradient-to-b from-[#0d0a05]/60 via-[#0d0a05]/80 to-[#0d0a05]"></div>
    </div>

    <div class="relative z-10 text-center max-w-3xl mx-auto">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 border border-[#c9a84c]/30 bg-[#c9a84c]/5 rounded-full mb-8">
        <span class="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse"></span>
        <span class="text-[#c9a84c] font-inter text-xs tracking-[0.3em] uppercase">Fan Zone — Official Quiz</span>
      </div>

      <h1 class="font-playfair text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
        How Well Do You<br>
        <span class="text-[#c9a84c]">Know Samantha?</span>
      </h1>
      <p class="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
        15 questions · 90 seconds · 3 difficulty levels.<br>
        Prove you're her biggest fan and claim your spot on the leaderboard.
      </p>

      <!-- Stats row -->
      <div class="flex justify-center gap-10 mb-12">
        <div class="text-center">
          <div class="text-3xl font-playfair font-bold text-white">15</div>
          <div class="text-white/30 text-xs tracking-widest uppercase mt-1">Questions</div>
        </div>
        <div class="w-px bg-white/10"></div>
        <div class="text-center">
          <div class="text-3xl font-playfair font-bold text-white">90s</div>
          <div class="text-white/30 text-xs tracking-widest uppercase mt-1">Time Limit</div>
        </div>
        <div class="w-px bg-white/10"></div>
        <div class="text-center">
          <div class="text-3xl font-playfair font-bold text-white">300</div>
          <div class="text-white/30 text-xs tracking-widest uppercase mt-1">Max Points</div>
        </div>
      </div>

      <!-- Difficulty legend -->
      <div class="flex justify-center gap-6 mb-12">
        <span class="flex items-center gap-2 text-sm text-white/50"><span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>Easy · 10 pts</span>
        <span class="flex items-center gap-2 text-sm text-white/50"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span>Medium · 20 pts</span>
        <span class="flex items-center gap-2 text-sm text-white/50"><span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>Hard · 30 pts</span>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button (click)="screen = 'register'"
                class="px-10 py-4 bg-[#c9a84c] text-[#0d0a05] font-bold text-sm tracking-wider hover:bg-[#d4b85a] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#c9a84c]/30">
          START THE QUIZ
        </button>
        <button (click)="loadLeaderboard(); screen = 'leaderboard'"
                class="px-10 py-4 border border-white/20 text-white/70 font-semibold text-sm tracking-wider hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-all">
          VIEW LEADERBOARD
        </button>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════ -->
  <!-- REGISTER SCREEN                            -->
  <!-- ══════════════════════════════════════════ -->
  <div *ngIf="screen === 'register'" class="min-h-screen flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="border border-white/10 bg-[#13100a] p-8 md:p-10">
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-full border-2 border-[#c9a84c]/40 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-[#c9a84c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 class="font-playfair text-2xl font-bold text-white mb-1">Enter Your Details</h2>
          <p class="text-white/40 text-sm">Your info will appear on the leaderboard</p>
        </div>

        <div class="space-y-5">
          <div>
            <label class="block text-white/60 text-xs tracking-widest uppercase mb-2">Full Name *</label>
            <input [(ngModel)]="player.name" type="text" placeholder="e.g. Priya Sharma"
                   class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#c9a84c]/60 placeholder-white/20 transition-colors" />
          </div>
          <div>
            <label class="block text-white/60 text-xs tracking-widest uppercase mb-2">Email Address *</label>
            <input [(ngModel)]="player.email" type="email" placeholder="you@example.com"
                   class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#c9a84c]/60 placeholder-white/20 transition-colors" />
            <p class="text-white/25 text-xs mt-1.5">Used to prevent duplicate entries. Not shared publicly.</p>
          </div>
          <div>
            <label class="block text-white/60 text-xs tracking-widest uppercase mb-2">City</label>
            <input [(ngModel)]="player.city" type="text" placeholder="e.g. Hyderabad"
                   class="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-[#c9a84c]/60 placeholder-white/20 transition-colors" />
          </div>

          <div *ngIf="registerError" class="text-rose-400 text-sm bg-rose-400/10 border border-rose-400/20 px-4 py-3">
            {{ registerError }}
          </div>

          <button (click)="startQuiz()"
                  [disabled]="checkingEmail"
                  class="w-full py-4 bg-[#c9a84c] text-[#0d0a05] font-bold text-sm tracking-wider hover:bg-[#d4b85a] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {{ checkingEmail ? 'CHECKING...' : 'BEGIN QUIZ →' }}
          </button>
          <button (click)="screen = 'landing'" class="w-full py-3 text-white/30 text-sm hover:text-white/60 transition-colors">
            ← Back
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════ -->
  <!-- QUIZ SCREEN                                -->
  <!-- ══════════════════════════════════════════ -->
  <div *ngIf="screen === 'quiz'" class="min-h-screen flex flex-col px-4 py-8 md:py-12">
    <div class="max-w-2xl mx-auto w-full flex-1 flex flex-col">

      <!-- Top bar -->
      <div class="flex items-center justify-between mb-8">
        <!-- Progress -->
        <div class="flex items-center gap-3">
          <span class="text-white/40 text-sm">{{ currentQ + 1 }} / {{ questions.length }}</span>
          <div class="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-[#c9a84c] rounded-full transition-all duration-500"
                 [style.width.%]="((currentQ + 1) / questions.length) * 100"></div>
          </div>
        </div>

        <!-- Timer -->
        <div class="flex items-center gap-2"
             [class.text-rose-400]="timeLeft <= 15"
             [class.text-[#c9a84c]]="timeLeft > 15">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-mono font-bold text-lg">{{ formatTime(timeLeft) }}</span>
        </div>

        <!-- Score -->
        <div class="text-right">
          <div class="text-[#c9a84c] font-bold text-lg">{{ score }}</div>
          <div class="text-white/30 text-xs">pts</div>
        </div>
      </div>

      <!-- Question card -->
      <div class="flex-1 flex flex-col">
        <div class="border border-white/10 bg-[#13100a] p-6 md:p-8 mb-6 flex-1">
          <!-- Difficulty badge -->
          <div class="flex items-center gap-3 mb-6">
            <span class="w-2 h-2 rounded-full"
                  [class.bg-emerald-400]="questions[currentQ].difficulty === 'easy'"
                  [class.bg-amber-400]="questions[currentQ].difficulty === 'medium'"
                  [class.bg-rose-400]="questions[currentQ].difficulty === 'hard'"></span>
            <span class="text-xs tracking-widest uppercase"
                  [class.text-emerald-400]="questions[currentQ].difficulty === 'easy'"
                  [class.text-amber-400]="questions[currentQ].difficulty === 'medium'"
                  [class.text-rose-400]="questions[currentQ].difficulty === 'hard'">
              {{ questions[currentQ].difficulty }} · {{ questions[currentQ].points }} pts
            </span>
          </div>

          <!-- Question text -->
          <h2 class="font-playfair text-xl md:text-2xl font-bold text-white leading-snug mb-8">
            {{ questions[currentQ].text }}
          </h2>

          <!-- Options -->
          <div class="grid grid-cols-1 gap-3">
            <button *ngFor="let opt of questions[currentQ].options; let i = index"
                    (click)="selectAnswer(i)"
                    [disabled]="answered"
                    class="w-full text-left px-5 py-4 border transition-all duration-200 text-sm font-medium"
                    [ngClass]="getOptionClass(i)">
              <span class="inline-flex items-center gap-4">
                <span class="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0"
                      [ngClass]="getOptionLetterClass(i)">
                  {{ ['A','B','C','D'][i] }}
                </span>
                {{ opt }}
              </span>
            </button>
          </div>
        </div>

        <!-- Next / Finish -->
        <div *ngIf="answered" class="flex justify-end">
          <button (click)="nextQuestion()"
                  class="px-8 py-3.5 bg-[#c9a84c] text-[#0d0a05] font-bold text-sm tracking-wider hover:bg-[#d4b85a] transition-all">
            {{ currentQ < questions.length - 1 ? 'NEXT QUESTION →' : 'SEE RESULTS →' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════ -->
  <!-- RESULT SCREEN                              -->
  <!-- ══════════════════════════════════════════ -->
  <div *ngIf="screen === 'result'" class="min-h-screen flex items-center justify-center px-4 py-20">
    <div class="max-w-lg w-full text-center">

      <!-- Score ring -->
      <div class="relative w-40 h-40 mx-auto mb-8">
        <svg class="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="8"/>
          <circle cx="60" cy="60" r="54" fill="none" stroke="#c9a84c" stroke-width="8"
                  stroke-linecap="round"
                  [attr.stroke-dasharray]="339.3"
                  [attr.stroke-dashoffset]="339.3 - (339.3 * score / 300)"/>
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="font-playfair text-4xl font-bold text-white">{{ score }}</span>
          <span class="text-white/30 text-xs tracking-widest">/ 300</span>
        </div>
      </div>

      <div class="mb-2">
        <span class="text-[#c9a84c] font-inter text-xs tracking-[0.3em] uppercase">Your Score</span>
      </div>
      <h2 class="font-playfair text-3xl md:text-4xl font-bold text-white mb-3">{{ getResultTitle() }}</h2>
      <p class="text-white/40 mb-8">{{ correctAnswers }} correct out of {{ questions.length }} · {{ formatTime(timeTaken) }} taken</p>

      <!-- Breakdown -->
      <div class="grid grid-cols-3 gap-px bg-white/5 mb-10">
        <div class="bg-[#0d0a05] py-5">
          <div class="text-2xl font-playfair font-bold text-emerald-400">{{ easyCorrect }}</div>
          <div class="text-white/30 text-xs mt-1">Easy</div>
        </div>
        <div class="bg-[#0d0a05] py-5">
          <div class="text-2xl font-playfair font-bold text-amber-400">{{ mediumCorrect }}</div>
          <div class="text-white/30 text-xs mt-1">Medium</div>
        </div>
        <div class="bg-[#0d0a05] py-5">
          <div class="text-2xl font-playfair font-bold text-rose-400">{{ hardCorrect }}</div>
          <div class="text-white/30 text-xs mt-1">Hard</div>
        </div>
      </div>

      <div *ngIf="submitting" class="text-white/40 text-sm mb-6 animate-pulse">Saving your score...</div>
      <div *ngIf="submitDone" class="text-emerald-400 text-sm mb-6">✓ Score saved to leaderboard!</div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button (click)="loadLeaderboard(); screen = 'leaderboard'"
                class="px-8 py-4 bg-[#c9a84c] text-[#0d0a05] font-bold text-sm tracking-wider hover:bg-[#d4b85a] transition-all">
          VIEW LEADERBOARD
        </button>
        <button (click)="resetQuiz()"
                class="px-8 py-4 border border-white/20 text-white/60 font-semibold text-sm tracking-wider hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-all">
          PLAY AGAIN
        </button>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════ -->
  <!-- LEADERBOARD SCREEN                         -->
  <!-- ══════════════════════════════════════════ -->
  <div *ngIf="screen === 'leaderboard'" class="min-h-screen px-4 py-16 md:py-20">
    <div class="max-w-3xl mx-auto">

      <div class="text-center mb-12">
        <span class="inline-block text-[#c9a84c] font-inter text-xs tracking-[0.3em] uppercase mb-3">Hall of Fame</span>
        <h1 class="font-playfair text-4xl md:text-5xl font-bold text-white">Leaderboard</h1>
        <p class="text-white/30 mt-3 text-sm">Top 20 fans ranked by score, then by fastest time</p>
      </div>

      <!-- Loading -->
      <div *ngIf="loadingLeaderboard" class="text-center py-20">
        <div class="w-10 h-10 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-white/30 text-sm">Loading leaderboard...</p>
      </div>

      <!-- Top 3 podium -->
      <div *ngIf="!loadingLeaderboard && leaderboard.length >= 3" class="flex items-end justify-center gap-4 mb-10">
        <!-- 2nd -->
        <div class="flex flex-col items-center">
          <div class="w-14 h-14 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mb-2">
            <span class="font-playfair font-bold text-white text-lg">{{ leaderboard[1].name[0] }}</span>
          </div>
          <div class="text-white/60 text-xs mb-1 truncate max-w-[80px] text-center">{{ leaderboard[1].name }}</div>
          <div class="w-20 bg-white/10 border border-white/10 flex flex-col items-center py-3">
            <span class="text-white/40 text-xs">🥈</span>
            <span class="text-white font-bold">{{ leaderboard[1].score }}</span>
          </div>
        </div>
        <!-- 1st -->
        <div class="flex flex-col items-center -mb-4">
          <div class="w-20 h-20 rounded-full bg-[#c9a84c]/20 border-2 border-[#c9a84c] flex items-center justify-center mb-2 shadow-lg shadow-[#c9a84c]/20">
            <span class="font-playfair font-bold text-[#c9a84c] text-2xl">{{ leaderboard[0].name[0] }}</span>
          </div>
          <div class="text-[#c9a84c] text-xs mb-1 truncate max-w-[90px] text-center font-medium">{{ leaderboard[0].name }}</div>
          <div class="w-24 bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex flex-col items-center py-4">
            <span class="text-[#c9a84c] text-sm">👑</span>
            <span class="text-[#c9a84c] font-bold text-lg">{{ leaderboard[0].score }}</span>
          </div>
        </div>
        <!-- 3rd -->
        <div class="flex flex-col items-center">
          <div class="w-14 h-14 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mb-2">
            <span class="font-playfair font-bold text-white text-lg">{{ leaderboard[2].name[0] }}</span>
          </div>
          <div class="text-white/60 text-xs mb-1 truncate max-w-[80px] text-center">{{ leaderboard[2].name }}</div>
          <div class="w-20 bg-white/10 border border-white/10 flex flex-col items-center py-3">
            <span class="text-white/40 text-xs">🥉</span>
            <span class="text-white font-bold">{{ leaderboard[2].score }}</span>
          </div>
        </div>
      </div>

      <!-- Full table -->
      <div *ngIf="!loadingLeaderboard" class="border border-white/10 overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-white/5 border-b border-white/10">
              <th class="px-4 py-3 text-left text-white/40 text-xs tracking-widest uppercase font-medium w-12">#</th>
              <th class="px-4 py-3 text-left text-white/40 text-xs tracking-widest uppercase font-medium">Fan</th>
              <th class="px-4 py-3 text-left text-white/40 text-xs tracking-widest uppercase font-medium hidden sm:table-cell">City</th>
              <th class="px-4 py-3 text-right text-white/40 text-xs tracking-widest uppercase font-medium">Score</th>
              <th class="px-4 py-3 text-right text-white/40 text-xs tracking-widest uppercase font-medium hidden md:table-cell">Time</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let entry of leaderboard"
                class="border-b border-white/5 hover:bg-white/3 transition-colors"
                [class.bg-gold-highlight]="entry.name === player.name && entry.score === score">
              <td class="px-4 py-4">
                <span *ngIf="entry.rank === 1" class="text-base">👑</span>
                <span *ngIf="entry.rank === 2" class="text-base">🥈</span>
                <span *ngIf="entry.rank === 3" class="text-base">🥉</span>
                <span *ngIf="entry.rank > 3" class="text-white/30 font-mono">{{ entry.rank }}</span>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center flex-shrink-0">
                    <span class="text-[#c9a84c] text-xs font-bold">{{ entry.name[0] }}</span>
                  </div>
                  <span class="text-white font-medium">{{ entry.name }}</span>
                </div>
              </td>
              <td class="px-4 py-4 text-white/40 hidden sm:table-cell">{{ entry.city }}</td>
              <td class="px-4 py-4 text-right">
                <span class="text-[#c9a84c] font-bold">{{ entry.score }}</span>
                <span class="text-white/20 text-xs">/300</span>
              </td>
              <td class="px-4 py-4 text-right text-white/40 hidden md:table-cell font-mono text-xs">{{ formatTime(entry.timeTakenSeconds) }}</td>
            </tr>
            <tr *ngIf="leaderboard.length === 0">
              <td colspan="5" class="px-4 py-16 text-center text-white/20">No entries yet. Be the first!</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        <button (click)="screen = 'register'; resetQuiz()"
                class="px-8 py-4 bg-[#c9a84c] text-[#0d0a05] font-bold text-sm tracking-wider hover:bg-[#d4b85a] transition-all">
          TAKE THE QUIZ
        </button>
        <button (click)="screen = 'landing'"
                class="px-8 py-4 border border-white/20 text-white/60 font-semibold text-sm tracking-wider hover:border-[#c9a84c]/50 hover:text-[#c9a84c] transition-all">
          ← BACK
        </button>
      </div>
    </div>
  </div>

</div>
  `,
  styles: [`
    :host { display: block; }
    .font-playfair { font-family: 'Playfair Display', serif; }
    .font-inter { font-family: 'Inter', sans-serif; }
    .font-mono { font-family: 'Courier New', monospace; }
    .bg-gold-highlight { background-color: rgba(201, 168, 76, 0.07); }
  `]
})
export class FanZoneComponent implements OnInit, OnDestroy {
  private apiUrl = 'https://samantha-official-website-api.onrender.com/api';

  screen: Screen = 'landing';
  questions: Question[] = [...QUESTIONS];
  currentQ = 0;
  score = 0;
  correctAnswers = 0;
  easyCorrect = 0;
  mediumCorrect = 0;
  hardCorrect = 0;
  answered = false;
  selectedOption: number | null = null;
  timeLeft = TOTAL_TIME;
  timeTaken = 0;
  private timerRef: any;

  player: PlayerInfo = { name: '', email: '', city: '' };
  registerError = '';
  checkingEmail = false;

  leaderboard: LeaderboardEntry[] = [];
  loadingLeaderboard = false;
  submitting = false;
  submitDone = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}
  ngOnDestroy(): void { this.clearTimer(); }

  // ── Registration ──────────────────────────────
  startQuiz(): void {
    this.registerError = '';
    if (!this.player.name.trim()) { this.registerError = 'Please enter your name.'; return; }
    if (!this.player.email.trim() || !this.player.email.includes('@')) { this.registerError = 'Please enter a valid email.'; return; }

    this.checkingEmail = true;
    this.http.get<{ played: boolean; score: number }>(`${this.apiUrl}/quiz/check?email=${encodeURIComponent(this.player.email)}`)
      .subscribe({
        next: (res) => {
          this.checkingEmail = false;
          if (res.played) {
            this.registerError = `You've already played today! Your best score: ${res.score}/300. Come back tomorrow.`;
          } else {
            this.beginQuiz();
          }
        },
        error: () => { this.checkingEmail = false; this.beginQuiz(); } // allow offline
      });
  }

  private beginQuiz(): void {
    // Shuffle questions
    this.questions = [...QUESTIONS].sort(() => Math.random() - 0.5);
    this.currentQ = 0;
    this.score = 0;
    this.correctAnswers = 0;
    this.easyCorrect = 0;
    this.mediumCorrect = 0;
    this.hardCorrect = 0;
    this.answered = false;
    this.selectedOption = null;
    this.timeLeft = TOTAL_TIME;
    this.timeTaken = 0;
    this.screen = 'quiz';
    this.startTimer();
  }

  // ── Timer ─────────────────────────────────────
  private startTimer(): void {
    this.clearTimer();
    this.timerRef = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) { this.clearTimer(); this.finishQuiz(); }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerRef) { clearInterval(this.timerRef); this.timerRef = null; }
  }

  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  // ── Answering ─────────────────────────────────
  selectAnswer(index: number): void {
    if (this.answered) return;
    this.answered = true;
    this.selectedOption = index;
    const q = this.questions[this.currentQ];
    if (index === q.correct) {
      this.score += q.points;
      this.correctAnswers++;
      if (q.difficulty === 'easy') this.easyCorrect++;
      else if (q.difficulty === 'medium') this.mediumCorrect++;
      else this.hardCorrect++;
    }
  }

  nextQuestion(): void {
    if (this.currentQ < this.questions.length - 1) {
      this.currentQ++;
      this.answered = false;
      this.selectedOption = null;
    } else {
      this.finishQuiz();
    }
  }

  private finishQuiz(): void {
    this.clearTimer();
    this.timeTaken = TOTAL_TIME - this.timeLeft;
    this.screen = 'result';
    this.submitScore();
  }

  // ── Submission ────────────────────────────────
  private submitScore(): void {
    this.submitting = true;
    this.submitDone = false;
    const payload = {
      name: this.player.name,
      email: this.player.email,
      city: this.player.city || null,
      score: this.score,
      totalQuestions: this.questions.length,
      timeTakenSeconds: this.timeTaken
    };
    this.http.post(`${this.apiUrl}/quiz/submit`, payload).subscribe({
      next: () => { this.submitting = false; this.submitDone = true; },
      error: () => { this.submitting = false; }
    });
  }

  // ── Leaderboard ───────────────────────────────
  loadLeaderboard(): void {
    this.loadingLeaderboard = true;
    this.http.get<LeaderboardEntry[]>(`${this.apiUrl}/quiz/leaderboard`).subscribe({
      next: (data) => { this.leaderboard = data; this.loadingLeaderboard = false; },
      error: () => { this.loadingLeaderboard = false; }
    });
  }

  // ── Helpers ───────────────────────────────────
  getOptionClass(i: number): string {
    if (!this.answered) return 'border-white/10 bg-white/3 text-white/80 hover:border-[#c9a84c]/40 hover:bg-[#c9a84c]/5 cursor-pointer';
    const q = this.questions[this.currentQ];
    if (i === q.correct) return 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300 cursor-default';
    if (i === this.selectedOption && i !== q.correct) return 'border-rose-400/60 bg-rose-400/10 text-rose-300 cursor-default';
    return 'border-white/5 bg-transparent text-white/30 cursor-default';
  }

  getOptionLetterClass(i: number): string {
    if (!this.answered) return 'border-white/20 text-white/40';
    const q = this.questions[this.currentQ];
    if (i === q.correct) return 'border-emerald-400 text-emerald-400';
    if (i === this.selectedOption && i !== q.correct) return 'border-rose-400 text-rose-400';
    return 'border-white/10 text-white/20';
  }

  getResultTitle(): string {
    const pct = this.score / 300;
    if (pct >= 0.9) return 'Ultimate Samantha Fan! 🏆';
    if (pct >= 0.7) return 'Super Fan! ⭐';
    if (pct >= 0.5) return 'Good Fan! 👏';
    if (pct >= 0.3) return 'Keep Learning! 📚';
    return 'Better Luck Next Time!';
  }

  resetQuiz(): void {
    this.screen = 'register';
    this.submitDone = false;
    this.submitting = false;
    this.registerError = '';
  }
}
