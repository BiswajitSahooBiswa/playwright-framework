import { test, expect } from "@playwright/test"
import { BASE_URL, USERNAME, PASSWORD } from "../utils/envConfig"
import { ProductPage } from "../pages/ProductPage"
import { LoginPage } from "../pages/LoginPage"
import { LoginLocators } from "../locators/LoginLocators"
import { productPageLocators } from "../locators/ProductPagesLocators"
import { productsToCart } from "../test_data/products"

test.describe("Product Page Validation", () => {
    let loginPage: LoginPage
    let productPage: ProductPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);

        await page.goto(BASE_URL)
        await loginPage.login(USERNAME, PASSWORD)
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
    })
    test("Validation Logout functionality", async ({ page }) => {
        await productPage.logout()
        await expect(page.locator(LoginLocators.loginBtn)).toBeVisible()
    })
    test("Validation About page and navigate back", async ({ page }) => {
        await productPage.openAboutPage()
        await expect(page.locator(productPageLocators.requestDemoButtton).first()).toBeVisible()
        await expect(page.locator(productPageLocators.tryifFreeeButton).first()).toBeVisible()
        await page.goBack()
        await expect(page.locator(productPageLocators.settingIcons)).toBeVisible()
    })
    test("Validate Product Page", async ({ page }) => {
        await productPage.validateAllProductsDisplayed()
        await productPage.addFirstProductToCart()
        await productPage.addAllProductToCart()
    })
    test("Validate Adding Specific Product To Cart", async ({ page }) => {
        await productPage.addSpecificProductsToCart(productsToCart)
    })
    test('Filter By Name A to Z', async () => {
        await productPage.filterByNameAtoZ()
        const names = await productPage.getTheProductNames()
        console.log("Product names:", names);
        const sorted = [...names].sort()
        expect(names).toEqual(sorted)
    })
    test('Filter By Name Z to A', async () => {
        await productPage.filterByNameZtoA()
        const names = await productPage.getTheProductNames()
        console.log("Product names:", names);
        const sorted = [...names].sort().reverse()
        expect(names).toEqual(sorted)
    })
    test.only('Filter By Price Low to High', async () => {
        await productPage.filterByPriceLowtoHigh()
        const prices = await productPage.getTheProductPrices()
        const sortedPrice = [...prices].sort((a, b) => a - b)
        expect(prices).toEqual(sortedPrice)
    })
    test.only('Filter By Price High to Low', async () => {
        await productPage.filterByPriceHightoLow()
        const prices = await productPage.getTheProductPrices()
        const sortedPrice = [...prices].sort((a, b) => b - a)
        expect(prices).toEqual(sortedPrice)
    })
})