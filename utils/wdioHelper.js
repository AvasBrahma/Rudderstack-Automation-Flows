const path = require('path');
const fs = require('fs');
const BeforeAction=require('../resources/BeforeAction');
class WDioHelper{

static async takeScreenshot(fileName) {
    let srPath=await BeforeAction.getCurrentExeIdFolderPath();
    console.log(`sr : ${srPath}`);
    const screenshotsDir = path.join(srPath, '/screenshots');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fullPath = path.join(screenshotsDir, `${fileName}_${timestamp}.png`);

    await browser.saveScreenshot(fullPath);
    console.log(`✅ Screenshot saved: ${fullPath}`);
}

}


module.exports = { WDioHelper };
