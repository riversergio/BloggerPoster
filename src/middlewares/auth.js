const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
// Get key file
const keyPath = path.join(__dirname, 'clientKeys.json');
let keys = { redirect_uris: [""] };
if (fs.existsSync(keyPath)) {
    keys = require(keyPath).web;
}
// Create auth client
const oauth2Client = new google.auth.OAuth2(keys.client_id, keys.client_secret, keys.redirect_uris[0]);
// Set auth options
google.options({ auth: oauth2Client });
// Export 
async function auth(req, res, next) {
    if (req.url.indexOf('/authCallback') > -1) {
        // Handle callback site
        const code = req.query.code;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.credentials = tokens;
        res.cookie('user', tokens.access_token, {
            expires: new Date(tokens.expiry_date),
            httpOnly: true
        });
        next();
    } else {
        // Handle other site
        const user = req.cookies.user;
        if (!user) {
            const authUrl = oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: ['https://www.googleapis.com/auth/blogger', 'https://www.googleapis.com/auth/userinfo.profile']
            });
            res.render('auth', {
                authUrl,
                title: 'Vui lòng cấp quyền cho tool'
            });
        } else {
            oauth2Client.setCredentials({
                access_token: user
            });
            res.locals.userData = await oauth2Client.request({
                headers: { Authorization: 'Bearer ' + user },
                url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json'
            });
            next();
        }
    }
}

module.exports = { auth, oauth2Client };

