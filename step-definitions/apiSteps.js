const { Given, When, Then } = require('@cucumber/cucumber');
const RudderStackPageObject = require('../pageobjects/rudderStackPageObject');


Then('User sends an HTTP POST request to {string} with {string} payload and verifies the response code', async (endPointName, payloadName) => {
    let rudderStack = new RudderStackPageObject(browser);
    await rudderStack.sendHTTPPostRequest(endPointName, payloadName);

});