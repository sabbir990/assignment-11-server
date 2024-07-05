const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middlewares

const corsOptions = {
    origin : ['http://localhost:5173', 'http://localhost:5174'],
    // Credential : true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());


app.get('/', (req, res) => {
    res.use('My assignment server is running.....')
})

app.listen(port, () => {
    console.log(`This server is running on port ${port}`)
})