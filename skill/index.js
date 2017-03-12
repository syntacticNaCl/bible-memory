'use strict'

const axios = require('axios');
const Alexa = require('alexa-sdk');
const AWS = require("aws-sdk");

//const alexaHandlers = require('/handlers');

const instance = axios.create({
    baseURL: 'https://c4tk.contentplatform.prod.lifeway.com/scripture/'
});



const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'Welcome to Scripture Memory. Ask me to study something?', 'Ask me to study a book, chapter and verse');
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
        this.emit(':tell', "Please ask me to read or study a verse");
    },
    StudyVerse : function(){
        console.log("STUDY VERSE FIRED");
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
            console.log(vm);
            console.log(scriptureRes);
            if(Object.keys(vm.attributes).length === 0) { // Check if it's the first time the skill has been invoked

                var originArray = scriptureRes.split(' ');

                var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
                var params = {
                    Item: {
                        "sessionId": {
                            S: vm.event.session.sessionId
                        }, "originText": {
                            S: scriptureRes
                        }, "answer": {
                            S: originArray[2].replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g,"")
                        }, "nextPosition": {
                            N: "3"
                        }
                    },
                    TableName: "c4tk-biblememory-session"
                };
                dynamodb.putItem(params, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else {
                        console.log(data);

                        console.log(originArray[0]);

                        vm.emit(':ask', originArray[0] + ' ' + originArray[1]);
                    }
                });
            }
        })
        .catch(function(err){
            console.log(err);
        });
    },
    NextWordIntent : function(){
        let resObject = this.event.request.intent.slots;
        let nextWord = resObject.NextWord.value;

        var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
        var params = {
            Key: {
                "sessionId": {
                    S: this.event.session.sessionId
                }
            },
            TableName: "c4tk-biblememory-session"
        };

        let vm = this;
        dynamodb.getItem(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data);
                console.log(data.Item.answer.S);
                console.log(nextWord);
                if(nextWord === data.Item.answer.S) {
                    var originArray = data.Item.originText.S.split(' ');
                    var nextPosition = parseInt(data.Item.nextPosition.N) + 3;

                    console.log(vm.event.session.sessionId);
                    console.log(data.Item.originText.S);
                    console.log(originArray[nextPosition]);
                    console.log(nextPosition);

                    var params = {
                        Item: {
                            "sessionId": {
                                S: vm.event.session.sessionId
                            }, "originText": {
                                S: data.Item.originText.S
                            }, "answer": {
                                S: originArray[nextPosition - 1].replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g,"")
                            }, "nextPosition": {
                                N: nextPosition.toString()
                            }
                        },
                        TableName: "c4tk-biblememory-session"
                    };
                    dynamodb.putItem(params, function(err, data) {
                        if (err) console.log(err, err.stack); // an error occurred
                        else {
                            console.log(data);

                            console.log(originArray[0]);

                            if ((typeof originArray[nextPosition - 3] !== undefined) && (typeof originArray[nextPosition -2] !== undefined)) {
                                vm.emit(':ask', originArray[nextPosition - 3] + ' ' + originArray[nextPosition - 2]);
                            }

                        }
                    });
                } else {
                    vm.emit(':ask', "Try again");
                }
            }
        });



        // console.log(this.attributes["originArray"]);
        // console.log(this.attributes["nextArraySpot"]);
        // if(nextWord === this.attributes.originArray[this.attributes.nextArraySpot])
        // {
        //     this.attributes.currentArraySpot = this.attributes.nextArraySpot + 1;
        //     this.attributes.nextArraySpot = this.attributes.currentArraySpot + 2;
        //     this.emit(':ask', this.attributes.originArray[this.attributes.currentArraySpot] + ' ' + this.attributes.originArray[this.attributes.currentArraySpot + 1]);
        // }
        // else
        // {
        //     this.emit(':ask', "Wrong! So sorry you can't remember stuff");
        // }
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
