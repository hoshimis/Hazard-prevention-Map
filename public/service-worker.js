'use strict'

/**
 * @brief add serviceworkerの全体説明
 * @desc スコープはサービスワーカーが存在する階層が勝手に指定される
 * @see https://32877.info/view/how-to-PWA-with-Push-Notification-01
 * @see https://qiita.com/y_fujieda/items/f9e765ac9d89ba241154
 * @see https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/?hl=ja
 *  */
/**
 * @desc install時の挙動
 * @see https://qiita.com/y_fujieda/items/f9e765ac9d89ba241154
 *
 * @param VERSION バージョンを管理
 * @param ORIGIN 通信元を指定する。デプロイ後、当該オリジンに変更する
 * @param CACHE_NAME キャッシュに保存する時の名前,静的ファイルを指定すると、オフライン時も実行可能になる
 * @param STATIC_FILES キャッシュで保存するリソースの指定
 */

const CACHE_NAME = 'chace-2'
const ORIGIN = 'https://test-pwa-5ae30.web.app/'
const urlsToCache = [
  './',
  './index.html',
  './src/pages/routes.html',
  './src/pages/settings.html',
  './src/pages/userpost.html',
  './src/js/route.js',
  './src/js/setttings.js',
  './src/js/userpost.js',
  './src/styles/main.css',
  './src/styles/reboot.css'
]
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 指定されたリソースをキャッシュに追加する
      return cache.addAll(urlsToCache)
    })
  )
})

/**
 * @see https://qiita.com/y_fujieda/items/f9e765ac9d89ba241154
 * @desc
 * 新規のインストール時には何も処理されない。
 * 1.キャッシュ名が変わったり、serviceworkerが更新されたと判断されたら、installが発火。
 * 2.そして変更されたキャッシュ名で保存される。
 * 3.安全な状態になり、サイドページを開いたときに、activateイベントが発火する。
 * 4.新しいキャッシュ名に変更されて、昔のキャッシュは削除される。
 */
self.addEventListener('activate', (e) => {
  let cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // ホワイトリストにないキャッシュ(古いキャッシュ)は削除する
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

/**
 * @see https://qiita.com/y_fujieda/items/f9e765ac9d89ba241154
 * @desc
 * serviceworkerがブラウザをコントロールしている時にリソースのリクエストが発生すると、fetchが発火する。
 * fetchイベントで何もしなければ、普通にネットワーク経由でリクエストが処理される。
 *
 */
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // キャッシュ内に該当レスポンスがあれば、それを返す
      if (response) {
        return response
      }
      // 重要：リクエストを clone する。リクエストは Stream なので
      // 一度しか処理できない。ここではキャッシュ用、fetch 用と2回
      // 必要なので、リクエストは clone しないといけない
      let fetchRequest = e.request.clone()

      return fetch(fetchRequest).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          // キャッシュする必要のないタイプのレスポンスならそのまま返す
          return response
        }
        // 重要：レスポンスを clone する。レスポンスは Stream で
        // ブラウザ用とキャッシュ用の2回必要。なので clone して
        // 2つの Stream があるようにする
        let responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache)
        })
        return response
      })
    })
  )
})
