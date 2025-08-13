const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

function createConfig() {
  const ENV = process.env.TEST_ENV || 'qa';
  const BROWSER = process.env.BROWSER || 'chrome';
  const envFile = path.resolve(__dirname, `../.env.${ENV}`);
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    console.log(`Loaded environment: ${ENV}`);
  } else {
    console.warn(`Environment file ${envFile} not found`);
  }
  return {
    env: ENV,
    browser: BROWSER,
    url: process.env.URL,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    get(key) {
      return this[key] || process.env[key];
    }
  };
}

module.exports = { createConfig };
