require("dotenv").config();
module.exports = {
    browserSetup: {
        browserName: process.env.BROWSER || 'chrome'
    },
    browserOptions: {
        chrome: { 'goog:chromeOptions': { args: ['--start-maximized'] } },
        firefox: { 'moz:firefoxOptions': { args: [] } }
    }
};
