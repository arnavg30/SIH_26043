const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('./firebase-service-account.json');

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const apiKey = 'AIzaSyAYvFaNzJ7YlwX2JEQ_-l9GwVcAcU-t-qg';

(async () => {
  const email = `autotest_${Date.now()}@example.com`;
  const password = 'TestPass123!';

  try {
    const user = await getAuth().createUser({ email, password, emailVerified: true });
    console.log('CREATED_USER', user.uid, email);

    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });

    const data = await res.json();
    console.log('SIGNIN_STATUS', res.status, data.error ? data.error.message : 'ok');

    if (!data.idToken) {
      throw new Error('NO_ID_TOKEN');
    }

    const syncRes = await fetch('http://localhost:5000/api/auth/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.idToken}`
      },
      body: JSON.stringify({ profileType: 'CITIZEN', languageCode: 'en' })
    });

    const syncText = await syncRes.text();
    console.log('SYNC_STATUS', syncRes.status);
    console.log(syncText);

    process.exit(syncRes.ok ? 0 : 1);
  } catch (err) {
    console.error('ERROR', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
