import { Component } from '@angular/core';
import { GameboardService } from './gameboard.service';
import Phaser from 'phaser';
// import PhaserHealth from 'PhaserHealth';
import { GameConstants } from './gameconstants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RobotWars';
  public readonly phaser = Phaser;
  public gameRunning = false;
  private game: Phaser.Game;

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
    //  height: GameConstants.height,
    //  width: GameConstants.width,
    backgroundColor: '#2d2d2d',
    //  scene: [MainScene],
    //  parent: 'gameContainer',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
      }
    },
  };
  public constructor(public gameService: GameboardService) { }

  public onGameReady(game: Phaser.Game): void {
    console.log('onGameReady', this.gameService, game);
    this.game = game;
    game.scene.add('Scene', this.gameService, true);
  }

  public newGame(event): void {
    console.log('newGame-app', event);
    this.gameRunning = true;
  }

  public exitGame(event): void {
    console.log('exitGame-app', event);
    this.game.destroy(true, false);
    this.gameRunning = false;
  }

}


