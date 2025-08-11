Feature: Rudder Stack Automation Flow


@RudderStack
Scenario: Verify rudder stack automation flow and verify api
Given Navigate to the home page
When Read 'Data Plane' and Save as 'DataPlane' from the Rudder Stack Dashboards
When Read 'Write Key' and Save as 'WriteKey' from the Rudder Stack Dashboards
Then Send a HTTP POST API request to 'identify' with 'IDENTIFY' payload and Verify Response Code
Then Send a HTTP POST API request to 'track' with 'TRACK' payload and Verify Response Code
Then Send a HTTP POST API request to 'page' with 'PAGE' payload and Verify Response Code
Then Send a HTTP POST API request to 'screen' with 'SCREEN' payload and Verify Response Code
Then Send a HTTP POST API request to 'group' with 'GROUP' payload and Verify Response Code
Then Send a HTTP POST API request to 'alias' with 'ALIAS' payload and Verify Response Code
Then Send a HTTP POST API request to 'batch' with 'BATCH' payload and Verify Response Code
When Click on the Webhook Destination 'Webhook avas' and Click on the Tab 'Events'
Then Read and Save the count of delivered and failed events