import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

import firebaseConfig from './config'
initializeApp(firebaseConfig)

const messaging = getMessaging()

const requestForToken = () => {
  return getToken(messaging, {
    vapidKey:
      'BIaYvnTp5zuUdzzw_m1fFbACNHhM7etNNJynadHT1DAauiBMwdzLQX8GSshWoIup3J-aVjfeZJEzU5mh69o_19g'
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log(`current token for client: ${currentToken}`)
      } else {
        console.log(
          `No registration token available. Request permission to generate one.`
        )
      }
    })
    .catch((err) => {
      console.log(`An error occurred while retrieving token ${err}`)
    })
}

const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('payload', payload)
      resolve(payload)
    })
  })

export { requestForToken, onMessageListener }
