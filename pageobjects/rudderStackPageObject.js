require("dotenv").config();
const { WDioHelper }=require('../utils/wdioHelper');
const { saveTestData, getTestData}=require('../utils/dynamicDataHelper');
const { APIHelper } = require('../utils/apiHelper');
const assert = require('assert');
const { logger } = require("../utils/loggerHelper");

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
    }

    async saveWriteKey(keyName){
         try {
             let writeKeyText= await WDioHelper.getText(this.writeKeySpanXpath);
             if(writeKeyText.trim()!=""&&writeKeyText!=null){
             writeKeyText = writeKeyText.split(" ")[2];
             await saveTestData(keyName, writeKeyText);
             await WDioHelper.takeScreenshot("WriteKey");
             logger.info(`User Successfully Save Write Key`);
             }else{
            logger.error(`Got Write Key as Null or Blank, WriteKey: ${writeKeyText}`);
        }
            
    } catch (error) {
        throw new Error(`Error while trying to save write key, ${error.message}`);
    }

    }

    async handlingRudderStackUserSaveAction(elementName, keyName){
        try {
        let textLocator="";
        if(elementName=="Data Plane"){
            textLocator=this.dataPlaneSpanXpath;
            await WDioHelper.waitForElementVisible(this.askAIBetaPopUp, "AskAIBetaPopUp");
            const popupIconEl = await this.browser.$(this.askAIBetaPopUp);
           if(await popupIconEl.isDisplayed()) {
             await popupIconEl.click();
          }
        }else if(elementName=="Delivered"){
            textLocator=this.desEventCountXpath.replace("{EventName}","Delivered");
            await WDioHelper.waitForElementVisible(textLocator, "DeliveryCount");
        }else if(elementName=="Failed"){
             textLocator=this.desEventCountXpath.replace("{EventName}",'Failed');
        }
        let textFound=await WDioHelper.getText(textLocator);
        await saveTestData(keyName, textFound);
        await WDioHelper.takeScreenshot(elementName);   
        logger.info(`User Saving ${elementName} value as key ${keyName}`);    
        } catch (error) {
          throw new Error(`Error while trying to read and Save ${elementName}, ${error.message}`);
        }
    }

async sendHTTPPostRequest(endpointName, payloadName){
    try {
    logger.info(`User Sending HTTP POST Request in an Endpoint: ${endpointName}`);
    let baseURL=await getTestData("DataPlane");
    let basicAuthValue=await getTestData("WriteKey");
    const username = basicAuthValue;
    const password = "";
    const credentials = `${username}:${password}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');
    await APIHelper.setBaseURL(baseURL);
    await APIHelper.setEndPoint(`/v1/${endpointName}`);
    await APIHelper.addHeaders('Authorization',"Basic "+encodedCredentials);
    await APIHelper.setPayload(payloadName);
    await APIHelper.sendPOSTReq();
    await APIHelper.verifyResponseCode(200);
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

}


module.exports = RudderStackPageObject;