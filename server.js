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
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cors());

// RESTful api

// below is the old way without currying where you inject req res along with needed info to pass to functions
// app.post('/register', (req, res) => {
//     register.registerHandle(req, res, db, bcrypt);
// })

// Note to see some explaination of currying in the login file

app.get('/', (req, res) => {res.json(database.users);})

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