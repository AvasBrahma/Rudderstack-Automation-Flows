const path=require('path');
const fs=require('fs');
const BeforeAction = require('./BeforeAction');

class AfterActions{


static async formatDuration(ms) {
  try {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  let parts = [];
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
  if (seconds > 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
  return parts.join(' ');
  } catch (error) {
    throw new Error(`Fail: Error while formating executing duration for summary report`, error.message);
  }
  
}

static async generateSummaryReport(results){
  const reportsDir=BeforeAction.projectResultDir;
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  const filePath = path.join(reportsDir, 'summary-report.json');
  fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
  console.log(`summary-report saved to: ${filePath}`);
}



}

module.exports=AfterActions;