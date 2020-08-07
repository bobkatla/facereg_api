// extra requirements
const bcrypt = require('bcrypt');
const cors = require('cors');

// the database connect
const knex = require('knex');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
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

const corsOptions = {
    origin: 'https://face-detecting-bob-prj.herokuapp.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cors(corsOptions));

// RESTful api

// below is the old way without currying where you inject req res along with needed info to pass to functions
// app.post('/register', (req, res) => {
//     register.registerHandle(req, res, db, bcrypt);
// })

// Note to see some explaination of currying in the login file

app.get('/', (req, res) => {res.json('it is working');})

app.post('/test', (req, res) => {
    const {something} = req.body;
    res.json(something);
})

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