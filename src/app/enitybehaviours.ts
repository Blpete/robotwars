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
            // if (value.angle > 360.0) {
            //     value.angle = value.angle - 360.0;
            // }
            value.sprite.rotation = value.angle + Math.PI / 2.0;
        } else if (value.entityKind === EntityType.Miner) {
            let angle = 0.0;
            const payload = value.sprite.getData('orepayload');
            if (payload) {
                //  console.log('miner to base');
                const x = value.baseloc.x;
                const y = value.baseloc.y;
                angle = Phaser.Math.Angle.Between(value.sprite.x, value.sprite.y, x, y);
                gs.physics.accelerateTo(value.sprite, x, y, 10, 30, 30);
            } else {
                //   console.log('miner to ore');
                const closest: any = gs.physics.closest(value.sprite, gs.orePool.getChildren());
                if (closest) {
                    // console.log('closest', closest);
                    const x = closest.x;
                    const y = closest.y;
                    angle = Phaser.Math.Angle.Between(value.sprite.x, value.sprite.y, x, y);
                    gs.physics.accelerateTo(value.sprite, x, y, 10, 30, 30);
                } else {
                    // todo what now
                    // no resources /  go back to base
                    const x = value.baseloc.x;
                    const y = value.baseloc.y;
                    angle = Phaser.Math.Angle.Between(value.sprite.x, value.sprite.y, x, y);
                    gs.physics.accelerateTo(value.sprite, x, y, 10, 30, 30);
                }
            }
            value.sprite.rotation = angle + Math.PI / 2.0;
        } else if (value.entityKind === EntityType.Loader) {

            const payload = value.sprite.getData('energy_payload');
            if (payload) {
                const x = value.baseloc.x;
                const y = value.baseloc.y;
                gs.physics.accelerateTo(value.sprite, x, y, 10, 30, 30);
            } else {
                //   console.log('miner to ore');
                const closest: any = gs.physics.closest(value.sprite, gs.energyPool.getChildren());
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
            let angle = 0;
            const closest: any = gs.physics.closest(value.sprite, gs.enemyWave.getChildren());
            if (closest) {
                const distance = Phaser.Math.Distance.Between(value.sprite.x, value.sprite.y, closest.x, closest.y);
                if (distance < 300) {
                    // todo set angle
                    angle = Phaser.Math.Angle.Between(value.sprite.x, value.sprite.y, closest.x, closest.y);
                    gs.physics.accelerateTo(value.sprite, closest.x, closest.y, 10, 30, 30);
                    value.sprite.rotation = angle + Math.PI / 2.0;
                }
            }

            if (value.timer < 600) {
                value.timer = value.timer + 1;
            } else {
                value.timer = 0;
                angle = Phaser.Math.Between(-Math.PI, Math.PI);
                gs.physics.velocityFromRotation(angle, 10, value.sprite.body.velocity);
                value.sprite.rotation = angle + Math.PI / 2.0;
            }
        }
        return value;
    }
}
