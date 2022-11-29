/* eslint-disable no-undef */
importScripts('/__/firebase/9.2.0/firebase-app-compat.js')
importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js')
importScripts('/__/firebase/init.js')

// eslint-disable-next-line no-unused-vars
const messaging = firebase.messaging()

importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js')
importScripts(
  'https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js'
)

firebase.initializeApp({
  apiKey: 'AIzaSyAbMEa9oKuejBE5wY5kftlIGtFKKAhq0xc',
  authDomain: 'test-pwa-5ae30.firebaseapp.com',
  projectId: 'test-pwa-5ae30',
  storageBucket: 'test-pwa-5ae30.appspot.com',
  appId: '1:1085529413657:web:59ac487341f0009ea8f288',
  messagingSenderId: '1085529413657'
})
