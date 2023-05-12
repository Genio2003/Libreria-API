const { MongoExpiredSessionError } = require("mongodb");
const { auth } = require("../auth");
exports.byers = (app, client, database) => {

    // Dichiaro la collezione dovo sono i dati (users table)
    const collection = database.collection('books');

    app.get('/books/:isbn/buyers', async (req, res) => {

        // Chiamo la funzione di autenticazione
        const IsAuth = await auth(client, database, req);
        
        // Controllo se l'utente è autenticato
        if(IsAuth == 401) {
            res.sendStatus(IsAuth);
            return;
        }

        // Controllo se l'utente è admin
        if(IsAuth['role'] != "admin") {
            res.sendStatus(401);
            return;
        }

        // Controllo se è stato passato un isbn
        const isbn = req.params.isbn;

        if(!isbn) {
            res.send(400, "Data Missing!");
            return;
        }

        try {
            // Effettuo la chiamata al database
            const findBook = await collection.find({ isbn: isbn }).toArray();

            // Controllo se il libro esiste
            if (findBook.length == 0) {
                // Se il libro non esiste, rispondo con un errore
                res.send(400, "Book Not Found!");
                return
            }

            // Rispondo con i dati degli aquirenti
            res.send(findBook[0]['buyers']);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    })

    app.get('/books/:isbn/buyers/:email', async (req, res) => {

        // Chiamo la funzione di autenticazione
        const IsAuth = await auth(client, database, req);
        
        // Controllo se l'utente è autenticato
        if(IsAuth == 401) {
            res.sendStatus(IsAuth);
            return;
        }

        // Controllo se l'utente è admin
        if(IsAuth['role'] != "admin") {
            res.sendStatus(401);
            return;
        }

        // Controllo se è stato passato un isbn
        const isbn = req.params.isbn;

        if(!isbn) {
            res.send(400, "Data Missing!");
            return;
        }

        try {
            // Effettuo la chiamata al database
            const findBook = await collection.find({ isbn: isbn }).toArray();

            // Controllo se il libro esiste
            if (findBook.length == 0) {
                // Se il libro non esiste, rispondo con un errore
                res.send(400, "Book Not Found!");
                return
            }

            // Controllo se è stato passato un email
            const email = req.params.email;

            if(!email) {
                res.send(400, "Data Missing!");
                return;
            }

            // Controllo se l'aquirente esista
            if(findBook[0]['buyers'].filter(buyer => buyer.email == email).length == 0) {
                res.send(400, "Buyer Not Found!");
                return;
            }

            res.send(findBook[0]['buyers'].filter(buyer => buyer.email == email)[0]);
            
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    })

    app.post('/books/:isbn/byers', async (req, res) => {

        // Chiamo la funzione di autenticazione
        const IsAuth = await auth(client, database, req);
        
        // Controllo se l'utente è autenticato
        if(IsAuth == 401) {
            res.sendStatus(IsAuth);
            return;
        }

        // Controllo se l'utente è admin
        if(IsAuth['role'] != "admin") {
            res.sendStatus(401);
            return;
        }

        // Controllo se è stato passato un isbn
        const isbn = req.params.isbn;

        if(!isbn) {
            res.send(400, "Data Missing!");
            return;
        }

        try {
            // Effettuo la chiamata al database
            const findBook = await collection.find({ isbn: isbn }).toArray();

            // Controllo se il libro esiste
            if (findBook.length == 0) {
                // Se il libro non esiste, rispondo con un errore
                res.send(400, "Book Not Found!");
                return
            }

            // Estraggo i dai degli acquirenti da aggiungere
            const first_name = req.body.first_name;
            const last_name = req.body.last_name;
            const email = req.body.email;

            if(!first_name || !last_name || !email) {
                res.send(400, "Data Missing!");
                return;
            }

            // Controllo se l'acquirente è già presente
            if(findBook[0]['buyers'].filter(buyer => buyer.email == email).length > 0) {
                res.send(400, "Buyer Already Exist!");
                return;
            }

            // Aggiungo l'acquirente
            await collection.updateOne({ isbn: isbn }, { $push: { buyers: { first_name: first_name, last_name: last_name, email: email } }});
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    })

    app.post('/books/:isbn/buyers/:email', async (req, res) => {

        // Chiamo la funzione di autenticazione
        const IsAuth = await auth(client, database, req);
        
        // Controllo se l'utente è autenticato
        if(IsAuth == 401) {
            res.sendStatus(IsAuth);
            return;
        }

        // Controllo se l'utente è admin
        if(IsAuth['role'] != "admin") {
            res.sendStatus(401);
            return;
        }

        // Controllo se è stato passato un isbn
        const isbn = req.params.isbn;

        if(!isbn) {
            res.send(400, "Data Missing!");
            return;
        }

        // Controllo se è stato passata un email
        const email = req.params.email;

        if(!email) {
            res.send(400, "Data Missing!");
            return;
        }

        try {
            // Effettuo la chiamata al database
            const findBook = await collection.find({ isbn: isbn }).toArray();

            // Controllo se il libro esiste
            if (findBook.length == 0) {
                // Se il libro non esiste, rispondo con un errore
                res.send(400, "Book Not Found!");
                return
            }

            // Controllo se l'acquirente è presente
            if(findBook[0]['buyers'].filter(buyer => buyer.email == email).length == 0) {
                res.send(400, "Buyer Not Found!");
                return;
            }

            // Estraggo i dai dell'acquirente da modificare
            const newFirst_name = req.body.first_name;
            const newLast_name = req.body.last_name;
            const newEmail = req.body.email;

            // Controllo se è stato passato almeno un dato
            if(!newFirst_name && !newLast_name && !newEmail) {
                res.send(400, "Data Missing!");
                return;
            }

            // Modifico l'acquirente
            try {
                if(newFirst_name) {
                    await collection.updateOne({ isbn: isbn, "buyers.email": email }, { $set: { "buyers.$.first_name": newFirst_name }});
                }
                if(newLast_name) {
                    await collection.updateOne({ isbn: isbn, "buyers.email": email }, { $set: { "buyers.$.last_name": newLast_name }});
                }
                if(newEmail) {
                    await collection.updateOne({ isbn: isbn, "buyers.email": email }, { $set: { "buyers.$.email": newEmail }});
                }
                res.sendStatus(200);
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    })

    app.delete('/books/:isbn/byers/:email', async (req, res) => {

        // Chiamo la funzione di autenticazione
        const IsAuth = await auth(client, database, req);
        
        // Controllo se l'utente è autenticato
        if(IsAuth == 401) {
            res.sendStatus(IsAuth);
            return;
        }

        // Controllo se l'utente è admin
        if(IsAuth['role'] != "admin") {
            res.sendStatus(401);
            return;
        }

        // Controllo se è stato passato un isbn
        const isbn = req.params.isbn;

        if(!isbn) {
            res.send(400, "Data Missing!");
            return;
        }

        // Controllo se è stato passata un email
        const email = req.params.email;

        if(!email) {
            res.send(400, "Data Missing!");
            return;
        }

        try {
            // Effettuo la chiamata al database
            const findBook = await collection.find({ isbn: isbn }).toArray();

            // Controllo se il libro esiste
            if (findBook.length == 0) {
                // Se il libro non esiste, rispondo con un errore
                res.send(400, "Book Not Found!");
                return
            }

            // Controllo se l'acquirente è presente
            if(findBook[0]['buyers'].filter(buyer => buyer.email == email).length == 0) {
                res.send(400, "Buyer Not Found!");
                return;
            }

            // Rimuovo l'acquirente
            await collection.updateOne({ isbn: isbn }, { $pull: { buyers: { email: email } }});
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    })

}