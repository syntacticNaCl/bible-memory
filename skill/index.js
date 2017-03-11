'use strict'

const axios = require('axios');
const Alexa = require('alexa-sdk');

//const alexaHandlers = require('/handlers');

const instance = axios.create({
    baseURL: 'https://c4tk.contentplatform.prod.lifeway.com/scripture/'
});



const handlers = {
    ReadVerse : function(){
        var vm = this;
        instance.get('/John%203%3A16')
        .then(function(res) {
            var scriptureText = res.data.text;
            console.log(scriptureText);
            vm.emit(':tell', scriptureText);
        })
        .catch( function(error){
            console.log(error);
        });
    },
    SayVerse : function() {
        console.log(this.event.request.intent);
        let firstOrThird;
        let verseObj = this.event.request.intent.slots;

        let book = verseObj.Book.value.charAt(0).toUpperCase() + verseObj.Book.value.slice(1);

        if(verseObj.Book.value.toLowerCase().includes("first") || verseObj.Book.value.toLowerCase().includes("second") || verseObj.Book.value.toLowerCase().includes("third")){
            let ar = verseObj.Book.value.split(" ");

            firstOrThird = ar[0];
            book = ar[1].charAt(0).toUpperCase() + ar[1].slice(1);

            switch(firstOrThird){
            case "first": 
                 book = "1" + ar[1];
                 break;
            case "second":
                book = "2" + ar[1];
                break;
            case "third":
                book = "3" + ar[1];
                break
            default: 
                break;
        }
    }
    

        let path = encodeURIComponent(book + ' ' + verseObj.Chapter.value + ':' + verseObj.Verse.value);
        
        let vm = this;

        instance.get('/' + path)
        .then(function(res){
            let scriptureRes = res.data.text;
            console.log(scriptureRes);

            vm.emit(':tell', scriptureRes);
        })
        .catch(function(err){
            console.log(err);
        });
    },
    Unhandled : function() {
        this.emit(':tell', "Sorry for you I have not this intent");
    }
}


exports.handler = function (event, context) {
    // console.log(event);
    //
    // var jsonStr = event.request.intent.slots;
    // console.log(jsonStr);

    let alexa = Alexa.handler(event, context);

    // alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    // alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
