require('dotenv').config({
  path: `.env.${process.env.TEST_ENV || 'qa'}`
});

module.exports = {
    browserSetup: {
        browserName: process.env.BROWSER || 'chrome'
    },
    browserOptions: {
        chrome: { 'goog:chromeOptions': { 
            args: [
                '--headless=new',
                '--start-maximized',
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-infobars',
                '--disable-extensions',
                '--window-size=1920,1080'
            ] } },
        firefox: { 'moz:firefoxOptions': { args: [] } }
    }
};
