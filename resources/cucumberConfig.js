const {Before, BeforeAll, AfterAll, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { getBrowserSetup, browserOptions } = require('./browserConfig');
const { remote } = require('webdriverio');
const BeforeAction = require('./BeforeAction');
const { logger } = require('../utils/loggerHelper');
const { createConfig } = require('./ConfigDetails');

setDefaultTimeout(60000);
let config;

BeforeAll(async () => {
    config = createConfig();
    global.config = config;
    logger.info(`Test Executing in Environment: ${config.env}`);
    logger.info(`Browser: ${config.browser}`);
    logger.info(`..................Setting up Results folder...........`);
    await BeforeAction.runBeforeAllConfig();
});

Before(async (scenario) => {
const browserSetup = getBrowserSetup();
   global.browser = await remote({
    logLevel: 'error',
    capabilities: { browserName: browserSetup.browserName,
            ...(browserOptions[browserSetup.browserName] || {}) }
  });
  await BeforeAction.beforTestConfig(scenario);
});

After(async function () {
   logger.clear();
   if(global.browser) {
        try {
            await browser.deleteCookies();
            await browser.execute(() => {
            window.localStorage.clear();
            window.sessionStorage.clear();
        });
        } catch (err) {
            console.error("Error clearing cookies:", err);
        }
        await global.browser.deleteSession();
        global.browser = null;
    }
    });

AfterAll(async () => {
    if(global.browser){
     await global.browser.deleteSession();
    }
});
