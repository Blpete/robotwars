import Phaser from 'phaser';
import { EntityBehaviors } from './enitybehaviours';

export class Coordinate {
    x: number;
    y: number;
}

export enum EntityType {
    Loader = 'loader', Miner = 'miner', Attacker = 'attacker', Defender = 'defender', Builder = 'builder'
}

export class EntityClass {
    sprite: any;
    entityKind: EntityType;
    angle: number;
    distance: number;
    baseloc: Coordinate;
    health: number;
    base: number;
    status: string;
    behaviour: string;
    level: number;
    timer: number = 0;
    speed: number = 30;
}

export class Base {
    entityCounts: number[];
    health: number;
    status: string;
    location: Coordinate;
    entities: EntityClass[];
    sprite: any;
}

export class Score {
    score: number = 0;
    resource: number = 0;
    energy: number = 50;
    robotCount: number = 0;
}

export class entityLookup {
//

}


