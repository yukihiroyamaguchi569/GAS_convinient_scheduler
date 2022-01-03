function onOpen() {

  //カスタムメニュー作成
  SpreadsheetApp.getActiveSpreadsheet().addMenu('便利なスケジューラー', COSTUM_MENU);

}


//　チェックが入ったメンバーの一覧を、入力画面シートの1行目に展開する
function setMemberName() {

}

//「チャンネル名一覧」シートを更新
function updateSlackChannels() {
  const slackApi = new SlackApi();
  const activeChannelsValues = slackApi.getActiveChannelsValues();
  const sheet = new Sheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_INFO.SLACK_CHANNEL.NAME));
  sheet.setValuesHeaderRowAfter(activeChannelsValues);
}

//チャンネルに存在するメンバーを「メンバー選択」シートの4行目以降にペースト
function setMemberList() {
  const slackApi = new SlackApi();
  const sheet = new Sheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_INFO.SELECT_MEMBER.NAME), SHEET_INFO.SELECT_MEMBER.HEADER_ROWS);

  const channelId = sheet.getValue(SHEET_INFO.SELECT_MEMBER.CHANNEL_ID_RANGE);
  const slackNameValues = slackApi.getSlackNameValuesById(channelId);
  sheet.setValuesHeaderRowAfter(slackNameValues);
}

// Slackに入力依頼を投稿
function postInputRequest() {


}