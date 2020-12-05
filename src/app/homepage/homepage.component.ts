import { Component, OnInit } from '@angular/core';
import { GameboardService } from '../gameboard.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  public showHomepage: boolean = true;

  constructor(public gs: GameboardService) { }


  ngOnInit(): void {
    this.showHomepage = this.gs.homeVisible;
  }

  newGame(): void {
    console.log('newGame');
    this.showHomepage = false;
    this.gs.homeVisible = false;
  }

}
