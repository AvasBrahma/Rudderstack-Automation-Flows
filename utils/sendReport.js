const nodemailer = require('nodemailer');
const fs = require('fs');
const dotenv = require('dotenv');
const path=require('path');

(async () => {
  try {
    const summaryPath = path.resolve('reports', 'summary-report.json');
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.AUTH_USER_EMAIL,
        pass: process.env.AUTH_USER_PASSWORD
      }
    });

    const emailBody = `
<h3>RudderStack Automation Test Report</h3>
<table border="1" cellpadding="4" cellspacing="0">
<tr><th>Passed</th><td>${summary.passed}</td></tr>
<tr><th>Failed</th><td>${summary.failed}</td></tr>
<tr><th>Duration</th><td>${summary.duration}</td></tr>
</table>
<p>Alternatively, Open the attached file to view the cucumber html report.</p>
`;

  const cucumberHTMLReport = fs.readFileSync('./reports/cucumber-report.html', 'utf-8');
  await transporter.sendMail({
      from: `"Automation By Avas" <${process.env.MAIL_FROM}>`,
      to: process.env.MAIL_TO,
      subject: 'RudderStack Automation Test Daily Report',
      html: emailBody,
      attachments: [
        {
          filename: 'Cucumber-Report.html',
          content: cucumberHTMLReport
        }
      ]
    });
    console.log("RudderStack Automation Test Daily Report sent successfully!");
  } catch (error) {
    console.error("Failed to send Automation Test Daily Report email:", error);
    process.exit(1);
  }
})();
