function onOpen() {

  //カスタムメニュー作成
  SS.addMenu('便利なスケジューラー', COSTUM_MENU);

}


//「チャンネル名一覧」シートを更新
function updateSlackChannels() {
  const slackApi = new SlackApi();
  const activeChannelsValues = slackApi.getActiveChannelsValues();
  const sheet = new Sheet(SS.getSheetByName(SHEET_INFO.SLACK_CHANNEL.NAME));
  sheet.setValuesHeaderRowAfter(activeChannelsValues);
}

//チャンネルに存在するメンバーを「メンバー選択」シートの4行目以降にペースト
function setMemberList() {
  const slackApi = new SlackApi();
  const sheet = new Sheet(SS.getSheetByName(SHEET_INFO.SELECT_MEMBER.NAME), SHEET_INFO.SELECT_MEMBER.HEADER_ROWS);

  const channelId = sheet.getValue(SHEET_INFO.SELECT_MEMBER.CHANNEL_ID_RANGE);
  const slackNameValues = slackApi.getSlackNameValuesById(channelId);
  sheet.setValuesHeaderRowAfter(slackNameValues);
}

//　チェックが入ったメンバーの一覧を、入力画面シートの1行目に展開する
function setMemberName() {

  const selectMemberSheet = new SelectMemberSheet(SS.getSheetByName(SHEET_INFO.SELECT_MEMBER.NAME), SHEET_INFO.SELECT_MEMBER.HEADER_ROWS);
  const checkedMembersNames = selectMemberSheet.getCheckedMembers();
  console.log(checkedMembersNames);
  const inputDataSheet = new InputDateSheet();
  inputDataSheet.setCheckedMembers(checkedMembersNames);

}

/** NOTE webhookURLを設定しておかないといけない
*  Slackに入力依頼を投稿
*/
function postInputRequest() {

  //チェックの入ったメンバーのslackIDを取得
  const selectMemberSheet = new SelectMemberSheet(SS.getSheetByName(SHEET_INFO.SELECT_MEMBER.NAME), SHEET_INFO.SELECT_MEMBER.HEADER_ROWS);
  const checkedMembersIds = selectMemberSheet.getCheckedMembersIDs().flat();

  const webhookUrl = new Properties().get('WEBHOOK_URL');
  const slackMessage = new SlackMessage(webhookUrl);

  //slackIDをメンションに変換
  const checkedMemberMentions = checkedMembersIds.map(value => slackMessage.getUserMention(value)).join();

  const postSlackSheet = new SelectMemberSheet(SS.getSheetByName(SHEET_INFO.POST_SLACK.NAME));
  const mailBodyFromSheet = postSlackSheet.sheet.getRange(SHEET_INFO.POST_SLACK.MAIL_BODY_RANGE_FIRST_POST).getValues().flat().join();

  const spreadSheetUrl = SS.getUrl();

  const message = checkedMemberMentions + mailBodyFromSheet + spreadSheetUrl;

  slackMessage.send(message);

  setTriggerTommorow8AM();

}

/** NOTE webhookURLを設定しておかないといけない
*  Slackに入力依頼を投稿
* 
*/
function postRemind() {

  //チェックの入ったメンバーのslackIDを取得
  const selectMemberSheet = new SelectMemberSheet(SS.getSheetByName(SHEET_INFO.SELECT_MEMBER.NAME), SHEET_INFO.SELECT_MEMBER.HEADER_ROWS);
  const inputDataSheet = new InputDateSheet();
  const unresponsiveMembersName = inputDataSheet.makeUnansweredMemberList();
  const unresponsiveMembersIds = unresponsiveMembersName.map(value => selectMemberSheet.convertUserSlackNameToSlackId(value));

  if (unresponsiveMembersIds.length === 0) return;

  const webhookUrl = new Properties().get('WEBHOOK_URL');
  const slackMessage = new SlackMessage(webhookUrl);

  //slackIDをメンションに変換
  const unresponsiveMembersMentions = unresponsiveMembersIds.map(value => slackMessage.getUserMention(value)).join();

  const postSlackSheet = new SelectMemberSheet(SS.getSheetByName(SHEET_INFO.POST_SLACK.NAME));
  const mailBodyFromSheet = postSlackSheet.sheet.getRange(SHEET_INFO.POST_SLACK.MAIL_BODY_RANGE_PRESS_ANSWER).getValues().flat().join();

  const spreadSheetUrl = SS.getUrl();

  const message = unresponsiveMembersMentions + mailBodyFromSheet + spreadSheetUrl;

  slackMessage.send(message);

}


