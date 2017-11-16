/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: '86b76828-be0e-4996-a3d8-b7177217abaa',//process.env.MicrosoftAppId,
    appPassword: 'cxksvFJYBCVM6473%)!ko1(',//process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

//// Create your bot with a function to receive messages from the user
//var bot = new builder.UniversalBot(connector, function (session) {
//    session.send("Hola gato dijiste: %s", session.message.text);
//});
var bot = new builder.UniversalBot(connector);


//let luisApp = process.env.LUIS_APP;
//let luisKey = process.env.LUIS_KEY;

let luisApp ='79fa449f-4feb-4051-b2a4-00f5a8ee221f';
let luisKey = 'a6e721a8bf894a359da97e8d16c74548';

// Crear un procesador LUIS que apunte a nuestro modelo en el root (/)
var model = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/${luisApp}?subscription-key=${luisKey}&timezoneOffset=-3.0&verbose=true`;

var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);



dialog.onDefault(builder.DialogAction.send("No entendí. Me lo decís de nuevo pero de otra manera, por favor?"));