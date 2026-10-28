import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';

/**
 * Local replacement for the unmaintained `phaser-component-library` (last published
 * for Angular 6). Keeps the same selector, inputs, and lifecycle behavior:
 * create a Phaser.Game from `gameConfig`, append its canvas once the game is ready,
 * and destroy the game with the component.
 */
@Component({
    // The original library selector is part of the game template contract.
    // tslint:disable-next-line: component-selector
    selector: 'phaser-component',
    template: '',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PhaserComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Phaser game configuration. The `parent` property is ignored; the canvas is
   * attached to this component's host element.
   */
  @Input() gameConfig: any;

  /** Emits the Phaser.Game instance once the game is ready and the view has initialized. */
  @Output() readonly gameReady = new EventEmitter<any>();

  /** Phaser module reference. Falls back to `window.Phaser` when omitted. */
  @Input() Phaser: any;

  private game: any;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const PhaserModule = this.Phaser || (window as any).Phaser;
    if (!PhaserModule) {
      throw new ReferenceError('Phaser not found.');
    } else if (!PhaserModule.Game) {
      throw new ReferenceError('Phaser.Game not found.');
    }
    this.game = new PhaserModule.Game(this.gameConfig);
  }

  ngAfterViewInit(): void {
    this.game.events.once('ready', () => {
      this.elementRef.nativeElement.appendChild(this.game.canvas);
      this.elementRef.nativeElement.style.overflow = 'hidden';
      this.gameReady.emit(this.game);
    });
  }

  ngOnDestroy(): void {
    if (this.game && typeof this.game.destroy === 'function') {
      this.game.destroy(true);
    }
  }
}
