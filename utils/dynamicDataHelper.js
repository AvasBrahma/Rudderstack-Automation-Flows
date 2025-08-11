const fs=require('fs');

let dynamicDataFilePath="";
let currentExecutionId="";

const setDynamicDataFilePath=async (filePath)=>{
    dynamicDataFilePath=filePath+"/dyanmicTestData.json";
}

const setExecutionId=async (testExecutionId)=>{
   currentExecutionId=testExecutionId;
}


const saveTestData=async(key, value)=>{
    let testData={};
    if(fs.existsSync(dynamicDataFilePath)){
        const fileContent=fs.readFileSync(dynamicDataFilePath, 'utf8');
        if(fileContent){
            testData=JSON.parse(fileContent);
        }
    }
    const testExecutionId=currentExecutionId;
    if(testExecutionId!==""){
        if (!testData[testExecutionId]) {
          testData[testExecutionId] = {};
        }
        testData[testExecutionId][key]=value;
        fs.writeFileSync(dynamicDataFilePath, JSON.stringify(testData, null, 2), 'utf8');
    }else{
        console.log("Fail: Blank Test Execution ID");
    }
}

const getTestData=async (key)=>{
    const testExecutionId=currentExecutionId;
    if(fs.existsSync(dynamicDataFilePath)){
        const fileContent=fs.readFileSync(dynamicDataFilePath, 'utf8');
        if(fileContent){
            const testData=JSON.parse(fileContent);
            return testData[testExecutionId]?testData[testExecutionId][key]:null;
        }
    }
    return null;
}

module.exports={setDynamicDataFilePath, setExecutionId, saveTestData, getTestData};
