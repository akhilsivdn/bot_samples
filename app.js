var restify = require('restify');
var builder = require('botbuilder');
var http = require('http');


var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: '981d1927-614e-48b9-8e05-3263d8f2dd79',
    appPassword: 'HTiovjcPQGkpJO6fSWNN1Zq'
});

//var bot = new builder.UniversalBot(connector);
//var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/94bb3f03-01ea-4b24-aa89-d8b6e4bb324f?subscription-key=d78155f56dc04ce09329793bce0101eb');

server.post('/api/messages', connector.listen());


var bot = new builder.UniversalBot(connector, [
    function (session) {
        builder.Prompts.text(session, "Hello... What's your name?");
    },
    function (session, results) {
        session.userData.name = results.response;
        builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?");
    },
    function (session, results) {
        session.userData.coding = results.response;
        builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
    },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.send("Got it... " + session.userData.name +
                     " you've been programming for " + session.userData.coding +
                     " years and use " + session.userData.language + ".");
    }
]);



// var intents = new builder.IntentDialog({ recognizers: [recognizer] });
// bot.dialog('/', intents);

// intents.matches('GoodMorning', [
//     function (session, args, next) {
//        if (args.entities.length > 0) {
//             var searchText =  args.entities[0];
//        }
// }]);

