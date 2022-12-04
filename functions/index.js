const functions = require("firebase-functions");
// expressのimport
const express = require("express");

// expressのappを作成する。
const app = express();
// timestampのパスにgetでアクセスしたら以下を実行
app.get("/timestamp", (request, response) => {
  //   response.send("Hello from Firebase!");
  response.send(`${Date.now()}`);
});

// コンテンツキャッシュの作成
app.get("/timestamp", (request, response) => {
  response.set("Cache-Control", "public", "max-age=300", "smax-age=600");
  response.send(`${Date.now()}`);
});

// https関数の作成
// これらの関数にリクエストが来るたびに処理を返す
exports.app = functions.https.onRequest(app);
