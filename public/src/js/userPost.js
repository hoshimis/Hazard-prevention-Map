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
    // map情報の格納
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
  mapConf.addListener('click', (e) => {
    getAddress(e.latLng)
    const lat = document.querySelector('#lat')
    const lng = document.querySelector('#lng')
    lat.value = e.latLng.lat()
    lng.value = e.latLng.lng()
  })
  const date = document.querySelector('#date')
  const year = document.querySelector('#year')
  date.addEventListener('change', () => {
    const str = date.value.substr(0, 4)
    year.value = str
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
