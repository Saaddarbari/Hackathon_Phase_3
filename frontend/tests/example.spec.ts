import { test, expect } from '@playwright/test';

test.describe('User Signup', () => {
  test('should allow new user to sign up', async ({ page }) => {
    // Navigate to the frontend application
    await page.goto('http://localhost:3003');
    
    // Look for a signup link/button and click it
    // Try multiple possible selectors for signup button/link
    const signupSelectors = [
      page.getByRole('button', { name: 'Sign Up' }),
      page.getByRole('link', { name: 'Sign Up' }),
      page.getByRole('button', { name: 'Register' }),
      page.getByRole('link', { name: 'Register' }),
      page.locator('text=Sign Up'),
      page.locator('text=Register')
    ];
    
    let signupElementFound = false;
    for (const selector of signupSelectors) {
      if (await selector.count() > 0) {
        await selector.click();
        signupElementFound = true;
        break;
      }
    }
    
    // If no signup element found on homepage, try navigating directly
    if (!signupElementFound) {
      await page.goto('http://localhost:3003/signup');
    }
    
    // Wait for the signup form to load
    await page.waitForLoadState('networkidle');
    
    // Fill in the signup form - try different possible selectors
    const nameSelectors = ['input[name="name"]', 'input[name="username"]', 'input[placeholder*="Name" i]', 'input[placeholder*="Full Name" i]'];
    const emailSelectors = ['input[name="email"]', 'input[placeholder*="Email" i]', 'input[type="email"]'];
    const passwordSelectors = ['input[name="password"]', 'input[placeholder*="Password" i]', 'input[type="password"]'];
    
    // Fill name field
    for (const selector of nameSelectors) {
      if (await page.locator(selector).count() > 0) {
        await page.locator(selector).fill('Test User');
        break;
      }
    }
    
    // Fill email field
    for (const selector of emailSelectors) {
      if (await page.locator(selector).count() > 0) {
        await page.locator(selector).fill('testuser@example.com');
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
    
    // Submit the form - try different possible selectors
    const submitSelectors = [
      page.getByRole('button', { name: 'Sign Up' }),
      page.getByRole('button', { name: 'Register' }),
      page.getByRole('button', { name: 'Submit' }),
      page.locator('button[type="submit"]'),
      page.locator('text=Sign Up'),
      page.locator('text=Register')
    ];
    
    for (const selector of submitSelectors) {
      if (await selector.count() > 0) {
        await selector.click();
        break;
      }
    }
    
    // Wait for navigation after signup
    await page.waitForLoadState('networkidle');
    
    // Expect to be redirected after successful signup
    await expect(page).toHaveURL(/.*dashboard|.*home|.*todos|.*profile/);
  });
});