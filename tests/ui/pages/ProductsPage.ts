import { type Page, type Locator, expect } from "@playwright/test";

export class ProductsPage {
  private readonly pageTitle: Locator;
  private readonly burgerMenuButton: Locator;
  private readonly logoutLink: Locator;
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly inventoryItems: Locator;

  constructor(private readonly page: Page) {
    this.pageTitle = page.locator('[data-test="title"]');
    this.burgerMenuButton = page.locator("#react-burger-menu-btn");
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
  }

  async addProductToCart(productName: string): Promise<void> {
    const itemCard = this.inventoryItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', {
        hasText: productName,
      }),
    });
    await itemCard.locator("button", { hasText: "Add to cart" }).click();
  }

  async addMultipleProductsToCart(productNames: string[]): Promise<void> {
    for (const name of productNames) {
      await this.addProductToCart(name);
    }
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async logout(): Promise<void> {
    await this.burgerMenuButton.click();
    await this.logoutLink.waitFor({ state: "visible" });
    await this.logoutLink.click();
  }

  async expectProductsPageVisible(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText("Products");
  }

  async expectInventoryUrl(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
  }

  async expectCartBadgeCount(count: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async getAllProductNames(): Promise<string[]> {
    const names = await this.page
      .locator('[data-test="inventory-item-name"]')
      .allTextContents();
    return names;
  }
}
