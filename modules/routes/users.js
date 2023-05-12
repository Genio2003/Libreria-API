const { MongoExpiredSessionError } = require("mongodb");
const { auth } = require("../auth");
exports.users = (app, client, database) => {

    // Dichiaro la collezione dovo sono i dati (users table)
    const collection = database.collection('users');

    app.post('/user/login', async (req, res) => {

        // Includo Moduli Necessari
        const jwt = require('jsonwebtoken'); // Per Generare Token JWT
        const bcrypt = require('bcrypt'); // Per Hashare la Password
        require('dotenv').config(); // Per Leggere Variabili d'Ambiente
        
        const email = req.body.email;
        const password = req.body.password;

        // Controllo se sono stati passati email e password
        if(!email || !password) {
            res.send(400, "Email and Password Missing!");
            return;
        }

        try {
            // Effettuo ricerca filtrata in MongoDB e converto la risposta in un Array
            const findUser = await collection.find({ email: email }).toArray();

            // Controllo se l'utente esista
            if (findUser.length == 0) {
                // Se non esiste rispondo con un errore
                res.send(404, "User Not Found!");
                return;
            }

            // Controllo se la password passata sia uguale a quella hashata nel database
            const validPassword = await bcrypt.compare(password, findUser[0].password)

            // Se la password è valida
            if(validPassword) {
                // Genero un token JWT e lo invio al client
                const accessToken = jwt.sign({ user: findUser[0] }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({accessToken: accessToken});
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    })

    app.post('/user/register', async (req, res) => {

        // Controllo se sono stati passati email e password
        if(!req.body.email || !req.body.password) {
            res.send(400, "Data Missing!");
            return;
        }

        const email = req.body.email;
        const plainTextPassword = req.body.password;
        var role = req.body.role;

        // Controllo se è stato passato un ruolo
        if(!role) {
            // Se non è stato passato un ruolo, lo imposto a user
            role = "user";
        }

        try {
            // Effettuo la chiamata al database
            const findUser = await collection.find({ email: email }).toArray();

            if (findUser.length > 0) {
                // Se l'utente esiste già, rispondo con un errore
                res.send(400, "User Already Exists!");
                return
            }

            // Hashing della Password!
            const bcrypt = require('bcrypt');
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

            // Inizzializzo le statistiche dell'utente
            const stats = {
                numberOfRequests: 0,
                lastRequest: Date.now(),
            }

            // Inserisco l'utente nel database
            await collection.insertOne({ email: email, password: hashedPassword, role: role, stats: stats });
            res.sendStatus(200);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    })

    app.get('/user/:email', async (req, res) => {

        // Chiamo la funzione di autenticazione
        const IsAuth = await auth(client, database, req);
        
        // Controllo se l'utente è autenticato
        if(IsAuth == 401) {
            res.sendStatus(IsAuth);
            return;
        }

        // Controllo se è stato passata un email
        const email = req.params.email;

        if(!email) {
            res.send(400, "Data Missing!");
            return;
        }

        // Controllo se l'utente è admin o se sta cercando i suoi dati
        if(IsAuth['role'] != "admin" && IsAuth['email'] != email) {
            res.sendStatus(401);
            return;
        }

        try {
            // Effettuo la chiamata al database
            const findUser = await collection.find({ email: email }).toArray();

            // Controllo se l'utente esista
            if (findUser.length == 0) {
                // Se non esiste rispondo con un errore
                res.send(404, "User Not Found!");
                return;
            }

            // Se l'utente esiste, rispondo con i suoi dati
            res.send(200, findUser[0]);

        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }

    })

    app.post('/user/:email', async (req, res) => {

        // Chiamo la funzione di autenticazione
        const IsAuth = await auth(client, database, req);
        
        // Controllo se l'utente è autenticato
        if(IsAuth == 401) {
            res.sendStatus(IsAuth);
            return;
        }

        // Controllo se è stato passata un email
        const email = req.params.email;

        if(!email) {
            res.send(400, "Data Missing!");
            return;
        }

        // Controllo se l'utente è admin o se sta cercando i suoi dati
        if(IsAuth['role'] != "admin" && IsAuth['email'] != email) {
            res.sendStatus(401);
            return;
        }

        try {
            // Effettuo la chiamata al database
            const findUser = await collection.find({ email: email }).toArray();

            // Controllo se l'utente esista
            if (findUser.length == 0) {
                // Se non esiste rispondo con un errore
                res.send(404, "User Not Found!");
                return;
            }

            // Estraggo i dati da modificare
            const newEmail = req.body.email;
            const newPassword = req.body.password;
            const newRole = req.body.role;

            // Controllo se è stato passato almeno un dato da modificare
            if(!newEmail && !newPassword && !newRole) {
                res.send(400, "Data Missing!");
                return;
            }

            // Modifico i dati
            try {
                if(newRole) {
                    // Controllo se l'utente è admin
                    if(IsAuth['role'] != "admin") {
                        // Se non è admin, rispondo con un errore
                        res.sendStatus(401);
                        return;
                    }

                    await collection.updateOne({ email: email }, { $set: { role: newRole } });
                }

                if(newEmail) {
                    await collection.updateOne({ email: email }, { $set: { email: newEmail } });
                }
    
                if(newPassword) {
                    // Hashing della nuova Password!
                    const bcrypt = require('bcrypt');
                    const saltRounds = 10;
                    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
                    console.log(hashedPassword);

                    await collection.updateOne({ email: email }, { $set: { password: hashedPassword } });
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

    app.delete('/user/:email', async (req, res) => {

        // Chiamo la funzione di autenticazione
        const IsAuth = await auth(client, database, req);
        
        // Controllo se l'utente è autenticato
        if(IsAuth == 401) {
            res.sendStatus(IsAuth);
            return;
        }

        // Controllo se è stato passata un email
        const email = req.params.email;

        if(!email) {
            res.send(400, "Data Missing!");
            return;
        }

        // Controllo se l'utente è admin o se sta cercando i suoi dati
        if(IsAuth['role'] != "admin" && IsAuth['email'] != email) {
            res.sendStatus(401);
            return;
        }

        try {
            // Effettuo la chiamata al database
            const findUser = await collection.find({ email: email }).toArray();

            // Controllo se l'utente esista
            if (findUser.length == 0) {
                // Se non esiste rispondo con un errore
                res.send(404, "User Not Found!");
                return;
            }

            // Elimino l'utente
            try {
                const Del = await collection.deleteMany({ email: email });
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

}