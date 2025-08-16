const axios = require('axios');
const path=require('path');
const fs=require('fs');
const assert = require('assert');
const { logger } = require("./loggerHelper");

class APIHelper{
    constructor() {
        this.baseURL = "";
        this.apiURL = "";
        this.apiVersion = "";
        this.headers = new Map();
        this.payload = null;
        this.response = null;
    }

    setBaseURL(baseURL) {
        if (!baseURL || typeof baseURL !== "string") {
            throw new Error("Base URL must be a non-empty string.");
        }
        this.baseURL = baseURL;
        logger.info(`Base URL set to: ${this.baseURL}`);
    }

    setEndPoint(endpoint) {
        if (!endpoint || typeof endpoint !== "string") {
            throw new Error("Endpoint must be a non-empty string.");
        }
        this.apiURL = `${this.baseURL}${endpoint}`;
        logger.info(`API endpoint set to: ${this.apiURL}`);
    }

    setAPIVersion(version) {
        if (!version.startsWith("/")){
          version = "/" + version;
        }
        this.apiVersion = version;
        logger.info(`API version set to: ${this.apiVersion}`);
    }
    setEndPoint(endpoint) {
        if (!endpoint.startsWith("/")) {
          endpoint = "/" + endpoint;
        }
        this.apiURL = `${this.baseURL}${this.apiVersion}${endpoint}`;
        logger.info(`API endpoint set to: ${this.apiURL}`);
    }

    addHeader(key, value) {
        if (!key || !value) {
            throw new Error("Header key and value must be provided.");
        }
        this.headers.set(key, value);
        logger.info(`Header added: ${key}=${value}`);
    }

    async setPayloadFromFile(jsonFileName) {
        try {
            const projectRoot = path.resolve(__dirname, "..");
            const payloadPath = path.join(projectRoot, "apiPayloads", `${jsonFileName}.json`);
            if(!fs.existsSync(payloadPath)) {
                throw new Error(`Payload file not found: ${payloadPath}`);
            }
            this.payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
            logger.info(`Payload loaded from: ${payloadPath}`);
        } catch (error) {
            throw new Error(`Error loading payload: ${error.message}`);
        }
    }


    async sendPOSTRequest(method) {
        if (!this.apiURL) throw new Error("API URL is not set.");
        if (!["GET", "POST", "PUT", "DELETE", "PATCH"].includes(method.toUpperCase())) {
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
        const headersObj = Object.fromEntries(this.headers);

        try {
            logger.info(`Sending ${method} request to: ${this.apiURL}`);
            this.response = await axios({
                method,
                url: this.apiURL,
                headers: headersObj,
                data: this.payload
            });
            logger.info(`Received response with status: ${this.response.status}`);
        } catch (error) {
            logger.error(`Request failed: ${error.message}`);
            throw error;
        }
    }

    verifyStatusCode(expectedStatus) {
        if (!this.response) throw new Error("No response to verify.");
        assert.strictEqual(this.response.status,
            expectedStatus,
            `Expected status ${expectedStatus}, but got ${this.response.status}`
        );
        logger.info(`Status code ${this.response.status} matches expected ${expectedStatus}`);
    }

    getResponseBody() {
        return this.response?.data ?? null;
    }

    getResponseHeaders() {
        return this.response?.headers ?? {};
    }

  static getBasicAuthHeader(username,password) {
    if (!username) {
        throw new Error("Username is required for Basic Auth");
    }
    const credentials = `${username}:${password}`;
    const encoded = Buffer.from(credentials, "utf8").toString("base64");
    return `Basic ${encoded}`;
}



}

module.exports = { APIHelper };

