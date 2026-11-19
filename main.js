
const {
  app,
  BrowserWindow,
  ipcMain,
  shell
} = require('electron');

const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { google } = require('googleapis');

// PUT YOUR GOOGLE DESKTOP CLIENT ID HERE
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

// Gmail permissions
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send'
];

let mainWindow;
let oauthClient = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
}

function base64url(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function googleLogin() {
  const state = base64url(crypto.randomBytes(32));
  const verifier = base64url(crypto.randomBytes(32));

  const challenge = base64url(
    crypto.createHash('sha256')
      .update(verifier)
      .digest()
  );

  const server = http.createServer();

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  const port = server.address().port;
  const redirectUri = `http://127.0.0.1:${port}`;

  const authUrl = new URL(
    'https://accounts.google.com/o/oauth2/v2/auth'
  );

  authUrl.search = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256'
  }).toString();

  let timeout;

  try {
    const code = await new Promise((resolve, reject) => {
      timeout = setTimeout(() => {
        reject(new Error('Google login timed out.'));
      }, 180000);

      server.on('request', (req, res) => {
        const callbackUrl = new URL(req.url, redirectUri);

        if (callbackUrl.pathname !== '/') {
          res.writeHead(404);
          res.end();
          return;
        }

        if (callbackUrl.searchParams.get('state') !== state) {
          res.writeHead(400);
          res.end('Invalid OAuth state.');
          clearTimeout(timeout);
          reject(new Error('Invalid OAuth state.'));
          return;
        }

        const error = callbackUrl.searchParams.get('error');
        const authorizationCode = callbackUrl.searchParams.get('code');

        if (error || !authorizationCode) {
          res.writeHead(400);
          res.end('Google authentication failed.');
          clearTimeout(timeout);
          reject(new Error(error || 'No authorization code received.'));
          return;
        }

        res.writeHead(200, {
          'Content-Type': 'text/html'
        });

        res.end(`
          <h2>Login successful!</h2>
          <p>You can close this window and return to Mail-App.</p>
        `);

        clearTimeout(timeout);
        resolve(authorizationCode);
      });

      shell.openExternal(authUrl.toString()).catch(reject);
    });

    const client = new google.auth.OAuth2(
      CLIENT_ID,
      undefined,
      redirectUri
    );

    const { tokens } = await client.getToken({
      code,
      codeVerifier: verifier
    });

    client.setCredentials(tokens);
    oauthClient = client;

    const gmail = google.gmail({
      version: 'v1',
      auth: oauthClient
    });

    const profile = await gmail.users.getProfile({
      userId: 'me'
    });

    return {
      success: true,
      email: profile.data.emailAddress
    };

  } finally {
    clearTimeout(timeout);
    server.close();
  }
}

ipcMain.handle('google-login', async () => {
  try {
    return await googleLogin();
  } catch (error) {
    console.error('Google login error:', error);

    return {
      success: false,
      error: error.message
    };
  }
});

ipcMain.handle('get-emails', async () => {
  if (!oauthClient) {
    throw new Error('You need to log in first.');
  }

  const gmail = google.gmail({
    version: 'v1',
    auth: oauthClient
  });

  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 20
  });

  return response.data.messages || [];
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
