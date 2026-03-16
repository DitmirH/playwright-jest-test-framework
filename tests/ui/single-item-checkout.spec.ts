import { test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";

test.describe("Single Item Checkout", () => {
  const PRODUCT_NAME = "Sauce Labs Backpack";

  test("should complete checkout with a single item", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await loginPage.navigate();
    await loginPage.login("standard_user", "secret_sauce");

    await productsPage.expectProductsPageVisible();
    await productsPage.addProductToCart(PRODUCT_NAME);
    await productsPage.expectCartBadgeCount(1);

    await productsPage.openCart();
    await cartPage.expectCartPageVisible();
    await cartPage.expectItemCount(1);
    await cartPage.expectItemInCart(PRODUCT_NAME);

    await cartPage.clickCheckout();
    await checkout.expectStepOneVisible();
    await checkout.fillShippingDetails("John", "Doe", "12345");
    await checkout.clickContinue();

    await checkout.expectOverviewVisible();
    await checkout.expectItemCount(1);
    await checkout.expectTotalVisible();

    await checkout.clickFinish();
    await checkout.expectOrderComplete();
  });
});
