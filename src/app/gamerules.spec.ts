import { EntityType } from './gameTypes';
import { applyDamage, canAfford, nearestPoint } from './gamerules';

describe('canAfford', () => {
  it('gates each unit on GameConstants.entityCost', () => {
    expect(canAfford(5, EntityType.Loader)).toBe(true);
    expect(canAfford(4, EntityType.Loader)).toBe(false);
    expect(canAfford(15, EntityType.Defender)).toBe(true);
    expect(canAfford(14, EntityType.Defender)).toBe(false);
    expect(canAfford(20, EntityType.Miner)).toBe(true);
    expect(canAfford(19, EntityType.Miner)).toBe(false);
    expect(canAfford(10, EntityType.Attacker)).toBe(true);
    expect(canAfford(9, EntityType.Attacker)).toBe(false);
  });

  it('refuses a builder at any energy because nothing defines what it builds', () => {
    expect(canAfford(999, EntityType.Builder)).toBe(false);
  });
});

describe('applyDamage', () => {
  it('subtracts attack from health and destroys only at zero or below', () => {
    expect(applyDamage(30, 10)).toEqual({ health: 20, destroyed: false });
    expect(applyDamage(10, 10)).toEqual({ health: 0, destroyed: true });
    expect(applyDamage(5, 15)).toEqual({ health: -10, destroyed: true });
  });
});

describe('nearestPoint', () => {
  const bases = [
    { x: 350, y: 180 },
    { x: 180, y: 400 },
    { x: 1000, y: 1000 }
  ];

  it('picks the closest base rather than a hardcoded point', () => {
    expect(nearestPoint({ x: 200, y: 390 }, bases)).toEqual({ x: 180, y: 400 });
    expect(nearestPoint({ x: 340, y: 190 }, bases)).toEqual({ x: 350, y: 180 });
    expect(nearestPoint({ x: 900, y: 900 }, bases)).toEqual({ x: 1000, y: 1000 });
  });
});
