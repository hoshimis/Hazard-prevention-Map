const admin = require('firebase-admin')
const functions = require('firebase-functions')

const topic = 'all'

admin.initializeApp()

exports.registerTokenTrigger = functions
  .region('asia-northeast1')
  .firestore.document('token/{tokenId}')
  .onCreate((snap) => {
    const newValue = snap.data()

    const token = newValue.token

    admin
      .messaging()
      .subscribeToTopic(token, topic)
      .then((response) => {
        console.log('Successfully subscribed to topic:', response)
        response.status(200).send('set token')
      })
      .catch((error) => {
        console.log('Error subscribing to topic:', error)
        // eslint-disable-next-line no-undef
        response.status(500).send('fail to set token')
      })
  })

exports.hogeTrigger = functions
  .region('asia-northeast1')
  .firestore.document('data/{dataId}')
  // eslint-disable-next-line no-undef
  .onCreate((snap) => {
    const newValue = snap.data()

    const message = {
      data: {
        value: JSON.stringify(newValue)
      },
      topic
    }

    admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response)
        return
      })
      .catch((error) => {
        console.log('Error sending message:', error)
        return
      })
  })
