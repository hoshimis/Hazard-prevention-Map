const getUserPostUrl = 'http://localhost:5000/getuserpost'

/**
 * @function initMap mapの初期化処理
 * @param latLng 地図の中心位置を指定
 * @param options 地図の表示設定
 * @param map mapクラスのインスタンス
 * @param circle 円の表示
 * @param marker マーカーとタイトルの表示
 */

var initMap = () => {
  console.log('init map')
  navigator.geolocation.getCurrentPosition((currentPoition) => {
    const currentlatlng = new google.maps.LatLng(
      currentPoition.coords.latitude,
      currentPoition.coords.longitude
    )
    const options = {
      zoom: 15, //地図の縮尺値を設定する
      center: currentlatlng //地図の中心座標を設定する
    }
    const mapConf = new google.maps.Map(document.getElementById('map'), options)
    const marker = new google.maps.Marker({
      map: mapConf,
      position: currentlatlng,
      title: 'ここが現在地です。'
    })

    // // 現在位置を追跡する。
    // navigator.geolocation.watchPosition(
    //   successGetCurrentPosition(mapConf, currentlatlng),
    //   errGetCurrentPosition,
    //   optionObj
    // )
    init(mapConf)
  })
}

let syncerWatchPosition = { lastTime: 0 }

// 現在位置を取得するのに成功した場合に実行
const successGetCurrentPosition = (mapConf, currentlatlng) => {
  let nowTime = ~~(new Date() / 1000) // UNIX Timestamp

  // 前回の書き出しから3秒以上経過していたら描写
  // 毎回HTMLに書き出していると、ブラウザがフリーズするため
  if (syncerWatchPosition.lastTime + 3 > nowTime) {
    return false
  }
  // 前回の時間を更新
  syncerWatchPosition.lastTime = nowTime
  console.log(mapConf)
  // 地図の中心を変更
  mapConf.setCenter(currentlatlng)

  // // マーカーの場所を変更
  // mapConf.setPosition(currentlatlng)
}

// 現在地取得に失敗したときに実行される関数
const errGetCurrentPosition = (error) => {
  // エラーコードのメッセージを定義
  var errorMessage = {
    0: '原因不明のエラーが発生しました…。',
    1: '位置情報の取得が許可されませんでした…。',
    2: '電波状況などで位置情報が取得できませんでした…。',
    3: '位置情報の取得に時間がかかり過ぎてタイムアウトしました…。'
  }

  // エラーコードに合わせたエラー内容を表示
  alert(errorMessage[error.code])
}

// オプション・オブジェクト
var optionObj = {
  enableHighAccuracy: false,
  timeout: 1000000,
  maximumAge: 0
}

function init(mapConf) {
  // ユーザ投稿情報の取得
  getUserPost(getUserPostUrl, mapConf)
  // オープンデータ情報の取得
  getJSON(mapConf)
  // ルート検索から遷移された場合
  checkDirectionParam(mapConf)
}

// ユーザ投稿の取得
const getUserPost = (url, map) => {
  let getColor = localStorage.getItem('userDataColor')
  let color
  getColor !== null ? (color = getColor) : (color = '#000')
  console.log(color, getColor)

  fetch(url)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      // JSON のデータ数分処理
      for (let i = 0; i < data.userPosts.length; i++) {
        const lat = data.userPosts[i].lat //緯度
        const lng = data.userPosts[i].lng //経度
        const name = data.userPosts[i].subject //タイトル

        // マーカーの表示
        const marker = new google.maps.Marker({
          map: map, //表示している地図を指定する
          position: new google.maps.LatLng(lat, lng), //マーカーの表示位置を設定する
          title: name //タイトルに値を設定する
          // icon: 'http://mt.google.com/vt/icon?psize=16&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=3&text=A'
        })
        const circle = new google.maps.Circle({
          map: map,
          center: new google.maps.LatLng(lat, lng),
          // 以下からオプション値
          radius: 90,
          fillColor: `${color}`,
          strokeColor: `${color}`
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

/**
 * @function getJSON JSONとのやりとり
 * @param req XMLHttpRequest オブジェクト
 * @function onreadystatechange XMLHttpRequest オブジェクトの状態が変化した際に呼び出されるイベントハンドラ
 * @param data 取得したJsonファイルが格納される
 * @param latlng 地図の中心座標を指定
 * @param marker
 * @function open HTTPメソッドとアクセスするサーバーのURLを指定
 * @function send 実際にサーバーへリクエストを送信
 *
 * @see https://www.koreyome.com/web/json-data-get/
 */
const getJSON = (map) => {
  let getColor = localStorage.getItem('openDataColor')
  let color
  getColor !== undefined ? (color = getColor) : (color = '#000')
  const req = new XMLHttpRequest()
  req.onreadystatechange = () => {
    if (req.readyState == 4 && req.status == 200) {
      const data = JSON.parse(req.responseText)

      // JSON のデータ数分処理
      for (let i = 0; i < data.marker.length; i++) {
        const lat = data.marker[i].lat //緯度
        const lng = data.marker[i].lng //経度
        const name = data.marker[i].name //タイトル

        const latlng = new google.maps.LatLng(lat, lng)
        // マーカーの表示
        const marker = new google.maps.Marker({
          map: map, //表示している地図を指定する
          position: latlng, //マーカーの表示位置を設定する
          title: name //タイトルに値を設定する
        })

        const circle = new google.maps.Circle({
          map: map,
          center: latlng,
          radius: 90,
          fillColor: `${color}`,
          strokeColor: `${color}`
        })
      }
    }
  }
  req.open('GET', './data.json', true)
  req.send()
}

// ルート検索からの遷移か確認する。
const checkDirectionParam = (map) => {
  // URLを取得
  const url = new URL(window.location.href)
  const params = url.searchParams

  const origin = params.get('origin')
  const destination = params.get('destination')

  // ルート検索から遷移されていたら、ルート検索が実行される。
  if (origin !== null && destination !== null) {
    directionMap(origin, destination, map)
  }
}

/**
 * @function directionMap 現在位置から指定位置までの道順を表示する。
 * @see https://softauthor.com/google-maps-directions-service/
 */
const directionMap = (origin, destination, map) => {
  const directionsService = new google.maps.DirectionsService()
  const directionsRenderer = new google.maps.DirectionsRenderer()

  //directionsRenderer と地図を紐付け
  directionsRenderer.setMap(map)

  directionsService.route(
    {
      origin: origin,
      destination: destination,
      travelMode: 'WALKING' // 固定
    },
    (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response)
      }
    }
  )
}
