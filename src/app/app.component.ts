import { Component } from '@angular/core';
import { GameboardService } from './gameboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'robotwars';
  public readonly phaser = Phaser;
  // public readonly config = {
  //   type: Phaser.AUTO,
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // };
  public readonly config = {
    title: 'Robot Wars',
    version: '1.0.0',
    type: Phaser.AUTO,
    height: 480,
    width: 600,
    backgroundColor: '#2d2d2d',
    //  scene: [MainScene],
    //  parent: 'gameContainer',
    // physics: {
    //   default: 'arcade',
    //   arcade: {
    //     gravity: { y: 100 }
    //   }
    // },
  };
  public constructor(public gameService: GameboardService) { }

  public onGameReady(game: Phaser.Game): void {
    console.log('onGameReady', this.gameService, game);
    game.scene.add('Scene', this.gameService, true);
  }
}


