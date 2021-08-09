"use strict";

const express = require("express");
const line = require("@line/bot-sdk");
const PORT = process.env.PORT || 3000;

const getChannelSeacret = require("./seacretDirectory/channelSeacret");
const getChannelAccessToken = require("./seacretDirectory/channelAccessToken");

const config = {
  channelSecret: getChannelSeacret(),
  channelAccessToken: getChannelAccessToken(),
};

const app = express();

app.get("/", (req, res) => res.send("Hello LINE BOT!(GET)")); //ブラウザ確認用(無くても問題ない)
app.post("/webhook", line.middleware(config), (req, res) => {
  console.log(req.body.events);

  Promise.all(req.body.events.map(handleEvent)).then((result) =>
    res.json(result)
  );
});

const client = new line.Client(config);

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  /* -------------------------------------------
    -------返信メッセージの処理の記述ゾーン ---------
    ------------------------------------------- */

  let replyText = "";
  replyText = event.message.text; // event.message.textに自分のメッセージが入っている。

  /* ------------------------------------------
    ------------------------------------------
    ------------------------------------------ */

  /* ここでメッセージを返す。(replyTextに返すメッセージが入っている。) */
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: replyText,
  });
}
app.listen(PORT);
console.log(`Server running at ${PORT}`);
