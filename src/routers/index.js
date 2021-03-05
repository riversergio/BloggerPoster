
const pagesRouter = require('./pages');

function MainRouter(app) {
    app.use('/' ,pagesRouter);
}

module.exports = MainRouter;