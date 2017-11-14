const express = require('express');
const sessions = require('express-session')
const bodyParser = require('body-parser');
const mc = require( `./controllers/messages_controller` );
require('dotenv').config()

//Middleware
const createInitialSession = require( `./middleware/session` );
const filter = require('./middleware/session');

const app = express();

app.use( bodyParser.json() );

console.log(__dirname)


app.use( express.static( `${__dirname}/../build` ) );
app.use(sessions({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized:true,
  cookie:{
    maxAge: 60000
  }

}))

app.use(createInitialSession);
app.use((req,res,next) => {
  if(req.method === 'POST' || req.method === 'PUT'){
    filter(req,res,next);
  }
  else{
    next();
  }
})

const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, mc.create );
app.get( messagesBaseUrl, mc.read );
app.get( messagesBaseUrl + '/history', mc.history)
app.put( `${messagesBaseUrl}`, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );

const port = process.env.PORT || 3000
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );
