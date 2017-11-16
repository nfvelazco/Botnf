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
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

//var connector = new builder.ChatConnector({
//    appId: '86b76828-be0e-4996-a3d8-b7177217abaa',
//    appPassword: 'cxksvFJYBCVM6473%)!ko1(',
//});

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

dialog.matches('None', [
    function (session, args, next) {
        builder.Prompts.text(session, '¿Dónde estás?');
    }
]);

// Esta función se ejecuta cuando el Intent == ordenarTaxi
dialog.matches('Listado de cursos', [
    function (session, args, next) {
        var heroCard1 = new builder.HeroCard(session)
            .title('Curso 1')
            .subtitle('Este curso es para ver temas')
            .text('Se explicara como hacer algunas cosas de cositas')
            .images([
                builder.CardImage.create(session, 'data:image/jpeg;base64,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')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://docs.botframework.com/en-us/', 'Aprende')
            ]);

        var heroCard2 = new builder.HeroCard(session)
            .title('Curso 2')
            .subtitle('Este curso es para ver otros temas')
            .text('No se explica mucho')
            .images([
                builder.CardImage.create(session, 'data:image/jpeg;base64,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')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://docs.botframework.com/en-us/', 'Aprende')
            ]);

        // Creamos un array de tarjetas
        var tarjetas = [heroCard1, heroCard2];

        // Adjuntamos la tarjeta al mensaje
        var msj = new builder.Message(session).attachmentLayout(builder.AttachmentLayout.carousel).attachments(tarjetas);
        session.send(msj);
    }
]);

dialog.onDefault(builder.DialogAction.send("No entendí. Me lo decís de nuevo pero de otra manera, por favor?"));