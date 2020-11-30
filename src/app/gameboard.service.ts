import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GameboardService extends Phaser.Scene {

  robotCount: number;
  currentLoc: Coordinate;
  frameCount: number;

  private controls: any;
  private sourceMarker: any;
  private destinationMarker: any;
  private map: any;

  constructor() {
    super({ key: 'Scene' });
    this.currentLoc = { x: 0, y: 10 };
    this.robotCount = 0;
    this.frameCount = 0;
  }


  public newResource(kind: EntityType): void {

    this.robotCount++;

    const sourceTileX = this.map.tileToWorldX(this.currentLoc.x);
    const sourceTileY = this.map.tileToWorldY(this.currentLoc.y);
    console.log('addNewResource', kind, sourceTileX, sourceTileY);
    console.log('take2', this.currentLoc.x, this.currentLoc.y);
    const entity = this.add.sprite(sourceTileX, sourceTileY, 'guy');
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

    const help = this.add.text(16, 16, 'Left-click to copy the tiles in the\nwhite rectangle to the black rectangle.', {
      fontSize: '18px',
      padding: { x: 10, y: 5 },
      backgroundColor: '#000000',
      fill: '#ffffff'
    });
    help.setScrollFactor(0);
  }


  public preload(): void {
    console.log('preload method');
    // this.load.image('mario-tiles', 'assets/tilemaps/tiles/super-mario.png');
    this.load.image('tiles', 'assets/tilemaps/tiles/tmw_desert_spacing.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/desert.json');
    this.load.image('guy', 'assets/sprites/brain.png');
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

    if (this.input.manager.activePointer.isDown) {
      if (this.sourceMarker.y > 0) {
        console.log('click on', sourceTileX, sourceTileY);

        this.setCurrentCoordinate({ x: sourceTileX, y: sourceTileY });
      }

      // Copy a 6 x 6 area at (sourceTileX, sourceTileY) to (destinationTileX, destinationTileY)
      // this.map.copy(sourceTileX, sourceTileY, 6, 6, destinationTileX, destinationTileY);
    }

  }
}

export class Coordinate {
  x: number;
  y: number;
}
export enum EntityType {
  Loader, Miner, Attacker, Defender, Builder
}
