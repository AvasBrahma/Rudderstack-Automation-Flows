const {Before, BeforeAll, AfterAll, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { browserSetup, browserOptions } = require('./browserConfig');
const { remote } = require('webdriverio');

setDefaultTimeout(60000);

BeforeAll(async () => {
    console.log(`Browser is set as ${browserSetup.browserName}`);
});

Before(async () => {
   global.browser = await remote({
    logLevel: 'error',
    capabilities: { browserName: browserSetup.browserName,
            ...(browserOptions[browserSetup.browserName] || {}) }
  });
});

AfterAll(async () => {
    await global.browser.deleteSession();
});
