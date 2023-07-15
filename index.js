const express = require('express');
const app = express();
const port = 8000;

//to use layouts
const expressLayout = require('express-ejs-layouts');
//setting up database
const db = require('./config/mongoose');

// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));

//to use the static files from assets folder
app.use(express.static('./assets'));
app.use(expressLayout);

//extract and place the css and js file from subpages into the correct position
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


//set view engine to ejs and views folder to used for pages
app.set('view engine','ejs');
app.set('views','./views');


//use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`Error on running the server: ${err}`);
    }

    console.log(`Server running on port : ${port}`);
})