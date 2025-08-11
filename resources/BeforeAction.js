const path=require('path');
const fs=require('fs');
const { setDynamicDataFilePath, setExecutionId } = require('../utils/dynamicDataHelper');

class BeforeAction {

static resultTimeStampFolderPath;
static currentExeIdFolderPath;

static async runBeforeAllConfig(){
    const timeStamp=new Date().toISOString().replace(/[-:.]/g,'');
    const projDir=path.resolve(process.cwd(),'reports');
    BeforeAction.resultTimeStampFolderPath=path.join(projDir, `${timeStamp}`);
    console.log(`Test Execution Result Folder Created : ${BeforeAction.resultTimeStampFolderPath}`);
    await setDynamicDataFilePath(BeforeAction.resultTimeStampFolderPath);
}


static async beforTestConfig(scenario){
 let tags=String(scenario.pickle.tags.map(tag=>tag.name));
 const scenarioName=scenario.pickle.name;
 tags=tags.substring(1);
 let testName=tags.split(",")[0];
 await setExecutionId(testName);
 BeforeAction.currentExeIdFolderPath=path.join(BeforeAction.resultTimeStampFolderPath, testName);
 if(!fs.existsSync(BeforeAction.currentExeIdFolderPath)){
    fs.mkdirSync(BeforeAction.currentExeIdFolderPath, {recursive: true});
 }
 console.log(`Test Result Folder Created : ${BeforeAction.resultTimeStampFolderPath} for Test Case ${testName}`);
 console.log(`--------------  Executing Scenario ${scenarioName} --------------------`)
}

static async getCurrentExeIdFolderPath(){
    return BeforeAction.currentExeIdFolderPath;
}



}

module.exports=BeforeAction;