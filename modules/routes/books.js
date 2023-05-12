const { MongoExpiredSessionError } = require("mongodb");
const { auth } = require("../auth");
const e = require("express");
exports.books = (app, client, database) => {

    // Dichiaro la collezione dovo sono i dati (users table)
    const collection = database.collection('books');

    app.get('/books', async (req, res) => {

        // Chiamo la funzione di autenticazione
        const IsAuth = await auth(client, database, req);
        
        // Controllo se l'utente è autenticato
        if(IsAuth == 401) {
            res.sendStatus(IsAuth);
            return;
        }

        // Estraggo i filtri
        const title = req.query.title;
        const pages = req.query.pages;
        var order = req.query.order;

        // Controllo se l'ordine è corretto
        switch(order) {
            case "asc":
                order = 1;
                break;
            case "desc":
                order = -1;
                break;
            default:
                order = 1;
                break;
        }

        try {
            if(title && pages) {
                // Se sono stati passati entrambi i filtri, filtro i dati
                getBooks = await collection.find({ title: title, pages: parseInt(pages) }).sort({ title: order }).toArray();
                
                // Se non ci sono libri, rispondo con un errore
                if (getBooks.length == 0) {
                    // Se il libro non esiste, rispondo con un errore
                    return res.send(400, "Books Not Found");
                }

                res.send(200, getBooks);
                return;
            }
            if(title) {
                // Se è stato passato il filtro del titolo, filtro i dati
                getBooks = await collection.find({ title: title }).sort({ title: order }).toArray();
                
                // Se non ci sono libri, rispondo con un errore
                if (getBooks.length == 0) {
                    // Se il libro non esiste, rispondo con un errore
                    return res.send(400, "Books Not Found");
                }
                
                res.send(200, getBooks);
                return;
            }
            if(pages) {
                // Se è stato passato il filtro delle pagine, filtro i dati
                getBooks = await collection.find({ pages: parseInt(pages) }).sort({ pages: order }).toArray();
                
                // Se non ci sono libri, rispondo con un errore
                if (getBooks.length == 0) {
                    // Se il libro non esiste, rispondo con un errore
                    return res.send(400, "Books Not Found");
                }
                
                res.send(200, getBooks);
                return;
            }
            if(!title && !pages) {
                // Se non è stato passato nessun filtro, prendo tutti i dati
                getBooks = await collection.find({}).sort({ title: order}).toArray();
                
                // Se non ci sono libri, rispondo con un errore
                if (getBooks.length == 0) {
                    // Se il libro non esiste, rispondo con un errore
                    return res.send(400, "Books Not Found");
                }
                
                res.send(200, getBooks);
                return;
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

        /*
        // Controllo se è stato passato almeno un filtro
        if(!title && !pages && !order) {
            // Se non è stato passato nessun filtro, prendo tutti i dati
            try {
                // Prendo tutti i dati dalla collezione
                getBooks = await collection.find({}).toArray();
                // Rispondo con i dati
                res.send(200, getBooks);
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            }
        } else {
            
            // Controllo se l'ordine è corretto
            if(order != "asc" && order != "desc" && order != undefined) {
                order = "asc";
            }
            try {
                if(title) {
                    // Se è stato passato il filtro del titolo, filtro i dati
                    getBooks = await collection.find({ title: title }).sort({ title: order }).toArray();
                }
                if(pages) {
                    // Se è stato passato il filtro delle pagine, filtro i dati
                    getBooks = await collection.find({ pages: pages }).sort({ pages: order }).toArray();
                }
                if(title && pages) {
                    // Se sono stati passati entrambi i filtri, filtro i dati
                    getBooks = await collection.find({ title: title, pages: pages }).sort({ title: order }).toArray();
                } else {
                    // Se non è stato passato nessun filtro, prendo tutti i dati
                    getBooks = await collection.find({}).sort({ title: order}).toArray();
                }
                // Rispondo con i dati
                res.send(200, getBooks);
            } catch (error) {
                console.log(error);
                res.sendStatus(500);
            }
        }
        */

    })

    app.get('/books/:isbn', async (req, res) => {

        // Chiamo la funzione di autenticazione
        const IsAuth = await auth(client, database, req);
        
        // Controllo se l'utente è autenticato
        if(IsAuth == 401) {
            res.sendStatus(IsAuth);
            return;
        }

        // Estraggo l'isbn
        const isbn = req.params.isbn;

        // Controllo se è stato passato l'isbn
        if(!isbn) {
            res.sendStatus(400);
            return;
        }

        try {
            // Prendo tutti i dati dalla collezione
            getBook = await collection.find({ isbn: isbn}).toArray();

            if (getBook.length == 0) {
                // Se il libro non esiste, rispondo con un errore
                res.send(400, "Book Not Found");
                return
            }

            // Rispondo con i dati
            res.send(200, getBook);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    })

    app.post('/books', async (req, res) => {

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

        // Controllo se sono stati passati tutti i dati
        const isbn = req.body.isbn;
        const title = req.body.title;
        const subtitle = req.body.subtitle;
        const author = req.body.author;
        const publisher = req.body.publisher;
        const pages = req.body.pages;
        const description = req.body.description;
        const purchases = req.body.purchases;

        if(!isbn || !title || !subtitle || !author || !publisher || !pages || !description || !purchases) {
            res.send(400, "Data Missing!");
            return;
        }

        try {
            // Effettuo la chiamata al database
            const findBook = await collection.find({ isbn: isbn }).toArray();

            if (findBook.length > 0) {
                // Se il libro esiste già, rispondo con un errore
                res.send(400, "Book Already Exists!");
                return
            }

            // Se il libro non esiste, lo inserisco
            await collection.insertOne({ isbn: isbn, title: title, subtitle: subtitle, author: author, publisher: publisher, pages: pages, description: description, purchases: purchases ? purchases : 0 });
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    })

    app.post('/books/:isbn', async (req, res) => {

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
            
            // Estraggo i dati da aggiornare
            const newIsbn = req.body.isbn;
            const newTitle = req.body.title;
            const newSubtitle = req.body.subtitle;
            const newAuthor = req.body.author;
            const newPublisher = req.body.publisher;
            const newPages = req.body.pages;
            const newDescription = req.body.description;
            const newPurchases = req.body.purchases;

            // Controllo se è stato passato almeno un dato da modificare
            if(!newIsbn && !newTitle && !newSubtitle && !newAuthor && !newPublisher && !newPages && !newDescription && !newPurchases) {
                res.send(400, "Data Missing!");
                return;
            }

            // Modifico i dati
            try {
                if(newIsbn) {
                    await collection.updateOne({ isbn: isbn }, { $set: { isbn: newIsbn } });
                }
                if(newTitle) {
                    await collection.updateOne({ isbn: isbn }, { $set: { title: newTitle } });
                }
                if(newSubtitle) {
                    await collection.updateOne({ isbn: isbn }, { $set: { subtitle: newSubtitle } });
                }
                if(newAuthor) {
                    await collection.updateOne({ isbn: isbn }, { $set: { author: newAuthor } });
                }
                if(newPublisher) {
                    await collection.updateOne({ isbn: isbn }, { $set: { publisher: newPublisher } });
                }
                if(newPages) {
                    await collection.updateOne({ isbn: isbn }, { $set: { pages: newPages } });
                }
                if(newDescription) {
                    await collection.updateOne({ isbn: isbn }, { $set: { description: newDescription } });
                }
                if(newPurchases) {
                    await collection.updateOne({ isbn: isbn }, { $set: { purchases: newPurchases } });
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

    app.delete('/books/:isbn', async (req, res) => {

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

            // Se il libro esiste, lo elimino
            await collection.deleteOne({ isbn: isbn });
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    })

}