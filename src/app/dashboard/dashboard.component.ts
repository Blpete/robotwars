import { Component, OnInit } from '@angular/core';
import { interval, timer } from 'rxjs';
import { GameboardService } from '../gameboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

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
    this.score = 100;
    this.robots = 1;
    this.simTime = 1;
    this.frameRate = 1;
    this.energy = 1000;
    this.resources = 2000;
    // subscribe to timer for one second sim time updates
    this.observableTimer();

  }

  observableTimer(): void {
    const source = timer(1000, 1000);
    const abc = source.subscribe(val => {
      this.simTime++;
      this.robots = this.gameService.robotCount;
      this.frameRate = this.gameService.getFrameRate();
      this.score = this.gameService.getScore();
      this.energy = this.gameService.getEnergy();
      this.resources = this.gameService.getResources();
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
  }
}
