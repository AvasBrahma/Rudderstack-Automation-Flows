const { Given, When, Then } = require('@cucumber/cucumber');
const RudderStackPageObject = require('../pageobjects/rudderStackPageObject');


When('User reads the {string} value from the RudderStack Dashboard and saves it as {string}', async (propertyName, keyName) => {
    let rudderStack = new RudderStackPageObject(browser);
    if(propertyName=='Data Plane'){
      await rudderStack.handlingRudderStackUserSaveAction(propertyName, keyName);
    }else if(propertyName=='Write Key'){
      await rudderStack.saveWriteKey(keyName);
    }
});

Then('User sends an HTTP POST request to {string} with {string} payload and verifies the response code', async (endPointName, payloadName) => {
    let rudderStack = new RudderStackPageObject(browser);
    await rudderStack.sendHTTPPostRequest(endPointName, payloadName);

});

When('User clicks on the Webhook Destination {string} and navigates to the {string} tab', async (webHookDestinationName, tabName) => {
    let rudderStack = new RudderStackPageObject(browser);
    await rudderStack.navigateToTabUnderDestination(webHookDestinationName, tabName);
});

Then('User reads and saves the count of delivered and failed events', async () => {
    let rudderStack = new RudderStackPageObject(browser);
    await rudderStack.handlingRudderStackUserSaveAction("Delivered","DeliveredCount");
    await rudderStack.handlingRudderStackUserSaveAction("Failed","FailedCount");
});