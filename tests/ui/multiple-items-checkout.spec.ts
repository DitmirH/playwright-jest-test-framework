import { test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";

test.describe("Multiple Items Checkout", () => {
  const PRODUCTS = [
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
    "Sauce Labs Bolt T-Shirt",
  ];

  test("should complete checkout with multiple items", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");

    await productsPage.expectProductsPageVisible();
    await productsPage.addMultipleProductsToCart(PRODUCTS);
    await productsPage.expectCartBadgeCount(PRODUCTS.length);

    await productsPage.openCart();
    await cartPage.expectCartPageVisible();
    await cartPage.expectItemCount(PRODUCTS.length);
    await cartPage.expectAllItemsInCart(PRODUCTS);

    await cartPage.clickCheckout();
    await checkout.expectStepOneVisible();
    await checkout.fillShippingDetails("Jane", "Smith", "67890");
    await checkout.clickContinue();

    await checkout.expectOverviewVisible();
    await checkout.expectItemCount(PRODUCTS.length);
    await checkout.expectTotalVisible();

    await checkout.clickFinish();
    await checkout.expectOrderComplete();
  });
});
