const aws = require("aws-sdk");
const documentClient = new aws.DynamoDB.DocumentClient({ region: "us-east-1" });
const { v4: uuidv4 } = require('uuid');
var ddb = new aws.DynamoDB({ apiVersion: "2012-08-10" });
aws.config.update({ region: "us-east-1" });
exports.emailService = function (event, context, callback) {
	let email = event.Records[0].Sns.Message;
	 console.log('NEWEST DEPLOYMENT');
	 let uuid= uuidv4();
	 let emailMessage = 'https://'+process.env.Domain_Name+'/reset?email='+email+'&token='+uuid;
	 var emailParams = {
		Destination: {
		  ToAddresses: [
			email
		  ]
		},
		Message: {
		  Body: {
	
			Html: {
			  Charset: "UTF-8",
			  Data: emailMessage
			}
		  },
		  Subject: {
			Charset: "UTF-8",
			Data: "Password Reset Link"
		  }
		},
		Source: "csye6225@" + process.env.Domain_Name
	  };

	const seconds = 15 * 60;
	const secondsSinceEpoch = Math.round(Date.now() / 1000);
	const expirationTime = (secondsSinceEpoch + seconds)

	  let putParams = {
		TableName: "csye6225",
		Item: {
		  email_id:  email ,
		  TimeToExist: expirationTime ,
		  token: uuid 
		}
	  };
	  let queryParams = {
		TableName: 'csye6225',
		Key: {
		  'email_id':email 
		},
	  }

	  documentClient.get(queryParams, function (err, data) {
		if (err) console.log(err, err.stack); // an error occurred
		else {
		  console.log("Data from dynamo db " + data);
		  if (data.Item == null) {
			documentClient.put(putParams, function (error, result) {
			  if (error) {
				console.log("Error in putting data " + error)
			  }
			  else {
				console.log("data added to dynamo db table " + result)
				var sendPromise = new aws.SES({ apiVersion: '2010-12-01' }).sendEmail(emailParams).promise();
				sendPromise.then(
				  function (data) {
					console.log("Email sent to: "+email+" Message id:: "+ data.MessageId);
				  }).catch(
					function (err) {
					  console.error(err, err.stack);
					});
			  }
			})
		  }
		  else {
			console.log("Email ID exists");
		  }
		}
	  })





	 
};
