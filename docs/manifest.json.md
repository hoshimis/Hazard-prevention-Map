## manifest.json

見る前に`ctrl+shift+v`をおす！

ウェブアプリのマニフェストを json 形式で記載したもの  
ウェブアプリをインストールする際にこちらの設定が参照される  
magnifest.json はサイトのルートディレクトリに設置  
サイトの head タグ内に magnifest.json の位置を記載しておく必要がある

### パス

[manifest.json](../public/manifest.json)

### それぞれの項目の説明

| 項目名           | 説明                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------- |
| name             | サイト（ウェブアプリ）名                                                                                   |
| short_name       | ホーム画面に表示されるサイト（ウェブアプリ）名                                                             |
| description      | サイト（ウェブアプリ）の説明                                                                               |
| start_url        | 起動時に表示される URL。PWA 化するならこのままで OK。                                                      |
| display          | 表示モード。fullscreen、fullscreen、standalone、minimal-ui の 4 つを設定可能。 通常は standalone で OK。   |
| lang             | 日本語なら「ja」                                                                                           |
| dir              | テキストの方向。 ltr（左から右）、rtl（右から左）、auto の 3 つを設定可能。日本語は ltr（左から右）で OK。 |
| theme_color      | サイト（ウェブアプリ）のテーマカラー。OS/ブラウザによって使用方法は異なる。                                |
| background_color | 背景色。サイト起動時にこの色が表示されたりする。                                                           |
| icons            | アイコン用画像。ホーム画面に表示されたりする。192x192px と 512x512px があれば OK。                         |
| gcm_sender_id    | プッシュ通知を受信する場合は必要。Firebase の Cloud Messaging を用いる場合、当該プロジェクト ID を指定する |
