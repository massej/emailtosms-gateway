#  emailtosms-gateway
 ### Amazon Serverless Lambda NodeJS Function
 
 A lambda NodeJS serverless function that forward an email (received by SendGrid) to an SMS message (Using Twilio API).
 
 See this blog article for details on how to deploy this Email to SMS gateway:<br> 
 https://www.twilio.com/blog/serverless-email-sms-gateway-lambda
  
# Lambda environment variables configuration

| Name        | Description           |
| ------------- |:-------------:|
| AllowedDomains      | Allowed domains sender list (separated by a coma).<br><br>If there are no domains, it will allow any domains to send email. (For security concern, it is recommended to set this value.)<br><br>Example :<br>If we want to allow @test.com and @test.net to send email to SMS.<br>We need to set this value to "@test.com,@test.net"<br><br>Type : string.|

# HTTP GET variables configuration

| Name        | Description           |
| ------------- |:-------------:|
| twilio_accountsid      | Your Twilio account SID.<br><br>Type : string.|
| twilio_authtoken      | Your Twilio account authentication token.<br><br>Type : string.|
| twilio_phonenumber      | Your Twilio phone number to use to send the SMS message.<br><br>Type : string.|
