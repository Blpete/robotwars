import { Component, OnInit } from '@angular/core';
import { GameboardService } from '../gameboard.service';
import { EntityType, Score } from '../gameTypes';


@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {

  constructor(public gameService: GameboardService) { }

  loaderEnable = false;
  attackerEnable = false;
  minerEnable = false;
  defenderEnable = false;
  builderEnable = false;;
  subscription: any

  ngOnInit(): void {

    this.subscription = this.gameService.getScoreEmitter()
      .subscribe(item => this.scoreUpdated(item));
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

  public scoreUpdated(score: Score): void {
    console.log('scoreUpdate:', score);
    if (score.energy >= 5) {
      this.loaderEnable = true;
    } else {
      this.loaderEnable = false;
    }
    if (score.energy >= 20) {
      this.minerEnable = true;
    } else {
      this.minerEnable = false;
    }
    if (score.energy >= 10) {
      this.attackerEnable = true;
    } else {
      this.attackerEnable = false;
    }
    if (score.energy >= 20) {
      this.defenderEnable = true;
    } else {
      this.defenderEnable = false;
    }
    if (score.energy >= 40) {
      this.builderEnable = true;
    } else {
      this.builderEnable = false;
    }
  }
}
