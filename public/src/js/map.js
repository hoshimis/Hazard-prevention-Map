/**
 * @author 小池将弘
 * @function initMap mapの初期化処理
 * @param latLng 地図の中心位置を指定
 * @param options 地図の表示設定
 * @param map mapクラスのインスタンス
 * @param circle 円の表示
 * @param marker マーカーとタイトルの表示
 *
 */

var initMap = () => {
  console.log("init map");
  const latLng = new google.maps.LatLng(35.170778, 136.882494);
  const options = {
    zoom: 17, //地図の縮尺値を設定する
    center: latLng, //地図の中心座標を設定する
  };
  const map = new google.maps.Map(document.getElementById("map"), options);

  const circle = new google.maps.Circle({
    map: map,
    center: latLng,
    radius: 90,
  });

  const marker = new google.maps.Marker({
    map: map,
    position: latLng,
    title: "名古屋駅！！",
  });

  getJSON()
};

/**
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
  const req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    if (req.readyState == 4 && req.status == 200) {
      const data = JSON.parse(req.responseText);
      const latlng = new google.maps.LatLng(35.6811673, 139.7670516);
      const options = {
        zoom: 15, //地図の縮尺値を設定する
        center: latlng, //地図の中心座標を設定する
      };
      const map = new google.maps.Map(document.getElementById("map"), options);

      // JSON のデータ数分処理
      for (let i = 0; i < data.marker.length; i++) {
        console.log(`
          let: ${data.marker[i].lat}, 
          lng: ${data.marker[i].lng},
          name: ${data.marker[i].name},
          flg: ${data.marker[i].flg}
          `);
        const lat = data.marker[i].lat; //緯度
        const lng = data.marker[i].lng; //経度
        const name = data.marker[i].name; //タイトル
        const flg = data.marker[i].flg; //flg
        

        // flgがAの値のみを表示する
        if (flg === "A") {
          //マーカーとタイトルを表示する
          const marker = new google.maps.Marker({
            map: map, //表示している地図を指定する
            position: new google.maps.LatLng(lat, lng), //マーカーの表示位置を設定する
            title: name, //タイトルに値を設定する
            icon: "http://mt.google.com/vt/icon?psize=16&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=3&text=A",
          });
        } else if (flg === "B") {
          const marker = new google.maps.Marker({
            map: map, //表示している地図を指定する
            position: new google.maps.LatLng(lat, lng), //マーカーの表示位置を設定する
            title: name, //タイトルに値を設定する
            icon: "http://mt.google.com/vt/icon?psize=16&font=fonts/Roboto-Regular.ttf&color=ff330000&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=3&text=B",
          });
        } else if (flg === "C") {
          const marker = new google.maps.Marker({
            map: map, //表示している地図を指定する
            position: new google.maps.LatLng(lat, lng), //マーカーの表示位置を設定する
            title: name, //タイトルに値を設定する
            icon: "http://mt.google.com/vt/icon?psize=16&font=fonts/Roboto-Regular.ttf&color=f3331111&name=icons/spotlight/spotlight-waypoint-b.png&ax=44&ay=48&scale=3&text=C",
          });
        }
      }
    }
  };
  req.open("GET", "./2018.json", true);
  req.send();
};
