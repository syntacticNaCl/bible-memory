'use strict'

const axios = require('axios');
const Alexa = require('alexa-sdk');
const alexaHandlers = require('/handlers');

const instance = axios.create({
    baseURL: 'https://c4tk.contentplatform.prod.lifeway.com/scripture/'
});


export.handler = function (event, context) {

    let alexa = Alexa.handler(event, context);

    // alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    // alexa.resources = languageStrings; 
    alexa.registerHandlers(alexaHandlers.handle);
    alexa.execute();
};
