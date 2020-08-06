const loginHandle = (db, bcrypt) => (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json('incorrect form submission')
    }

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
}

module.exports = {
    loginHandle
}

/* 
explain the function in function, so in the app.post, it will return a req and res,
however as I run a function that does not take the req and res as parameter,
the function will be function()(req, res) -> currying in javascript
that is why here we can do (parameters) => (req, res) => {this scope can access all the parameters with req and res}
in the code in server.js you can't see (req, res) as it is automatic so you can put it in and it does not matter
To explain more,
the source of this part (the link) is 

    app.post('/signin', login.loginHandle(db, bcrypt));

in here you can treat the whole login.loginHandle(db, bcrypt) as a function, you can imagine

const access = login.loginHandle(db, brypt);
and access will now, as the second parameter of the app.post , can take (req, res)
-> access(req, res)
so the whole thing is actually: app.post('/signin, access(req, res))
but however you can remover (req, res) as it is automatated in there
*/