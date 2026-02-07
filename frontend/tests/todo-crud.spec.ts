import { test, expect } from '@playwright/test';

test.describe('Todo CRUD Operations', () => {
  // Sign in before running CRUD tests
  test.beforeEach(async ({ page }) => {
    // Navigate to the signin page
    await page.goto('http://localhost:3003');
    
    // Try to find and click the signin button/link
    const signinSelectors = [
      page.getByRole('button', { name: 'Sign In' }),
      page.getByRole('link', { name: 'Sign In' }),
      page.getByRole('button', { name: 'Login' }),
      page.getByRole('link', { name: 'Login' })
    ];
    
    for (const selector of signinSelectors) {
      if (await selector.count() > 0) {
        await selector.click();
        break;
      }
    }
    
    // Fill in the signin form
    const emailSelectors = ['input[name="email"]', 'input[placeholder*="Email" i]', 'input[type="email"]'];
    const passwordSelectors = ['input[name="password"]', 'input[placeholder*="Password" i]', 'input[type="password"]'];
    
    for (const selector of emailSelectors) {
      if (await page.locator(selector).count() > 0) {
        await page.locator(selector).fill('testuser@example.com');
        break;
      }
    }
    
    for (const selector of passwordSelectors) {
      if (await page.locator(selector).count() > 0) {
        await page.locator(selector).fill('password123');
        break;
      }
    }
    
    // Submit the signin form
    const submitSelectors = [
      page.getByRole('button', { name: 'Sign In' }),
      page.getByRole('button', { name: 'Login' }),
      page.locator('button[type="submit"]')
    ];
    
    for (const selector of submitSelectors) {
      if (await selector.count() > 0) {
        await selector.click();
        break;
      }
    }
    
    // Wait for navigation to the main page after signin
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*dashboard|.*home|.*todos/);
  });

  test('should create a new todo', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Find and fill the todo input field
    const todoInputSelectors = [
      'input[placeholder*="todo" i]',
      'input[placeholder*="task" i]',
      'input[placeholder*="add" i]',
      '#todo-input',
      '#task-input',
      '[data-testid="todo-input"]'
    ];
    
    let inputFound = false;
    for (const selector of todoInputSelectors) {
      if (await page.locator(selector).count() > 0) {
        await page.locator(selector).fill('Test todo item');
        inputFound = true;
        break;
      }
    }
    
    if (!inputFound) {
      // If no specific input found, try a general approach
      await page.locator('input').first().fill('Test todo item');
    }
    
    // Find and click the add button
    const addButtonSelectors = [
      page.getByRole('button', { name: 'Add' }),
      page.getByRole('button', { name: 'Create' }),
      page.getByRole('button', { name: '+' }),
      page.locator('button', { hasText: 'Add' }),
      page.locator('button', { hasText: 'Create' })
    ];
    
    for (const selector of addButtonSelectors) {
      if (await selector.count() > 0) {
        await selector.click();
        break;
      }
    }
    
    // Wait for the todo to be added
    await page.waitForLoadState('networkidle');
    
    // Verify the todo appears in the list
    await expect(page.locator('text="Test todo item"')).toBeVisible();
  });

  test('should mark a todo as completed', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Find a todo item to mark as completed
    const todoItem = page.locator('.todo-item, .task-item').first();
    
    if (await todoItem.count() > 0) {
      // Find the checkbox or toggle for the todo
      const checkbox = todoItem.locator('input[type="checkbox"], .toggle-complete').first();
      
      if (await checkbox.count() > 0) {
        await checkbox.click();
        
        // Wait for the state to update
        await page.waitForLoadState('networkidle');
        
        // Verify the todo is marked as completed
        await expect(checkbox).toBeChecked();
      }
    }
  });

  test('should delete a todo', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Get initial count of todos
    const initialTodoCount = await page.locator('.todo-item, .task-item').count();
    
    if (initialTodoCount > 0) {
      // Find the delete button for the first todo
      const deleteButtonSelectors = [
        page.locator('.delete-btn, .remove-btn, .todo-delete').first(),
        page.locator('button', { hasText: 'Delete' }).first(),
        page.locator('button', { hasText: 'Remove' }).first(),
        page.locator('i', { hasText: '×' }).first(),
        page.locator('svg').first()
      ];
      
      for (const selector of deleteButtonSelectors) {
        if (await selector.count() > 0) {
          await selector.click();
          break;
        }
      }
      
      // Wait for the todo to be deleted
      await page.waitForLoadState('networkidle');
      
      // Verify the todo count has decreased
      const finalTodoCount = await page.locator('.todo-item, .task-item').count();
      expect(finalTodoCount).toBeLessThan(initialTodoCount);
    }
  });
});