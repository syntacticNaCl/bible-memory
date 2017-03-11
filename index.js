'use strict'

const axios = require('axios');
const Alexa = require('alexa-sdk');
const HANDLERS = require('/handlers');

const instance = axios.create({
    baseURL: 'https://c4tk.contentplatform.prod.lifeway.com/scripture/'
});



exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(HANDLERS.handlers);
    alexa.execute();
};





export.handlers = function (event, context) {

    let alexa = Alexa.handler(event, context);

    // alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    // alexa.resources = languageStrings; 
    alexa.registerHandlers(handlers);
    alexa.execute();
};
