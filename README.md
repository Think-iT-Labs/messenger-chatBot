# messenger-chatBot
This is a minimal functional messenger chat bot.

It is writtin on nodejs (express) and deployable on heroku.

It is meant for a fast workshop.

Once the workshop is done you can continue your bot development refering to [official docs](https://developers.facebook.com/docs/messenger-platform)

### Pre-requisites
[Official step by step](https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start)
You will need:
- A public ssl protected server
- A facebook app
- A facebook page
In your code the action matching a GET /webhook must compare a shared token (verifyToken) between your app and your facebook app.

### How it works
There is only one source file: index.js

##### 1. Recieving a message
Once configured and the webhook validated, upon the end user writting a message to your facebook page, it will be transfered to your app via POST /webhook.

The recieved data have as mime-type json/application and contains an array of entries each entry contain an array of a messaging event.

The messaging event schema may vary from one to an other, you can [find more about theme here!](https://developers.facebook.com/docs/messenger-platform/webhook)

<small>Each entry represent from where the data were recieved (in our case it is the facebook page).
Messaging events are grouped for performance reason.</small>
##### 2. Understanding the message
Depending of the message recived you will be adding some logic to your app, ending probably by sending a reply.

##### 3. sending a message
You can now respond to the user via faceook.

To do that just emit an authenticated POST json/application request to graph.facebook.com, the body of your request will contain the id -within your page scope- of the fb-user and a message.

The message vary depending of the elements you are willing to display, you can [check the full list here](https://developers.facebook.com/docs/messenger-platform/reference/send-api)

