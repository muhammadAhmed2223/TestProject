const fs = require('fs');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = './GmailReader/token.json';

// Load client secrets from a local file.
function loadCredentials() {
  return new Promise((resolve, reject) => {
    fs.readFile('./GmailReader/credentials.json', (err, content) => {
      if (err) return reject('Error loading client secret file: ' + err);
      resolve(JSON.parse(content));
    });
  });
}

function loadToken() {
  return new Promise((resolve, reject) => {
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return reject('Token not found, please authorize the app.');
      resolve(JSON.parse(token));
    });
  });
}

function authorize(credentials, token) {
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.setCredentials(token);

  // Check if token needs to be refreshed
  if (new Date(token.expiry_date) < new Date()) {
    return oAuth2Client.refreshAccessToken().then(res => {
      const newToken = res.credentials;
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(newToken));
      oAuth2Client.setCredentials(newToken);
      return oAuth2Client;
    });
  } else {
    return Promise.resolve(oAuth2Client);
  }
}

function listMessages(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  return new Promise((resolve, reject) => {
    gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread from:noreply', // adjust the query to fit your needs
      maxResults: 1,
    }, async (err, res) => {
      if (err) {
        console.log('The API returned an error: ' + err);
        return reject(err);
      }
      const messages = res.data.messages;
      if (messages && messages.length) {
        const message = messages[0];
        try {
          const detailedMessage = await getMessage(auth, message.id);
          const code = extractCode(detailedMessage);
          if (code) {
            console.log(`Extracted code: ${code}`);
            resolve(code);
          } else {
            console.log('No 6-digit code found in the email.');
            resolve(null);
          }
        } catch (messageErr) {
          console.log('Error retrieving message details: ' + messageErr);
          reject(messageErr);
        }
      } else {
        console.log('No new messages found.');
        resolve(null);
      }
    });
  });
}

function getMessage(auth, messageId) {
  const gmail = google.gmail({version: 'v1', auth});
  return new Promise((resolve, reject) => {
    gmail.users.messages.get({
      userId: 'me',
      id: messageId,
    }, (err, res) => {
      if (err) return reject('The API returned an error: ' + err);
      resolve(res.data);
    });
  });
}

function extractCode(message) {
  const body = getBody(message);
  const codeMatch = body.match(/\b\d{6}\b/);
  return codeMatch ? codeMatch[0] : null;
}

function getBody(message) {
  const encodedBody = message.payload.parts ? getHTMLPart(message.payload.parts) : message.payload.body.data;
  const decodedBody = Buffer.from(encodedBody, 'base64').toString('utf8');
  return decodedBody;
}

function getHTMLPart(parts) {
  for (let part of parts) {
    if (part.mimeType === 'text/html') {
      return part.body.data;
    } else if (part.parts) {
      return getHTMLPart(part.parts);
    }
  }
  return '';
}

module.exports = {
  loadCredentials,
  loadToken,
  authorize,
  listMessages,
  getMessage,
};
