class SlackApi { }

function testSlackApi() {

  const getSlack = new SlackApi();

  // チャンネル名を引数にしてメンバー一覧を返す（スニペットあり）
  console.log(SlackApi.getMembers());

  //催促したい人のアカウント名を一次元配列で受け取って,催促の文面を作るメソッド
  console.log(SlackApi.makeMessageBody);

  //投稿するチャンネル名をうけとって、Slackに文面を投稿するメソッド
  console.log(SlackApi.post());

}

