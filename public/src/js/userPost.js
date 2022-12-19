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

    init(mapConf)
  })
}

// マップ上のクリックした個所のlatlngを取得する。
function init(mapConf) {
  console.log(mapConf)
  mapConf.addListener('click', (e) => {
    setTimeout(() => {
      console.log(e.latLng.lat())
      console.log(e.latLng.lng())
      getAddress(e.latLng)
      const lat = document.querySelector('#lat')
      const lng = document.querySelector('#lng')
      lat.value = e.latLng.lat()
      lng.value = e.latLng.lng()
      getToday()
    }, 1500)
  })
}

/**
 * @function getAddress タップした個所の緯度経度から住所に変換する
 */
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
          const place = document.querySelector('#place')
          place.value = address
        }
      }
    }
  )
}

/**
 * 今日の日付を取得する
 * @see https://wakalog.hatenadiary.jp/entry/2017/10/25/104040
 */
const getToday = () => {
  var today = new Date()
  today.setDate(today.getDate())
  var yyyy = today.getFullYear()
  var mm = ('0' + (today.getMonth() + 1)).slice(-2)
  var dd = ('0' + today.getDate()).slice(-2)
  document.querySelector('#date').value = yyyy + '-' + mm + '-' + dd
}
