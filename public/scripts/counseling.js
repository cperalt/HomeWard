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

async function searchCounseling(zipcode) {
    try {
        const geoLocation = await fetch(`https://api.zippopotam.us/us/${zipcode}`);
        if (!geoLocation.ok) throw new Error('Failed to fetch location data for the ZIP code');
        const geoData = await geoLocation.json();
        const { longitude, latitude } = geoData.places[0];
        const distance = 20;
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
    const zipcode = req.query.zipcode;
    if (!zipcode) return res.send('Enter a valid zipcode!');
    const counselorData = await searchCounseling(zipcode);
    //  const counselorData = [
    //     {
    //       services: 'DFC,FBC,FHW,NDW,PLW,PPC,PPW',
    //       languages: 'ENG,SPA',
    //       agcid: '84352',
    //       adr1: '5500 Executive Center Dr Ste 105',
    //       adr2: ' ',
    //       city: 'Charlotte',
    //       email: 'N/A',
    //       fax: '877-329-6222',
    //       nme: 'NACA (NEIGHBORHOOD ASSISTANCE CORPORATION OF AMERICA) CHARLOTTE, NC',
    //       phone1: '704-536-7676',
    //       statecd: 'NC',
    //       weburl: 'https://www.naca.com',
    //       zipcd: '28212-8821',
    //       agc_ADDR_LATITUDE: '35.203132',
    //       agc_ADDR_LONGITUDE: '-80.744152',
    //       parentid: '90101',
    //       county_NME: '',
    //       phone2: '617-250-6222',
    //       mailingadr1: '5500 Executive Center Dr Ste 105',
    //       mailingadr2: ' ',
    //       mailingcity: 'Charlotte',
    //       mailingzipcd: '28212-8821',
    //       mailingstatecd: 'NC',
    //       state_NME: 'North Carolina',
    //       state_FIPS_CODE: null,
    //       faithbased: 'N',
    //       colonias_IND: 'N',
    //       migrantwkrs_IND: 'N',
    //       agc_STATUS: 'P',
    //       agc_SRC_CD: 'HUD',
    //       counslg_METHOD: 'Face to Face Counseling,Phone Counseling,Video Conference'
    //     },
    //     {
    //       services: 'DFC,FBC,FHW,NDW,PLW,PPC,PPW',
    //       languages: 'ENG,SPA',
    //       agcid: '84566',
    //       adr1: '5855 Executive Center Dr Suite 400',
    //       adr2: ' ',
    //       city: 'CHARLOTTE',
    //       email: 'N/A',
    //       fax: '877-329-6222',
    //       nme: 'NACA (NEIGHBORHOOD ASSISTANCE CORPORATION OF AMERICA) CHARLOTTE, NC',
    //       phone1: '606-230-6222',
    //       statecd: 'NC',
    //       weburl: 'https://www.naca.com',
    //       zipcd: '28212-8881',
    //       agc_ADDR_LATITUDE: '35.199404',
    //       agc_ADDR_LONGITUDE: '-80.742765',
    //       parentid: '90101',
    //       county_NME: '',
    //       phone2: '617-250-6222',
    //       mailingadr1: '5855 Executive Center Dr Suite 400',
    //       mailingadr2: ' ',
    //       mailingcity: 'Charlotte',
    //       mailingzipcd: '28212-8883',
    //       mailingstatecd: 'NC',
    //       state_NME: 'North Carolina',
    //       state_FIPS_CODE: null,
    //       faithbased: 'N',
    //       colonias_IND: 'N',
    //       migrantwkrs_IND: 'N',
    //       agc_STATUS: 'P',
    //       agc_SRC_CD: 'HUD',
    //       counslg_METHOD: 'Face to Face Counseling,Phone Counseling,Video Conference'
    //     },
    //     {
    //       services: 'DFC,DFW,FBC,FBW,FHW,HIC,NDW,PLW,PPC,PPW,RHC',
    //       languages: 'ENG,SPA',
    //       agcid: '82067',
    //       adr1: '349 E Franklin St',
    //       adr2: null,
    //       city: 'Monroe',
    //       email: 'smuccdc@carolina.rr.com',
    //       fax: '704-292-1037',
    //       nme: 'MONROE-UNION COUNTY COMMUNITY DEVELOPMENT CORPORATION',
    //       phone1: '704-283-8804',
    //       statecd: 'NC',
    //       weburl: 'https://www.muccdc.com',
    //       zipcd: '28112-4823',
    //       agc_ADDR_LATITUDE: '34.981874',
    //       agc_ADDR_LONGITUDE: '-80.544095',
    //       parentid: '90188',
    //       county_NME: '',
    //       phone2: null,
    //       mailingadr1: 'PO Box 887',
    //       mailingadr2: null,
    //       mailingcity: 'Monroe',
    //       mailingzipcd: '28111-0887',
    //       mailingstatecd: 'NC',
    //       state_NME: 'North Carolina',
    //       state_FIPS_CODE: null,
    //       faithbased: 'N',
    //       colonias_IND: 'N',
    //       migrantwkrs_IND: 'N',
    //       agc_STATUS: 'A',
    //       agc_SRC_CD: 'HUD',
    //       counslg_METHOD: 'Face to Face Counseling,Group Counseling,Internet Counseling,Other Counseling,Phone Counseling,Video Conference' 
    //     },
    //     {
    //       services: 'DFC,NDW,PPC,PPW,RHC',
    //       languages: 'ENG,SPA',
    //       agcid: '90664',
    //       adr1: '10130 Perimeter Pkwy Ste 200',
    //       adr2: null,
    //       city: 'Charlotte',
    //       email: 'counselinginfo@moneymanagement.org',
    //       fax: '866-921-5129',
    //       nme: 'MONEY MANAGEMENT INTERNATIONAL - CHARLOTTE, N.C. BRANCH',
    //       phone1: '866-232-9080',
    //       statecd: 'NC',
    //       weburl: 'http://www.moneymanagement.org',
    //       zipcd: '28216-0197',
    //       agc_ADDR_LATITUDE: '35.347513',
    //       agc_ADDR_LONGITUDE: '-80.851707',
    //       parentid: '82554',
    //       county_NME: '',
    //       phone2: '866-232-9080',
    //       mailingadr1: '10130 Perimeter Pkwy Ste 200',
    //       mailingadr2: null,
    //       mailingcity: 'Charlotte',
    //       mailingzipcd: '28216-0197',
    //       mailingstatecd: 'NC',
    //       state_NME: 'North Carolina',
    //       state_FIPS_CODE: null,
    //       faithbased: 'N',
    //       colonias_IND: 'N',
    //       migrantwkrs_IND: 'N',
    //       agc_STATUS: 'P',
    //       agc_SRC_CD: 'HUD',
    //       counslg_METHOD: 'Face to Face Counseling,Group Counseling,Internet Counseling,Phone Counseling'
    //     },
    //     {
    //       services: 'DFC,DFW,FBC,FBW,NDW,PPC,PPW',
    //       languages: 'ENG',
    //       agcid: '80840',
    //       adr1: '4601 Charlotte Park Dr Ste 350',
    //       adr2: null,
    //       city: 'Charlotte',
    //       email: 'N/A',
    //       fax: null,
    //       nme: 'DreamKey Partners',
    //       phone1: '704-342-0933',
    //       statecd: 'NC',
    //       weburl: 'http://www.cmhp.org',
    //       zipcd: '28217-1920',
    //       agc_ADDR_LATITUDE: '35.183235',
    //       agc_ADDR_LONGITUDE: '-80.88992',
    //       parentid: '80989',
    //       county_NME: '',
    //       phone2: null,
    //       mailingadr1: '4601 Charlotte Park Dr Ste 350',
    //       mailingadr2: null,
    //       mailingcity: 'Charlotte',
    //       mailingzipcd: '28217-1920',
    //       mailingstatecd: 'NC',
    //       state_NME: 'North Carolina',
    //       state_FIPS_CODE: null,
    //       faithbased: 'N',
    //       colonias_IND: 'N',
    //       migrantwkrs_IND: 'N',
    //       agc_STATUS: 'A',
    //       agc_SRC_CD: 'HUD',
    //       counslg_METHOD: 'Phone Counseling'
    //     },
    //     {
    //       services: 'DFC,FBC,FBW,HMC,NDW,PLW,PPC,PPW,RHC,RHW',
    //       languages: 'ENG',
    //       agcid: '83584',
    //       adr1: '601 E 5th St Ste 220',
    //       adr2: null,
    //       city: 'Charlotte',
    //       email: 'N/A',
    //       fax: null,
    //       nme: 'COMMUNITY LINK',
    //       phone1: '800-977-1969',
    //       statecd: 'NC',
    //       weburl: 'http://www.communitylinknc.org',
    //       zipcd: '28202-3093',
    //       agc_ADDR_LATITUDE: '35.223811',
    //       agc_ADDR_LONGITUDE: '-80.836739',
    //       parentid: '80816',
    //       county_NME: '',
    //       phone2: null,
    //       mailingadr1: '601 E 5th St Ste 220',
    //       mailingadr2: null,
    //       mailingcity: 'Charlotte',
    //       mailingzipcd: '28202-3093',
    //       mailingstatecd: 'NC',
    //       state_NME: 'North Carolina',
    //       state_FIPS_CODE: null,
    //       faithbased: 'N',
    //       colonias_IND: 'N',
    //       migrantwkrs_IND: 'N',
    //       agc_STATUS: 'A',
    //       agc_SRC_CD: 'HUD',
    //       counslg_METHOD: 'Phone Counseling'
    //     },
    //     {
    //       services: 'DFC,DFW,FBC,FBW,PPC,PPW',
    //       languages: 'ENG',
    //       agcid: '84342',
    //       adr1: '8000 Corporate Center Dr',
    //       adr2: 'Suite 1114',
    //       city: 'Charlotte',
    //       email: 'home@knowdebt.org',
    //       fax: '704-973-9462',
    //       nme: 'ALLIANCE CREDIT COUNSELING, INC.',
    //       phone1: '704-341-1010',
    //       statecd: 'NC',
    //       weburl: 'https://www.knowdebt.org',
    //       zipcd: '28226-4464',
    //       agc_ADDR_LATITUDE: '35.086366',
    //       agc_ADDR_LONGITUDE: '-80.854376',
    //       parentid: '80816',
    //       county_NME: '',
    //       phone2: '866-303-3328',
    //       mailingadr1: '8000 Corporate Center Dr',
    //       mailingadr2: 'Suite 114',
    //       mailingcity: 'Charlotte',
    //       mailingzipcd: '28226-4464',
    //       mailingstatecd: 'NC',
    //       state_NME: 'North Carolina',
    //       faithbased: 'N',
    //       colonias_IND: 'N',
    //       migrantwkrs_IND: 'N',
    //       agc_STATUS: 'A',
    //       agc_SRC_CD: 'HUD',
    //       counslg_METHOD: 'Face to Face Counseling,Group Counseling,Internet Counseling,Phone Counseling,Video Conference'
    //     }
    //   ];
    console.log(counselorData);
    console.log(counselorData.length);
    hbs.registerHelper('len', function(obj) {return Object.keys(counselorData).length - 1});
    res.render('counselor', counselorData);
})

app.listen(PORT, () => console.log(`Listening to port ${PORT}...`))