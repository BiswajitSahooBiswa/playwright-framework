import { Page } from "@playwright/test";
import { cartPageLocators } from "../locators/CartPageLocators";

export class CartPage {
    constructor(private page: Page) { }

    async clickOnContinueShopping() {
        await this.page.locator(cartPageLocators.contiuneShoppingBtn).click()
    }

    async getCartPageElements() {
        return {
            cartTitle: this.page.locator(cartPageLocators.cartTitle),
            shoppingCart: this.page.locator(cartPageLocators.contiuneShoppingBtn),
            checkout: this.page.locator(cartPageLocators.checkOutBtn)
        }
    }

    async getCartProducts() {
        const allNames = await this.page.locator(cartPageLocators.productNames).allTextContents()
        const allDescription = await this.page.locator(cartPageLocators.productDescription).allTextContents()
        const allPrices = await this.page.locator(cartPageLocators.productPrices).allTextContents()

        const allCartProducts = allNames.map((_, i) =>
        ({
            name: allNames[i].trim(),
            description: allDescription[i].trim(),
            price: allPrices[i].trim(),
        }))
        return allCartProducts
    }

    async removeFirstProduct() {
        await this.page.locator(cartPageLocators.removeBtn).first().click()
    }

    async clickCheckoutBtn(){
        await this.page.locator(cartPageLocators.checkOutBtn).click()
    }
}