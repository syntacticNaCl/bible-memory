#!/bin/bash
npm install \
&&
zip bibLambda.zip handlers.js index.js package.json node_modules/* \
&&
aws cloudformation package --template bible-mem-sam.yaml --s3-prefix bible-mem-lambda --s3-bucket c4tk-alexa --output-template-file bible-mem-sam-packaged.yaml
# && \
# aws cloudformation deploy --template-file bible-mem-sam-packaged.yaml --stack-name sam-bible-mem
