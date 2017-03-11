'use strict'

const axios = require('axios');

const instance = axios.create({
    baseURL: 'https://c4tk.contentplatform.prod.lifeway.com/scripture/'
});


instance.get('/John%203%3A16').then(function(res) {
    var scriptureText = res.data.text;
    console.log(scriptureText);
}).catch( function(error){
    console.log(error);
});

