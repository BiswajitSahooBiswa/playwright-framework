import { test, expect } from "@playwright/test"
import { BASE_URL, USERNAME, PASSWORD } from "../../utils/envConfig"
import { ProductPage } from "../../pages/ProductPage"
import { LoginPage } from "../../pages/LoginPage"
import { LoginLocators } from "../../locators/LoginLocators"
import { CartPage } from "../../pages/CartPage"
import { CheckoutPage } from "../../pages/CheckOutPage"
import { checkoutData } from "../../test_data/checkoutData"
import { productsToCart } from "../../test_data/products"
import { CheckoutOverview } from "../../pages/CheckoutOverviewPage"
import { FinalPage } from "../../pages/FinalPage"

test.describe("Final Page Validation", () => {
    let loginPage: LoginPage
    let productPage: ProductPage
    let cartPage: CartPage
    let checkoutPage: CheckoutPage
    let checkoutOverview: CheckoutOverview
    let finalPage: FinalPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page)
        checkoutOverview = new CheckoutOverview(page)
        finalPage = new FinalPage(page)

        await page.goto(BASE_URL)
        await loginPage.login(USERNAME, PASSWORD)
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html')
        await productPage.getSpecificProductDetails(productsToCart)
        await productPage.clickOnCartlink()
        await cartPage.clickCheckoutBtn()
        await checkoutPage.fillCheckoutDetails(checkoutData.firstName, checkoutData.lastName, checkoutData.postalCode)
        await checkoutPage.clickContinue()
        await checkoutOverview.clickOnFinish()
    })
    
    test("Validate checkout overview page UI & url", async ({page})=>{
        await expect(page).toHaveURL("https://www.saucedemo.com/checkout-complete.html")
        const elements = await finalPage.getFinalPageElements()
        await expect(elements.backHomeBtn).toBeVisible()
        await expect(elements.successMsg).toBeVisible()
        await expect(elements.pageInfo).toBeVisible()
    })
    
    test.only("Validate the Success Message", async({page})=>{
        const message = await finalPage.getSuccessMsg()
        expect(message).toBe("Thank you for your order!")
    })
    
    test("Validate BackHomeButton", async({page})=>{
        await finalPage.clickOnBackHomeBtn()
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html")
    })
    
    test("Validate BackHomeButton 1234", async({page})=>{
        await finalPage.clickOnBackHomeBtn()
        await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html")
    })
    
})