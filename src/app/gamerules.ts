import { GameConstants } from './gameconstants';
import { Coordinate, EntityType } from './gameTypes';

/** Enemies are not in the entity tables, so they use this fixed attack. */
export const ENEMY_ATTACK = 10;

/** Base shots use the same 10 already awarded as score for a hit. */
export const BULLET_DAMAGE = 10;

/**
 * Builder has no construction rule in the scene, so it can never be spawned.
 * Every other unit is gated by GameConstants.entityCost.
 */
export function canAfford(energy: number, kind: string): boolean {
  if (kind === EntityType.Builder) {
    return false;
  }
  const cost = GameConstants.entityCost[kind];
  return typeof cost === 'number' && energy >= cost;
}

export function applyDamage(health: number, attack: number): { health: number; destroyed: boolean } {
  const next = health - attack;
  return { health: next, destroyed: next <= 0 };
}

export function nearestPoint(from: Coordinate, points: Coordinate[]): Coordinate | null {
  if (!points.length) {
    return null;
  }
  let best = points[0];
  let bestDistance = distanceSquared(from, best);
  for (let i = 1; i < points.length; i++) {
    const candidate = points[i];
    const dist = distanceSquared(from, candidate);
    if (dist < bestDistance) {
      best = candidate;
      bestDistance = dist;
    }
  }
  return best;
}

function distanceSquared(a: Coordinate, b: Coordinate): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}
