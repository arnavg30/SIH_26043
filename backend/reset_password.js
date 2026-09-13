const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('./firebase-service-account.json');

initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth();
auth.getUserByEmail('arnav25csu037@ncuindia.edu')
  .then((userRecord) => {
    return auth.updateUser(userRecord.uid, {
      password: 'password123'
    });
  })
  .then((userRecord) => {
    console.log('Successfully updated user password:', userRecord.uid);
    process.exit(0);
  })
  .catch((error) => {
    console.log('Error updating user:', error);
    process.exit(1);
  });
