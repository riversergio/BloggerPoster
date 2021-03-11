
const pagesRouter = require('./pages');
const blogRouter = require('./blog');
const notFound = require('../middlewares/notFound');
const {auth} = require('../middlewares/auth');

function MainRouter(app) {
    app.use(auth);
    app.use('/',pagesRouter);
    app.use('/blog', blogRouter);
    app.use(notFound);
}

module.exports = MainRouter;