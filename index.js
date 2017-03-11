'use strict'

const axios = require('axios');
const Alexa = require('alexa-sdk');

const instance = axios.create({
    baseURL: 'https://c4tk.contentplatform.prod.lifeway.com/scripture/'
});


instance.get('/John%203%3A16')
        .then(function(res) {
            var scriptureText = res.data.text;
            console.log(scriptureText);
            this.emit(':tell', scriptureText.text);
        })
        .catch( function(error){
            console.log(error);
        });

