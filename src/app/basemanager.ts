import { constants } from 'buffer';
import { basename } from 'path';
import { GameboardService } from './gameboard.service';
import { Base, Coordinate } from './gameTypes';

export class BaseManager {

    public bases: Base[] = [];
    // tslint:disable-next-line: no-inferrable-types
    public currentbase: number = -1;

    public addBase(id: number, loc: Coordinate, gs: GameboardService): void {
        console.log('addBase', id, loc);
        //  bases
        const base: Base = new Base();
        base.location = loc;
        const sourceTileX = gs.map.tileToWorldX(loc.x);
        const sourceTileY = gs.map.tileToWorldY(loc.y);
        console.log('add base');
        const entity = gs.add.sprite(sourceTileX, sourceTileY, 'base');
        base.sprite = entity;
        base.entities = [];
        this.bases.push(base);
    }

    public hightlightBase(loc: Coordinate): void {
        //console.log('highlightbase', loc);
        // dehighlight all
        for (let i = 0; i < this.bases.length; i++) {
            this.bases[i].sprite.setTexture('base');

            if ((this.bases[i].location.x === loc.x) && (this.bases[i].location.y === loc.y)) {
                this.currentbase = i;
                this.bases[i].sprite.setTexture('base-highlight');
            }
        }
    }
}
