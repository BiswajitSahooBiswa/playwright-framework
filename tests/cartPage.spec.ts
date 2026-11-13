import { test, expect } from "@playwright/test"
import { BASE_URL, USERNAME, PASSWORD } from "../utils/envConfig"
import { ProductPage } from "../pages/ProductPage"
import { LoginPage } from "../pages/LoginPage"
import { LoginLocators } from "../locators/LoginLocators"
import { productPageLocators } from "../locators/ProductPagesLocators"
import { productsToCart } from "../test_data/products"
import { CartPage } from "../pages/CartPage"

test.describe("Cart Page Validation", () => {
    let loginPage: LoginPage
    let productPage: ProductPage
    let cartPage: CartPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);

        await page.goto(BASE_URL)
        await loginPage.login(USERNAME, PASSWORD)
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
    })
    test("Validate Cart Page URL and UI Elements", async ({ page }) => {
        await productPage.addFirstProductToCart()
        await productPage.clickOnCartlink()
        await expect(page).toHaveURL("https://www.saucedemo.com/cart.html")
        const UI = cartPage.getCartPageElements()
        await expect((await UI).cartTitle).toBeVisible()
        expect((await UI).shoppingCart).toBeVisible()
        expect((await UI).checkout).toBeVisible()
    })
    test("Validate Continue Shopping Functionality", async ({ page }) => {
        await productPage.addFirstProductToCart()
        await productPage.clickOnCartlink()
        await cartPage.clickOnContinueShopping()
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html")
    })
    test("Validate First Product to the Cart Page", async ({ page }) => {
        const firstPtoduct = await productPage.getFirstProductDetails()
        await productPage.addFirstProductToCart()
        await productPage.clickOnCartlink()
        await page.waitForTimeout(3000)
        const cartProducts = await cartPage.getCartProducts()
        expect(cartProducts.length).toBeGreaterThan(0);
        expect(cartProducts[0]).toEqual(firstPtoduct)
    })
    test("Validate All Products to the Cart Page", async ({ page }) => {
        const allProductsDetails = await productPage.getAllProductDetails()
        await productPage.addAllProductToCart()
        await productPage.clickOnCartlink()
        const cartProducts = await cartPage.getCartProducts()
        expect(cartProducts).toEqual(allProductsDetails)        
    })
    test("Validate Specific Products to the Cart Page", async ({ page }) => {
        const getSpecificProductDetails = await productPage.getSpecificProductDetails(productsToCart)
        await productPage.addSpecificProductsToCart(productsToCart)
        await productPage.clickOnCartlink()
        const cartProducts = await cartPage.getCartProducts()
        expect(cartProducts).toEqual(getSpecificProductDetails)
    })
    test.only("Validate Remove Product Functionality", async ({ page }) => {
        await productPage.addAllProductToCart()
        await productPage.clickOnCartlink()
        const initialProducts = await cartPage.getCartProducts()
        expect(initialProducts.length).toBeGreaterThan(0)
        await cartPage.removeFirstProduct()

        const updetedCartProducts = await cartPage.getCartProducts()
        expect(updetedCartProducts.length).toBe(initialProducts.length-1)
    })
})