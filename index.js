const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const port = 5000

const app = express();
app.use(bodyParser.json());
app.use(cors());

//mongodb connection
const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productCollection = client.db("motoBikeStore").collection("products");
    const orderCollection = client.db("motoBikeStore").collection("orders");
    const reviewCollection = client.db("motoBikeStore").collection("reviews");
    const adminCollection = client.db("motoBikeStore").collection("admins");

    app.post('/makeAdmin',(req,res)=>{
        const admin = req.body;
        adminCollection.insertOne(admin)
        .then(result=>{
            res.send(result.insertedCount >0)
        })
    })
    app.post('/isAdmin',(req,res)=>{
        const email = req.body.email;
        adminCollection.find({email:email})
        .toArray((err,documents)=>{
            res.send(documents.length>0)
            
        })
    })
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
            .then(result => {
                res.send(result.insertedCount >0 )
            })
    })
    app.post('/addPurchase',(req,res)=>{
        const order = req.body
        orderCollection.insertOne(order)
        .then(result=>{
           res.send(result.insertedCount >0)
        })
    })
    app.post('/addReview',(req,res)=>{
        const review = req.body;
        reviewCollection.insertOne(review)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })

    })
    app.get('/reviews',(req,res)=>{
        reviewCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

    app.get('/product/:id',(req,res)=>{
        productCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err,documents)=>{
            res.send(documents[0])
        })
    })

    app.get('/products',(req,res)=>{
        productCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })
    app.get('/myOrders',(req,res)=>{
        orderCollection.find({email : req.query.email})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

    app.get('/allOrders',(req,res)=>{
        orderCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

    app.delete('/delete/:id',(req,res)=>{
        orderCollection.deleteOne({_id:ObjectId(req.params.id)})
        .then(result=>{
           res.send(result)
        })
    })
    app.delete('/deleteProduct/:id',(req,res)=>{
        productCollection.deleteOne({_id:ObjectId(req.params.id)})
        .then(result=>{
           res.send(result)
        })
    })

});


app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(process.env.PORT || port )