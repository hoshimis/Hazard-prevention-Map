## ディレクトリ構成

```
root/
├─ README.md
├─ docs
│   ├─ dir.md
│   ├─ manifest.json.md
│   └─ sw.js.md
├─ firebase.json
├─ functions
│   ├─ index.js
│   ├─ js
│   │   ├─ firebase
│   │   │   └─ config.js
│   │   ├─ main.js
│   │   └─ util
│   │       ├─ counter.js
│   │       └─ push.js
│   ├─ main.js
│   ├─ package─lock.json
│   ├─ package.json
│   └─ sw.js
└─ public
    ├─ images
    │   └─ sample.png
    ├─ index.html
    ├─ manifest.json
    └─ src
        ├─ pages
        │   ├─ 404.html
        │   └─ sub.html
        └─ styles
            ├─ main.css
            ├─ reset.css
            └─ style.css
```

### docs

- 各ファイルの説明

### functions/

- firebase cloud functions で動かすコードを格納する
  - ### js/
    - js ファイルを格納する
      - ### firebase/
        - firebase の操作を行う js ファイルを格納する
      - ### util
        - firebase を操作する以外で自分で作った関数などを格納する

### public/

- firebase hosting にデプロイする HTML/CSS/js ファイルを格納する
  - ### images/
    - webapp に表示する画像を格納する
  - ### pages/
    - index.html 以外の html ファイルを格納する
  - ### styles/
    - css ファイルを格納する
