const express = require('express');
require('dotenv').config();
const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const {
    PORT = 3005,
    API_URL= "http://127.0.0.1",
    MONGODB_URI= "mongodb://localhost:27017/library_mongodb"
} = process.env;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Успешное подключение к MongoDB'))
    .catch((error) => {
        console.error('Ошибка подключения: ', error);
        process.exit(1);
    });

app.get('/', (req, res) => {
    res.status(200);
    res.send('Hello World!');
})

app.use(cors());
app.use(bodyParser.json());
app.use(userRouter);
app.use(bookRouter);

app.listen(PORT, ()=> console.log(`Server started on ${API_URL}:${PORT}`));