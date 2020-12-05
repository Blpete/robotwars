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

            const payload = value.sprite.getData('orepayload');
            if (payload) {
                //  console.log('miner to base');
                const x = value.baseloc.x;
                const y = value.baseloc.y;
                gs.physics.accelerateTo(value.sprite, x, y, 10, 30, 30);
            } else {
                //   console.log('miner to ore');
                const closest: any = gs.physics.closest(value.sprite, gs.orePool.getChildren());
                if (closest) {
                    // console.log('closest', closest);
                    const x = closest.x;
                    const y = closest.y;
                    gs.physics.accelerateTo(value.sprite, x, y, 10, 30, 30);
                } else {
                    // todo what now
                    // no resources /  go back to base
                    const x = value.baseloc.x;
                    const y = value.baseloc.y;
                    gs.physics.accelerateTo(value.sprite, x, y, 10, 30, 30);
                }
            }
        } else if (value.entityKind === EntityType.Attacker) {
            const closest: any = gs.physics.closest(value.sprite, gs.enemyWave.getChildren());
            if (closest) {
                const distance = Phaser.Math.Distance.Between(value.sprite.x, value.sprite.y, closest.x, closest.y);
                if (distance < 300) {
                    gs.physics.accelerateTo(value.sprite, closest.x, closest.y, 10, 30, 30);
                }
            }

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
