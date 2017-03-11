#!/bin/bash
npm install \
&&
find . \
 '(' -perm -0700 -exec chmod 0777 '{}' + ')' -o \
 '(' -perm -0600 -exec chmod 0666 '{}' + ')' \
&&
zip -R bibLambda.zip handlers.js index.js package.json node_modules/* \
&&
aws cloudformation package --template bible-mem-sam.yaml --s3-prefix bible-mem-lambda --s3-bucket c4tk-alexa --output-template-file bible-mem-sam-packaged.yaml --region=us-east-1 \
&&
aws cloudformation deploy --template-file bible-mem-sam-packaged.yaml --stack-name sam-bible-mem --region=us-east-1
