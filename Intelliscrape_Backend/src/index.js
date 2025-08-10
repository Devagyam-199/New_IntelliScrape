const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.get('/api', (req, res) => {
    res.send(`tum sarvaiya`);
});

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
