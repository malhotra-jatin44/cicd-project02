const express = require("express");
const { Client } = require("pg");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const redis = require("redis");
// const redisClient = redis.createClient({ url: "redis://redis-cache:6379" });

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect().then(() => console.log("Connected to Redis"));


const app = express();
app.use(cors({
  origin: "*",   // <-- For now allow everything (works in your setup)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());


      
/* -------- POSTGRES CONNECTION -------- */
const pgClient = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT
});

pgClient.connect().then(() => console.log("Connected to Postgres"));

pgClient.query(`
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  item VARCHAR(255),
  qty INT
)
`);

/* -------- MONGO CONNECTION (READ CART) -------- */
const mongourl = process.env.MONGO_URI
// const mongoClient = new MongoClient("mongodb://mongocont:27017");
const mongoClient = new MongoClient(mongourl);
let cartCollection;

async function connectMongo() {
  await mongoClient.connect();
  cartCollection = mongoClient.db("shop").collection("cart");
  console.log("Connected to MongoDB (for cart)");
}
connectMongo();

/* -------- CHECKOUT API -------- */
app.post("/checkout", async (req, res) => {

  // Step 1: Read cart from Mongo
  const cartItems = await cartCollection.find().toArray();

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // Step 2: Store cart in Redis (CACHE)
  await redisClient.set("checkout_cart", JSON.stringify(cartItems));

  // Step 3: Read from Redis instead of Mongo
  const cachedCart = JSON.parse(await redisClient.get("checkout_cart"));

  // Step 4: Create orders in Postgres
  for (let item of cachedCart) {
    await pgClient.query(
      "INSERT INTO orders(item, qty) VALUES($1,$2)",
      [item.name, item.qty]
    );
  }

  // Step 5: Clear Mongo cart
  await cartCollection.deleteMany({});

  // Step 6: Clear Redis cache
  await redisClient.del("checkout_cart");

  res.json({ message: "Order placed successfully using Redis cache" });
});


/* -------- GET ALL ORDERS -------- */
app.get("/orders", async (req, res) => {
  const result = await pgClient.query("SELECT * FROM orders ORDER BY id DESC");
  res.json(result.rows);
});

app.listen(3003, () => console.log("Orders Service on 3003"));