exports.routes = (app, client, database) => {

    // Includo le Routes
    const userRoutes = require('./routes/users');
    const booksRoutes = require('./routes/books');
    const byersRoutes = require('./routes/byers');

    // Inizzializzo le Routes
    userRoutes.users(app, client, database);
    booksRoutes.books(app, client, database);
    byersRoutes.byers(app, client, database);
}