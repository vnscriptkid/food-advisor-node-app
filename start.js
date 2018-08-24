const mongoose = require('mongoose');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

// Connect to our db and handle an bad connections
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise; // Tell mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
    console.error(err.message);
});
mongoose.connection.on('connected', (err) => {
    console.error(`Connected to ${process.env.DATABASE}`);
});

// import all models
require('./models/Store');
require('./models/User');
require('./models/Review');

// Start our app
const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
    console.log(`Express running on port ${app.get('port')}`)
})