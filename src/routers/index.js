
const pagesRouter = require('./pages');
const blogRouter = require('./blog');
const {auth} = require('../middlewares/auth');

function MainRouter(app) {
    app.use(auth);
    app.use('/',pagesRouter);
    app.use('/blog', blogRouter);
}

module.exports = MainRouter;