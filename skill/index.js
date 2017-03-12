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

        if(verseObj.Book.value.includes("1") || verseObj.Book.value.includes("second") || verseObj.Book.value.includes("3")){
            let ar = verseObj.Book.value.split(" ");

            firstOrThird = ar[0];
            book = ar[1].charAt(0).toUpperCase() + ar[1].slice(1);

            switch(firstOrThird){
            case "1st":
                 book = "1 " + ar[1];
                 break;
            case "second":
                book = "2 " + ar[1];
                break;
            case "3rd":
                book = "3 " + ar[1];
                break
            default:
                break;
        }
    }

        let path;
        let intro;
        if(verseObj.StartVerse.value == null){
            path = encodeURIComponent(book + ' ' + verseObj.Chapter.value);
            intro = 'Reading ' + verseObj.Book.value + ' chapter ' + verseObj.Chapter.value + '<break time="500ms"/>'
        } else if(verseObj.StartVerse.value != null && verseObj.EndVerse.value == null) {
            path = encodeURIComponent(book + ' ' + verseObj.Chapter.value + ':' + verseObj.StartVerse.value);
            intro = 'Reading ' + verseObj.Book.value + ' chapter ' + verseObj.Chapter.value + ' verse ' + verseObj.StartVerse.value + '<break time="500ms"/>';
        } else if(verseObj.StartVerse.value != null && verseObj.EndVerse.value != null) {
            path = encodeURIComponent(book + ' ' + verseObj.Chapter.value + ':' + verseObj.StartVerse.value + '-' + verseObj.EndVerse.value);
            intro = 'Reading ' + verseObj.Book.value + ' chapter ' + verseObj.Chapter.value + ' verses ' + verseObj.StartVerse.value + ' through ' + verseObj.EndVerse.value + '<break time="500ms"/>';
        } else {
            path = encodeURIComponent(book + ' ' + verseObj.Chapter.value);
            intro = 'Reading ' + verseObj.Book.value + ' chapter ' + verseObj.Chapter.value + '<break time="500ms"/>';
        }

        let vm = this;

        instance.get('/' + path)
        .then(function(res){
            let scriptureRes = res.data.text;
            console.log(scriptureRes);

            vm.emit(':tell', intro + scriptureRes);
        })
        .catch(function(err){
            console.log(err);
        });
    },
    Unhandled : function() {
        this.emit(':tell', "Sorry for you I have not this intent");
    },
    StudyVerse : function(){
        console.log(this.event.request.intent);
        let firstOrThird;
        let verseObj = this.event.request.intent.slots;

        let book = verseObj.Book.value.charAt(0).toUpperCase() + verseObj.Book.value.slice(1);
        
        if(verseObj.Book.value.includes("1") || verseObj.Book.value.includes("second") || verseObj.Book.value.includes("3")){
            let ar = verseObj.Book.value.split(" ");

            firstOrThird = ar[0];
            book = ar[1].charAt(0).toUpperCase() + ar[1].slice(1);

            switch(firstOrThird){
            case "1st": 
                 book = "1 " + ar[1];
                 break;
            case "second":
                book = "2 " + ar[1];
                break;
            case "3rd":
                book = "3 " + ar[1];
                break
            default: 
                break;
        }
    }


        let path;
        let intro;
        if(verseObj.StartVerse.value == null){
            path = encodeURIComponent(book + ' ' + verseObj.Chapter.value);
            intro = 'Reading ' + verseObj.Book.value + ' chapter ' + verseObj.Chapter.value + '<break time="500ms"/>'
        } else if(verseObj.StartVerse.value != null && verseObj.EndVerse.value == null) {
            path = encodeURIComponent(book + ' ' + verseObj.Chapter.value + ':' + verseObj.StartVerse.value);
            intro = 'Reading ' + verseObj.Book.value + ' chapter ' + verseObj.Chapter.value + ' verse ' + verseObj.StartVerse.value + '<break time="500ms"/>';
        } else if(verseObj.StartVerse.value != null && verseObj.EndVerse.value != null) {
            path = encodeURIComponent(book + ' ' + verseObj.Chapter.value + ':' + verseObj.StartVerse.value + '-' + verseObj.EndVerse.value);
            intro = 'Reading ' + verseObj.Book.value + ' chapter ' + verseObj.Chapter.value + ' verses ' + verseObj.StartVerse.value + ' through ' + verseObj.EndVerse.value + '<break time="500ms"/>';
        } else {
            path = encodeURIComponent(book + ' ' + verseObj.Chapter.value);
            intro = 'Reading ' + verseObj.Book.value + ' chapter ' + verseObj.Chapter.value + '<break time="500ms"/>';
        }
        
        let vm = this;

        instance.get('/' + path)
        .then(function(res){
            let scriptureRes = res.data.text;
            console.log(res);
            if(Object.keys(this.attributes).length === 0) { // Check if it's the first time the skill has been invoked

                this.attributes['originText'] = scriptureRes;
                this.attributes['originArray'] = scriptureRes.split();
                this.attributes['currentArraySpot'] = 0;
                this.attributes['nextArraySpot'] = this.attributes['currentArraySpot'] + 2;

                let currentArraySpot = this.attributes['currentArraySpot'];

                vm.emit(':ask', this.attributes.originArray[currentArraySpot] + this.attributes.originArray[currentArraySpot + 1]);
            }

         
        })
        .catch(function(err){
            console.log(err);
        });
    },
    NextWordIntent : function(){
        let resObject = this.event.request.intent.slots;
        let nextWord = resObject.NextWord.value;
        if(nextWord === session.attributes.originArray[session.attributes.nextArraySpot])
        {
            session.attributes.currentArraySpot = session.attributes.nextArraySpot + 1;
            session.attributes.nextArraySpot = session.attributes.currentArraySpot + 2;
            this.emit(':ask', session.attributes.originArray[session.attributes.currentArraySpot] + session.attributes.originArray[session.attributes.currentArraySpot + 1]);
        }
        else
        {
            this.emit(':ask', "Wrong! So sorry you can't remember stuff");
        }
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
