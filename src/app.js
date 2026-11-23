const express = require('express');
require('dotenv').config();
const userRouter = require('./routes/users');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/backend-library', err => {
    if (err) throw err;

    console.log('MongoDB Connected!');
});

const app = express();

const {PORT = 3000, API_URL= "http://127.0.0.1"} = process.env;

app.get('/', (req, res) => {
    res.status(200);
    res.send('Hello World!');
})

app.post('/', (req, res) => {
    res.status(200);
    res.send('Hello World!');
})

app.use(cors());
app.use(bodyParser.json());
app.use(userRouter);

app.listen(PORT, ()=> console.log(`Server started on ${API_URL}:${PORT}`));