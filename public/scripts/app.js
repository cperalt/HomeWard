const express = require('express');
const app = express();

const TOKEN = '';
const PORT = 8080;
const OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`
    }
}



app.listen(PORT, () => console.log(`Listening to port ${PORT}...`))