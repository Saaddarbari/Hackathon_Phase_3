import { test, expect } from '@playwright/test';

test.describe('User Signin', () => {
  test('should allow existing user to sign in', async ({ page }) => {
    // Navigate to the frontend application
    await page.goto('http://localhost:3003');
    
    // Look for a signin link/button and click it
    const signinSelectors = [
      page.getByRole('button', { name: 'Sign In' }),
      page.getByRole('link', { name: 'Sign In' }),
      page.getByRole('button', { name: 'Login' }),
      page.getByRole('link', { name: 'Login' }),
      page.locator('text=Sign In'),
      page.locator('text=Login')
    ];
    
    let signinElementFound = false;
    for (const selector of signinSelectors) {
      if (await selector.count() > 0) {
        await selector.click();
        signinElementFound = true;
        break;
      }
    }
    
    // If no signin element found on homepage, try navigating directly
    if (!signinElementFound) {
      await page.goto('http://localhost:3003/signin');
    }
    
    // Wait for the signin form to load
    await page.waitForLoadState('networkidle');
    
    // Fill in the signin form
    const emailSelectors = ['input[name="email"]', 'input[placeholder*="Email" i]', 'input[type="email"]', 'input[name="username"]'];
    const passwordSelectors = ['input[name="password"]', 'input[placeholder*="Password" i]', 'input[type="password"]'];
    
    // Fill email field
    for (const selector of emailSelectors) {
      if (await page.locator(selector).count() > 0) {
        await page.locator(selector).fill('testuser@example.com'); // Use the email from signup
        break;
      }
    }
    
    // Fill password field
    for (const selector of passwordSelectors) {
      if (await page.locator(selector).count() > 0) {
        await page.locator(selector).fill('password123');
        break;
      }
    }
    
    // Submit the form
    const submitSelectors = [
      page.getByRole('button', { name: 'Sign In' }),
      page.getByRole('button', { name: 'Login' }),
      page.getByRole('button', { name: 'Submit' }),
      page.locator('button[type="submit"]')
    ];
    
    for (const selector of submitSelectors) {
      if (await selector.count() > 0) {
        await selector.click();
        break;
      }
    }
    
    // Wait for navigation after signin
    await page.waitForLoadState('networkidle');
    
    // Expect to be redirected after successful signin
    await expect(page).toHaveURL(/.*dashboard|.*home|.*todos|.*profile/);
  });
});