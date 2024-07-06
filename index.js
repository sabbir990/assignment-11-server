const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p2btb5w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Middlewares

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    // Credential : true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const volunteerPosts = client.db('VolunteerDB').collection('volunteerPosts');
        const beAVolunteerCollection = client.db('VolunteerDB').collection('beAVolunteer');

        app.post('/volunteerPosts', async(req, res) => {
            const post = req.body;
            const result = await volunteerPosts.insertOne(post);
            res.send(result);
        })

        app.get('/volunteerPosts', async(req, res) => {
            const result = await volunteerPosts.find().toArray();
            res.send(result);
        })

        app.get('/postDetails/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const result = await volunteerPosts.findOne(query);
            res.send(result)
        })

        app.post('/beAVolunteer', async(req, res) => {
            const body = req.body;
            const result = await beAVolunteerCollection.insertOne(body);
            const filter = {_id : new ObjectId(body.id)};
            const updateDoc = {
                $inc : {volunteer_number : -1}
            }

            const updateVolunteerNumber = await volunteerPosts.updateOne(filter, updateDoc)

            console.log(updateVolunteerNumber)
            res.send(result);
        })
    } finally {
        
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('My assignment server is running.....')
})

app.listen(port, () => {
    console.log(`This server is running on port ${port}`)
})