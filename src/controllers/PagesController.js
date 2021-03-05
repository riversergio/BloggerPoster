const {oauth2Client} = require('../middlewares/oauthClient');
const {google} = require('googleapis');
const blogger = google.blogger('v3');

class PagesController {
    async index(req,res,next) {
        const blogData = await blogger.blogs.listByUser({userId: 'self'});
        console.log(blogData)
        res.render('index',{
            msg: "Hello bitches",
            blogs: blogData.data.items
        });
    }
    async authCallback(req, res) {
        // const qs = new url.URL(req.url).searchParams;
        const code = req.query.code;
        const {tokens} = await oauth2Client.getToken(code);
        oauth2Client.credentials = tokens;
        res.cookie('user', tokens.access_token, {
            expires: new Date(Date.now() + (3600 * 1000)),
            httpOnly: true
        });
        res.redirect('/');
    }
}

module.exports = new PagesController();