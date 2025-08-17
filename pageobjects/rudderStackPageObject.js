require("dotenv").config();
const { WDioHelper }=require('../utils/wdioHelper');
const { saveTestData, getTestData}=require('../utils/dynamicDataHelper');
const { APIHelper } = require('../utils/apiHelper');
const assert = require('assert');
const { logger } = require("../utils/loggerHelper");
const { RSCollectHelper } = require("../utils/rsCollectHelper");

class RudderStackPageObject {
    constructor(browserInstance) {
        this.browser = browserInstance;
         this.dataPlaneSpanXpath="//span[text()='Data Plane']/following-sibling::div/div/span";
         this.askAIBetaPopUp="//button[@type='button' and @aria-label='Close']";
         this.writeKeySpanXpath="//span[starts-with(text(), 'Write key')]";
         this.webHookDestinationButton="//span[text()='{destinationName}']";
         this.webHookDestinationSubTab="//div[@role='tab' and text()='{tabName}']"
         this.desEventCountXpath="//span[text()='{EventName}']/following-sibling::div/h2/span";
         this.eventsDetailsFailedRadioToggleButton="//div[@class='ant-segmented-item-label' and @title='Failures']";
         this.tableAllRowsColumnDataXPath="//tbody/tr/td[@class='ant-table-cell'][{columnNumber}]/span";
         this.refreshButtonXpath="//span[text()='Refresh']/parent::button";
    }
    async handlingRudderStackUserSaveAction(elementName, keyName){
        try {
        let keyValue=null;
        if(elementName=="Write Key"){
            keyValue=await RSCollectHelper.getWriteKey();
        }else if(elementName=="Data Plane"){
            keyValue=await RSCollectHelper.getDataPlane();
        }else if(elementName=="Delivered"||elementName=="Failed"){
            keyValue=await RSCollectHelper.webHookGetEventsCount(elementName);
        }
        if(keyValue!=null){
         await saveTestData(keyName, keyValue);
         await WDioHelper.takeScreenshot(elementName);   
         logger.info(`User Saving ${elementName} value as key ${keyName}`); 
        }else{
           throw new Error(`Error Value Found as Null for ${elementName}, ${error.message}`);
        }  
        } catch (error) {
          throw new Error(`Error while trying to read and Save ${elementName}, ${error.message}`);
        }
    }

async sendHTTPPostRequest(endpointName, payloadName){
    try {
    logger.info(`User Sending HTTP POST Request in an Endpoint: ${endpointName}`);
    let baseURL=await getTestData("DataPlane");
    let basicAuthUserName=await getTestData("WriteKey");
    const api = new APIHelper();
    api.setBaseURL(baseURL);
    api.setAPIVersion("/v1");
    api.setEndPoint(endpointName);
    const basicAuthValue=APIHelper.getBasicAuthHeader(basicAuthUserName,"");
    api.addHeader("Authorization", basicAuthValue);
    api.addHeader("Content-Type", "application/json");
    await api.setPayloadFromFile(payloadName);
    await api.sendPOSTRequest("POST");
    api.verifyStatusCode(200);
    } catch (error) {
    throw new Error(`Error while trying to Send HTTP POST Request in Endpoint ${endpointName}, ${error.message}`);   
    }
}


async navigateToTabUnderDestination(webHookName, tabName){
    let webHookDesXpath=this.webHookDestinationButton.replace("{destinationName}", webHookName);
    await WDioHelper.clickAction(webHookDesXpath,webHookName,"Desination Board");
    await WDioHelper.takeScreenshot(webHookName);
    logger.info(`User Navigating Inside Destination ${webHookName}`);
    let webHookDesTabXpath=this.webHookDestinationSubTab.replace("{tabName}", tabName); 
    await WDioHelper.waitForElementVisible(webHookDesTabXpath,tabName);
    await WDioHelper.clickAction(webHookDesTabXpath,tabName,"Tab");
    const newWebHookDesTabEle = await this.browser.$(webHookDesTabXpath);
    const isTabClick = await newWebHookDesTabEle.getAttribute('aria-selected');
    if(isTabClick=="true"){
        logger.info(`Web Hook Destination Tab ${tabName} click successfully`);
        await WDioHelper.takeScreenshot(tabName);
    }else{
        console.log(`Issue while clicking Web Hook Destination Tab ${tabName}`);
    }
}



async verifyEventsCount(previousDeliveryCount,previousFailedCount,expectedTotalRequests){
    try {
    let durationOfWait=2;
    logger.info(`Waiting up to ${durationOfWait} minutes for Webhook events count to reflect`);
    await browser.pause(durationOfWait * 60 * 1000);
    logger.info(`Clicking Refresh Button`);
    await this.browser.$(this.refreshButtonXpath).click(); 
    let currentDeliverdCount=await RSCollectHelper.webHookGetEventsCount("Delivered");
    let currentFailedCount=await RSCollectHelper.webHookGetEventsCount("Failed");
    let numPreDeliveredCount=parseInt(previousDeliveryCount);
    let numPreFailedCount=parseInt(previousFailedCount);
    await WDioHelper.takeScreenshot("AfterRequestEventsCount");
    const deliveredDiff = currentDeliverdCount - numPreDeliveredCount;
    const failedDiff = currentFailedCount - numPreFailedCount;
    const totalDiff = deliveredDiff + failedDiff;
    if (totalDiff !== expectedTotalRequests){
        throw new Error(`Mismatch in total requests. Expected ${expectedTotalRequests}, but got ${totalDiff}`);
    }
    logger.info(`Validation Passed: Delivered + Failed = ${totalDiff}, matches expected ${expectedTotalRequests}`);
        
    } catch (error) {
        throw new Error(`Error While verifing delivery events count, ${error.message}`);
    }
    
}

}


module.exports = RudderStackPageObject;