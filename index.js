const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.m7wfdb3.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('photographyService').collection('services');

        const aboutCollection = client.db('photographyService').collection('about');

        const equipmentsCollection = client.db('photographyService').collection('equipments');

        const bannerCollection = client.db('photographyService').collection('banner');

        const reviewCollection = client.db('photographyService').collection('reviews');

        // creating api
        app.get('/services', async (req, res) => {
            const query = {};
            const sort = { price: -1 };
            const limit = 3;
            const cursor = serviceCollection.find(query).sort(sort).limit(limit);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const servicesId = await serviceCollection.findOne(query);
            res.send(servicesId);
        })
        app.get('/servicesAll', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const servicesAll = await cursor.toArray();
            res.send(servicesAll);
        })
        app.get('/servicesAll/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const servicesAllId = await serviceCollection.findOne(query);
            res.send(servicesAllId);
        })
        // about api created
        app.get('/about', async (req, res) => {
            const query = {};
            const cursor = aboutCollection.find(query);
            const about = await cursor.toArray();
            res.send(about);
        })
        // equipments api created
        app.get('/equipments', async (req, res) => {
            const query = {};
            const cursor = equipmentsCollection.find(query);
            const equipments = await cursor.toArray();
            res.send(equipments);
        })
        app.get('/banner', async (req, res) => {
            const query = {};
            const cursor = bannerCollection.find(query);
            const banner = await cursor.toArray();
            res.send(banner);
        });

        app.get('/reviews', async (req, res) => {

            let query = {};

            if (req.query.service) {
                query = {
                    service: req.query.service
                }
            }

            if (req.query.customerMail) {
                query = {
                    customerMail: req.query.customerMail
                }
            }
            const cursor = reviewCollection.find(query);
            const service = await cursor.toArray();
            res.send(service);
        });
        //post
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });
        app.post('/servicesAll', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });

        // delete
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        // for update
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewCollection.findOne(query);
            res.send(review);
        })

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            console.log(review);
            const option = { upsert: true };
            const updatedReview = {
                $set: {

                    message: review.message,

                }
            };
            const result = await reviewCollection.updateOne(filter, updatedReview, option);
            res.send(result);

        })

    }
    finally {

    }

}
run().catch(error => console.error(error))


app.get('/', (req, res) => {
    res.send("Server is running")
})

app.listen(port, () => {
    console.log(`server running on ${port} port`);
})
