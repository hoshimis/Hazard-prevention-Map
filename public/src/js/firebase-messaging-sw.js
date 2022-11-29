// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

// eslint-disable-next-line no-undef
firebase.initializeApp({
  apiKey: 'AIzaSyAbMEa9oKuejBE5wY5kftlIGtFKKAhq0xc',
  authDomain: 'test-pwa-5ae30.firebaseapp.com',
  projectId: 'test-pwa-5ae30',
  storageBucket: 'test-pwa-5ae30.appspot.com',
  appId: '1:1085529413657:web:59ac487341f0009ea8f288',
  messagingSenderId: '1085529413657'
})
// eslint-disable-next-line no-undef
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  )
  const data = JSON.parse(payload.data.value)
  const notificationTitle = `${data.title} | ${data.sender}`
  const notificationOptions = {
    body: data.text,
    icon: '/xxx.png'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
