import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GameboardService } from '../gameboard.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})


export class HomepageComponent implements OnInit {
  @Output()
  public newGameEmit: EventEmitter<string> = new EventEmitter<string>();
  public showHomepage: boolean = true;

  constructor(public gs: GameboardService) { }


  ngOnInit(): void {
    this.showHomepage = this.gs.homeVisible;
    document.body.classList.add('bg-img');
  }

  newGame(): void {
    console.log('newGame');
    this.showHomepage = false;
   // this.gs.homeVisible = false;
    this.newGameEmit.emit('newgame');
  }
  loadGame(): void {
    console.log('loadgame');
  }
  options(): void {
    console.log('options');
  }
  moreInfo(): void {
    console.log('moreInfo');
  }
}
