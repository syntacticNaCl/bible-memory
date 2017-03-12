#!/bin/bash

cd skill
npm install
aws cloudformation package --template ../bible-mem-sam.yaml --s3-prefix bible-mem-lambda --s3-bucket c4tk-alexa --output-template-file ../bible-mem-sam-packaged.yaml --region=us-east-1
s3key=`grep ../bible-mem-sam-packaged.yaml -e "CodeUri:" | sed -e 's/CodeUri: s3:\/\/c4tk-alexa\///g'`
echo $s3key
aws lambda update-function-code --function-name "test-alexa-bible-function-sam" --s3-bucket "c4tk-alexa" --s3-key $s3key --region=us-east-1

##&&
##aws cloudformation deploy --template-file ../bible-mem-sam-packaged.yaml --stack-name sam-bible-mem --region=us-east-1
