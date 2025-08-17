const { Given, When, Then } = require('@cucumber/cucumber');
const RudderStackPageObject = require('../pageobjects/rudderStackPageObject');
const { getTestData } = require('../utils/dynamicDataHelper');


When('User reads the {string} value from the RudderStack Dashboard and saves it as {string}', async (propertyName, keyName) => {
    let rudderStack = new RudderStackPageObject(browser);
      await rudderStack.handlingRudderStackUserSaveAction(propertyName, keyName);
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


Then('Verify Webhook events count is increased by {int} as per API request', async (expectedDelivered) => {
    let rudderStack = new RudderStackPageObject(browser);
    let previousDeliveryCount=await getTestData('DeliveredCount');
    let previousFailedCount=await getTestData('FailedCount');
    await rudderStack.verifyEventsCount(previousDeliveryCount,previousFailedCount,expectedDelivered);

});