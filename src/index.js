// Required modules
const express = require('express');
const hls = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const expressSessions = require('express-session');
// Create app
const app = express(), port = process.env.PORT || 3000;
// Router import
const appRouter = require('./routers');
// App engine setting
app.engine('hbs', hls({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/layouts',
    particalsPath: __dirname + '/views/partials'
}));
// App middleware
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json(true));
app.use(methodOverride('_method'));
app.use(expressSessions({
    secret: '$1$PtjEp5Od$pszG7Kjdnx5ukKEwFvw.W1',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));
// App Set
app.set('view engine','hbs');
app.set('views', path.join(__dirname,'views'));
app.set('trust proxy', 1);
// Init routers
appRouter(app);
// App listen on port
app.listen(port, () => {
    console.log(`App listen on port ${port}`);
});
