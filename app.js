/* api endpoint should be able to handle query string for: 
    * property_type
    * bedrooms
    * beds
* your response should always return JSON with below properties
    * _id
    * listing_url
    * name
    * summary
    * property_type
    * bedrooms
    * beds
*/

import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import express from 'express';
import cors from 'cors';

dotenv.config();
console.log(process.env);

const db_username = process.env.MONGO_DB_USERNAME;
const db_password = process.env.MONGO_DB_PASSWORD;
const db_url = process.env.MONGO_DB_URL;

const uri =
  `mongodb+srv://${db_username}:${db_password}@${db_url}?retryWrites=true&w=majority`;

const client = new MongoClient(uri);


/*
const dataSource = client.dataSource('Cluster0');
const database = client.database('sample_airbnb');
const collection = client.collection('listingsAndReviews');
const query = {"property_type" : property_type, "bedrooms" : bedrooms, "beds" : beds};
*/

const app = express();
//var cors = require('cors');
app.set('port', process.env.PORT || 3000);

app.use(cors());

// const property_type = req.query.property_type;
// const bedrooms = req.query.bedrooms;
// const beds = req.query.beds;

app.get('/findOne', async (req,res) => {
    try {
        //const dataSource = client.dataSource('Cluster0');
        const database = client.db('sample_airbnb');
        const collection = database.collection('listingsAndReviews');
        const query = {};
        if (req.query.property_type) {
            query.property_type = req.query.property_type;
        }
        if (req.query.bedrooms) {
            query.bedrooms = parseInt(req.query.bedrooms);
        }
        if (req.query.beds) {
            query.beds = parseInt(req.query.beds);
        }
        const aListing = await collection.findOne(query);
        console.log(aListing);
        res.type('json');
        res.status(200);
        res.json({
            /* return JSON with below proper ties
            * _id, listing_url, name, summary, property_type, bedrooms, beds */
            _id: aListing._id,
            listing_url: aListing.listing_url,
            name: aListing.name,
            summary: aListing.summary,
            property_type: aListing.property_type,
            bedrooms: aListing.bedrooms,
            beds: aListing.beds
        });
    } catch (error) {
      console.log(error)  
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    
});

app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});

app.listen(app.get('port'), () => {
        console.log('Express started');
});

