const express = require('express')
const app = express()
const cors = require('cors');
// const mongoose = require('mongoose');
require('dotenv').config();
const getUser = require('./Models/User')

const PORT = process.env.PORT || 3001;
app.use(cors());




app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/books', getUser)

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});