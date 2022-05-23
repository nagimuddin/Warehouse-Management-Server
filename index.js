const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6j8zx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('distributeAgent').collection('item');
        const newProductCollection = client.db('distributeAgent').collection('newItem');

        // Authentication
        app.post('/login', (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        });

        // Get product
        app.get('/product', async (req, res) => {
            const query = {};
            const product = await productCollection.find(query).toArray();
            res.send(product);
        });

        // Get product by ID
        app.get('/product/:productId', async (req, res) => {
            const id = req.params.productId;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        });

        // Post a new product
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const result = await inventoryCollection.insertOne(newInventory);
            res.send(result);
        });

        // Delete a product
        app.delete('/product/:productId', async (req, res) => {
            const id = req.params.productId;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

        // New product Collection
        app.get('/newitems', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const newProduct = await newProductCollection.find(query).toArray();
            res.send(newProduct);
        });

        app.post('/newitems', async (req, res) => {
            const newProduct = req.body;
            const result = await newProductCollection.insertOne(newProduct);
            res.send(result);
        });

        // Delete a New product Items
        app.delete('/newitems/:newitemsId', async (req, res) => {
            const id = req.params.newitemsId;
            const query = { _id: ObjectId(id) };
            const result = await newProductCollection.deleteOne(query);
            res.send(result);
        })

        // Get New product Items by ID
        app.get('/newitems/:newitemsId', async (req, res) => {
            const id = req.params.newitemsId;
            const query = { _id: ObjectId(id) };
            const result = await newProductCollection.findOne(query);
            res.send(result);
        })

        // Get Quantity
        app.put('/update-quantity/:id', async (req, res) => {
            const id = req.params.id;
            const updatedInventoryInfo = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedInventoryInfo.quantity,
                    sold: updatedInventoryInfo.sold
                }
            }
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
    }
    finally { }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Server Testing');
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})