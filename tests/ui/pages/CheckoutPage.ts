import { type Page, type Locator, expect } from "@playwright/test";

export class CheckoutPage {
  private readonly pageTitle: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly summaryItems: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;

  constructor(private readonly page: Page) {
    this.pageTitle = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.summaryItems = page.locator('[data-test="inventory-item"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
  }

  async expectStepOneVisible(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText("Checkout: Your Information");
  }

  async fillShippingDetails(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async expectOverviewVisible(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText("Checkout: Overview");
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.summaryItems).toHaveCount(count);
  }

  async expectTotalVisible(): Promise<void> {
    await expect(this.totalLabel).toBeVisible();
    await expect(this.totalLabel).not.toHaveText("");
  }

  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

  async expectOrderComplete(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageTitle).toHaveText("Checkout: Complete!");
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeHeader).toHaveText("Thank you for your order!");
    await expect(this.completeText).toBeVisible();
  }
}
