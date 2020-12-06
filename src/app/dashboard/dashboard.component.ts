import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { interval, timer } from 'rxjs';
import { GameboardService } from '../gameboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @Output()
  public exitGame: EventEmitter<string> = new EventEmitter<string>();
  score: number;
  robots: number;
  simTime: number;
  frameRate: number;
  energy: number;
  resources: number;
  paused: boolean = false;
  pauseLabel: string = 'Pause';

  constructor(public gameService: GameboardService) { }

  ngOnInit(): void {
    this.score = 0;
    this.robots = 0;
    this.simTime = 0;
    this.frameRate = 0;
    this.energy = 0;
    this.resources = 0;
    // subscribe to timer for one second sim time updates
    this.observableTimer();

  }

  observableTimer(): void {
    const source = timer(1000, 1000);
    const abc = source.subscribe(val => {
      this.simTime++;
      this.robots = this.gameService.getScore().robotCount;
      this.frameRate = this.gameService.getFrameRate();
      this.score = this.gameService.getScore().score;
      this.energy = this.gameService.getScore().energy;
      this.resources = this.gameService.getScore().resource;
    });
  }

  pause(): void {
    console.log('pause clicked', this.paused);
    if (!this.paused) {
      this.gameService.pauseGame();
      this.paused = true;
      this.pauseLabel = 'Resume';
    } else {
      this.gameService.resumeGame();
      this.paused = false;
      this.pauseLabel = 'Pause';
    }
  }

  exit(): void {
    console.log('exit clicked');
    this.gameService.pauseGame();
    this.exitGame.emit('exitGame');
  }
}
