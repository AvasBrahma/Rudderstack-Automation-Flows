const { Given, When, Then } = require('@cucumber/cucumber');
const RudderStackPageObject = require('../pageobjects/rudderStackPageObject');


When('Read {string} and Save as {string} from the Rudder Stack Dashboards', async (propertyName, keyName) => {
    let rudderStack = new RudderStackPageObject(browser);
    if(propertyName=='Data Plane'){
      await rudderStack.readDataPlaneAndSave(keyName);
    }else if(propertyName=='Write Key'){
      await rudderStack.readWriteKeyAndSave(keyName);
    }
});

Then('Send a HTTP POST API request to {string} with {string} payload and Verify Response Code', async (endPointName, payloadName) => {
    let rudderStack = new RudderStackPageObject(browser);
    await rudderStack.sendHTTPPostRequest(endPointName, payloadName);

});

When('Click on the Webhook Destination {string} and Click on the Tab {string}', async (webHookDestinationName, tabName) => {
    let rudderStack = new RudderStackPageObject(browser);
    await rudderStack.goToWebHooksAndClickTab(webHookDestinationName, tabName);
});

Then('Read and Save the count of delivered and failed events', async () => {
    let rudderStack = new RudderStackPageObject(browser);
    await rudderStack.readAndSaveDeliveredCounts();
    await rudderStack.readAndSaveFailedEvents();
}); 