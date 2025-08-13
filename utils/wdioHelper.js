const path = require('path');
const fs = require('fs');
const BeforeAction=require('../resources/BeforeAction');
const { logger } = require('./loggerHelper');
class WDioHelper{

static async takeScreenshot(fileName) {
    let srPath=await BeforeAction.getCurrentExeIdFolderPath();
    const screenshotsDir = path.join(srPath, '/screenshots');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullPath = path.join(screenshotsDir, `${fileName}_${timestamp}.png`);

    await browser.saveScreenshot(fullPath);
}

static async waitForElementVisible(locator, elementName, timeout = 15000) {
    try {
         await browser.waitUntil(
            async () => {
                const el = await browser.$(locator);
                return await el.isDisplayed();
            },
            {
                timeout,
                timeoutMsg: `${elementName} is not visible within ${timeout / 1000}s`
            }
        );
    } catch (error) {
        throw new Error(`Failed to while trying to wait for element ${elementName} locator: ${locator}, ${error.message}`);
    }
}

static async getText(locator){
        try {
        const textElement =  await browser.$(locator);
        let text = await textElement.getText();
        return text;
        } catch (error) {
            throw new Error(`Failed to read text from locator (${locator}): ${error.message}`);
        }
      
    }

    static async clickAction(locator, elementName, elementType){
        try {
            const clickElement = await browser.$(locator);
            await clickElement.click();
        } catch (error) {
            throw new Error(`Failed to while trying to click ${elementName} ${elementType}, locator: ${locator} ${error.message}`);
        }
    
    } 
 
}


module.exports = { WDioHelper };
