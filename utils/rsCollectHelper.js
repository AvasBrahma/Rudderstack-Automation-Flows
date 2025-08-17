const { logger } = require('./loggerHelper');
const { WDioHelper }=require('./wdioHelper');
const { saveTestData, getTestData}=require('./dynamicDataHelper');

class RSCollectHelper{
    static desEventCountXpath="//span[text()='{EventName}']/following-sibling::div/h2/span";
    static writeKeySpanXpath="//span[starts-with(text(), 'Write key')]";
    static dataPlaneSpanXpath="//span[text()='Data Plane']/following-sibling::div/div/span";


    static async webHookGetEventsCount(eventName){
        if(eventName=="Delivered"||eventName=="Failed"){
            let textLocator=RSCollectHelper.desEventCountXpath.replace("{EventName}",eventName);
            await WDioHelper.waitForElementVisible(textLocator, "DeliveryCount");
            let spanText=await WDioHelper.getText(textLocator);
            let count=parseInt(spanText);
            return count;
        }else{
            throw new Error(`Fail: Error Invalid Envent Name ${eventName}`, error.message);
    }}

    static async getWriteKey(){
        let writeKeyText= await WDioHelper.getText(RSCollectHelper.writeKeySpanXpath);
        if(writeKeyText.trim()!=""&&writeKeyText!=null){
             writeKeyText = writeKeyText.split(" ")[2];
             return writeKeyText;
             }else{
             throw new Error(`Got Write Key as Null or Blank, WriteKey: ${writeKeyText}`);
        }
    }

    static async getDataPlane(){
        let dataPlaneText= await WDioHelper.getText(RSCollectHelper.dataPlaneSpanXpath);
        return dataPlaneText.trim();
    }


}


module.exports = { RSCollectHelper };