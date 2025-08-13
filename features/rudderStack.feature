Feature: Validating HTTP API Request from RudderStack source to destination webhook and verifying delivery status


@RudderStack @test
Scenario: Verify user can send HTTP request from source write key and validate event delivery and failed count 
Given User enters username and password and logs in to the RudderStack Dashboard
When User reads the 'Data Plane' value from the RudderStack Dashboard and saves it as 'DataPlane'
And User reads the 'Write Key' value from the RudderStack Dashboard and saves it as 'WriteKey'
And User sends an HTTP POST request to 'identify' with 'IDENTIFY' payload and verifies the response code
And User sends an HTTP POST request to 'track' with 'TRACK' payload and verifies the response code
And User sends an HTTP POST request to 'page' with 'PAGE' payload and verifies the response code
And User sends an HTTP POST request to 'screen' with 'SCREEN' payload and verifies the response code
And User sends an HTTP POST request to 'group' with 'GROUP' payload and verifies the response code
And User sends an HTTP POST request to 'alias' with 'ALIAS' payload and verifies the response code
And User sends an HTTP POST request to 'batch' with 'BATCH' payload and verifies the response code
When User clicks on the Webhook Destination 'Webhook avas' and navigates to the 'Events' tab
Then User reads and saves the count of delivered and failed events