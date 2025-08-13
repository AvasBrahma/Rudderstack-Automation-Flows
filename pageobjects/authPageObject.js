require("dotenv").config();
const { WDioHelper }=require('../utils/wdioHelper');
const { logger } = require('../utils/loggerHelper');

class AuthPageObject {
    constructor(browserInstance) {
        this.browser = browserInstance;
        this.url = process.env.URL;
        this.emailIdCssSel="#text-input-email";
        this.passwordCssSel="#text-input-password";
        this.logInButtonXPath="//button[@type='button']/span[normalize-space(text())='Log in']";
        this.hyperLinkIWillDoLater="//a[text()=\"I'll do this later\"]";
        this.goToDashBoardButton="//button[@type='button']/span[normalize-space(text())='Go to dashboard']";
    }

    async navigateToHomePage() {
        await this.browser.url(this.url);
        await WDioHelper.takeScreenshot("homePage");
        await this.login();
        await this.skip2FA();
        await this.goToDashBoard();
    }

    async login() {
        try {
        await this.browser.$(this.emailIdCssSel).setValue(process.env.email);
        await this.browser.$(this.passwordCssSel).setValue(process.env.password);
        await WDioHelper.takeScreenshot("loginPage");
        await this.browser.$(this.logInButtonXPath).click();  
        } catch (error) {
            throw new Error(`Fail: Error while entering username & password in login page`, error.message);
        }
    }

    async skip2FA(){
        try {
          await WDioHelper.waitForElementVisible(this.hyperLinkIWillDoLater,"I'll do this later");
          const skipFALinkEle = await this.browser.$(this.hyperLinkIWillDoLater);
          await skipFALinkEle.waitForClickable();
          await WDioHelper.takeScreenshot("skip2FAWarn");
          await skipFALinkEle.click(); 
        } catch (error) {
            throw new Error(`Fail: Error while skipping 2FA Alert`, error.message);
        }
        
    }
    async goToDashBoard(){
        try {
        await WDioHelper.waitForElementVisible(this.goToDashBoardButton,"Go To DashBoard Button");
        const goToDashBoardEle = await this.browser.$(this.goToDashBoardButton);
        await goToDashBoardEle.waitForClickable();
        await WDioHelper.takeScreenshot("goToDashBoardButton");
        await goToDashBoardEle.click();
        } catch (error) {
            throw new Error(`Fail: Error while trying to click Go To DashBoard Link`, error.message);
        }
    }
}

module.exports = AuthPageObject;
