import { Injectable } from '@angular/core';
import Phaser, { LEFT } from 'phaser';
import { BaseManager } from './basemanager';
import { EntityBehaviors } from './enitybehaviours';
import { GameConstants } from './gameconstants';
import { Coordinate, EntityClass, EntityType } from './gameTypes';

// var Health = PhaserHealth;

const SCENE_KEY = 'Scene';

@Injectable({
  providedIn: 'root'
})

export class GameboardService extends Phaser.Scene {

  robotCount: number;
  currentLoc: Coordinate;
  frameCount: number;
  baseManager: BaseManager;
  public score: number;
  energy: number;


  private controls: any;
  private sourceMarker: any;
  private destinationMarker: any;
  // map: any;
  private sprites: EntityClass[] = [];
  // tslint:disable-next-line: no-inferrable-types
  private paused: boolean = false;

  // chests
  chests;

  // bullets
  bullets;
  lastBulletShotAt;
  bulletPool;
  enemyWave;
  orePool;
  energyPool;

  // space
  bg;

  // Define constants
  SHOT_DELAY = 500; // milliseconds (10 bullets/second)
  BULLET_SPEED = 500; // pixels/second
  NUMBER_OF_BULLETS = 30;

  constructor() {
    super({ key: SCENE_KEY });
    this.currentLoc = { x: 0, y: 10 };
    this.robotCount = 0;
    this.frameCount = 0;
    this.energy = 0;
    this.baseManager = new BaseManager();
    this.score = 0;
  }

  public pauseGame(): void {
    this.paused = true;
    this.game.scene.pause(SCENE_KEY);
  }

  public resumeGame(): void {
    this.paused = false;
    this.game.scene.resume(SCENE_KEY);
  }

  public getScore(): number {
    return this.score;
  }
  public getEnergy(): number {
    return this.energy;
  }

  public newResource(kind: EntityType): void {

    this.robotCount++;

   // const sourceTileX = this.map.tileToWorldX(this.currentLoc.x);
   // const sourceTileY = this.map.tileToWorldY(this.currentLoc.y);
    console.log('addNewResource', kind, this.currentLoc.x, this.currentLoc.y);

    const entity = this.physics.add.sprite(this.currentLoc.y, this.currentLoc.y, kind.toString());
    entity.setBounce(0.2);
    entity.setCollideWorldBounds(true);
    entity.setVelocityX(Phaser.Math.Between(-10, 10));
    entity.setVelocityY(Phaser.Math.Between(-10, 10));


    const obj: EntityClass = new EntityClass();
    obj.entityKind = kind;
    obj.sprite = entity;
    obj.angle = Math.random() * 360;
    obj.distance = Math.random() * 150;
    const base = this.baseManager.getCurrentBase();
    obj.baseloc = { x: base.sprite.x, y: base.sprite.y };
    this.sprites.push(obj);

  }

  public setCurrentCoordinate(coord: Coordinate): void {
    // console.log('setCurrentCoord', coord, coord.x);
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


  public shootBullet(source: any, target: any): void {
    // Enforce a short delay between shots by recording
    // the time that each bullet is shot and testing if
    // the amount of time since the last shot is more than
    // the required delay.
    if (this.lastBulletShotAt === undefined) { this.lastBulletShotAt = 0; }
    if (this.game.getTime() - this.lastBulletShotAt < this.SHOT_DELAY) { return; }
    this.lastBulletShotAt = this.game.getTime();
    console.log('shootbullet');

    // Get a dead bullet from the pool
    const bullet = this.bulletPool.getFirstDead();

    // If there aren't any bullets available then don't shoot
    if (bullet === null || bullet === undefined) { return; }

    // Revive the bullet
    // This makes the bullet "alive"
    // bullet.revive();

    // Bullets should kill themselves when they leave the world.
    // Phaser takes care of this for me by setting this flag
    // but you can do it yourself by killing the bullet if
    // its x,y coordinates are outside of the world.
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;

    // Set the bullet position to the gun position
    // const sourceTileX = this.map.tileToWorldX(this.currentLoc.x);
    // const sourceTileY = this.map.tileToWorldY(this.currentLoc.y);

    bullet.x = source.x;
    bullet.y = source.y;

    bullet.setActive(true);
    bullet.setVisible(true);
    // console.log('bullet', bullet);

    let angle = 0.0;
    //  console.log('closest:', closeChest);
    angle = Phaser.Math.Angle.Between(source.x, source.y, target.x, target.y);
    //  console.log('Angle:', angle);

    // Shoot it
    this.physics.velocityFromRotation(angle, this.BULLET_SPEED, bullet.body.velocity);
    // bullet.body.velocity.x = this.BULLET_SPEED;
    // bullet.body.velocity.y = 0;
  }



  public create(): void {
    console.log('SCENE Create');

    // SPACE
    //  World size is 8000 x 6000
    this.bg = this.add.tileSprite(400, 300, 800, 600, 'background').setScrollFactor(0);

    // this.map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
    // const tiles = this.map.addTilesetImage('Desert', 'tiles');
    // const layer = this.map.createDynamicLayer('Ground', tiles, 0, 0);

    // Graphic to show the "source" of the copy operation
    const tilewidth = 16;
    const tileheight = 16;
    this.sourceMarker = this.add.graphics({ lineStyle: { width: 5, color: 0xffffff, alpha: 1 } });
    // this.sourceMarker.strokeRect(0, 0, 1 * this.map.tileWidth, 1 * this.map.tileHeight);
    this.sourceMarker.strokeRect(0, 0, 1 * tilewidth, 1 * tileheight);

    // // Graphic to show the "destination" of the copy operation
    // this.destinationMarker = this.add.graphics({ lineStyle: { width: 5, color: 0x000000, alpha: 1 } });
    // this.destinationMarker.strokeRect(0, 0, 3 * this.map.tileWidth, 3 * this.map.tileHeight);
    // this.destinationMarker.setPosition(this.map.tileWidth * 5, this.map.tileHeight * 10);

    this.cameras.main.setBounds(0, 0, 8000, 6000);

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
    // tslint:disable-next-line: typedef,  tslint:disable-next-line: only-arrow-functions
    this.game.canvas.oncontextmenu = function(e) { e.preventDefault(); };

    // create bases
    this.baseManager.addBase(1, { x: 50, y: 80 }, this);
    this.baseManager.addBase(2, { x: 130, y: 200 }, this);
    this.baseManager.addBase(3, { x: 1000, y: 1000 }, this);


    //  create chests
    this.chests = this.physics.add.group({ key: 'chest', frameQuantity: 10 });
    const rect = new Phaser.Geom.Rectangle(0, 0, GameConstants.width, GameConstants.height);
    Phaser.Actions.RandomRectangle(this.chests.getChildren(), rect);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
      console.log('drag', gameObject);
    });

    // enemy wave
    this.enemyWave = this.physics.add.group({ key: 'badguy', frameQuantity: 10 });
    Phaser.Actions.RandomRectangle(this.enemyWave.getChildren(), rect);

    // // Add component to Sprite class
    // PhaserHealth.MixinTo(Phaser.GameObjects.Sprite);

    // create bullets

    // Create an object representing our gun
    // Create an object pool of bullets
    this.bulletPool = this.physics.add.group();
    for (let i = 0; i < this.NUMBER_OF_BULLETS; i++) {
      // Create each bullet and add it to the group.
      const bullet: any = this.add.sprite(0, 0, 'bullet');
      this.bulletPool.add(bullet);

      // Set its initial state to "dead".
      this.bulletPool.killAndHide(bullet);
    }

    const self = this;
    this.physics.add.collider(
      this.bulletPool,
      this.enemyWave,
      function (ball, crate): void {
        //  console.log('colision', ball, crate);
        crate.destroy();
        self.score = self.score + 10;
        ball.destroy();
        console.log('colision', self.score);
        // ball.setAlpha(0.5);
        // crate.setAlpha(0.5);
      });
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
    this.load.image('bullet', 'assets/sprites/bullets/bullet7.png');
    this.load.image('badguy', 'assets/sprites/ship.png');

    // space
    this.load.image('background', 'assets/space/nebula.jpg');
    this.load.image('stars', 'assets/space/stars.png');
    this.load.atlas('space', 'assets/space/space.png', 'assets/pace/space.json');
  }

  public update(time, delta): void {

    this.updateFrame();

    this.controls.update(delta);

    const worldPoint: any = this.input.activePointer.positionToCamera(this.cameras.main);

    // const sourceTileX = this.map.worldToTileX(worldPoint.x);
    // const sourceTileY = this.map.worldToTileY(worldPoint.y);
    //  let destinationTileX = this.map.worldToTileX(this.destinationMarker.x);
    // let destinationTileY = this.map.worldToTileY(this.destinationMarker.y);

    // Snap to tile coordinates, but in world space
    // this.sourceMarker.x = this.map.tileToWorldX(sourceTileX);
    // this.sourceMarker.y = this.map.tileToWorldY(sourceTileY);

    // button down
    if (this.input.manager.activePointer.isDown) {
      if (this.sourceMarker.y >= 0) {
        console.log('click on', worldPoint.x, worldPoint.y);

        this.setCurrentCoordinate({ x:worldPoint.x, y: worldPoint.y });
        this.baseManager.hightlightBase({ x: worldPoint.x, y: worldPoint.y });

        // todo test
        const closeTarget: any = this.physics.closest(this.baseManager.getCurrentBase().sprite, this.enemyWave.getChildren());
        if (closeTarget) {
          this.shootBullet(this.baseManager.getCurrentBase().sprite, closeTarget);
        }
      }

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


