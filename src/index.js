const express = require('express');
const expressHandlebars = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
// Create app
const app = express(), port = process.env.PORT || 3000;
// Router import
const appRouter = require('./routers');
const { env } = require('process');
// App middleware
app.engine('handlebars', expressHandlebars());
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json(true));
// App Set view engine
app.set('view engine','handlebars');
app.set('views', path.join(__dirname,'views'));
// App Router
appRouter(app);
// App init
app.listen(port, () => {
    console.log(`App listen on port ${port}`);
});
