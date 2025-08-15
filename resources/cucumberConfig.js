const {Before, BeforeAll, AfterAll, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { getBrowserSetup, browserOptions } = require('./browserConfig');
const { remote } = require('webdriverio');
const BeforeAction = require('./BeforeAction');
const AfterAction = require('./AfterAction');
const { logger } = require('../utils/loggerHelper');
const { createConfig } = require('./ConfigDetails');

setDefaultTimeout(60000);
let config;
let results = {
  passed: 0,
  failed: 0,
  duration: 0
};
let startTime;

BeforeAll(async () => {
    startTime = Date.now();
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

After(async function (scenario) {
   logger.clear();
   if (scenario.result.status === 'PASSED' || scenario.result.status === 'passed') {
    results.passed++;
    }else if (scenario.result.status === 'FAILED' || scenario.result.status === 'failed') {
    results.failed++;
  }
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
    results.duration = await AfterAction.formatDuration(Date.now() - startTime);
    await AfterAction.generateSummaryReport(results);
});
