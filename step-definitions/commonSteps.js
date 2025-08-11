const { Given, When, Then } = require('@cucumber/cucumber');
const AuthPageObject = require('../pageobjects/authPageObject');

Given('Navigate to the home page', async () => {
    let authPage = new AuthPageObject(browser);
    await authPage.navigateToHomePage();
});