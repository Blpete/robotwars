import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-entitytile',
  templateUrl: './entitytile.component.html',
  styleUrls: ['./entitytile.component.css']
})
export class EntitytileComponent implements OnInit {

  constructor() { }

  count: number = 1;
  kind: string = "Loader";
  cost: number =5;
  leve: number =1;

  ngOnInit(): void {
  }

}
