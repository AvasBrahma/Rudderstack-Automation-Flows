const { Given, When, Then } = require('@cucumber/cucumber');
const AuthPageObject = require('../pageobjects/authPageObject');
const { logger } = require('../utils/loggerHelper');

Given('User enters username and password and logs in to the RudderStack Dashboard', async () => {
    logger.info(`Validating User able to login to Rudder Stack Dashboard`);
    let authPage = new AuthPageObject(browser);
    await authPage.navigateToHomePage();
});