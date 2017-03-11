
const handlers = {
    ReadVerse : function(){
        instance.get('/John%203%3A16')
        .then(function(res) {
            var scriptureText = res.data.text;
            console.log(scriptureText);
            this.emit(':tell', scriptureText.text);
        })
        .catch( function(error){
            console.log(error);
        });
    }
}

module.exports = handlers;