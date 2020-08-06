const saltRounds = 10;

const registerHandle = (db, bcrypt) => (req, res) => {
    const {email, password, name} = req.body;

    if(!email || !name || !password) {
        return res.status(400).json('incorrect form submission')
    }

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
}

module.exports = {
    registerHandle
}