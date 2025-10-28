const admin = require('firebase-admin');

// Carregar service account do arquivo JSON
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`
});

const bucket = admin.storage().bucket();
console.log('✅ Firebase configurado com arquivo JSON');

module.exports = { admin, bucket };