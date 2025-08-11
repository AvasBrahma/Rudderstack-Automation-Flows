require("dotenv").config();

class AuthPageObject {
    constructor(browserInstance) {
        this.browser = browserInstance;
        this.url = process.env.URL || 'https://example.com';
    }

    get usernameInput() { return this.browser.$('#username'); }
    get passwordInput() { return this.browser.$('#password'); }
    get loginButton() { return this.browser.$('#login'); }

    async navigateToHomePage() {
        await this.browser.url(this.url);
    }

    async login(username, password) {
        await this.usernameInput.setValue(username);
        await this.passwordInput.setValue(password);
        await this.loginButton.click();
    }
}

module.exports = AuthPageObject;
