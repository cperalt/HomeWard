import express from 'express';
import fetch from 'node-fetch';
import hbs from 'hbs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set('view engine', 'hbs');
app.engine('html', hbs.__express);
const root = path.join(__dirname, '../..')
app.use(express.static(root));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;
const apiKey = process.env.API_KEY || 'AIzaSyBgAhCPbNjviOE0NapTIt_5lQxRG3GkSRI';

const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'password',
    database: process.env.DB_DATABASE || 'users'
})

//Static pages
app.get('/', (req, res) => res.redirect('/public/index.html'));
app.get('/public/index.html', (req, res) => res.render('../public/index.html'));
app.get('/public/about.html', (req, res) => res.render('../public/about.html'));
app.get('/public/resources.html', (req, res) => res.render('../public/resources.html'));
app.get('/public/contact.html', (req, res) => res.render('../public/contact.html'));
app.get('/public/volunteer.html', (req, res) => res.render('../public/volunteer.html'));

//Dynamic pages
app.get('/resources/counselor', async (req, res) => {
    const { zipcode, distance } = req.query;
    if (!zipcode) {
        const counselorData = [];
        hbs.registerHelper('len', function (obj) { return 0 });
        return res.render('counselor', counselorData);
    }
    else if (!distance) return res.send(`Enter a valid distance!`);
    else {
        const counselorData = await searchCounseling(zipcode, distance);
        hbs.registerHelper('len', function (obj) { return Object.keys(counselorData).length - 1 });
        res.render('counselor', counselorData);
    }
})

app.get('/searchFoodBanks', async (req, res) => {
    const {
        zipcode
    } = req.query;
    try {
        const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${apiKey}`);
        const geocodeData = await geocodeResponse.json();

        if (geocodeData.results.length === 0) {
            return res.status(404).send('No results found for the provided ZIP code');
        }

        const location = geocodeData.results[0].geometry.location;
        const placesResponse = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=5000&type=food_bank&key=${apiKey}`);
        const placesData = await placesResponse.json();

        res.render('nearby', { results: placesData.results })
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

//CRUD endoipoints
app.post('/data/volunteer', async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        connection.execute(`INSERT INTO mailing_list (first_name, last_name, email, phone, isVolunteer) values (?, null, ?, ?, true);`, [name, email, phone]);
        res.render('../public/volunteer.html');
    } catch (err) {
        console.error('Error inserting data into database', err);
        res.status(500).send('Error sending data');
    }
})

app.post('/data/contact', (req, res) => {
    const { 'first-name': firstName, 'last-name': lastName, email, phone } = req.body;
    try {
        connection.execute('INSERT INTO mailing_list (first_name, last_name, email, phone, isVolunteer) values (?, ?, ?, ?, false)', [firstName, lastName, email, phone]);
        res.render('/public/contact.html');
    } catch (err) {
        console.error('Error inserting data into database', err);
        res.status(500).send('Error sending data');
    }
})

// helper functions
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

// server connection
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`))