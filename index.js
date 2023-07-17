const express = require('express');
const app = express();
const port = 8000;

//to use layouts
const expressLayout = require('express-ejs-layouts');
//setting up database
const db = require('./config/mongoose');

//setting up express session
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStores = require('connect-mongo')(session);
//flash messages
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');

// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));

//to use the static files from assets folder
app.use(express.static('./assets'));
//make the uploads path available to the browser
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(expressLayout);

//extract and place the css and js file from subpages into the correct position
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


//set view engine to ejs and views folder to used for pages
app.set('view engine','ejs');
app.set('views','./views');

app.use(session({
    name: 'Happens',
    secret: 'sonuraut',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000*60*100)
    },
    store: new MongoStores({
        mongooseConnection: db,
        autoRemove: 'disabled'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(customMiddleware.setFlash);

app.use(passport.setAuthenticatedUser);


//use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`Error on running the server: ${err}`);
    }

    console.log(`Server running on port : ${port}`);
})