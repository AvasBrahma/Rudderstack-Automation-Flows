module.exports = {
  default: `--require-module @babel/register
            --require ./resources/cucumberConfig.js
            --format-options '{"theme":{"feature keyword": ["magenta","bold"],"scenario keyword":["magenta","bold"],"step keyword":["bold"]}}'
             --format @cucumber/pretty-formatter
             --format html:reports/cucumber-report.html
             --require step-definitions/*.js
             require features/*.feature
             --tags "@RudderStack"`,
};
