const axios = require('axios');
const path=require('path');
const fs=require('fs');
const assert = require('assert');
const { logger } = require("./loggerHelper");

class APIHelper{
    
    static baseURL="";
    static apiURL="";
    static reqPayload="";
    static response="";
    static headersMap = new Map();
    static responseCode=null;
    static responseBody="";

    static async setBaseURL(baseURL){
       this.baseURL=baseURL;
    }

    static async setEndPoint(endPoint){
        this.apiURL=this.baseURL+endPoint;
    }

    static async addHeaders(headerKey, headerValue) {
       this.headersMap.set(headerKey, headerValue);
  }

    static async setPayload(jsonFileName){
        try {
           const projectRoot = path.resolve(__dirname, '..');
           const payloadPath = path.join(projectRoot, 'apiPayloads', jsonFileName+".json");
            if (!fs.existsSync(payloadPath)) {
           throw new Error(`Payload file not found: ${payloadPath}`);
           }
         this.reqPayload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));     
        } catch (error) {
            throw new Error(`Error while setting payload: ${error}`);
        }
     
    }
    static async getResponse(){
        return APIHelper.response;
    }
    static async getHeadersObject() {
      return Object.fromEntries(this.headersMap);
  }

    static async sendPOSTReq(){
            try {
                await this.addHeaders("Content-Type", "application/json");
                this.response = await axios.post(this.apiURL, this.reqPayload, {
                headers: await this.getHeadersObject()
        });
        this.saveResponseDetails(this.response);
    } catch (err) {
        console.log("Error While Sending POST Request", err);
        response = err.response;
    }

    }

    static async saveResponseDetails(response){
        this.responseCode=response.status;
    } 

    static async verifyResponseCode(expectedStatus) {
        const actualStatus = this.responseCode;
        assert.strictEqual(
        actualStatus,
        expectedStatus,
        `Expected status ${expectedStatus} but got ${actualStatus}`
    );
    logger.info(`Response status ${actualStatus} matches expected ${expectedStatus}`);
}



}

module.exports = { APIHelper };

