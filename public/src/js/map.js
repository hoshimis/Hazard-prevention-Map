/**
 * @author 小池将弘
 * @function initMap mapの初期化処理
 * @param latLng 地図の中心位置を指定
 * @param options 地図の表示設定
 * @param map mapクラスのインスタンス
 * @param circle 円の表示
 * @param marker マーカーとタイトルの表示
 */

let map

var initMap = () => {
  const currentlatlng = new google.maps.LatLng(35.170778, 136.882494)
  console.log('init map')
  const options = {
    zoom: 15, //地図の縮尺値を設定する
    center: currentlatlng //地図の中心座標を設定する
  }
  map = new google.maps.Map(document.getElementById('map'), options)

  const marker = new google.maps.Marker({
    map: map,
    position: latLng,
    title: '名古屋駅！！'
  })

  // URLを取得
  let url = new URL(window.location.href)
  // URLSearchParamsオブジェクトを取得
  let params = url.searchParams

  // getメソッド
  const origin = params.get('origin')
  const destination = params.get('destination')

  // 現在地と宛先のパラメタがあったならば
  if (origin !== null && destination !== null) {
    directionMap(origin, destination)
  }
}

/**
 * @author 小池将弘
 * @function directionMap 現在位置から指定位置までの道順を表示する。
 */

// directionApi
const directionMap = (origin, destination) => {
  //https://softauthor.com/google-maps-directions-service/
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
      console.log(response) //JSONの中身はここを見てね。
      console.log(status)
      if (status === 'OK') {
        directionsRenderer.setDirections(response) //取得したルート（結果：result）をセット
      }
    }
  )
}

/**
 * @author 小池将弘
 * @function getJSON JSONとのやりとり
 * @param req XMLHttpRequest オブジェクト
 * @function onreadystatechange XMLHttpRequest オブジェクトの状態が変化した際に呼び出されるイベントハンドラ
 * @param data 取得したJsonファイルが格納される
 * @param latlng 地図の中心座標を指定
 * @param options Mapクラスのインスタンス
 * @param marker
 * @function open HTTPメソッドとアクセスするサーバーのURLを指定
 * @function send 実際にサーバーへリクエストを送信
 *
 * @see https://www.koreyome.com/web/json-data-get/
 */
const getJSON = () => {
  const req = new XMLHttpRequest()
  req.onreadystatechange = () => {
    if (req.readyState == 4 && req.status == 200) {
      const data = JSON.parse(req.responseText)

      map = new google.maps.Map(document.getElementById('map'), options)

      // JSON のデータ数分処理
      for (let i = 0; i < data.marker.length; i++) {
        console.log(`
          lat: ${data.marker[i].lat}, 
          lng: ${data.marker[i].lng},
          name: ${data.marker[i].name},
          flg: ${data.marker[i].flg}
          `)
        const lat = data.marker[i].lat //緯度
        const lng = data.marker[i].lng //経度
        const name = data.marker[i].name //タイトル

        // マーカーの表示
        const marker = new google.maps.Marker({
          map: map, //表示している地図を指定する
          position: new google.maps.LatLng(lat, lng), //マーカーの表示位置を設定する
          title: name, //タイトルに値を設定する
          icon: 'http://mt.google.com/vt/icon?psize=16&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=3&text=A'
        })

        // const circle = new google.maps.Circle({
        //   map: map,
        //   center: latLng,
        //   radius: 90
        // })
      }
    }
  }
  req.open('GET', './data.json', true)
  req.send()
}
