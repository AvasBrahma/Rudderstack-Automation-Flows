const browserOptions = {
    chrome: { 'goog:chromeOptions': { 
        args: [
            // '--headless=new',
            '--start-maximized',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-infobars',
            '--disable-extensions',
            '--window-size=1920,1080',
            `--user-data-dir=/tmp/chrome-user-data-${Date.now()}`
        ]
    } },
    firefox: { 'moz:firefoxOptions': { args: [] } }
};

function getBrowserSetup() {
    if (!global.config) {
        throw new Error("Config not loaded yet! Ensure createConfig() runs in BeforeAll.");
    }
    return { browserName: global.config.browser || 'chrome' };
}

module.exports = { getBrowserSetup, browserOptions };
