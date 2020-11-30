import { Component, OnInit } from '@angular/core';
import { EntityType, GameboardService } from '../gameboard.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  constructor(public gameService: GameboardService) { }

  ngOnInit(): void {
  }

  public newLoader(): void {
    console.log('newLoader pressed');
    this.gameService.newResource(EntityType.Loader);
  }

  public newAttacker(): void {
    console.log('newAttacker pressed');
    this.gameService.newResource(EntityType.Attacker);
  }

  public newMiner(): void {
    console.log('newMiner pressed');
    this.gameService.newResource(EntityType.Miner);
  }


  public newDefender(): void {
    console.log('newDefender pressed');
    this.gameService.newResource(EntityType.Defender);
  }

  public newBuilder(): void {
    console.log('newBuilder pressed');
    this.gameService.newResource(EntityType.Builder);
  }
}
