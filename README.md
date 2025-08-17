
# RudderStack Automation Flow
An End-to-end automation framework built using WebdriverIO, JavaScript, and Cucumber.js (BDD).
This framework supports UI automation, API testing, dynamic test data management, multiple environments, and CI/CD integration.

## ✨ Features
1. End-to-End UI Testing using WebdriverIO
2. Behavior-Driven Development (BDD) with Cucumber.js
3. API Testing with Axios
4. Dynamic Test Data Handling using a custom TestData Helper (save & retrieve values across steps)
5. Multi-Environment Support (dev, qa, prod) via environment-specific config & .env files
6. Cucumber HTML Reports for execution insights
7. CI/CD Ready with GitHub Actions
8. Added winston logger for handling logs and screenshots in the reports directory
9. Daily Email Report Notification using Nodemailer (Cucumber HTML report attached)
10. Automated Scheduler with Cron Job for daily execution reports

## 🛠️ How to Use
1. Clone the Repository
git clone https://github.com/AvasBrahma/Rudderstack-Automation-Flows.git

2. Install Dependencies
npm install

3. Run Tests

* Run All Test: npm test
* Run by Tag: npx cucumber-js --tags "@RudderStack"
* Run for Specific Environment
The project supports multiple environments (dev, qa, prod) via .env files.

Example:
* Dev environment: npm run test:dev
* QA environment: npm run test:qa
* Production environment: npm run test:prod

