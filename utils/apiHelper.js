const axios = require('axios');
const path=require('path');
const fs=require('fs');

class APIHelper{
    
    static baseURL="";
    static apiURL="";
    static reqPayload="";
    static response="";
    static headersMap = new Map();

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
    } catch (err) {
        console.log("Error While Sending POST Request", err);
        response = err.response;
    }

    }


}

module.exports = { APIHelper };

