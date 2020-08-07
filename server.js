// extra requirements
const bcrypt = require('bcrypt');
const cors = require('cors');

// the database connect
const knex = require('knex');
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'conmeocon1',
        database: 'facereg'
    }
})

// connect with the api written in other files
const register = require('./controllers/register');
const login = require('./controllers/login');
const image = require('./controllers/image');
const idUser = require('./controllers/idUser');

// express.js connect later
const express = require('express');
const app = express();

// middleware

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "localhost:3000");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
 
// hard coded configuration object
conf = {
    // look for PORT environment variable,
    // else look for CLI argument,
    // else use hard coded value for port 8080
    port: process.env.PORT || process.argv[2] || 8080,
    // origin undefined handler
    // see https://github.com/expressjs/cors/issues/71
    originUndefined: function (req, res, next) {
        if (!req.headers.origin) {
            res.json({
                mess: 'Hi you are visiting the service locally. If this was a CORS the origin header should not be undefined'
            });
        } else {
            next();
        }
    },
    // Cross Origin Resource Sharing Options
    cors: {
        // origin handler
        origin: function (origin, cb) {
            // setup a white list
            let wl = ['https://dustinpfister.github.io'];
 
            if (wl.indexOf(origin) != -1) {
                cb(null, true);
            } else {
                cb(new Error('invalid origin: ' + origin), false);
            }
        },
        optionsSuccessStatus: 200
    }
};
 
// use origin undefined handler, then cors for all paths
app.use(conf.originUndefined, cors(conf.cors));

app.use(express.urlencoded({extended: false}))
app.use(express.json());
// app.use(cors());

// RESTful api

// below is the old way without currying where you inject req res along with needed info to pass to functions
// app.post('/register', (req, res) => {
//     register.registerHandle(req, res, db, bcrypt);
// })

// Note to see some explaination of currying in the login file

app.get('/', (req, res) => {res.json('it is working');})

app.post('/signin', login.loginHandle(db, bcrypt));

app.post('/register', register.registerHandle(db, bcrypt));

app.get('/profile/:id', idUser.idHandle(db));

app.put('/image', image.imageHandle(db));

app.post('/urlimage', image.clarifaiHandle);

// run on port 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});