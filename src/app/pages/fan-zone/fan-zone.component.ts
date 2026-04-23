import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, FanCreation, QuizLeaderboardEntry } from '../../services/api.service';
import { FanPollComponent } from '../../components/fan-poll/fan-poll.component';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

interface PlayerInfo {
  name: string;
  email: string;
  city: string;
}

type Screen = 'landing' | 'register' | 'quiz' | 'result' | 'leaderboard';

const PENDING_QUIZ_SUBMISSION_STORAGE_KEY = 'srp_pending_quiz_submission_v1';
const LIVE_LEADERBOARD_REFRESH_MS = 15000;

const QUESTIONS: Question[] = [
  { id: 1, text: 'What is Samantha Ruth Prabhu\'s birth name?', options: ['Samantha Akkineni', 'Samantha Ruth Prabhu', 'Samantha Naga Chaitanya', 'Samantha Daggubati'], correct: 1, difficulty: 'easy', points: 10 },
  { id: 2, text: 'In which city was Samantha born?', options: ['Hyderabad', 'Chennai', 'Bengaluru', 'Mumbai'], correct: 1, difficulty: 'easy', points: 10 },
  { id: 3, text: 'Which was Samantha\'s debut film?', options: ['Ye Maaya Chesave', 'Brindavanam', 'Dookudu', 'Eega'], correct: 0, difficulty: 'easy', points: 10 },
  { id: 4, text: 'Samantha played the iconic role of Raji in which web series?', options: ['Mirzapur', 'The Family Man 2', 'Sacred Games', 'Panchayat'], correct: 1, difficulty: 'easy', points: 10 },
  { id: 5, text: 'What is the name of Samantha\'s production company?', options: ['S Productions', 'Tralala Moving Images', 'SRP Films', 'Ruth Studios'], correct: 1, difficulty: 'easy', points: 10 },
  { id: 6, text: 'Samantha was diagnosed with which autoimmune condition in 2022?', options: ['Lupus', 'Myositis', 'Rheumatoid Arthritis', 'Multiple Sclerosis'], correct: 1, difficulty: 'medium', points: 20 },
  { id: 7, text: 'Which director directed Samantha in "Ye Maaya Chesave"?', options: ['Trivikram Srinivas', 'Gautham Vasudev Menon', 'Sukumar', 'Rajamouli'], correct: 1, difficulty: 'medium', points: 20 },
  { id: 8, text: 'Samantha\'s item number "Oo Antava" was from which film?', options: ['Pushpa: The Rise', 'RRR', 'KGF Chapter 2', 'Vikram'], correct: 0, difficulty: 'medium', points: 20 },
  { id: 9, text: 'Which award did Samantha win for "The Family Man 2"?', options: ['National Film Award', 'Filmfare OTT Award', 'IIFA Award', 'Screen Award'], correct: 1, difficulty: 'medium', points: 20 },
  { id: 10, text: 'Samantha\'s philanthropic initiative "Pratyusha Support" focuses on?', options: ['Animal welfare', 'Women empowerment & mental health', 'Child education', 'Environmental conservation'], correct: 1, difficulty: 'medium', points: 20 },
  { id: 11, text: 'In which year did Samantha make her Bollywood debut?', options: ['2017', '2019', '2021', '2023'], correct: 2, difficulty: 'hard', points: 30 },
  { id: 12, text: 'Samantha\'s character name in "Majili" was?', options: ['Divya', 'Pooja', 'Sravani', 'Ananya'], correct: 2, difficulty: 'hard', points: 30 },
  { id: 13, text: 'Which Hollywood-connected franchise entry did Samantha appear in?', options: ['Citadel', 'Extraction', 'The Gray Man', 'Bullet Train'], correct: 0, difficulty: 'hard', points: 30 },
  { id: 14, text: 'Samantha\'s fitness brand is called?', options: ['S10 Fitness', 'Ruth Fit', 'Samantha Wellness', 'Fit with Sam'], correct: 0, difficulty: 'hard', points: 30 },
  { id: 15, text: 'In "Shakuntalam", Samantha played the role of which mythological character?', options: ['Draupadi', 'Shakuntala', 'Sita', 'Radha'], correct: 1, difficulty: 'hard', points: 30 },
];

const TOTAL_TIME = 90;

@Component({
  selector: 'app-fan-zone',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FanPollComponent],
  templateUrl: './fan-zone.component.html',
  styleUrls: ['./fan-zone.component.css']
})
export class FanZoneComponent implements OnInit, OnDestroy {
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
  private timerRef: ReturnType<typeof setInterval> | null = null;

  player: PlayerInfo = { name: '', email: '', city: '' };
  registerError = '';
  checkingEmail = false;

  leaderboard: QuizLeaderboardEntry[] = [];
  currentPlayerEntry: QuizLeaderboardEntry | null = null;
  loadingLeaderboard = false;
  submitting = false;
  submitDone = false;
  submissionNotice = '';

  fanCreations: FanCreation[] = [];
  loadingFanCreations = false;
  private leaderboardRefreshRef: ReturnType<typeof setInterval> | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.retryPendingQuizSubmission();
    this.loadLandingData();
    this.startLiveLeaderboardRefresh();
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.clearLiveLeaderboardRefresh();
  }

  get topLeaderboard(): QuizLeaderboardEntry[] {
    return this.leaderboard.slice(0, 5);
  }

  get featuredFanCreations(): FanCreation[] {
    const featured = this.fanCreations.filter(item => item.isFeatured);
    return (featured.length > 0 ? featured : this.fanCreations).slice(0, 3);
  }

  get posterCount(): number {
    return this.countCreations('Poster');
  }

  get videoCount(): number {
    return this.countCreations('Video');
  }

  get illustrationCount(): number {
    return this.countCreations('Illustration');
  }

  startQuiz(): void {
    this.registerError = '';
    if (!this.player.name.trim()) {
      this.registerError = 'Please enter your name.';
      return;
    }

    if (!this.player.email.trim() || !this.player.email.includes('@')) {
      this.registerError = 'Please enter a valid email.';
      return;
    }

    this.checkingEmail = true;
    this.apiService.checkQuizStatus(this.player.email).subscribe({
      next: (response) => {
        this.checkingEmail = false;
        if (response.played) {
          this.registerError = `You've already played today. Your best score: ${response.score}/300.`;
          return;
        }

        this.beginQuiz();
      },
      error: () => {
        this.checkingEmail = false;
        this.beginQuiz();
      }
    });
  }

  openLeaderboard(): void {
    this.screen = 'leaderboard';
    this.loadLeaderboard();
  }

  openRegister(): void {
    this.screen = 'register';
    this.registerError = '';
  }

  formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  selectAnswer(index: number): void {
    if (this.answered) {
      return;
    }

    this.answered = true;
    this.selectedOption = index;

    const question = this.questions[this.currentQ];
    if (index !== question.correct) {
      return;
    }

    this.score += question.points;
    this.correctAnswers++;

    if (question.difficulty === 'easy') {
      this.easyCorrect++;
    } else if (question.difficulty === 'medium') {
      this.mediumCorrect++;
    } else {
      this.hardCorrect++;
    }
  }

  nextQuestion(): void {
    if (this.currentQ < this.questions.length - 1) {
      this.currentQ++;
      this.answered = false;
      this.selectedOption = null;
      return;
    }

    this.finishQuiz();
  }

  loadLeaderboard(): void {
    this.loadingLeaderboard = true;
    this.apiService.getQuizLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard = data;
        this.loadingLeaderboard = false;
        this.loadCurrentPlayerEntry();
      },
      error: () => {
        this.loadingLeaderboard = false;
      }
    });
  }

  getOptionClass(index: number): string {
    if (!this.answered) {
      return 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-white/80 hover:border-[rgba(214,169,93,0.45)] hover:bg-[rgba(214,169,93,0.08)]';
    }

    const question = this.questions[this.currentQ];
    if (index === question.correct) {
      return 'border-emerald-400/70 bg-emerald-400/12 text-emerald-200';
    }

    if (index === this.selectedOption) {
      return 'border-rose-400/70 bg-rose-400/12 text-rose-200';
    }

    return 'border-[rgba(255,255,255,0.08)] bg-transparent text-white/28';
  }

  getResultTitle(): string {
    const ratio = this.score / 300;
    if (ratio >= 0.9) {
      return 'Ultimate Samantha Fan';
    }
    if (ratio >= 0.7) {
      return 'Super Fan';
    }
    if (ratio >= 0.5) {
      return 'Strong Run';
    }
    if (ratio >= 0.3) {
      return 'Keep Climbing';
    }
    return 'Another Round Awaits';
  }

  resetQuiz(): void {
    this.screen = 'register';
    this.submitDone = false;
    this.submitting = false;
    this.submissionNotice = '';
    this.registerError = '';
    this.currentPlayerEntry = null;
    this.answered = false;
    this.selectedOption = null;
  }

  isCurrentPlayerOnLeaderboard(): boolean {
    if (!this.currentPlayerEntry) {
      return false;
    }

    return this.leaderboard.some(entry =>
      entry.name === this.currentPlayerEntry?.name
      && entry.score === this.currentPlayerEntry?.score
      && entry.timeTakenSeconds === this.currentPlayerEntry?.timeTakenSeconds
      && entry.submittedAt === this.currentPlayerEntry?.submittedAt
    );
  }

  getCreationCta(item: FanCreation): string {
    return item.type === 'Video' ? 'Watch Edit' : 'View Piece';
  }

  getCreationMeta(item: FanCreation): string {
    const bits = [item.type, item.platform, item.dateLabel].filter(Boolean);
    return bits.join(' · ');
  }

  shareScore(platform: 'twitter' | 'whatsapp'): void {
    const message = `I scored ${this.score}/300 on the Samantha Ruth Prabhu fan quiz! Can you beat me?`;
    const shareUrl = platform === 'whatsapp'
      ? `https://wa.me/?text=${encodeURIComponent(message)}`
      : `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;

    window.open(shareUrl, '_blank', 'noopener');
  }

  private loadLandingData(): void {
    this.loadingFanCreations = true;

    this.apiService.getFanCreations().subscribe({
      next: (data) => {
        this.fanCreations = data;
        this.loadingFanCreations = false;
      },
      error: () => {
        this.loadingFanCreations = false;
      }
    });

    this.refreshLeaderboardSnapshot();
  }

  private beginQuiz(): void {
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
    this.currentPlayerEntry = null;
    this.submissionNotice = '';
    this.screen = 'quiz';
    this.startTimer();
  }

  private startTimer(): void {
    this.clearTimer();
    this.timerRef = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.clearTimer();
        this.finishQuiz();
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerRef) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
  }

  private finishQuiz(): void {
    this.clearTimer();
    this.timeTaken = TOTAL_TIME - this.timeLeft;
    this.screen = 'result';
    this.submitScore();
  }

  private submitScore(): void {
    const payload = this.buildQuizSubmission();
    this.persistPendingQuizSubmission(payload);
    this.submitting = true;
    this.submitDone = false;
    this.submissionNotice = '';

    this.apiService.submitQuizEntry(payload).subscribe({
      next: (entry) => {
        this.clearPendingQuizSubmission();
        this.currentPlayerEntry = entry;
        this.submitting = false;
        this.submitDone = true;
        this.submissionNotice = '';
        this.refreshLeaderboardSnapshot();
      },
      error: () => {
        this.submitting = false;
        this.submitDone = false;
        this.submissionNotice = 'Your score is saved on this device and will retry automatically until it reaches the live leaderboard.';
      }
    });
  }

  private loadCurrentPlayerEntry(): void {
    const email = this.player.email.trim();
    if (!email) {
      return;
    }

    this.apiService.getQuizPlayerEntry(email).subscribe({
      next: (entry) => {
        this.currentPlayerEntry = entry;
      },
      error: () => {}
    });
  }

  private countCreations(type: FanCreation['type']): number {
    return this.fanCreations.filter(item => item.type === type).length;
  }

  private buildQuizSubmission(): {
    clientSubmissionId: string;
    name: string;
    email: string;
    city: string | null;
    score: number;
    totalQuestions: number;
    timeTakenSeconds: number;
  } {
    return {
      clientSubmissionId: crypto.randomUUID(),
      name: this.player.name.trim(),
      email: this.player.email.trim(),
      city: this.player.city?.trim() || null,
      score: this.score,
      totalQuestions: this.questions.length,
      timeTakenSeconds: this.timeTaken
    };
  }

  private startLiveLeaderboardRefresh(): void {
    this.clearLiveLeaderboardRefresh();
    this.leaderboardRefreshRef = setInterval(() => {
      if (this.screen !== 'landing' && this.screen !== 'leaderboard') {
        return;
      }

      this.refreshLeaderboardSnapshot();
    }, LIVE_LEADERBOARD_REFRESH_MS);
  }

  private clearLiveLeaderboardRefresh(): void {
    if (this.leaderboardRefreshRef) {
      clearInterval(this.leaderboardRefreshRef);
      this.leaderboardRefreshRef = null;
    }
  }

  private refreshLeaderboardSnapshot(): void {
    this.apiService.getQuizLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard = data;
        if (this.screen === 'leaderboard') {
          this.loadCurrentPlayerEntry();
        }
      },
      error: () => {}
    });
  }

  private retryPendingQuizSubmission(): void {
    const pending = this.loadPendingQuizSubmission();
    if (!pending) {
      return;
    }

    this.apiService.submitQuizEntry(pending).subscribe({
      next: (entry) => {
        this.clearPendingQuizSubmission();
        this.currentPlayerEntry = entry;
        this.submitDone = true;
        this.submitting = false;
        this.submissionNotice = '';
        this.refreshLeaderboardSnapshot();
      },
      error: () => {
        this.submissionNotice = 'A queued quiz score is still waiting to sync to the live leaderboard.';
      }
    });
  }

  private persistPendingQuizSubmission(payload: {
    clientSubmissionId: string;
    name: string;
    email: string;
    city: string | null;
    score: number;
    totalQuestions: number;
    timeTakenSeconds: number;
  }): void {
    localStorage.setItem(PENDING_QUIZ_SUBMISSION_STORAGE_KEY, JSON.stringify(payload));
  }

  private loadPendingQuizSubmission(): {
    clientSubmissionId: string;
    name: string;
    email: string;
    city: string | null;
    score: number;
    totalQuestions: number;
    timeTakenSeconds: number;
  } | null {
    const raw = localStorage.getItem(PENDING_QUIZ_SUBMISSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(PENDING_QUIZ_SUBMISSION_STORAGE_KEY);
      return null;
    }
  }

  private clearPendingQuizSubmission(): void {
    localStorage.removeItem(PENDING_QUIZ_SUBMISSION_STORAGE_KEY);
  }
}
