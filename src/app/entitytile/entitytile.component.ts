import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Loader } from 'phaser';
import { GameConstants } from '../gameconstants';
import { EntityType } from '../gameTypes';

@Component({
  selector: 'app-entitytile',
  templateUrl: './entitytile.component.html',
  styleUrls: ['./entitytile.component.css']
})
export class EntitytileComponent implements OnInit {

  @Input() entityKind: string;
  @Input() disabled: boolean;
  @Output()
  public tileClick: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  count: number = 1;
  kind: string = '';
  cost: number = 5;
  level: number = 1;

  ngOnInit(): void {
    console.log('InitTile:', this.entityKind);
    this.cost = GameConstants.entityCost[this.entityKind];
    this.kind = this.entityKind;
  }

  newEntity(): void {
    this.tileClick.emit('click');
  }

}
