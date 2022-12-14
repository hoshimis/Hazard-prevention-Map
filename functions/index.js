/**
 * @author 小池将弘
 * @see https://qiita.com/ozaki25/items/565c889a9941a5bbdd76
 * @see https://tech.chakapoko.com/nodejs/express/params.html
 */

// expressのimport
const bodyParser = require('body-parser')
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
// const docref = db.collection('users').doc('aturing')
const docref = db.collection('userpost')
// helloを返すだけ
app.get('/hello', (request, response) => {
  response.send('Hello')
})

// timestampのパスにgetでアクセスしたら以下を実行
// コンテンツキャッシュの作成
app.get('/timestamp', (request, response) => {
  response.set('Cache-Control', 'public', 'max-age=300', 'smax-age=600')
  response.send(`${Date.now()}`)
})

app.get('/messages', async (request, response) => {
  // messageコレクションのデータを全量取得
  const snapshots = await docref.get()
  // レスポンスからデータ部分のみ取り出す
  const messages = snapshots.docs.map((doc) => {
    doc.data()
  })
  response.send(messages)
})

app.post('/userpost', async (request, response) => {
  const message = {
    // text: request.body.text,
    text: 'he',
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  }
  await docref.add(message)
  response.redirect('/')
})

// setするデータ
// const setAda = docref.set({
//   first: 'Ada',
//   last: 'Lovelace',
//   born: '1815'
// })
// const setAda = docref.set({
//   first: 'Alan',
//   Middle: 'Mathison',
//   last: 'Turing',
//   born: '1815'
// })
// データの取得
// db.collection('users')
//   .get()
//   .then((snapshot) => {
//     snapshot.forEach((doc) => {
//       console.log(`${doc.id} => ${doc.data()}`)
//     })
//   })
//   .catch((err) => {
//     console.log(`Error getting docments ${err}`)
//   })

// https関数の作成
// これらの関数にリクエストが来るたびに処理を返す
exports.app = functions.https.onRequest(app)
// const port = '5000'
// app.listen(port, () => console.log(`app start listening on port ${port}`))
