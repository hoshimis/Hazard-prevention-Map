/**
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
const { request, response } = require('express')

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
const userPostRef = db.collection('UserPost')

// ユーザ投稿をするAPI
app.post('/userpost', async (request, response) => {
  const message = {
    name: request.body.name,
    place: request.body.place,
    time: request.body.time,
    date: request.body.date,
    year: request.body.year,
    remarks: request.body.remarks,
    lat: request.body.lat,
    lng: request.body.lng,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  }
  await userPostRef.add(message)
  response.redirect('/')
})

// ユーザ投稿を取得するAPI
app.get('/getuserpost/:year', async (request, response) => {
  // クエリストリングの取得
  const year = request.params.year
  userPostRef
    .where('year', '==', year)
    .get()
    .then((snapshot) => {
      let userPosts = []
      let buff = { userPosts }
      snapshot.forEach((doc) => {
        let data = doc.data()
        userPosts.push({
          id: doc.id,
          name: data.name,
          place: data.place,
          date: data.date,
          time: data.time,
          remarks: data.remarks,
          lat: data.lat,
          lng: data.lng
        })
      })
      response.json(buff)
    })
    .catch((err) => {
      console.log('Error getting documents', err)
    })
})

// 指定した年のオープンデータを取得する
app.get('/getopendata/:year', async (request, response) => {
  // クエリストリングの取得
  const year = request.params.year

  // DB参照の取得
  const refStr = 'OpenData' + year
  const openDataRef = db.collection(refStr)

  openDataRef
    .get()
    .then((snapshot) => {
      response.json(getOpenData(snapshot))
    })
    .catch((err) => {
      console.log('Error getting documents', err)
    })
})

// コレクション内のデータをすべて取得する。
const getOpenData = (snapshot) => {
  let openData = []
  let buff = { openData }
  snapshot.forEach((doc) => {
    let data = doc.data()
    openData.push({
      id: doc.id,
      name: data.name,
      place: data.place,
      date: data.date,
      time: data.time,
      remarks: data.remarks,
      lat: data.lat,
      lng: data.lng
    })
  })
  console.log('件数', openData.length)
  return buff
}
exports.app = functions.https.onRequest(app)
