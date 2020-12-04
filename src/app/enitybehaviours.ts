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
            const closest: any = gs.physics.closest(value.sprite, gs.chests.getChildren());
            // const closest = gs.chests;
            if (closest) {
                console.log('closest', closest);
                const x = closest.x;
                const y = closest.y;
                gs.physics.accelerateTo(value.sprite, x, y, 10, 300, 300);
            }
        } else if (value.entityKind === EntityType.Attacker) {
            if (value.timer < 600) {
                value.timer = value.timer + 1;
            } else {
                value.timer = 0;
                value.sprite.setVelocity(Phaser.Math.Between(-10, 10), Phaser.Math.Between(-10, 10));
            }
        }
        return value;
    }
}
