const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: process.env.API_CLA
});

const clarifaiHandle = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => res.status(400).json('problem with api'));
}

const imageHandle = (db) => (req, res) => {
    const {id} = req.body;
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0]))
        .catch(err => res.status(400).json('cannot function'));
}

module.exports = {
    imageHandle,
    clarifaiHandle
}