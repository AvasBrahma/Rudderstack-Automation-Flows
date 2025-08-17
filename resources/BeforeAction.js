const path=require('path');
const fs=require('fs');
const winston=require('winston');
const { setDynamicDataFilePath, setExecutionId } = require('../utils/dynamicDataHelper');
const { logger, createTestLogger } = require('../utils/loggerHelper');


class BeforeAction {

static resultTimeStampFolderPath;
static currentExeIdFolderPath;
static projectResultDir;

static async runBeforeAllConfig(){
    const timeStamp=new Date().toISOString().replace(/[-:.]/g,'');
    const projDir=path.resolve(process.cwd(),'reports');
    BeforeAction.projectResultDir=projDir;
    BeforeAction.resultTimeStampFolderPath=path.join(projDir, `${timeStamp}`);
    console.log(`Test Execution Result Folder Created : ${BeforeAction.resultTimeStampFolderPath}`);
    await setDynamicDataFilePath(BeforeAction.resultTimeStampFolderPath);
    const logsFilePath=createTestLogger(BeforeAction.resultTimeStampFolderPath);
    logger.add(new winston.transports.File({
    filename: logsFilePath,
    level: 'info'
 }));
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