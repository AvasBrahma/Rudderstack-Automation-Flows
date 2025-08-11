require("dotenv").config();
const { WDioHelper }=require('../utils/wdioHelper');

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

    get usernameInput() { return this.browser.$('#username'); }
    get passwordInput() { return this.browser.$('#password'); }
    get loginButton() { return this.browser.$('#login'); }

    async navigateToHomePage() {
        await this.browser.url(this.url);
        await WDioHelper.takeScreenshot("homePage");
        await this.login();
        await this.skip2FA();
        await this.goToDashBoard();
    }

    async login() {
        await this.browser.$(this.emailIdCssSel).setValue(process.env.email);
        await this.browser.$(this.passwordCssSel).setValue(process.env.password);
        await WDioHelper.takeScreenshot("loginPage");
        await this.browser.$(this.logInButtonXPath).click();
    }

    async skip2FA(){
        await this.browser.waitUntil(
        async () => await (await this.browser.$(this.hyperLinkIWillDoLater)).isDisplayed(),
        {
            timeout: 15000,
            timeoutMsg: `"I'll do this later" link was not visible within 15s`
        }
    );
          //await this.browser.$(this.hyperLinkIWillDoLater).waitForDisplayed({ timeout: 5000 });
          const skipFALinkEle = await this.browser.$(this.hyperLinkIWillDoLater);
          await skipFALinkEle.waitForClickable();
          await WDioHelper.takeScreenshot("skip2FAWarn");
          await skipFALinkEle.click();
    }
    async goToDashBoard(){
          await this.browser.waitUntil(
        async () => await (await this.browser.$(this.goToDashBoardButton)).isDisplayed(),
        {
            timeout: 15000,
            timeoutMsg: `"Go To DashBoard Button was not visible within 15s`
        }
    );
        const goToDashBoardEle = await this.browser.$(this.goToDashBoardButton);
        await goToDashBoardEle.waitForClickable();
        await WDioHelper.takeScreenshot("goToDashBoardButton");
        await goToDashBoardEle.click();
    }
}

module.exports = AuthPageObject;
