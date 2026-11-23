const express = require('express');
require('dotenv').config();
const userRouter = require('./routes/users');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/mydb';

mongoose.connect(uri)
    .then(() => console.log('Успешное подключение к MongoDB'))
    .catch((error) => {
        console.error('Ошибка подключения: ', error);
        process.exit(1);
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