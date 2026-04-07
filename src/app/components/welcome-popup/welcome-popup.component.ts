import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, VisitorEntrySubmission } from '../../services/api.service';
import {
  ENTRY_EXPERIENCE_COMPLETED_STORAGE_KEY,
  ENTRY_PROFILE_STORAGE_KEY,
  PENDING_VISITOR_ENTRY_STORAGE_KEY,
  VISITOR_ID_STORAGE_KEY
} from './entry-experience.storage';

type PuzzleEdge = 'flat' | 'tab' | 'blank';

interface PuzzleShape {
  top: PuzzleEdge;
  right: PuzzleEdge;
  bottom: PuzzleEdge;
  left: PuzzleEdge;
}

interface PuzzleSlot {
  id: string;
  row: number;
  col: number;
  shape: PuzzleShape;
}

interface PuzzleOption {
  id: string;
  row: number;
  col: number;
  shape: PuzzleShape;
  title: string;
  targetSlotId?: string;
  isDecoy?: boolean;
}

@Component({
  selector: 'app-welcome-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './welcome-popup.component.html',
  styleUrls: ['./welcome-popup.component.css']
})
export class WelcomePopupComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  readonly puzzleImageUrl = 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg';
  readonly columns = 3;
  readonly rows = 4;
  readonly boardUnitSize = 100;
  readonly boardWidth = this.columns * this.boardUnitSize;
  readonly boardHeight = this.rows * this.boardUnitSize;
  readonly boardViewBox = `0 0 ${this.boardWidth} ${this.boardHeight}`;
  readonly trayListId = 'entry-piece-tray';
  readonly missingSlotIds = ['slot-4'];
  readonly successHearts = ['\u2764', '\uD83D\uDC96', '\u2764', '\uD83D\uDC95', '\u2764'];
  readonly puzzleSlots: PuzzleSlot[] = this.buildPuzzleSlots();
  readonly allPuzzleOptions: PuzzleOption[] = this.buildPuzzleOptions();

  isVisible = true;
  stage: 'intro' | 'puzzle' | 'success' = 'intro';
  visitorName = '';
  socialMediaId = '';
  introError = '';
  puzzleMessage = '';
  puzzleError = '';
  trackingStatus: 'idle' | 'saving' | 'saved' | 'queued' = 'idle';
  trayOptions: PuzzleOption[] = [];
  placedPieces: Record<string, string | null> = this.buildEmptyPlacedPieces();
  draggingPieceId: string | null = null;
  selectedPieceId: string | null = null;
  incorrectSlotIds = new Set<string>();

  private readonly maskCache = new Map<string, string>();
  private readonly pathCache = new Map<string, string>();
  private readonly pieceOrder = new Map<string, number>(
    this.allPuzzleOptions.map((option, index) => [option.id, index])
  );
  private checkTimerId: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    this.restoreSavedProfile();
    this.resetPuzzle(true);
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    this.clearPendingCheck();
  }

  get completedName(): string {
    return this.visitorName.trim() || 'Guest';
  }

  get puzzleProgressLabel(): string {
    const placedCount = this.missingSlotIds.filter(slotId => !!this.placedPieces[slotId]).length;
    const pieceLabel = this.missingSlotIds.length === 1 ? 'piece' : 'pieces';
    return `${placedCount} / ${this.missingSlotIds.length} ${pieceLabel} placed`;
  }

  get boardHint(): string {
    switch (this.stage) {
      case 'intro':
        return 'Enter your name to activate the puzzle board and begin.';
      case 'success':
        return 'Portrait complete. The welcome gate is unlocked.';
      default:
        return this.draggingPieceId || this.selectedPieceId
          ? 'Drop the selected jigsaw piece into the glowing missing space.'
          : 'Drag the correct piece from the tray into the portrait.';
    }
  }

  beginPuzzle(): void {
    const trimmedName = this.visitorName.trim();
    if (trimmedName.length < 2) {
      this.introError = 'Please enter your name to begin the puzzle.';
      return;
    }

    this.visitorName = trimmedName;
    this.socialMediaId = this.socialMediaId.trim();
    this.persistProfile();
    this.introError = '';
    this.stage = 'puzzle';
    this.resetPuzzle(true);
  }

  onDragStarted(event: DragEvent, pieceId: string): void {
    if (this.stage !== 'puzzle') {
      return;
    }

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', pieceId);
    }

    this.draggingPieceId = pieceId;
    this.selectedPieceId = pieceId;
    this.puzzleError = '';
    this.puzzleMessage = 'Drag the piece into one of the highlighted puzzle gaps.';
  }

  onDragEnded(): void {
    this.draggingPieceId = null;
  }

  selectPiece(pieceId: string): void {
    if (this.stage !== 'puzzle') {
      return;
    }

    this.selectedPieceId = this.selectedPieceId === pieceId ? null : pieceId;
    this.puzzleError = '';
    this.puzzleMessage = this.selectedPieceId
      ? 'Piece selected. Tap a missing slot to place it, or drag it into the portrait.'
      : 'Selection cleared. Choose another piece from the tray.';
  }

  allowPieceDrop(event: DragEvent): void {
    if (this.stage !== 'puzzle') {
      return;
    }

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onSlotDrop(event: DragEvent, slotId: string): void {
    event.preventDefault();
    const pieceId = event.dataTransfer?.getData('text/plain');
    if (!pieceId) {
      return;
    }

    this.placePieceInSlot(slotId, pieceId);
    this.draggingPieceId = null;
    this.selectedPieceId = null;
  }

  onTrayDrop(event: DragEvent): void {
    event.preventDefault();
    const pieceId = event.dataTransfer?.getData('text/plain');
    if (!pieceId) {
      return;
    }

    this.returnPieceToTray(pieceId);
    this.draggingPieceId = null;
    this.selectedPieceId = null;
  }

  onMissingSlotClick(slotId: string): void {
    if (this.stage !== 'puzzle') {
      return;
    }

    const pieceId = this.placedPieces[slotId];
    if (pieceId && !this.selectedPieceId) {
      this.returnPieceToTray(pieceId);
      return;
    }

    if (!this.selectedPieceId) {
      return;
    }

    this.placePieceInSlot(slotId, this.selectedPieceId);
    this.selectedPieceId = null;
  }

  resetPuzzle(shuffleOptions = false): void {
    this.clearPendingCheck();
    this.draggingPieceId = null;
    this.selectedPieceId = null;
    this.puzzleError = '';
    this.puzzleMessage = 'One interior piece is missing. Look closely before you place it.';
    this.incorrectSlotIds = new Set<string>();
    this.placedPieces = this.buildEmptyPlacedPieces();

    const freshOptions = [...this.allPuzzleOptions];
    this.trayOptions = shuffleOptions ? this.shuffleOptions(freshOptions) : freshOptions;
  }

  onEnterSite(): void {
    localStorage.setItem(ENTRY_EXPERIENCE_COMPLETED_STORAGE_KEY, 'true');
    localStorage.setItem('srp_welcome_seen', 'true');
    localStorage.setItem('srp_entry_completed', 'true');
    this.persistProfile();
    this.closePopup();
  }

  isMissingSlot(slotId: string): boolean {
    return this.missingSlotIds.includes(slotId);
  }

  isSlotIncorrect(slotId: string): boolean {
    return this.incorrectSlotIds.has(slotId);
  }

  getTrayConnections(): string[] {
    return this.missingSlotIds.map(slotId => this.getSlotDropListId(slotId));
  }

  getSlotConnections(slotId: string): string[] {
    return [
      this.trayListId,
      ...this.missingSlotIds
        .filter(candidate => candidate !== slotId)
        .map(candidate => this.getSlotDropListId(candidate))
    ];
  }

  getSlotDropListId(slotId: string): string {
    return `entry-slot-${slotId}`;
  }

  getSlotPiece(slotId: string): PuzzleOption | undefined {
    const pieceId = this.placedPieces[slotId];
    return pieceId ? this.getPieceById(pieceId) : undefined;
  }

  getPieceArtworkStyle(piece: Pick<PuzzleOption, 'row' | 'col' | 'shape'>): Record<string, string> {
    return this.buildPieceArtworkStyle(piece.row, piece.col, piece.shape);
  }

  // Returns styles for the WRAPPER div — mask gives puzzle shape, background shows correct image slice
  getPieceWrapperStyle(shape: PuzzleShape): Record<string, string> {
    const shapeKey = JSON.stringify(shape);
    const encoded = this.maskCache.get(shapeKey) || this.buildEncodedMask(shape);
    return {
      '-webkit-mask-image': encoded,
      'mask-image': encoded,
      '-webkit-mask-size': '100% 100%',
      'mask-size': '100% 100%',
      '-webkit-mask-repeat': 'no-repeat',
      'mask-repeat': 'no-repeat',
    };
  }

  // Returns styles for the IMG — uses object-fit + object-position to show the correct slice
  // object-position: x% y% where x = col/(cols-1)*100, y = row/(rows-1)*100
  getPieceMaskStyle(shape: PuzzleShape): Record<string, string> {
    return this.getPieceWrapperStyle(shape);
  }

  getPieceVectorPath(shape: PuzzleShape): string {
    const shapeKey = JSON.stringify(shape);
    const cachedPath = this.pathCache.get(shapeKey);
    if (cachedPath) {
      return cachedPath;
    }

    const path = this.buildPiecePath(shape);
    this.pathCache.set(shapeKey, path);
    return path;
  }

  getBoardPieceTransform(slot: Pick<PuzzleSlot, 'row' | 'col'>): string {
    return `translate(${slot.col * this.boardUnitSize} ${slot.row * this.boardUnitSize})`;
  }

  getBoardSlotStyle(slot: PuzzleSlot): Record<string, string> {
    return {
      ...this.getPieceMaskStyle(slot.shape),
      top: `${(slot.row / this.rows) * 100}%`,
      left: `${(slot.col / this.columns) * 100}%`,
      width: `${100 / this.columns}%`,
      height: `${100 / this.rows}%`
    };
  }

  getBoardPlacedPieceStyle(piece: Pick<PuzzleOption, 'row' | 'col'>): Record<string, string> {
    return this.buildPieceFillStyle(piece.row, piece.col);
  }

  // Style for tray piece img — shows the correct image slice using object-position
  getTrayPieceImgStyle(row: number, col: number): Record<string, string> {
    // Position the full image so the correct cell is visible
    // img is 200% wide (2 cols) and 300% tall (3 rows)
    // left offset: -col * 100% of container (each col = 50% of full img width = 100% of container)
    // top offset: -row * 100% of container (each row = 33.3% of full img height = 100% of container)
    return {
      'left': `${-col * 100}%`,
      'top': `${-row * 100}%`,
    };
  }

  private placePieceInSlot(slotId: string, pieceId: string): void {
    if (!this.isMissingSlot(slotId)) {
      return;
    }

    const piece = this.getPieceById(pieceId);
    if (!piece) {
      return;
    }

    const originSlotId = this.findSlotByPieceId(pieceId);
    if (originSlotId === slotId) {
      return;
    }

    this.clearPendingCheck();
    this.puzzleError = '';
    this.incorrectSlotIds.delete(slotId);

    if (originSlotId) {
      this.placedPieces[originSlotId] = null;
    } else {
      this.removePieceFromTray(pieceId);
    }

    const displacedPieceId = this.placedPieces[slotId];
    if (displacedPieceId && displacedPieceId !== pieceId) {
      this.addPieceToTray(displacedPieceId);
    }

    this.removePieceFromTray(pieceId);
    this.placedPieces[slotId] = pieceId;

    if (this.allMissingSlotsFilled()) {
      this.puzzleMessage = 'That looks promising. Checking the portrait...';
      this.checkTimerId = window.setTimeout(() => this.checkPuzzle(), 280);
      return;
    }

    this.puzzleMessage = 'Nice placement. One missing space still needs the correct piece.';
  }

  private returnPieceToTray(pieceId: string): void {
    const originSlotId = this.findSlotByPieceId(pieceId);
    if (!originSlotId) {
      return;
    }

    this.clearPendingCheck();
    this.placedPieces[originSlotId] = null;
    this.addPieceToTray(pieceId);
    this.incorrectSlotIds.delete(originSlotId);
    this.puzzleError = '';
    this.puzzleMessage = 'Piece returned to the tray. Try a different match.';
  }

  private checkPuzzle(): void {
    this.clearPendingCheck();

    if (!this.allMissingSlotsFilled()) {
      return;
    }

    const incorrectSlots = this.missingSlotIds.filter(slotId => {
      const piece = this.getSlotPiece(slotId);
      return piece?.targetSlotId !== slotId;
    });

    if (incorrectSlots.length === 0) {
      this.onPuzzleSolved();
      return;
    }

    this.puzzleError = 'Close, but that piece does not complete the portrait yet. Try again.';
    this.puzzleMessage = '';
    this.incorrectSlotIds = new Set(incorrectSlots);

    window.setTimeout(() => {
      incorrectSlots.forEach(slotId => {
        const pieceId = this.placedPieces[slotId];
        if (!pieceId) {
          return;
        }

        this.placedPieces[slotId] = null;
        this.addPieceToTray(pieceId);
      });

      this.incorrectSlotIds = new Set<string>();
      this.puzzleMessage = 'The tray is ready again. Drag a new piece into the portrait.';
    }, 720);
  }

  private onPuzzleSolved(): void {
    this.stage = 'success';
    this.puzzleError = '';
    this.puzzleMessage = '';
    this.draggingPieceId = null;
    this.selectedPieceId = null;
    this.persistProfile();
    this.submitVisitorEntry();
  }

  private submitVisitorEntry(): void {
    const payload = this.buildVisitorPayload();
    this.trackingStatus = 'saving';

    this.apiService.recordVisitorEntry(payload).subscribe({
      next: () => {
        this.trackingStatus = 'saved';
        localStorage.removeItem(PENDING_VISITOR_ENTRY_STORAGE_KEY);
      },
      error: () => {
        this.trackingStatus = 'queued';
        localStorage.setItem(PENDING_VISITOR_ENTRY_STORAGE_KEY, JSON.stringify(payload));
      }
    });
  }

  private buildVisitorPayload(): VisitorEntrySubmission {
    return {
      clientVisitorId: this.getOrCreateVisitorId(),
      name: this.visitorName.trim(),
      socialMediaId: this.socialMediaId.trim() || undefined,
      source: 'entry-puzzle'
    };
  }

  private getOrCreateVisitorId(): string {
    const existingId = localStorage.getItem(VISITOR_ID_STORAGE_KEY);
    if (existingId) {
      return existingId;
    }

    const generatedId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `srp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    localStorage.setItem(VISITOR_ID_STORAGE_KEY, generatedId);
    return generatedId;
  }

  private restoreSavedProfile(): void {
    const rawProfile = localStorage.getItem(ENTRY_PROFILE_STORAGE_KEY);
    if (!rawProfile) {
      return;
    }

    try {
      const parsedProfile = JSON.parse(rawProfile) as { name?: string; socialMediaId?: string };
      this.visitorName = parsedProfile.name?.trim() || '';
      this.socialMediaId = parsedProfile.socialMediaId?.trim() || '';
    } catch {
      localStorage.removeItem(ENTRY_PROFILE_STORAGE_KEY);
    }
  }

  private persistProfile(): void {
    localStorage.setItem(ENTRY_PROFILE_STORAGE_KEY, JSON.stringify({
      name: this.visitorName.trim(),
      socialMediaId: this.socialMediaId.trim()
    }));
  }

  private closePopup(): void {
    this.isVisible = false;
    document.body.style.overflow = '';
    this.close.emit();
  }

  private getPieceById(pieceId: string): PuzzleOption | undefined {
    return this.allPuzzleOptions.find(option => option.id === pieceId);
  }

  private findSlotByPieceId(pieceId: string): string | undefined {
    return Object.keys(this.placedPieces).find(slotId => this.placedPieces[slotId] === pieceId);
  }

  private removePieceFromTray(pieceId: string): void {
    this.trayOptions = this.trayOptions.filter(option => option.id !== pieceId);
  }

  private addPieceToTray(pieceId: string): void {
    const piece = this.getPieceById(pieceId);
    if (!piece || this.trayOptions.some(option => option.id === pieceId)) {
      return;
    }

    this.trayOptions = [...this.trayOptions, piece].sort((left, right) => {
      const leftOrder = this.pieceOrder.get(left.id) ?? 0;
      const rightOrder = this.pieceOrder.get(right.id) ?? 0;
      return leftOrder - rightOrder;
    });
  }

  private allMissingSlotsFilled(): boolean {
    return this.missingSlotIds.every(slotId => !!this.placedPieces[slotId]);
  }

  private shuffleOptions(options: PuzzleOption[]): PuzzleOption[] {
    const shuffled = [...options];

    for (let index = shuffled.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
  }

  private clearPendingCheck(): void {
    if (this.checkTimerId !== null) {
      window.clearTimeout(this.checkTimerId);
      this.checkTimerId = null;
    }
  }

  private buildPieceArtworkStyle(
    row: number,
    col: number,
    shape: PuzzleShape
  ): Record<string, string> {
    return {
      ...this.getPieceWrapperStyle(shape),
      ...this.buildPieceFillStyle(row, col)
    };
  }

  private buildPieceFillStyle(row: number, col: number): Record<string, string> {
    return {
      'background-image': `url('${this.puzzleImageUrl}')`,
      'background-size': `${this.columns * 100}% ${this.rows * 100}%`,
      'background-position': this.getBackgroundPosition(row, col),
      'background-repeat': 'no-repeat',
      'background-color': 'rgba(18, 12, 11, 0.82)'
    };
  }

  private buildPiecePath(shape: PuzzleShape): string {
    const left = 8;
    const top = 8;
    const right = 92;
    const bottom = 92;
    const neckStart = 36;
    const neckEnd = 64;
    const softInset = 2;
    const peak = 7;

    return [
      `M ${left} ${top}`,
      this.buildTopEdge(shape.top, top, right, neckStart, neckEnd, softInset, peak),
      this.buildRightEdge(shape.right, right, bottom, neckStart, neckEnd, softInset, peak),
      this.buildBottomEdge(shape.bottom, left, bottom, neckStart, neckEnd, softInset, peak),
      this.buildLeftEdge(shape.left, left, top, bottom, neckStart, neckEnd, softInset, peak),
      'Z'
    ].join(' ');
  }

  private buildTopEdge(
    edge: PuzzleEdge,
    top: number,
    right: number,
    neckStart: number,
    neckEnd: number,
    softInset: number,
    peak: number
  ): string {
    if (edge === 'flat') {
      return `L ${right} ${top}`;
    }

    const direction = edge === 'tab' ? -1 : 1;
    return [
      `L ${neckStart} ${top}`,
      `C ${neckStart + 4} ${top}, ${neckStart + 4} ${top + direction * softInset}, ${neckStart + 10} ${top + direction * softInset}`,
      `C ${neckStart + 12} ${top + direction * peak}, ${neckEnd - 12} ${top + direction * peak}, ${neckEnd - 10} ${top + direction * softInset}`,
      `C ${neckEnd - 4} ${top + direction * softInset}, ${neckEnd - 4} ${top}, ${neckEnd} ${top}`,
      `L ${right} ${top}`
    ].join(' ');
  }

  private buildRightEdge(
    edge: PuzzleEdge,
    right: number,
    bottom: number,
    neckStart: number,
    neckEnd: number,
    softInset: number,
    peak: number
  ): string {
    if (edge === 'flat') {
      return `L ${right} ${bottom}`;
    }

    const direction = edge === 'tab' ? 1 : -1;
    return [
      `L ${right} ${neckStart}`,
      `C ${right} ${neckStart + 4}, ${right + direction * softInset} ${neckStart + 4}, ${right + direction * softInset} ${neckStart + 10}`,
      `C ${right + direction * peak} ${neckStart + 12}, ${right + direction * peak} ${neckEnd - 12}, ${right + direction * softInset} ${neckEnd - 10}`,
      `C ${right + direction * softInset} ${neckEnd - 4}, ${right} ${neckEnd - 4}, ${right} ${neckEnd}`,
      `L ${right} ${bottom}`
    ].join(' ');
  }

  private buildBottomEdge(
    edge: PuzzleEdge,
    left: number,
    bottom: number,
    neckStart: number,
    neckEnd: number,
    softInset: number,
    peak: number
  ): string {
    if (edge === 'flat') {
      return `L ${left} ${bottom}`;
    }

    const direction = edge === 'tab' ? 1 : -1;
    return [
      `L ${neckEnd} ${bottom}`,
      `C ${neckEnd - 4} ${bottom}, ${neckEnd - 4} ${bottom + direction * softInset}, ${neckEnd - 10} ${bottom + direction * softInset}`,
      `C ${neckEnd - 12} ${bottom + direction * peak}, ${neckStart + 12} ${bottom + direction * peak}, ${neckStart + 10} ${bottom + direction * softInset}`,
      `C ${neckStart + 4} ${bottom + direction * softInset}, ${neckStart + 4} ${bottom}, ${neckStart} ${bottom}`,
      `L ${left} ${bottom}`
    ].join(' ');
  }

  private buildLeftEdge(
    edge: PuzzleEdge,
    left: number,
    top: number,
    bottom: number,
    neckStart: number,
    neckEnd: number,
    softInset: number,
    peak: number
  ): string {
    if (edge === 'flat') {
      return `L ${left} ${top}`;
    }

    const direction = edge === 'tab' ? -1 : 1;
    return [
      `L ${left} ${neckEnd}`,
      `C ${left} ${neckEnd - 4}, ${left + direction * softInset} ${neckEnd - 4}, ${left + direction * softInset} ${neckEnd - 10}`,
      `C ${left + direction * peak} ${neckEnd - 12}, ${left + direction * peak} ${neckStart + 12}, ${left + direction * softInset} ${neckStart + 10}`,
      `C ${left + direction * softInset} ${neckStart + 4}, ${left} ${neckStart + 4}, ${left} ${neckStart}`,
      `L ${left} ${top}`
    ].join(' ');
  }

  private buildPuzzleSlots(): PuzzleSlot[] {
    const slots: PuzzleSlot[] = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const slotAbove = row > 0 ? slots[(row - 1) * this.columns + col] : null;
        const slotLeft = col > 0 ? slots[row * this.columns + (col - 1)] : null;

        const top = row === 0 ? 'flat' : this.getComplementEdge(slotAbove!.shape.bottom);
        const left = col === 0 ? 'flat' : this.getComplementEdge(slotLeft!.shape.right);
        const right = col === this.columns - 1 ? 'flat' : ((row + col) % 2 === 0 ? 'tab' : 'blank');
        const bottom = row === this.rows - 1 ? 'flat' : ((row + col) % 2 === 0 ? 'blank' : 'tab');

        slots.push({
          id: `slot-${slots.length}`,
          row,
          col,
          shape: { top, right, bottom, left }
        });
      }
    }

    return slots;
  }

  private buildPuzzleOptions(): PuzzleOption[] {
    const correctOptions = this.missingSlotIds
      .map((slotId, index) => {
        const slot = this.puzzleSlots.find(candidate => candidate.id === slotId);
        if (!slot) {
          return null;
        }

        return {
          id: `piece-${slot.id}`,
          row: slot.row,
          col: slot.col,
          shape: slot.shape,
          title: `Piece ${String.fromCharCode(65 + index)}`,
          targetSlotId: slot.id
        } as PuzzleOption;
      })
      .filter((option): option is PuzzleOption => !!option);

    const decoySourceIds = ['slot-1', 'slot-5', 'slot-7'].filter(
      slotId => !this.missingSlotIds.includes(slotId)
    );

    const decoyOptions = decoySourceIds
      .map((slotId, index) => {
        const slot = this.puzzleSlots.find(candidate => candidate.id === slotId);
        if (!slot) {
          return null;
        }

        return {
          id: `piece-decoy-${slot.id}`,
          row: slot.row,
          col: slot.col,
          shape: slot.shape,
          title: `Piece ${String.fromCharCode(65 + correctOptions.length + index)}`,
          isDecoy: true
        } as PuzzleOption;
      })
      .filter((option): option is PuzzleOption => !!option);

    return [...correctOptions, ...decoyOptions];
  }

  private buildEmptyPlacedPieces(): Record<string, string | null> {
    return this.missingSlotIds.reduce<Record<string, string | null>>((accumulator, slotId) => {
      accumulator[slotId] = null;
      return accumulator;
    }, {});
  }

  private getBackgroundPosition(row: number, col: number): string {
    const xPct = this.columns <= 1 ? 0 : (col / (this.columns - 1)) * 100;
    const yPct = this.rows <= 1 ? 0 : (row / (this.rows - 1)) * 100;
    return `${xPct}% ${yPct}%`;
  }

  private buildEncodedMask(shape: PuzzleShape): string {
    const shapeKey = JSON.stringify(shape);
    const cachedMask = this.maskCache.get(shapeKey);
    if (cachedMask) {
      return cachedMask;
    }

    const path = this.getPieceVectorPath(shape);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill='white' d='${path}'/></svg>`;
    const encodedMask = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
    this.maskCache.set(shapeKey, encodedMask);
    return encodedMask;
  }

  private getComplementEdge(edge: PuzzleEdge): PuzzleEdge {
    if (edge === 'tab') {
      return 'blank';
    }

    if (edge === 'blank') {
      return 'tab';
    }

    return 'flat';
  }
}
