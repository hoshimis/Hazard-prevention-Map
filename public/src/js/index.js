'use strict'

const getUserPostUrl = 'http://localhost:5000/getuserpost'
const getOpenDataUrl = 'http://localhost:5000/getopendata'

// 現在地点に関する変数
let syncerWatchPosition = {
  count: 0,
  lastTime: 0,
  map: null,
  marker: null
}

// 危険地域と通知に関する変数
let allSpot = {
  openDangerousSpot: [],
  userDangerousSpotOpen: [],
  notoified: []
}

// 生成したmarker%circleを格納する配列
let markers = []
let circles = []

var initMap = () => {
  console.log('init map')
  let watchId = navigator.geolocation.watchPosition(
    successGetCurrentPosition,
    errGetCurrentPosition,
    syncerWatchPosition
  )
}

// 現在位置を取得するのに成功した場合に実行
const successGetCurrentPosition = (position) => {
  // データの更新
  ++syncerWatchPosition.count // 処理回数
  let nowTime = ~~(new Date() / 1000) // UNIX Timestamp

  // 前回の書き出しから3秒以上経過していたら描写
  // 毎回HTMLに書き出していると、ブラウザがフリーズするため
  if (syncerWatchPosition.lastTime + 3 > nowTime) {
    return false
  }
  // 前回の時間を更新
  syncerWatchPosition.lastTime = nowTime

  // 位置情報
  const currentLatlng = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude
  )

  // Google Mapsに書き出し
  if (syncerWatchPosition.map == null) {
    // 地図の新規出力
    syncerWatchPosition.map = new google.maps.Map(
      document.getElementById('map'),
      {
        zoom: 15, // ズーム値
        center: currentLatlng // 中心座標 [latlng]
      }
    )

    // マーカーの新規出力
    syncerWatchPosition.marker = new google.maps.Marker({
      map: syncerWatchPosition.map,
      position: currentLatlng,
      icon: './src/images/icons8-google-maps-48.png'
    })
  } else {
    // 地図の中心を変更
    syncerWatchPosition.map.setCenter(currentLatlng)

    // マーカーの場所を変更
    syncerWatchPosition.marker.setPosition(currentLatlng)
    calcDistance(currentLatlng)
  }

  init(syncerWatchPosition.map)
}

// 危険スポットの描画処理
function init(mapConf = syncerWatchPosition.map) {
  // すでにセットされているマーカをリセット
  deleteMakers()
  // ユーザ投稿情報の取得
  getUserPost(getUserPostUrl, mapConf)
  // オープンデータ情報の取得
  getOpenData(getOpenDataUrl + '/' + 'All', mapConf)
  // ルート検索から遷移された場合
  checkDirectionParam(mapConf)
}

// 現在地取得に失敗したときに実行される関数
const errGetCurrentPosition = (error) => {
  // エラーコードのメッセージを定義
  const errorMessage = {
    0: '原因不明のエラーが発生しました…。',
    1: '位置情報の取得が許可されませんでした…。',
    2: '電波状況などで位置情報が取得できませんでした…。',
    3: '位置情報の取得に時間がかかり過ぎてタイムアウトしました…。'
  }

  // エラーコードに合わせたエラー内容を表示
  alert(errorMessage[error.code])
}

// ユーザ投稿の取得
const getUserPost = (url, map) => {
  fetch(url)
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      // JSON のデータ数分処理
      allSpot.userDangerousSpotOpen = data //userデータを格納
      setMarker(data.userPosts, map, 1)
    })
    .catch((err) => {
      console.log(err)
    })
}

// オープンデータの取得
const getOpenData = (url, map) => {
  fetch(url)
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      // JSON のデータ数分処理
      allSpot.openDangerousSpot = data //userデータを格納
      setMarker(data.openData, map, 0)
    })
    .catch((err) => {
      console.log(err)
    })
}

// ルート検索からの遷移か確認する。
const checkDirectionParam = (map) => {
  // URLを取得
  const url = new URL(location.href)
  const params = url.searchParams

  const data = {
    origin: params.get('origin'),
    destination: params.get('destination'),
    waypoints: params.get('via'),
    lat: params.get('lat'),
    lng: params.get('lng')
  }
  // ルート検索から遷移されていたら、ルート検索が実行される。
  if (data.origin !== null && data.destination !== null) {
    directionMap(data, map)
  }
}

// 現在位置から指定位置までの道順を表示する。
// see https://softauthor.com/google-maps-directions-service/
const directionMap = (data, map) => {
  // DirectionServiceオブジェクトを生成
  const directionsService = new google.maps.DirectionsService()

  // text形式からオブジェクトの形に直す
  let arr = data.waypoints.replace('/"', '"').split('★')
  let waypoints = new Array()
  arr.map((data) => {
    try {
      waypoints.push(JSON.parse(data))
    } catch (error) {
      waypoints = null
    }
  })

  // 距離計算のdirectionRequest オブジェクトを作成
  directionsService.route(
    {
      origin: `${data.lat}, ${data.lng}`, // 出発地
      destination: data.destination, // 目的地
      waypoints:
        waypoints === null
          ? [{ location: `${data.lat}, ${data.lng}` }]
          : waypoints, // 経由地点
      optimizeWaypoints: true, // 経由地点を最適化する
      travelMode: 'WALKING' // 固定
    },
    (response, status) => {
      if (status === 'OK') {
        // ルートが見つかった場合は、DirectionsRenderer オブジェクトを使って地図上に表示します
        const directionsRenderer = new google.maps.DirectionsRenderer()
        directionsRenderer.setMap(map)
        //directionsRenderer と地図を紐付け
        directionsRenderer.setDirections(response)
      }
    }
  )
}

// 現在地と危険地との距離を計測する。
const calcDistance = (position) => {
  let distance = []
  const currentPosition = position
  let userSpot = new Array()
  let openSpot = new Array()
  userSpot = allSpot.userDangerousSpotOpen.userPosts
  openSpot = allSpot.openDangerousSpot.openData
  const spot = userSpot.concat(openSpot)
  for (let i = 0; i < spot.length; i++) {
    let position = new google.maps.LatLng(spot[i].lat, spot[i].lng)
    distance[i] = google.maps.geometry.spherical.computeDistanceBetween(
      currentPosition,
      position
    )
    if (distance[i] < 100) {
      sendPushNotification()
    }
  }
}

//危険区域に近づいたら通知を行う。
const sendPushNotification = () => {
  Push.create('危険予防マップ', {
    body: '危険な区域に近づきました。周りに注意してください。',
    icon: './src/images/icons8-google-maps-48.png',
    timeout: 5000,
    onClick: () => {
      this.close()
      location.href = '/'
    }
  })
}

// markerを削除する
const deleteMakers = (idx = null) => {
  if (idx == null) {
    //生成済マーカーを順次すべて削除する
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null)
      circles[i].setMap(null)
    }
    markers = [] //参照を開放
    circles = [] //参照を開放
  } else {
    //生成済マーカーからID指定されたmarker, circleを削除
    for (var i = 0; i < markers.length; i++) {
      if (idx.indexOf(i) >= 0) {
        markers[i].setMap(null)
        circles[i].setMap(null)
      }
    }
  }
}

// makerを表示する。
const setMarker = (data, map, colorNum) => {
  // markerの色表示
  // 0 : userdata, 1 : opendata
  let colorKey = colorNum === 0 ? 'userDataColor' : 'openDataColor'
  let getColor = localStorage.getItem(colorKey)
  let color
  getColor !== null ? (color = getColor) : (color = '#000')

  for (let i = 0; i < data.length; i++) {
    const name = data[i].name //タイトル
    const place = data[i].place // 場所
    const date = data[i].date // 日付、日時
    const time = data[i].time // 時間帯
    const remarks = data[i].remarks //備考
    const lat = data[i].lat // 緯度
    const lng = data[i].lng // 軽度

    // マーカーの表示
    const marker = new google.maps.Marker({
      map: map, // 表示している地図を指定する
      position: new google.maps.LatLng(lat, lng), // マーカーの表示位置を設定する
      title: name // タイトルに値を設定する
    })

    const infoWindow = new google.maps.InfoWindow({
      position: new google.maps.LatLng(lat, lng), //マーカーの表示位置を設定する
      content: `
      <div>件名：${name}</div>
      <div>場所：${place}</div>
      <div>日時：${date}</div>
      <div>時間：${time}時台</div>
      <div>備考：${remarks}</div>`,
      pixelOffset: new google.maps.Size(0, -50)
    })

    //マーカーをクリックしたら情報ウィンドウを開く
    marker.addListener('click', () => {
      infoWindow.open(map)
    })

    const circle = new google.maps.Circle({
      map: map,
      center: new google.maps.LatLng(lat, lng),
      // 以下からオプション値
      radius: 90,
      fillColor: `${color}`,
      strokeColor: `${color}`
    })

    // markersに格納
    markers.push(marker)
    circles.push(circle)
  }
}

// フィルタリングされたオープンデータの情報を表示
const filterPoint = (filterYear) => {
  // 現在表示されているmarkerの削除
  deleteMakers()
  let opUrl = getOpenDataUrl + '/' + filterYear
  let usUrl = getUserPostUrl + '/' + filterYear
  getOpenData(opUrl, syncerWatchPosition.map)
  getUserPost(usUrl, syncerWatchPosition.map)
}

// Service Worker 登録
navigator.serviceWorker
  .register('./../../service-worker.js')
  .catch(console.error.bind(console))
