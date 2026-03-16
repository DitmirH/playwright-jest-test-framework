import { test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";

test.describe("Login and Logout", () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    await loginPage.navigate();
  });

  test("should login successfully with valid credentials", async () => {
    await loginPage.expectLoginPageVisible();
    await loginPage.login("standard_user", "secret_sauce");
    await loginPage.expectLoginPageNotVisible();
    await productsPage.expectInventoryUrl();
    await productsPage.expectProductsPageVisible();
  });

  test("should logout successfully after login", async () => {
    await loginPage.login("standard_user", "secret_sauce");
    await loginPage.expectLoginPageNotVisible();
    await productsPage.expectInventoryUrl();
    await productsPage.expectProductsPageVisible();
    await productsPage.logout();
    await loginPage.expectLoginPageVisible();
  });

  test("should show error for locked out user", async () => {
    await loginPage.login("locked_out_user", "secret_sauce");
    await loginPage.expectErrorMessage(
      "Sorry, this user has been locked out"
    );
  });
});
