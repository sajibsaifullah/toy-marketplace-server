const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mzdz3ie.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db("toyHouse").collection("toys");
    const myToyCollection = client.db("toyHouse").collection("myToys");

    app.get("/allToys", async (req, res) => {
      const result = await toyCollection.find().toArray();
      res.send(result);
    });

    // app.post('/addToys', async(req, res) => {
    //   const allToys = req.body;
    //   // console.log(allToys);
    //   const result = await toyCollection.insertOne(allToys);
    //   res.send({result});
    // })

    app.get("/allToys/:text", async (req, res) => {
      // console.log(req.params.text)
      const result = await toyCollection
        .find({ subcategory: req.params.text })
        .toArray();
      res.send(result);
    });

    // myToys

    app.get("/myToys", async (req, res) => {
      // const result = await myToyCollection.find().toArray();
      // res.send(result);

      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await myToyCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/myToys", async (req, res) => {
      const toys = req.body;
      // console.log(myToys);
      const result = await myToyCollection.insertOne(toys);
      res.send({ result });
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TOY MARKETPLACE server is running on test...");
});

app.listen(port, () => {
  console.log(`Toy Marketplace server is running on port: ${port}`);
});
