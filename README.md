# faas
# Serverless
This Function is used to Send emails to users who ask password reset. This function will send 1 email to each user who triggers the API in 15 minutes. The time count is maintained using ttl in Dynamo db table. This function is triggered using SNS notification.

# CICD
CI/CD is implemented on the project usig Circleci. On a merge to master the circle ci job will upload function zip to S3 bucket, and this function will get updated on the existing lambda function.