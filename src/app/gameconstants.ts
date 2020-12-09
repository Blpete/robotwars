import { EntityType } from './gameTypes';
export class GameConstants {
  //  public static  width = 800;
  //  public static  height = 600;

  public static worldWidth = 8000;
  public static worldHeight = 6000;

  public static entitySize = 32;

  public static entityCost: { [key: string]: number } = {
    loader: 5,
    attacker: 10,
    miner: 20,
    builder: 20,
    defender: 15
  };

  public static spriteImage: { [key: string]: string } = {
    loader: 'assets/sprites/blue_ball.png',
    attacker: 'assets/sprites/xenon2_ship.png',
    miner: 'assets/sprites/bsquadron3.png',
    builder: 'assets/sprites/asteroids_ship.png',
    defender: 'assets/sprites/bsquadron2.png'
  };

}
