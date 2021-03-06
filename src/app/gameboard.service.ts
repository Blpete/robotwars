import { EventEmitter, Injectable, Output } from '@angular/core';
import Phaser, { LEFT } from 'phaser';
import { BaseManager } from './basemanager';
import { EntityBehaviors } from './enitybehaviours';
import { GameConstants } from './gameconstants';
import { Coordinate, EntityClass, EntityType, Score } from './gameTypes';

// var Health = PhaserHealth;

const SCENE_KEY = 'Scene';

@Injectable({
  providedIn: 'root'
})

export class GameboardService extends Phaser.Scene {

  @Output()
  public scoreUpdate: EventEmitter<Score> = new EventEmitter<Score>();

  public homeVisible = true;
  baseManager: BaseManager;
  currentLoc: Coordinate;

  frameCount: number;
  // scores
  public score: Score;
  private paused: boolean = false;

  private controls: any;
  private sourceMarker: any;
  // map: any;
  private sprites: EntityClass[] = [];
  private audio_sprite: any;

  asteroid;

  // groups
  chests;
  miners;
  attackers;
  loaders;
  defenders;
  builders;
  private basegroup: Phaser.GameObjects.Group;
  enemyWave;
  orePool;
  energyPool;

  // bullets
  bullets;
  lastBulletShotAt;
  bulletPool;

  // space
  bg;

  // particles
  public emitter0;  // : Phaser.GameObjects.Particles.ParticleEmitterManager;
  emitter1;

  // Define constants
  SHOT_DELAY = 500; // milliseconds (10 bullets/second)
  BULLET_SPEED = 500; // pixels/second
  NUMBER_OF_BULLETS = 30;

  constructor() {
    super({ key: SCENE_KEY });
    this.currentLoc = { x: 0, y: 10 };
    this.frameCount = 0;
    this.baseManager = new BaseManager();
    this.score = new Score();
  }

  public getScoreEmitter(): EventEmitter<Score> {
    return this.scoreUpdate;
  }
  public updateScore(): void {
    this.scoreUpdate.emit(this.score);
    // todo
    this.audio_sprite.play('ping');
  }

  public pauseGame(): void {
    this.paused = true;
    this.game.scene.pause(SCENE_KEY);
  }

  public resumeGame(): void {
    this.paused = false;
    this.game.scene.resume(SCENE_KEY);
  }

  public getScore(): Score {
    return this.score;
  }

  public newResource(kind: EntityType): void {

    this.score.robotCount++;
    this.updateScore();

    const base = this.baseManager.getCurrentBase();
    // const sourceTileX = this.map.tileToWorldX(this.currentLoc.x);
    // const sourceTileY = this.map.tileToWorldY(this.currentLoc.y);
    console.log('addNewResource', kind, base);

    const entity = this.physics.add.sprite(base.location.x, base.location.y, kind.toString());
    entity.displayHeight = GameConstants.entitySize;
    entity.displayWidth = GameConstants.entitySize;
    entity.setBounce(0);
    entity.setCollideWorldBounds(true);

    const health = GameConstants.entityHealth[kind];
    entity.setData('health', health);

    const capacity = GameConstants.entityCapacity[kind];
    entity.setData('capacity', capacity);


    const angle = Phaser.Math.Between(-Math.PI, Math.PI);
    this.physics.velocityFromRotation(angle, 10, entity.body.velocity);
    entity.rotation = angle + Math.PI / 2.0;

    const obj: EntityClass = new EntityClass();
    obj.entityKind = kind;
    obj.sprite = entity;
    obj.angle = Math.random() * 360;
    obj.distance = Math.random() * 150;
    const speed = GameConstants.entitySpeed[kind];
    obj.speed = speed;

    obj.baseloc = { x: base.sprite.x, y: base.sprite.y };
    this.sprites.push(obj);

    const cost = GameConstants.entityCost[kind];
    this.score.energy = this.score.energy - cost;


    if (kind === EntityType.Miner) {
      this.miners.add(entity);
    }
    if (kind === EntityType.Loader) {
      this.loaders.add(entity);
    }
    if (kind === EntityType.Attacker) {
      this.attackers.add(entity);
    }
    if (kind === EntityType.Builder) {
      this.builders.add(entity);
    }
    if (kind === EntityType.Defender) {
      this.defenders.add(entity);
    }

    console.log('created entity', entity);
    this.updateScore();
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
    bullet.x = source.x;
    bullet.y = source.y;

    bullet.setActive(true);
    bullet.setVisible(true);

    let angle = 0.0;
    angle = Phaser.Math.Angle.Between(source.x, source.y, target.x, target.y);
    //  console.log('Angle:', angle);

    // Shoot it
    this.physics.velocityFromRotation(angle, this.BULLET_SPEED, bullet.body.velocity);
  }


  public zoom_out(): void {
    this.cameras.main.zoom = this.cameras.main.zoom - 0.1;
  }
  public zoom_in(): void {
    this.cameras.main.zoom = this.cameras.main.zoom + 0.1;
  }


  public create(): void {
    console.log('SCENE Create');
    this.audio_sprite = this.sound.addAudioSprite('blaster');

    // SPACE
    //  World size is 8000 x 6000
    this.bg = this.add.tileSprite(0, 0, GameConstants.worldWidth, GameConstants.worldHeight, 'background').setScrollFactor(0);

    // this.map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
    // const tiles = this.map.addTilesetImage('Desert', 'tiles');
    // const layer = this.map.createDynamicLayer('Ground', tiles, 0, 0);

    // Graphic to show the "source" of the copy operation
    const tilewidth = 16;
    const tileheight = 16;
    this.sourceMarker = this.physics.add.sprite(0, 0, 'cursor');
    // this.sourceMarker = this.physics.add.graphics({ lineStyle: { width: 5, color: 0xffffff, alpha: 1 } });
    // this.sourceMarker.strokeRect(0, 0, 1 * this.map.tileWidth, 1 * this.map.tileHeight);
    // this.sourceMarker.strokeRect(0, 0, 1 * tilewidth, 1 * tileheight);

    // this.cameras.main.startFollow(this.sourceMarker);

    // // Graphic to show the "destination" of the copy operation
    // this.destinationMarker = this.add.graphics({ lineStyle: { width: 5, color: 0x000000, alpha: 1 } });
    // this.destinationMarker.strokeRect(0, 0, 3 * this.map.tileWidth, 3 * this.map.tileHeight);
    // this.destinationMarker.setPosition(this.map.tileWidth * 5, this.map.tileHeight * 10);

    // this.cameras.main.setBounds(0, 0, 8000, 6000);
    // this.game.world.setBounds(0,0,8000,6000);

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

    const zoomout = this.add.text(16, 160, 'Zoom Out', {
      fontSize: 32,
      padding: { x: 10, y: 5 },
      backgroundColor: '#000000',
      fill: '#ffffff'
    });
    zoomout.setScrollFactor(0);
    zoomout.setInteractive().on('pointerdown', () => this.zoom_out());

    const zoomin = this.add.text(16, 105, 'Zoom In', {
      fontSize: 32,
      padding: { x: 10, y: 5 },
      backgroundColor: '#000000',
      fill: '#ffffff'
    });
    zoomin.setScrollFactor(0);
    zoomin.setInteractive().on('pointerdown', () => this.zoom_in());

    this.physics.world.step(0);

    // stop browser default menu on right click
    // tslint:disable-next-line: typedef,  tslint:disable-next-line: only-arrow-functions
    this.game.canvas.oncontextmenu = function(e) { e.preventDefault(); };

    // create bases
    this.basegroup = this.physics.add.group();

    this.basegroup.add(this.baseManager.addBase(1, { x: 350, y: 180 }, this).sprite);
    this.basegroup.add(this.baseManager.addBase(2, { x: 180, y: 400 }, this).sprite);
    this.basegroup.add(this.baseManager.addBase(3, { x: 1000, y: 1000 }, this).sprite);

    this.miners = this.physics.add.group();
    this.loaders = this.physics.add.group();
    this.attackers = this.physics.add.group();
    this.defenders = this.physics.add.group();
    this.builders = this.physics.add.group();

    const rect = new Phaser.Geom.Rectangle(0, 0, GameConstants.worldWidth, GameConstants.worldHeight);

    //  create chests
    this.chests = this.physics.add.group({ key: 'chest', frameQuantity: 100 });
    Phaser.Actions.RandomRectangle(this.chests.getChildren(), rect);
    this.chests.getChildren().forEach(element => {
      element.displayWidth = GameConstants.entitySize;
      element.displayHeight = GameConstants.entitySize;
    });

    //  create ore
    this.orePool = this.physics.add.group({ key: 'ore', frameQuantity: 100 });
    Phaser.Actions.RandomRectangle(this.orePool.getChildren(), rect);
    this.orePool.getChildren().forEach(element => {
      element.displayWidth = GameConstants.entitySize;
      element.displayHeight = GameConstants.entitySize;
      element.setData('ore_count', 1000);
    });

    //  create energy
    this.energyPool = this.physics.add.group({ key: 'energy', frameQuantity: 100 });
    Phaser.Actions.RandomRectangle(this.energyPool.getChildren(), rect);
    this.energyPool.getChildren().forEach(element => {
      element.displayWidth = GameConstants.entitySize;
      element.displayHeight = GameConstants.entitySize;
      element.setData('energy_count', 1000);
    });


    this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
      console.log('drag', gameObject);
    });

    // enemy wave
    this.enemyWave = this.physics.add.group({ key: 'badguy', frameQuantity: 10 });
    Phaser.Actions.RandomRectangle(this.enemyWave.getChildren(), rect);
    this.enemyWave.getChildren().forEach(element => {
      element.displayWidth = GameConstants.entitySize;
      element.displayHeight = GameConstants.entitySize;
      // todo get closest base;
      this.physics.moveTo(element, 350, 180, 30);
      element.setData('health', 1000);
    });


    // create bullets
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
      function(bullet, enemy): void {
        //  console.log('colision', ball, crate);
        bullet.destroy();
        self.score.score = self.score.score + 10;
        self.updateScore();
        enemy.destroy();
        console.log('colision', self.score);
      });

    this.physics.add.collider(
      this.attackers,
      this.enemyWave,
      function(attacker, enemy): void {
        //  console.log('colision', ball, crate);
        attacker.destroy();
        self.score.score = self.score.score + 10;
        self.updateScore();
        enemy.destroy();
        console.log('colision', self.score);
      });

    this.physics.add.collider(
      this.defenders,
      this.enemyWave,
      function(defender, enemy): void {
        //  console.log('colision', ball, crate);
        defender.destroy();
        self.score.score = self.score.score + 10;
        self.updateScore();
        enemy.destroy();
        this.audio_sprite.play('death');
        console.log('colision', self.score);
      });

    this.physics.add.collider(
      this.miners,
      this.orePool,
      this.miner_ore_collider

    );


    this.physics.add.collider(
      this.loaders,
      this.energyPool,
      function(miner, chest): void {
        console.log('loader energy  collision', miner, chest);
        miner.body.velocity.x = 0;
        miner.body.velocity.y = 0;
        const capacity = miner.getData('capacity');
        miner.setData('energy_payload', capacity);

        self.audio_sprite.play('ping');

        let remaining = chest.getData('energy_count');
        remaining = remaining - capacity;
        if (remaining < 1) {
          chest.destroy();
        } else {
          chest.setData('energy_count', remaining);
          chest.body.velocity.x = 0;
          chest.body.velocity.y = 0;
        }
      });


    this.physics.add.collider(
      this.miners,
      this.basegroup,
      function(miner, chest): void {
        console.log('miner base collision', miner, chest);
        miner.body.velocity.x = 0;
        miner.body.velocity.y = 0;
        // miner.body.velocity.re
        const payload = miner.getData('orepayload');
        if (payload) {
          self.score.resource = self.score.resource + payload;
          self.updateScore();
          miner.setData('orepayload', 0);
        }
        chest.body.velocity.x = 0;
        chest.body.velocity.y = 0;
      });

    this.physics.add.collider(
      this.loaders,
      this.basegroup,
      function(loader, chest): void {
        console.log('loader base collision', loader, chest);
        loader.body.velocity.x = 0;
        loader.body.velocity.y = 0;
        const payload = loader.getData('energy_payload');
        if (payload) {
          self.score.energy = self.score.energy + payload;
          self.updateScore();
          loader.setData('energy_payload', 0);
        }
        chest.body.velocity.x = 0;
        chest.body.velocity.y = 0;
      });

    this.physics.add.collider(
      this.sourceMarker,
      this.basegroup,
      function(cursor: any, base): void {
        console.log('collision cursor/base', cursor, base);
        const coor: Coordinate = { x: cursor.x, y: cursor.y };
        cursor.scene.baseManager.hightlightBase(coor);
      });

    this.physics.add.collider(
      this.sourceMarker,
      this.chests,
      function(cursor, chest): void {
        console.log('collision cursor/chest', cursor, chest);

      });

    // emitters
    this.emitter0 = this.add.particles('spark0').createEmitter({
      x: 400,
      y: 300,
      speed: { min: -100, max: 100 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'SCREEN',
      //  active: false,
      lifespan: 600,
      gravityY: 800,
      on: false
    });

    this.emitter1 = this.add.particles('spark1').createEmitter({
      speed: { min: -800, max: 809 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.3, end: 0 },
      quantity: { min: 2, max: 10 },
      blendMode: 'SCREEN',
      // active: false,
      lifespan: 300,
      gravityY: 100,
      on: false
    });

    this.asteroid = this.physics.add.image(225, 550, 'asteroid').setScale(0.03);
    this.asteroid.x = 100;
    this.asteroid.y = 100;
    this.asteroid.visible = true;


/*     this.add.particles('font').createEmitter({
      alpha: { start: 1, end: 0.25, ease: 'Expo.easeOut' },
      angle: 0,
      blendMode: 'ADD',
      emitZone: { source: codeRain, type: 'edge', quantity: 2000 },
      frame: Phaser.Utils.Array.NumberArray(8, 58),
      frequency: 100,
      lifespan: 6000,
      quantity: 25,
      scale: -0.5,
      tint: 0x0066ff00
  }); */
  var particles = this.add.particles('explosion');

  //  Setting { min: x, max: y } will pick a random value between min and max
  //  Setting { start: x, end: y } will ease between start and end

  particles.createEmitter({
      frame: [ 'smoke-puff', 'cloud', 'smoke-puff' ],
      angle: { min: 240, max: 300 },
      speed: { min: 200, max: 300 },
      quantity: 6,
      lifespan: 2000,
      alpha: { start: 1, end: 0 },
      scale: { start: 1.5, end: 0.5 },
      on: false
  });

  particles.createEmitter({
      frame: 'red',
      angle: { start: 0, end: 360, steps: 32 },
      lifespan: 1000,
      speed: 400,
      quantity: 32,
      scale: { start: 0.3, end: 0 },
      on: false
  });

  particles.createEmitter({
      frame: 'stone',
      angle: { min: 240, max: 300 },
      speed: { min: 400, max: 600 },
      quantity: { min: 2, max: 10 },
      lifespan: 4000,
      alpha: { start: 1, end: 0 },
      scale: { min: 0.05, max: 0.4 },
      rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
      gravityY: 800,
      on: false
  });

  particles.createEmitter({
      frame: 'muzzleflash2',
      lifespan: 200,
      scale: { start: 2, end: 0 },
      rotate: { start: 0, end: 180 },
      on: false
  });

  this.input.on('pointerdown', function (pointer) {

      particles.emitParticleAt(pointer.x, pointer.y);

  });
    // initial score
    this.updateScore();
  }

  public preload(): void {
    console.log('preload method');
    // this.load.image('mario-tiles', 'assets/tilemaps/tiles/super-mario.png');
    // this.load.image('tiles', 'assets/tilemaps/tiles/tmw_desert_spacing.png');
    // this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/desert.json');
    this.load.image('guy', 'assets/sprites/asteroids_ship.png');
    this.load.image('builder', 'assets/sprites/asteroids_ship.png');
    this.load.image('base', 'assets/sprites/blockb.png');
    this.load.image('attacker', 'assets/sprites/xenon2_ship.png');
    this.load.image('defender', 'assets/sprites/bsquadron2.png');
    this.load.image('miner', 'assets/sprites/bsquadron3.png');
    this.load.image('loader', 'assets/sprites/blue_ball.png');
    this.load.image('base-highlight', 'assets/sprites/blockBNM.png');
    this.load.image('chest', 'assets/sprites/carrot.png');
    this.load.image('bullet', 'assets/sprites/bullets/bullet7.png');
    this.load.image('badguy', 'assets/sprites/ship.png');

    this.load.image('cursor', 'assets/sprites/asteroids_ship.png');

    // space
    this.load.image('background', 'assets/space/nebula.jpg');
    this.load.image('stars', 'assets/space/stars.png');
    // this.load.atlas('space', 'assets/space/space.png', 'assets/space/space.json');

    this.load.image('ore', 'assets/space/blue-planet.png');
    this.load.image('energy', 'assets/space/green-orb.png');

    // particles
    this.load.image('spark0', 'assets/particles/blue.png');
    this.load.image('spark1', 'assets/particles/red.png');

    this.load.image('astroid1', 'assets/space/asteroid1.png');


    console.log('done preload method');
    // plugin example
    // const url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexpinchplugin.min.js';
    // this.load.plugin('rexpinchplugin', url, true);


    //  this.load.audio('blaster','assets/SoundEffects/fx_mixdown.json');
    this.load.audioSprite('blaster', 'assets/SoundEffects/fx_mixdown.json', [
      'assets/SoundEffects/fx_mixdown.ogg',
      'assets/SoundEffects/fx_mixdown.mp3'
    ]);
    this.load.spritesheet('font', 'assets/fonts/retro/knighthawks-font-filled.png', { frameWidth: 32, frameHeight: 25 });
    this.load.atlas('explosion', 'assets/particles/explosion.png', 'assets/particles/explosion.json');


  }

  public update(time, delta): void {

    this.updateFrame();

    this.controls.update(delta);

    const worldPoint: any = this.input.activePointer.positionToCamera(this.cameras.main);

    // const sourceTileX = this.map.worldToTileX(worldPoint.x);
    // const sourceTileY = this.map.worldToTileY(worldPoint.y);
    // let destinationTileX = this.map.worldToTileX(this.destinationMarker.x);
    // let destinationTileY = this.map.worldToTileY(this.destinationMarker.y);

    // Snap to tile coordinates, but in world space
    this.sourceMarker.x = worldPoint.x;
    this.sourceMarker.y = worldPoint.y;

    // button down
    if (this.input.manager.activePointer.isDown) {
      if (worldPoint.y > 0) {
        console.log('click on', worldPoint.x, worldPoint.y);

        this.setCurrentCoordinate({ x: worldPoint.x, y: worldPoint.y });
        if (this.baseManager.hightlightBase({ x: worldPoint.x, y: worldPoint.y })) {
          //
          // todo test
          this.audio_sprite.play('escape');
          const closeTarget: any = this.physics.closest(this.baseManager.getCurrentBase().sprite, this.enemyWave.getChildren());
          if (closeTarget) {
            this.shootBullet(this.baseManager.getCurrentBase().sprite, closeTarget);

            this.emitter0.setPosition(worldPoint.x, worldPoint.y);
            this.emitter0.explode(); // (worldPoint.x, worldPoint.y);
          }
        } else {

          this.emitter1.setPosition(worldPoint.x, worldPoint.y);
          this.emitter1.emitParticleAt(worldPoint.x, worldPoint.y);

        }
      }

    }

    for (let i = 0; i < this.sprites.length; i++) {
      const value = this.sprites[i];
      if (this.sprites[i].sprite.active) {
        this.sprites[i] = EntityBehaviors.updateEntity(value, this);
      }
    }

  }


  public miner_ore_collider(miner: any, chest): void {
    const capacity = miner.getData('capacity');
    console.log('miner ore collision', miner, chest, capacity);
    miner.body.velocity.x = 0;
    miner.body.velocity.y = 0;

    miner.setData('orepayload', capacity);

    miner.scene.emitter0.killAll();
    miner.scene.emitter0.setPosition(miner.body.x, miner.body.y);
    miner.scene.emitter0.explode();



    let remaining = chest.getData('ore_count');
    remaining = remaining - capacity;
    if (remaining < 1) {
      chest.destroy();
    } else {
      chest.setData('ore_count', remaining);
      chest.body.velocity.x = 0;
      chest.body.velocity.y = 0;
    }
  }
}


