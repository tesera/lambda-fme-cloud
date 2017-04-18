
# lambda-fme-cloud

This is a [serverless](//serverless.com/) repo with [AWS Lambda functions](//aws.amazon.com/lambda/) which manipulate the [FME Cloud API](https://www.safe.com/fme/fme-cloud/).

## Dependencies

Be sure you have serverless installed globally.

    npm install -g serverless

## Installation

    git clone git@github.com:tesera/lambda-fme-cloud.git
    cd lambda-fme-cloud
    nvm use
    npm install

## Deployment

    cp sample.env.yml env.yml
    # Update your FME Cloud API Token in env.yml
    serverless deploy
