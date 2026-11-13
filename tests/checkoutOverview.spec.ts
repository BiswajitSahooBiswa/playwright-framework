import { test, expect } from "@playwright/test"
import { BASE_URL, USERNAME, PASSWORD } from "../utils/envConfig"
import { ProductPage } from "../pages/ProductPage"
import { LoginPage } from "../pages/LoginPage"
import { LoginLocators } from "../locators/LoginLocators"
import { CartPage } from "../pages/CartPage"
import { CheckoutPage } from "../pages/CheckOutPage"
import { checkoutData } from "../test_data/checkoutData"
import { productsToCart } from "../test_data/products"
import { CheckoutOverview } from "../pages/CheckoutOverviewPage"

test.describe("Checkout Overview Validation", () => {
    let loginPage: LoginPage
    let productPage: ProductPage
    let cartPage: CartPage
    let checkoutPage: CheckoutPage
    let checkoutOverview: CheckoutOverview

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page)
        checkoutOverview = new CheckoutOverview(page)

        await page.goto(BASE_URL)
        await loginPage.login(USERNAME, PASSWORD)
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
        await productPage.getSpecificProductDetails(productsToCart)
        await productPage.clickOnCartlink()
        await cartPage.clickCheckoutBtn()
        await checkoutPage.fillCheckoutDetails(checkoutData.firstName, checkoutData.lastName, checkoutData.postalCode)
        await checkoutPage.clickContinue()
    })
    
    test("Validate checkout overview page UI & url", async ({page})=>{
        await expect(page).toHaveURL("https://www.saucedemo.com/checkout-step-two.html")
        const elements = await checkoutOverview.getCheckoutOverviewElements()
        await expect(elements.pageinfo).toBeVisible()
        await expect(elements.finishBtn).toBeVisible()
    })
    
    test("Validate cancel button functionality", async ({page})=>{
        await checkoutOverview.clickOnCancel()
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html")
    })

    test("Validate Item Total Calculation", async({page})=>{
        const overviewProducts = await checkoutOverview.getOverviewProducts()
        const calculatedTotal = overviewProducts.reduce((sum, {price}) => sum + parseFloat(price.replace("$", "")), 0)
        const UIItemTotal = await checkoutOverview.getItemTotal()
        expect(calculatedTotal).toBe(UIItemTotal)
    })

    test("Validate Final Total (ItemTotal + Tax)", async ({page}) =>{
        const itemTotal = await checkoutOverview.getItemTotal()
        const tax = await checkoutOverview.getTax()
        const finalTotal = await checkoutOverview.getTotal()

        const expectedFinalTotal = itemTotal + tax
        expect(finalTotal).toBe(expectedFinalTotal)
    })
    
})