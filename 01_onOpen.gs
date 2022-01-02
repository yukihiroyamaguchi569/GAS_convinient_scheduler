function onOpen() {

  //カスタムメニュー作成

  //チャンネル名を取得してチャンネル名一覧シートに展開する

}


function setMemberName() {
  //　チェックが入ったメンバーの一覧を、入力画面シートの1行目に展開する

}

function updateSlackChannels() {
  const slackApi = new SlackApi();
  const activeChannelsValues = slackApi.getActiveChannelsValues();
  const sheet = new Sheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_INFO.SLACK_CHANNEL.NAME));
  sheet.setValuesHeaderRowAfter(activeChannelsValues);
}

function setMemberList() {
  const slackApi = new SlackApi();
  const sheet = new Sheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_INFO.SELECT_MEMBER.NAME), SHEET_INFO.SELECT_MEMBER.HEADER_ROWS);

  const channelId = sheet.getValue(SHEET_INFO.SELECT_MEMBER.CHANNEL_ID_RANGE);
  const slackNameValues = slackApi.getSlackNameValuesById(channelId);
  sheet.setValuesHeaderRowAfter(slackNameValues);
}