import { Page } from "@playwright/test"
import { finalPageLocators } from "../locators/FinalPageLocators"

export class FinalPage {

    constructor(private page: Page) { }

    async getFinalPageElements() {

        return {
            pageInfo: this.page.locator(finalPageLocators.pageInfo),
            successMsg: this.page.locator(finalPageLocators.successMsg),
            backHomeBtn: this.page.locator(finalPageLocators.backHomeBtn)
        }
    }

    async getSuccessMsg(){
        const text = this.page.locator(finalPageLocators.successMsg).innerText()
        return (await text).trim()
    }

    async clickOnBackHomeBtn(){
        await this.page.locator(finalPageLocators.backHomeBtn).click()
        
    }

}