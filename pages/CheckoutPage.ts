import {Page} from "@playwright/test"
import { CheckoutPageLocators } from "../locators/CheckoutPageLocators"

export class CheckoutPage{
    constructor(private page: Page){}

    async getCheckoutElements(){

        return{
            pageInfo: this.page.locator(CheckoutPageLocators.pageInfo),
            cancel: this.page.locator(CheckoutPageLocators.cancelBtn),
            continue: this.page.locator(CheckoutPageLocators.continueBtn)
        }
    }

    async fillCheckoutDetails(firstName: string, lastName: string, postalCode: string){
        await this.page.fill(CheckoutPageLocators.firstName, firstName)
        await this.page.fill(CheckoutPageLocators.lastName, lastName)
        await this.page.fill(CheckoutPageLocators.postalCode, postalCode)
    }

    async clickCancel(){
        await this.page.click(CheckoutPageLocators.cancelBtn)
    }

    async clickContinue(){
        await this.page.click(CheckoutPageLocators.continueBtn)
    }
    async getErrorMsg(){
        return  await this.page.locator(CheckoutPageLocators.errorMsg).textContent()
    }
}
