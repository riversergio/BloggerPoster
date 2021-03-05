const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
// Get key file
const keyPath = path.join(__dirname, 'clientKeys.json');
let keys = {redirect_uris:[""]};
if (fs.existsSync(keyPath)) {
    keys = require(keyPath).web;
}
// Create auth client
const oauth2Client = new google.auth.OAuth2(keys.client_id, keys.client_secret, keys.redirect_uris[0]);
oauth2Client.on('tokens', (tokens) => {
    if(tokens.refresh_token) {
        console.log(tokens.refresh_token);
    }
    console.log(tokens.access_token);
})
// Set auth options
google.options({auth: oauth2Client});

async function processAuth(req,res,next) {
    const user = req.cookies.user;
    if(!user) {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/blogger','https://www.googleapis.com/auth/userinfo.profile']
        });
        res.render('authRequire', { authUrl });
    }else{
        const reAuth = await oauth2Client.setCredentials({
            access_token: user
        });
        next();
    }
}

module.exports = {processAuth, oauth2Client};


