import express from 'express';
import fetch from 'node-fetch';
import hbs from 'hbs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set('view engine', 'hbs');
app.engine('html', hbs.__express);
const root = path.join(__dirname, '../..')
app.use(express.static(root));

const TOKEN = '';
const PORT = 8080;
const OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`
    }
}

async function searchCounseling(zipcode, distance) {
    try {
        const geoLocation = await fetch(`https://api.zippopotam.us/us/${zipcode}`);
        if (!geoLocation.ok) throw new Error('Failed to fetch location data for the ZIP code');
        const geoData = await geoLocation.json();
        const { longitude, latitude } = geoData.places[0];
        const url = `https://data.hud.gov/Housing_Counselor/searchByLocation?Lat=${latitude}&Long=${longitude}&Distance=${distance}&RowLimit=10&Services=&Languages=`
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch counselor');
        const data = await response.json();
        return data;
    } catch (err) {
        throw new Error(`Error fetching home counselor: ${err.message}`);
    }
}

app.get('/', (req, res) => res.send('Good'))

app.get('/public/index.html', (req, res) => res.render('index.html'))

app.get('/resources/counselor', async (req, res) => {
    const { zipcode, distance } = req.query;
    if (!zipcode) return res.send(`Enter a valid zipcode!`);
    if (!distance) return res.send(`Enter a valid distance!`);
    const counselorData = await searchCounseling(zipcode, distance);
    hbs.registerHelper('len', function(obj) {return Object.keys(counselorData).length - 1});
    console.log(counselorData)
    res.render('counselor', counselorData);
})

app.listen(PORT, () => console.log(`Listening to port ${PORT}...`))