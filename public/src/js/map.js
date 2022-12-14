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

    title: '名古屋駅！！',
    class: 'fff/'
  })

  // クリックイベントを追加
  map.addListener('click', function (e) {
    console.log(e.latLng.lat())
    console.log(e.latLng.lng())
    getAddress(e.latLng)
    var lat = document.getElementById('lat')
    var lng = document.getElementById('lng')

    lat.value = e.latLng.lat();
    lng.value = e.latLng.lng();
  })
}

function getAddress(latlng) {
  // ジオコーダのコンストラクタ
  var geocoder = new google.maps.Geocoder()
  let address
  
  // geocodeリクエストを実行。
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
          // 住所を取得(日本の場合だけ「日本, 」を削除)
          address = results[0].formatted_address.replace(/^日本, /, '')
          const place = document.getElementById('place')
          place.value = address
        }
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
      const latlng = new google.maps.LatLng(35.6811673, 139.7670516)
      const options = {
        zoom: 15, //地図の縮尺値を設定する
        center: latlng //地図の中心座標を設定する
      }
      const map = new google.maps.Map(document.getElementById('map'), options)

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
