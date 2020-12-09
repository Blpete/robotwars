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
    defender: 10
  };

}
