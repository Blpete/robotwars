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
    });
  }

  pause(): void {
    console.log('pause clicked');

  }

  exit(): void {
    console.log('exit clicked');
  }
}
