const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Handle mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://nurpalash10:kW3GxXksdef5IpkU@cluster0.s7sbkwf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";




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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db("usersDB");
        const userCollection = database.collection("users");


        // Data all read
        app.get("/users", async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        });
        // Data single read
        app.get("/users/:id", async (req, res) => {
            const user = req.params.id;
            const query = { _id: new ObjectId(user) }
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        // Data create
        app.post("/users", async (req, res) => {
            const user = req.body;
            console.log("new user: ", user);
            const result = await userCollection.insertOne(user);
            res.send(result)
        });

        // Data update or modify
        app.put("/users/:id", async (req, res) => {
            const user = req.body;
            const userId = req.params.id
            const filter = { _id: new ObjectId(userId) };
            const options = { upsert: true };
            const userDoc = {
                $set: {
                    name: user.name,
                    email: user.email
                },
            };
            const result = await userCollection.updateOne(filter, userDoc, options);
            res.send(result);


        })

        // Data delete
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result);

        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("The server is running successfully")
});

app.listen(port, () => {
    console.log(`Sever is running on port ${port}`);
})