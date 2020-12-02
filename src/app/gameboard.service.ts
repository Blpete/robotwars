import { Injectable } from '@angular/core';
import Phaser from 'phaser';
import { BaseManager } from './basemanager';
import { EntityBehaviors } from './enitybehaviours';
import { GameConstants } from './gameconstants';
import { Coordinate, EntityClass, EntityType } from './gameTypes';

const SCENE_KEY = 'Scene';

@Injectable({
  providedIn: 'root'
})

export class GameboardService extends Phaser.Scene {

  robotCount: number;
  currentLoc: Coordinate;
  frameCount: number;
  baseManager: BaseManager;

  private controls: any;
  private sourceMarker: any;
  private destinationMarker: any;
  map: any;
  private sprites: EntityClass[] = [];
  // tslint:disable-next-line: no-inferrable-types
  private paused: boolean = false;

  // chests
  chests;

  constructor() {
    super({ key: SCENE_KEY });
    this.currentLoc = { x: 0, y: 10 };
    this.robotCount = 0;
    this.frameCount = 0;
    this.baseManager = new BaseManager();
  }

  public pauseGame(): void {
    this.paused = true;
    this.game.scene.pause(SCENE_KEY);
  }

  public resumeGame(): void {
    this.paused = false;
    this.game.scene.resume(SCENE_KEY);
  }

  public newResource(kind: EntityType): void {

    this.robotCount++;

    const sourceTileX = this.map.tileToWorldX(this.currentLoc.x);
    const sourceTileY = this.map.tileToWorldY(this.currentLoc.y);
    console.log('addNewResource', kind, sourceTileX, sourceTileY);

    const entity = this.physics.add.sprite(sourceTileX, sourceTileY, kind.toString());
    entity.setBounce(0.2);
    entity.setCollideWorldBounds(true);
    entity.setVelocityX(Phaser.Math.Between(-10, 10));
    entity.setVelocityY(Phaser.Math.Between(-10, 10));


    const obj: EntityClass = new EntityClass();
    obj.entityKind = kind;
    obj.sprite = entity;
    obj.angle = Math.random() * 360;
    obj.distance = Math.random() * 150;
    obj.baseloc = { x: sourceTileX, y: sourceTileY };
    this.sprites.push(obj);

  }

  public setCurrentCoordinate(coord: Coordinate): void {
    console.log('setCurrentCoord', coord, coord.x);
    this.currentLoc = coord;
  }

  public updateFrame(): void {
    // console.log('UpdateFrame', this.frameCount);
    this.frameCount = this.frameCount + 1;
  }

  public getFrameRate(): number {
    // console.log('getFrameRate', this.frameCount);
    const rate: number = this.frameCount;
    this.frameCount = 0;
    return rate;
  }






  public create(): void {
    console.log('SCENE Create');



    this.map = this.make.tilemap({ key: 'map' });
    const tiles = this.map.addTilesetImage('Desert', 'tiles');
    const layer = this.map.createDynamicLayer('Ground', tiles, 0, 0);

    // Graphic to show the "source" of the copy operation
    this.sourceMarker = this.add.graphics({ lineStyle: { width: 5, color: 0xffffff, alpha: 1 } });
    this.sourceMarker.strokeRect(0, 0, 1 * this.map.tileWidth, 1 * this.map.tileHeight);

    // // Graphic to show the "destination" of the copy operation
    // this.destinationMarker = this.add.graphics({ lineStyle: { width: 5, color: 0x000000, alpha: 1 } });
    // this.destinationMarker.strokeRect(0, 0, 3 * this.map.tileWidth, 3 * this.map.tileHeight);
    // this.destinationMarker.setPosition(this.map.tileWidth * 5, this.map.tileHeight * 10);

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    const cursors = this.input.keyboard.createCursorKeys();
    const controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5
    };
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    const help = this.add.text(16, 16, 'Wave 1', {
      fontSize: '18px',
      padding: { x: 10, y: 5 },
      backgroundColor: '#000000',
      fill: '#ffffff'
    });
    help.setScrollFactor(0);

    this.physics.world.step(0);

    // stop browser default menu on right click
    // tslint:disable-next-line: only-arrow-functions
    // tslint:disable-next-line: typedef
    this.game.canvas.oncontextmenu = function (e) { e.preventDefault(); };

    // create bases
    this.baseManager.addBase(1, { x: 5, y: 8 }, this);
    this.baseManager.addBase(2, { x: 13, y: 2 }, this);
    this.baseManager.addBase(3, { x: 10, y: 10 }, this);


    //  create chests
    this.chests = this.make.group({ key: 'chest', frameQuantity: 10 });
    const rect = new Phaser.Geom.Rectangle(0, 0, GameConstants.width, GameConstants.height);
    Phaser.Actions.RandomRectangle(this.chests.getChildren(), rect);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
      console.log('drag', gameObject);
    }
    );
  }


  public preload(): void {
    console.log('preload method');
    // this.load.image('mario-tiles', 'assets/tilemaps/tiles/super-mario.png');
    this.load.image('tiles', 'assets/tilemaps/tiles/tmw_desert_spacing.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/desert.json');
    this.load.image('guy', 'assets/sprites/asteroids_ship.png');
    this.load.image('builder', 'assets/sprites/asteroids_ship.png');
    this.load.image('base', 'assets/sprites/blockb.png');
    this.load.image('attacker', 'assets/sprites/xenon2_ship.png');
    this.load.image('defender', 'assets/sprites/advanced_wars_tank.png');
    this.load.image('miner', 'assets/sprites/xenon2_ship.png');
    this.load.image('loader', 'assets/sprites/blue_ball.png');
    this.load.image('base-highlight', 'assets/sprites/blockBNM.png');
    this.load.image('chest', 'assets/sprites/carrot.png');
  }

  public update(time, delta): void {

    this.updateFrame();

    this.controls.update(delta);

    const worldPoint: any = this.input.activePointer.positionToCamera(this.cameras.main);

    const sourceTileX = this.map.worldToTileX(worldPoint.x);
    const sourceTileY = this.map.worldToTileY(worldPoint.y);
    //  let destinationTileX = this.map.worldToTileX(this.destinationMarker.x);
    // let destinationTileY = this.map.worldToTileY(this.destinationMarker.y);

    // Snap to tile coordinates, but in world space
    this.sourceMarker.x = this.map.tileToWorldX(sourceTileX);
    this.sourceMarker.y = this.map.tileToWorldY(sourceTileY);

    // button down
    if (this.input.manager.activePointer.isDown) {
      if (this.sourceMarker.y > 0) {
        console.log('click on', sourceTileX, sourceTileY);

        this.setCurrentCoordinate({ x: sourceTileX, y: sourceTileY });
        this.baseManager.hightlightBase({ x: sourceTileX, y: sourceTileY });
      }

      // Copy a 6 x 6 area at (sourceTileX, sourceTileY) to (destinationTileX, destinationTileY)
      // this.map.copy(sourceTileX, sourceTileY, 6, 6, destinationTileX, destinationTileY);
    }

    for (let i = 0; i < this.sprites.length; i++) {
      const value = this.sprites[i];
      this.sprites[i] = EntityBehaviors.updateEntity(value, this);
    }

    // this.sprites.forEach(value => {
    //   value.sprite.setPosition(value.baseloc.x, value.baseloc.y);
    //   Phaser.Math.RotateAroundDistance(value.sprite, value.sprite.x, value.sprite.y, this.angle, value.distance);
    //   value.angle = value.angle + 0.01;

    // });
  }
}


