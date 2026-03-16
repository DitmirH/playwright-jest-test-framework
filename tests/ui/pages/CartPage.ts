import { type Page, type Locator, expect } from "@playwright/test";

export class CartPage {
  private readonly pageTitle: Locator;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async expectCartPageVisible(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText("Your Cart");
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectItemInCart(productName: string): Promise<void> {
    const itemName = this.page.locator('[data-test="inventory-item-name"]', {
      hasText: productName,
    });
    await expect(itemName).toBeVisible();
  }

  async expectAllItemsInCart(productNames: string[]): Promise<void> {
    for (const name of productNames) {
      await this.expectItemInCart(name);
    }
  }
}
