/**
 * express module
 * @const
 */
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

// env variables
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


/*
 * Send a message to a facebook user
 * @param {string} userId - The id of the user -we are sending to- within the scope of the facebook page.
 * @param {Object} message - The message we want to send, messages types at https://developers.facebook.com/docs/messenger-platform/reference/send-api
 */
const sendApi = function(userId, message) {
  request({
    uri: 'https://graph.facebook.com/v2.10/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient:{
        id: userId
      },
      message: message
    }
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    } else {
      console.error(response);
      console.error(error);
    }
  }); 
}

/*
 * Read & reconize messages in order to respond to it.
 * @param {Object} messaging - more at https://developers.facebook.com/docs/messenger-platform/webhook
 */
const handleMessage = function(messaging) {
  const userId = messaging.sender.id;
  if(messaging.message) {
    if(messaging.message.text){
      var text = messaging.message.text;
      if(text === 'do') {
        let message = {
          text: "Something",
          quick_replies:[
            {
              content_type:"text",
              title:"Fun",
              payload:"FUN"
            },
            {
              content_type:"text",
              title:"Healthy",
              payload:"HEALTHY"
            }
          ]
        }
        return sendApi(userId, message);
      }else {
        let message = {text: text.toUpperCase()};
        return sendApi(userId, message);
      }
    }
  }

  if(messaging.postback){
    if(messaging.postback.payload === "HEALTHY") {
      let message = {text: "Go Run!"};
      return sendApi(userId, message);
    }
    if(messaging.postback.payload === "FUN") {
      let message = {text: "Go Party!"};
      return sendApi(userId, message);
    }
  }
}

/**
 * Route for home - dummy.
 * @name get/
 * @function
 * @param {string} path - Express path
 * @param {callback} action - Express action.
 */
app.get('/', function(req, res) {
  res.status(200).send("it works");
});

/**
 * Route for Veifying facebook's webhook
 * @name get/webhook
 * @function
 * @param {string} path - Express path
 * @param {callback} action - Express action.
 */
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === VERIFY_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }
});

/**
 * Route for receiving the messenger messages.
 * @name post/webhook
 * @function
 * @param {string} path - Express path
 * @param {callback} action - Express action.
 */
app.post('/webhook', function(req, res) {
  var entries = req.body.entry;
  entries.forEach(function(entry){
    var messagings = entry.messaging;
    messagings.forEach(function(messaging){
      handleMessage(messaging);
    })
  })
  res.status(200).send();
});

var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %s", server.address().port);
});