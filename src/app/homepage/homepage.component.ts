import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  public showHomepage: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

  newGame(): void {
    console.log('newGame');
    this.showHomepage = false;
  }

}
