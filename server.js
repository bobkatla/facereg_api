const express = require('express');
const app = express();
const cors = require('cors');
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

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json(database.users);
})

app.post('/signin', (req, res) => {
    const {email, password} = req.body;
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            if (data[0] === undefined) return res.status(400).json('error of not existing');
            else {
                bcrypt.compare(password, data[0].hash, function(err, result) {
                    if(result !== undefined) {
                        if(result) {
                            return db.select('*').from('users')
                                .where('email', '=', email)
                                .then(user => {
                                    res.json(user[0]);
                                })
                                .catch(err => res.status(400).json('error system'));
                        } else {
                            return res.status(400).json('wrong credentials')
                        }
                    }
                    if(err) {
                        return res.status(400).json('error system');
                    }
                });
            }
        });
})

app.post('/register', (req, res) => {
    const {email, password, name} = req.body;

    bcrypt.hash(password, saltRounds, function(err, hash) {
        db.transaction(trx => {
            trx.insert({
                hash,
                email
            })
            .into('login')
            .returning('email')
            .then(async loginEmail => {
                try {
                    const user = await trx('users')
                        .returning('*')
                        .insert({
                            email: loginEmail[0],
                            name,
                            joined: new Date()
                        });
                    res.json(user[0]);
                }
                catch (err) {
                    return res.status(400).json('unable to register');
                }
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
    });
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    const newId = Number(id);
    db.select('*').from('users').where({id})
        .then(user => {
            if (user.length) {
                res.json(user[0]);
            } else {
                res.status(404).json('error getting user');
            }
    })
})

app.put('/image', (req, res) => {
    const {id} = req.body;
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json('cannot function'));
})

app.listen(5000, () => {
    console.log('app is running on port 5000');
});