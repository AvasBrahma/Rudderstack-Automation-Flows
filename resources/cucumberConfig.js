const {Before, BeforeAll, AfterAll, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { browserSetup, browserOptions } = require('./browserConfig');
const { remote } = require('webdriverio');
const BeforeAction = require('./BeforeAction');
const { logger } = require('../utils/loggerHelper');

setDefaultTimeout(60000);

BeforeAll(async () => {
    logger.info(`Browser is set as ${browserSetup.browserName}`);
    logger.info(`..................Setting up Results folder...........`);
    await BeforeAction.runBeforeAllConfig();
});

Before(async (scenario) => {
   global.browser = await remote({
    logLevel: 'error',
    capabilities: { browserName: browserSetup.browserName,
            ...(browserOptions[browserSetup.browserName] || {}) }
  });
  await BeforeAction.beforTestConfig(scenario);
});

After(async function (scenario) {
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
