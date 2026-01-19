const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "*",   // <-- For now allow everything (works in your setup)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());


const mongourl = process.env.MONGO_URI
const client = new MongoClient(mongourl);
let cartCollection;

async function connectDB() {
  await client.connect();
  const db = client.db("shop");
  cartCollection = db.collection("cart");
  console.log("Connected to MongoDB");
}

connectDB();

// Add item to cart
app.post("/cart", async (req, res) => {
  await cartCollection.insertOne(req.body);
  const cart = await cartCollection.find().toArray();
  res.json({ message: "Added to cart", cart });
});

// Get full cart (NO USER ANYMORE)
app.get("/cart", async (req, res) => {
  const cart = await cartCollection.find().toArray();
  res.json(cart);
});

// Clear cart after checkout
app.delete("/cart", async (req, res) => {
  await cartCollection.deleteMany({});
  res.json({ message: "Cart cleared" });
});

app.listen(3002, () => console.log("Cart Service on 3002"));
