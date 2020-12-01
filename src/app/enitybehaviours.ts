import { EntityClass, EntityType } from './gameTypes';
import Phaser from 'phaser';
import { GameboardService } from './gameboard.service';

export class EntityBehaviors {


    public static updateEntity(value: EntityClass, gs: GameboardService): EntityClass {
        if (value.entityKind === EntityType.Defender) {
            // orbit
            value.sprite.setPosition(value.baseloc.x, value.baseloc.y);
            Phaser.Math.RotateAroundDistance(value.sprite, value.sprite.x, value.sprite.y, value.angle, value.distance);
            value.angle = value.angle + 0.01;
            if (value.angle > 360.0) {
                value.angle = value.angle - 360.0;
            }
            value.sprite.angle = value.angle;
        } else if (value.entityKind === EntityType.Miner) {
            const closest: any = gs.physics.closest(value.sprite/* , gs.chests.getChildren() */);
            // const closest = gs.chests;
            if (closest) {
                // console.log('closest', closest.world.x, closest.world.y);
                const x = 400; // closest.world.x,
                const y = 400; // closest.world.y,
                gs.physics.accelerateTo(value.sprite, x, y, 10, 300, 300);
            }
        }
        return value;
    }
}
