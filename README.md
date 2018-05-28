# Node.js API with exppressjs to detect text from image
A simple Node.js application using expressjs to detect text from uploaded image file using Amazon Rekognition.

## Requirements

The only requirement of this application is the Node Package Manager. All other
dependencies (including the AWS SDK for Node.js) can be installed with:

    npm install

## Basic Configuration

You need to set up your AWS security credentials before the sample code is able
to connect to AWS. You can do this by creating a file named ".env" at 
/var/www/html/<path_of_nodeproject>/.env for Linux users and saving the following lines in the file:
    
    key = "<your_access_key_id>"
    id = "<your_secret_key>"
    region = "<your_aws_region>"                 

## Running the sample

Simply run

    node expressdownload.js

The S3 documentation has a good overview of the [restrictions for bucket names](http://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html)
for when you start making your own buckets.


