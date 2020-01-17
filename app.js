/**
 * Module dependencies.
 */

const express = require('express');
const routes = require('./routes');
const http = require('http');
const path = require('path');
const fs = require('fs');
const cfenv = require('cfenv');
const chatbot = require('./config/bot.js');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler');


const app = express();

const fileToUpload;

const dbCredentials = {
    dbName: 'my_sample_db'
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' === app.get('env')) {
    app.use(errorHandler());
}

app.get('/', routes.chat);

// =====================================
// WATSON CONVERSATION FOR ANA =========
// =====================================
app.post('/api/watson', function (req, res) {
    processChatMessage(req, res);
}); // End app.post 'api/watson'

function processChatMessage(req, res) {
    chatbot.sendMessage(req, function (err, data) {
        if (err) {
            console.log("Error in sending message: ", err);
            res.status(err.code || 500).json(err);
        }
        else {
//            Logs.find({
//                selector: {
//                    'conversation': data.context.conversation_id
//                }
//            }, function (err, result) {
//                if (err) {
//                    console.log("Cannot find log for conversation id of ", data.context.conversation_id);
//                }
//                else if (result.docs.length > 0) {
//                    var doc = result.docs[0];
//                    console.log("Sending log updates to dashboard");
                    //console.log("doc: ", doc);
//                    io.sockets.emit('logDoc', doc);
//                }
//                else {
//                    console.log("No log file found.");
//                }
//            });
            var context = data.context;
//            var owner = req.user.username;
            res.status(200).json(data);
        }
    });
}

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});
