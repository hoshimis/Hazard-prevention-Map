/**
 * @author 小池将弘
 * @see https://qiita.com/ozaki25/items/565c889a9941a5bbdd76
 * @see https://tech.chakapoko.com/nodejs/express/params.html
 */

// expressのimport
const bodyParser = require('body-parser')
const { request, response } = require('express')
const express = require('express')
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const ServiceAccount = require('./ServiceAccount.json')

// expressのappを作成する。
const app = express()
app.use(bodyParser.json())

// firestore firebase initialize
admin.initializeApp({ credential: admin.credential.cert(ServiceAccount) })
const db = admin.firestore()

// dbの参照取得
const docref = db.collection('userpost')

app.post('/userpost', async (request, response) => {
  const message = {
    // text: request.body.text,
    text: 'たいようくん、エラーばっかり！！',
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  }
  await docref.add(message)
  response.redirect('/')
})

app.get('/', async (request, response) => {
  docref
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, '=>', doc.data())
      })
    })
    .catch((err) => {
      console.log('Error getting documents', err)
    })
  response.redirect('/')
})

exports.app = functions.https.onRequest(app)
