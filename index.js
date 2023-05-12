// Includo Moduli Necessari
const express = require('express');
const cors = require('cors');
const {MongoClient} = require('mongodb');

const routes = require('./modules/routes');

// Inizializzo Express e Abilito Cors
const app = express();
app.use(cors());

// Connetto al Database (MongoDB)
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const database = client.db('libreria_api');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Avvio l'APP Sulla Porta 4000

app.listen(4000, () => {
    console.log("Server Inizializzato! (Port: 4000)");
});

// Inclusione ENDPOINTs //

routes.routes(app, client, database);