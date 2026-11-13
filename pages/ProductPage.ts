import { Page } from "@playwright/test"
import { productPageLocators } from "../locators/ProductPagesLocators"

export class ProductPage {
    constructor(private page: Page) {
    }
    async logout() {
        await this.page.click(productPageLocators.settingIcons)
        await this.page.click(productPageLocators.logoutLink)
    }

    async openAboutPage() {
        await this.page.click(productPageLocators.settingIcons)
        await this.page.click(productPageLocators.aboutLink)
    }
    async validateAllProductsDisplayed() {
        const names = await this.page.locator(productPageLocators.productNames).allTextContents()
        const description = await this.page.locator(productPageLocators.productDescription).allTextContents()
        const price = await this.page.locator(productPageLocators.productPrices).allTextContents()
        const buttonCount = await this.page.locator(productPageLocators.addToCartButtons).count()

        if (names.length === 0)
            throw new Error("No products Found")

        if (names.length !== description.length || names.length !== price.length || names.length !== buttonCount)
            throw new Error("Missmatch between the product details")
    }
    async addFirstProductToCart() {
        await this.page.locator(productPageLocators.addToCartButtons).first().click()
    }
    async addAllProductToCart() {
        const buttons = this.page.locator(productPageLocators.addToCartButtons)
        const count = await buttons.count()

        for (let i = 0; i < count; i++) {
            await buttons.nth(i).click()
            await this.page.waitForTimeout(1000)
        }
    }
    async addSpecificProductsToCart(productName: string[]) {
        const addProducts = this.page.locator(productPageLocators.productNames)
        const count = await addProducts.count()

        for (let i = 0; i < count; i++) {
            const name = await addProducts.nth(i).textContent()

            if (name && productName.includes(name.trim())) {
                await this.page.locator(productPageLocators.addToCartButtons).nth(i).click()
                await this.page.waitForTimeout(3000)
            }
        }
    }
    async filterByNameAtoZ() {
        await this.page.selectOption(productPageLocators.filterDropdown, "az")
    }
    async filterByNameZtoA() {
        await this.page.selectOption(productPageLocators.filterDropdown, "za")
        await this.page.waitForTimeout(3000)
    }
    async filterByPriceLowtoHigh() {
        await this.page.selectOption(productPageLocators.filterDropdown, "lohi")
        await this.page.waitForTimeout(3000)
    }
    async filterByPriceHightoLow() {
        await this.page.selectOption(productPageLocators.filterDropdown, "hilo")
        await this.page.waitForTimeout(3000)
    }

    async getTheProductNames(): Promise<string[]> {
        return await this.page.locator(productPageLocators.productNames).allTextContents()
    }

    async getTheProductPrices() {
        const prices = await this.page.locator(productPageLocators.productPrices).allTextContents()
        return prices.map(price => parseFloat(price.replace('$', '')))
    }

    async clickOnCartlink() {
        await this.page.locator(productPageLocators.shoppingCartLink).click()
    }
    async getFirstProductDetails() {
        const name = await this.page.locator(productPageLocators.productNames).first().textContent()
        const description = await this.page.locator(productPageLocators.productDescription).first().textContent()
        const price = await this.page.locator(productPageLocators.productPrices).first().textContent()
        return {
            name: name?.trim(),
            description: description?.trim(),
            price: price?.trim()
        }
    }
    async getAllProductDetails() {
        const allNames = await this.page.locator(productPageLocators.productNames).allTextContents()
        const allDescription = await this.page.locator(productPageLocators.productDescription).allTextContents()
        const allPrices = await this.page.locator(productPageLocators.productPrices).allTextContents()

        const allProducts = allNames.map((_, i) =>
        ({
            name: allNames[i].trim(),
            description: allDescription[i].trim(),
            price: allPrices[i].trim(),
        }))
        return allProducts
    }
    async getSpecificProductDetails(productName: string[]) {
        const allNames = await this.page.locator(productPageLocators.productNames).allTextContents()
        const allDescription = await this.page.locator(productPageLocators.productDescription).allTextContents()
        const allPrices = await this.page.locator(productPageLocators.productPrices).allTextContents()

        const allProducts = allNames.map((_, i) =>
        ({
            name: allNames[i].trim(),
            description: allDescription[i].trim(),
            price: allPrices[i].trim(),
        }))
        return allProducts.filter(p => productName.includes(p.name))
    }



}

