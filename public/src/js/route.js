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

    init()
  })
}

const init = () => {
  console.log('route')
}
