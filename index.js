/**
 * index.js
 * Edited by Jonathan Massé.
 * Date : 2021-08-10.
 * Goal : A lambda NodeJS serverless function that forward an email (received by SendGrid) to an SMS message (Using Twilio API).
 * 
 * Copyright 2010-2021 Jonathan Massé, Twilio or its affiliates. All Rights Reserved.
 * Based on https://www.twilio.com/blog/serverless-email-sms-gateway-lambda
 * 
 */

/**
 * 
 * Includes
*/
const parser = require("lambda-multipart-parser");
const twilio = require("twilio");

/**
 *
 * @param {String} from - FROM parameter passed from SendGrid
 * @returns {String} Containing email address
 */
const extractEmails = from => {
  return from.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
};

/**
 *
 * @param {String} from - FROM parameter passed from SendGrid
 * @returns {Boolean}
 */
const validateSender = from => {
  let emails = extractEmails(from);
  let isValid = false;
  let domains = process.env.AllowedDomains.toLowerCase().split(",");
  domains.forEach(domain => {
    if (emails[0].indexOf(domain) >= 0) {
      isValid = true;
    }
  });

  return isValid;
};


/**
 *
 * Main function to execute.
 */
exports.handler = async event => {
  var client = new twilio(event.queryStringParameters.accountsid, event.queryStringParameters.authtoken);
  let data = await parser.parse(event);
  console.log("input data: ", data);

  // If this is a valid sender / domain.
  if (validateSender(data.from.toLowerCase())) {
    // parse the to number from the left-hand side of the email address
    let regexp = /(^.\d+[^@])/g;
    let to = data.to.match(regexp)[0];

    // Here display only the email text message.
    // let body = `Subject: ${data.subject}\nMessage: ${data.text}`;
    let body = `${data.text}`;

    let message;

    // Try to send the SMS message.
    try {
      message = await client.messages.create(
        {
          body: body,
          from: event.queryStringParameters.phonenumber,
          to: to
        });
    }
    // If there is an error sending the SMS message.
    catch (err) {
      console.log(err);
      const response =
      {
        statusCode: 500,
        headers: {'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'},
        body: "Internal server error"
      };
      return response;
    }

    // Message sent successfully
    console.log("Message Output: ", message);
    const response =
    {
      statusCode: 200,
	  headers: {'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'},
      body: JSON.stringify({ input: data, output: message })
    };
    return response;
  }
  // Invalid sender / domain.
  else {
    const response =
    {
      statusCode: 403,
	  headers: {'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'},
      body: "Unauthorized Sender"
    };
    console.log(response.body);
    return response;
  }
};