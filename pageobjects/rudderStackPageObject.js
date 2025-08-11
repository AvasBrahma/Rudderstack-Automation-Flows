require("dotenv").config();
const { WDioHelper }=require('../utils/wdioHelper');
const { saveTestData, getTestData}=require('../utils/dynamicDataHelper');
const { APIHelper } = require('../utils/apiHelper');
const assert = require('assert')

class RudderStackPageObject {
    constructor(browserInstance) {
        this.browser = browserInstance;
         this.dataPlaneSpanXpath="//span[text()='Data Plane']/following-sibling::div/div/span";
         this.askAIBetaPopUp="//button[@type='button' and @aria-label='Close']";
         this.writeKeySpanXpath="//span[starts-with(text(), 'Write key')]"
    }

    async readWriteKeyAndSave(keyName){
         try {
            const writeKeyEle =  await this.browser.$(this.writeKeySpanXpath);
             let writeKeyText = await writeKeyEle.getText();
             writeKeyText = writeKeyText.split(" ")[2];
             await saveTestData(keyName, writeKeyText);
             await WDioHelper.takeScreenshot("WriteKey");
    } catch (error) {
        console.log("Error while trying to read write key");
    }

    }

     async readDataPlaneAndSave(keyName){
         try {
        await this.browser.waitUntil(
            async () => {
                const el = await this.browser.$(this.askAIBetaPopUp);
                return await el.isDisplayed();
            },
            {
                timeout: 15000,
                timeoutMsg: `Popup icon not visible within 15s`
            }
        )
        const popupIconEl = await this.browser.$(this.askAIBetaPopUp);
        if (await popupIconEl.isDisplayed()) {
             await popupIconEl.click();
             const dataPlaneSpanEle =  await this.browser.$(this.dataPlaneSpanXpath);
             let dataPlaneText = await dataPlaneSpanEle.getText();
             await saveTestData(keyName, dataPlaneText);
             await WDioHelper.takeScreenshot("DataPlane");
        } else {
             console.log("Popup not visible");
        }

    } catch (error) {
        console.log("Popup not found within 15s, skipping...");
    }

    }

async sendHTTPPostRequest(endpointName, payloadName){
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
    let response=await APIHelper.getResponse();
    assert.strictEqual(response.status, 200, 
        `Expected 200 but got ${response.status}`
    );
  console.log('Response status is 200 as expected');

}

}


module.exports = RudderStackPageObject;