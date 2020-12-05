import { constants } from 'buffer';

import { GameboardService } from './gameboard.service';
import { GameConstants } from './gameconstants';
import { Base, Coordinate } from './gameTypes';

export class BaseManager {


    public bases: Base[] = [];
    // tslint:disable-next-line: no-inferrable-types
    public currentbase: number = 0;

    public getCurrentBase(): Base {
        return this.bases[this.currentbase];
    }


    public addBase(id: number, loc: Coordinate, gs: GameboardService): Base {
        console.log('addBase', id, loc);
        //  bases
        const base: Base = new Base();
        base.location = loc;
        const sourceTileX = loc.x; // gs.map.tileToWorldX(loc.x);
        const sourceTileY = loc.y; // gs.map.tileToWorldY(loc.y);
        console.log('add base');
        const entity = gs.physics.add.sprite(sourceTileX, sourceTileY, 'base');
        entity.displayWidth = GameConstants.entitySize;
        entity.displayHeight = GameConstants.entitySize;

        entity.setBounce(0, 0);
        base.sprite = entity;
        base.entities = [];
        this.bases.push(base);
        return base;
    }

    public hightlightBase(loc: Coordinate): boolean {
        // console.log('highlightbase', loc);
        // dehighlight all
        let ishighlight: boolean = false;
        for (let i = 0; i < this.bases.length; i++) {
            this.bases[i].sprite.setTexture('base');

            if (Phaser.Math.Distance.Between(this.bases[i].location.x, this.bases[i].location.y, loc.x, loc.y) < 10) {
                this.currentbase = i;
                this.bases[i].sprite.setTexture('base-highlight');
                ishighlight = true;
            }
        }
        return ishighlight;
    }
}
