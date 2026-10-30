import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameboardService } from '../gameboard.service';
import { canAfford } from '../gamerules';
import { EntityType, Score } from '../gameTypes';


@Component({
    selector: 'app-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ControlsComponent implements OnInit {

  constructor(public gameService: GameboardService) { }

  base = 1;
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
    this.loaderEnable = canAfford(score.energy, EntityType.Loader);
    this.minerEnable = canAfford(score.energy, EntityType.Miner);
    this.attackerEnable = canAfford(score.energy, EntityType.Attacker);
    this.defenderEnable = canAfford(score.energy, EntityType.Defender);
    this.builderEnable = canAfford(score.energy, EntityType.Builder);
  }
}
