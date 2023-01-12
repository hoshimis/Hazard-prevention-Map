'use strict'

const getUserPostUrl = 'http://localhost:5000/getuserpost'
const getOpenDataUrl = 'http://localhost:5000/getopendata'
// const getUserPostUrl = 'https://test-pwa-5ae30.web.app/getuserpost'
// const getOpenDataUrl = 'https://test-pwa-5ae30.web.app/getopendata'

// button要素に挙動を追加する。
document.querySelector('.clear-origin').addEventListener('click', () => {
  clear('origin')
})
document.querySelector('.clear-destination').addEventListener('click', () => {
  clear('destination')
})
document.querySelector('.submit-button').addEventListener('click', () => {
  getWayPoint()
})
document.querySelector('.input-current').addEventListener('click', () => {
  getCurrentPosition()
})
document.querySelector('.clear-via').addEventListener('click', () => {
  //生成済マーカーを順次すべて削除する
  for (var i = 0; i < mapObj.markers.length; i++) {
    mapObj.clickMarker[i].setMap(null)
  }
  mapObj.clickMarker = [] //参照を開放
})

// 現在地点に関する変数
let syncerWatchPosition = {
  count: 0,
  lastTime: 0,
  map: null,
  marker: null,
  currentPosition: null
}

// 危険地域と通知に関する変数
let allSpot = {
  openDangerousSpot: [],
  userDangerousSpotOpen: [],
  notoified: []
}

// marker&circleのオブジェクトを格納する
let mapObj = {
  // 生成したmarker%circleを格納する配列
  markers: [],
  circles: [],
  // クリックしたmarkerの位置を格納する。
  clickMarker: [],
  // ルート検索の結果を格納する
  directionsRenderer: null
}

// マップの描画
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
      icon: '../images/icons8-google-maps-48.png'
    })
  } else {
    // 地図の中心を変更
    syncerWatchPosition.map.setCenter(currentLatlng)

    // マーカーの場所を変更
    syncerWatchPosition.marker.setPosition(currentLatlng)
  }
  syncerWatchPosition.currentPosition = currentLatlng
  init(syncerWatchPosition.map)
}

// 危険スポットの描画処理
const init = (mapConf = syncerWatchPosition.map) => {
  // すでにセットされているマーカをリセット
  deleteMakers()
  // ユーザ投稿情報の取得
  getUserPost(getUserPostUrl, mapConf)
  // オープンデータ情報の取得
  getOpenData(getOpenDataUrl + '/' + 'All', mapConf)

  // mapクリック時のイベントを追加
  mapConf.addListener('click', (e) => {
    addViaMaker(e)
    // マップクリック時に距離を計算するようにする。
    // markerが一個以上設置されていたら
    // 要素の取得(現在地と目的地)
    let originel = document.querySelector('#origin')
    let destinationel = document.querySelector('#destination')
    let origin = originel.value
    let destination = destinationel.value

    let data = {
      origin: origin,
      destination: destination
    }

    // 経由地点を格納する配列
    let waypoints = []

    mapObj.clickMarker.map((data) => {
      let lat = data.getPosition().lat()
      let lng = data.getPosition().lng()

      let point = {}
      point.location = `${lat}, ${lng}`

      // 経由地点を配列に格納する。
      waypoints.push(point)
    })

    data.waypoints = waypoints

    // 個々のif文の書き方ダサいけど許してください
    // 入力欄が埋まっている且つ経由地点を表示するマーカーが１つ以上あるとき
    if (origin !== '' || destination !== '') {
      if (mapObj.clickMarker.length >= 1) {
        console.log('ルートを表示するよ。')
        console.log(data.waypoints)
        directionMap(data)
      }
    }
  })
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
      allSpot.userDangerousSpotOpen = data //userデータを格納
      setMarker(data.openData, map, 0)
    })
    .catch((err) => {
      console.log(err)
    })
}

// markerを削除する
const deleteMakers = (idx = null) => {
  if (idx == null) {
    //生成済マーカーを順次すべて削除する
    for (var i = 0; i < mapObj.markers.length; i++) {
      mapObj.markers[i].setMap(null)
      mapObj.circles[i].setMap(null)
    }
    mapObj.markers = [] //参照を開放
    mapObj.circles = [] //参照を開放
  } else {
    //生成済マーカーからID指定されたmarker, circleを削除
    for (var i = 0; i < mapObj.markers.length; i++) {
      if (idx.indexOf(i) >= 0) {
        mapObj.markers[i].setMap(null)
        mapObj.circles[i].setMap(null)
      }
    }
  }
}

// makerを表示する。
const setMarker = (data, map, colorNum) => {
  // markerの色表示
  // clorNum -> 0 : userdata, 1 : opendata
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
      map: map, //表示している地図を指定する
      position: new google.maps.LatLng(lat, lng), //マーカーの表示位置を設定する
      title: name, //タイトルに値を設定する
      optimized: true
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

    // mapObj.markersに格納
    mapObj.markers.push(marker)
    mapObj.circles.push(circle)
  }
}

// 現在位置から指定位置までの道順を表示する。
// see https://softauthor.com/google-maps-directions-service/
const directionMap = (data) => {
  // DirectionServiceオブジェクトを生成
  const directionsService = new google.maps.DirectionsService()
  // 前回のルート表示を削除する
  if (mapObj.directionsRenderer !== null) {
    mapObj.directionsRenderer.setMap(null)
  } else {
    mapObj.directionsRenderer = new google.maps.DirectionsRenderer()
  }

  // 距離計算のdirectionRequest オブジェクトを作成
  directionsService.route(
    {
      origin: data.origin, // 出発地
      destination: data.destination, // 目的地
      waypoints: data.waypoints,
      optimizeWaypoints: true, // 経由地点を最適化する
      travelMode: 'WALKING' // 固定
    },
    (response, status) => {
      if (status === 'OK') {
        // ルートが見つかった場合は、DirectionsRenderer オブジェクトを使って地図上に表示します
        // 描画するマップを設定する。
        mapObj.directionsRenderer.setMap(syncerWatchPosition.map)
        //directionsRenderer と地図を紐付け
        mapObj.directionsRenderer.setDirections(response)
      }
    }
  )
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

// クリックした地点にclickMarkerを表示させる
const addViaMaker = (event) => {
  // marker作成
  var marker = new google.maps.Marker({
    draggable: true // ドラッグができるようになる
  })
  // markerの位置を設定
  // event.latLng.lat()でクリックしたところの緯度を取得
  marker.setPosition(
    new google.maps.LatLng(event.latLng.lat(), event.latLng.lng())
  )

  // 配列に格納する。
  mapObj.clickMarker.push(marker)

  // marker設置
  marker.setMap(syncerWatchPosition.map)
}

// クリックしたmarkerの地点をwatpointに格納する。
const getWayPoint = () => {
  // index.htmlに渡す値
  const via = document.querySelector('#via')
  const originLat = document.querySelector('#origin-lat')
  const originLng = document.querySelector('#origin-lng')
  const destinationLat = document.querySelector('#origin-lat')
  const destinationLng = document.querySelector('#origin-lng')

  // 経由地点を格納する配列
  let waypoints = []

  mapObj.clickMarker.map((data) => {
    let lat = data.getPosition().lat()
    let lng = data.getPosition().lng()

    let point = {}
    point.location = `${lat}, ${lng}`

    // 経由地点を配列に格納する。
    let tmp = JSON.stringify(point)
    waypoints.push(tmp)
  })
  via.value = waypoints.join('★')
}

// 入力を削除する。
const clear = (target) => {
  let el = document.querySelector(`#${target}`)
  el.value = ''
}

// 現在地を取得する関数
const getCurrentPosition = () => {
  getAddress(syncerWatchPosition.currentPosition)
}

// タップした個所の緯度経度から住所に変換する
const getAddress = (latlng) => {
  const geocoder = new google.maps.Geocoder()
  // 第１引数はGeocoderRequest。緯度経度⇒住所の変換時はlatLngプロパティを入れればOK。
  // 第２引数はコールバック関数。
  geocoder.geocode(
    {
      latLng: latlng
    },
    function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        // results.length > 1 で返ってくる場合もありますが・・・。
        if (results[0].geometry) {
          // 住所を取得(日本の場合だけ「日本、」を削除)
          const address = results[0].formatted_address.replace(
            /^日本、〒\d{3}-\d{4}/,
            ''
          )
          let origin = document.querySelector('#origin')
          origin.value = address
        }
      }
    }
  )
}
