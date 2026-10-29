import { expect, test } from '@playwright/test';

test('homepage loads and a new game starts the Phaser canvas', async ({ page }) => {
  await page.goto('/');

  const newGame = page.getByRole('button', { name: 'New Game' });
  await expect(newGame).toBeVisible();
  await newGame.click();

  await expect(page.locator('h1.title')).toHaveText('RobotWars');
  await expect(page.locator('phaser-component canvas')).toBeVisible();
});
