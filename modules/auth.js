exports.auth = async (client, database, req) => {

    // Dichiaro la collezzione dove sono i dati (Database)
    const collection = database.collection('users');

    // Includo Moduli Necessari
    const jwt = require('jsonwebtoken'); // Per Generare Token JWT
    require('dotenv').config(); // Per Leggere Variabili d'Ambiente

    // Estraggo il JWT token dalla richiesta
    const accessToken = req.headers.authorization;

    // Controllo se il token è stato passato
    if (!accessToken) {
        return 401;
    }

    try {
        //let Token = accessToken.split(" ")[1];
        //console.log(Token);
        const decoded = jwt.verify(accessToken.split(" ")[1], process.env.JWT_SECRET);
        //console.log(decoded);
        //console.log(decoded['user']['email']);

        // Controllo se l'utente esista nel database
        const findUser = await collection.find({ email: decoded['user']['email'] }).toArray();

        // Controllo se l'utente esista
        if (findUser.length == 0) {
            // Se non esiste rispondo con un errore
            return 401;
        }

        // Aggiorno le statistiche dell'utente
        const stats = {
            numberOfRequests: findUser[0].stats.numberOfRequests + 1,
            lastRequest: Date.now(),
        }

        const updateResult = await collection.updateOne({ email: decoded['user']['email'] }, { $set: { stats: stats } });

        // Ritorno i dati dell'utente
        return decoded['user'];

    } catch (error) {
        console.log(error);
        return 401;
    }

}