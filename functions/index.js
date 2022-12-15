/**
 * @author 小池将弘
 * @see https://qiita.com/ozaki25/items/565c889a9941a5bbdd76
 * @see https://tech.chakapoko.com/nodejs/express/params.html
 */

// expressのimport
const express = require('express')
const bodyParser = require('body-parser')
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const ServiceAccount = require('./ServiceAccount.json')
const engines = require('consolidate')

// expressのappを作成
const app = express()
app.engine('hbs', engines.handlebars)
app.set('views', './views')
app.set('view engine', 'hbs')
app.use(bodyParser.json())

// firebase firestore の初期化
admin.initializeApp({ credential: admin.credential.cert(ServiceAccount) })
const db = admin.firestore()

// dbの参照取得
const docref = db.collection('userpost')

// app.get('/aa', (request, response) => {
//   response.set('Cache-Control', 'public, max-age=300, s-maxage=600')
//   response.render('index', { "test" })
// })

// ユーザ投稿をするAPI
app.post('/userpost', async (request, response) => {
  const message = {
    // text: request.body.text,
    text: 'たいようくん、エラーばっかり！！',
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  }
  await docref.add(message)
  response.redirect('/')
})

// ユーザ投稿を取得するAPI
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
