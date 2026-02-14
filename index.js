const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.toblij9.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const coffeecollection = client.db("coffeeDB").collection("coffees");
    const userCollection = client.db("coffeeDB").collection("users");
    // C – create
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeecollection.insertOne(newCoffee);
      res.send(result);
    });
    // details
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeecollection.findOne(query);
      res.send(result);
    });

    // R – read
    app.get("/coffees", async (req, res) => {
      const result = await coffeecollection.find().toArray();
      res.send(result);
    });

    // D – delete
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeecollection.deleteOne(query);
      res.send(result);
    });
    // update
    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      const coffee = {
        $set: updatedCoffee,
      };
      const result = await coffeecollection.updateOne(filter, coffee, options);
      res.send(result);
    });
    // user related api
    // get data
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (error) {
    console.log(error);
  }
}

run();

app.get("/", (req, res) => {
  res.send("coffee server is ready");
});

app.listen(port, () => {
  console.log(`coffee server is running on port: ${port}`);
});
