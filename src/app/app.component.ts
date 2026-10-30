import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameboardService } from './gameboard.service';
import Phaser from 'phaser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'RobotWars';
  public readonly phaser = Phaser;
  public gameRunning = false;
  private game: Phaser.Game | null = null;
  private readonly onResize = () => this.resize();

  // public readonly config = {
  //   type: Phaser.AUTO,
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // };
  public readonly config = {
    title: 'Robot Wars',
    version: '1.0.0',
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    // height: 1280,
    //  width: 690,
    backgroundColor: '#2d2d2d',
    //  scene: [MainScene],
    //  parent: 'gameContainer',
    scale: {
      mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
    physics: {
      default: 'arcade',
      arcade: {
      }
    },
  };
  public constructor(public gameService: GameboardService) {
    window.addEventListener('resize', this.onResize);
  }

  public onGameReady(game: Phaser.Game): void {
    this.game = game;
    this.gameService.begin(game);
    this.resize();
  }

  public newGame(event): void {
    console.log('newGame-app', event);
    this.gameRunning = true;
  }

  public exitGame(event): void {
    console.log('exitGame-app', event);
    // PhaserComponent.ngOnDestroy is the only place that destroys the Game.
    this.gameService.end();
    this.game = null;
    this.gameRunning = false;
  }

  public ngOnInit(): void {

  }

  public ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
  }

  public resize(): void {
    if (!this.game) {
      return;
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.game.scale.resize(width, height);
    this.gameService.resizeViewport(width, height);
  }



}


