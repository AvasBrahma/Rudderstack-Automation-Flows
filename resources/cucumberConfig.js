const {Before, BeforeAll, AfterAll, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { browserSetup, browserOptions } = require('./browserConfig');
const { remote } = require('webdriverio');
const BeforeAction = require('./BeforeAction');

setDefaultTimeout(60000);

BeforeAll(async () => {
    console.log(`Browser is set as ${browserSetup.browserName}`);
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

AfterAll(async () => {
    await global.browser.deleteSession();
});
