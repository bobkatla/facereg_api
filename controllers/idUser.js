const idHandle = (db) => (req, res) => {
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
}

module.exports = {
    idHandle
}