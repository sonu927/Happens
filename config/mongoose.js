const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Happens_dev');

const db = mongoose.connection;

db.on('erros',console.error.bind(console,"error connecting to the database"));

db.once('open',function(){console.log("Sucessfully connected to database")});

module.exports = db;