const {oauth2Client} = require('../middlewares/oauthClient');

class PagesController {
    index(req,res,next) {
        res.render('index',{
            msg: "Hello bitches"
        });
    }
    async authCallback(req, res) {
        // const qs = new url.URL(req.url).searchParams;
        const code = req.query.code;
        const {tokens} = await oauth2Client.getToken(code);
        oauth2Client.setCredentials({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expiry_date: true
        });
        res.cookie('user', tokens.access_token, {
            expires: new Date(Date.now() + (3600 * 1000)),
            httpOnly: true
        });
        res.redirect('/');
    }
}

module.exports = new PagesController();