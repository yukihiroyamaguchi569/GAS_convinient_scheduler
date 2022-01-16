function onOpen() {
  //カスタムメニュー作成
  SS.addMenu('便利なスケジューラー', COSTUM_MENU);
}

/**
* 「チャンネル名一覧」のチャンネル名を更新
*
*/
//「チャンネル名一覧」シートを更新
function updateSlackChannels() {
  const slackApi = new SlackApi();
  const activeChannelsValues = slackApi.getActiveChannelsValues();
  const sheet = new Sheet(SS.getSheetByName(SHEET_INFO.SLACK_CHANNEL.NAME));
  sheet.setValuesHeaderRowAfter(activeChannelsValues);
}

/**
* チャンネルに存在するメンバーを「メンバー選択」シートの4行目以降にペースト
* チャンネルに存在するメンバーのメンバー名とSlack名を縦に結合して「メンバー名リスト」シートに貼り付ける
*/
function setMemberList() {
  const slackApi = new SlackApi();
  const selectMemberSheet = new Sheet(SS.getSheetByName(SHEET_INFO.SELECT_MEMBER.NAME), SHEET_INFO.SELECT_MEMBER.HEADER_ROWS);

  const channelId = selectMemberSheet.getValue(SHEET_INFO.SELECT_MEMBER.CHANNEL_ID_RANGE);
  const slackNameValues = slackApi.getSlackNameValuesById(channelId);
  selectMemberSheet.setValuesHeaderRowAfter(slackNameValues);

  //「メンバー名リスト」シートに貼り付け
  const memberNames = slackNameValues.map(value => [value[0]]);
  const slackNames = slackNameValues.map(value => [value[1]]);
  const memberNamesAndSlackNames = memberNames.concat(slackNames);

  const memberNameListSheet = new Sheet(SS.getSheetByName(SHEET_INFO.MEMBER_LIST.NAME));
  memberNameListSheet.setValuesHeaderRowAfter(memberNamesAndSlackNames);
}

/**
* チャンネルに存在するメンバーを「メンバー選択」シートの4行目以降にペースト
* チャンネルに存在するメンバーのメンバー名とSlack名を縦に結合して「メンバー名リスト」シートに貼り付ける
*/
function setMemberListOnEdit() {
  // シート定義
  const sheet = SS.getActiveSheet();     // 編集したシート（タブ）
  const range = sheet.getActiveRange();                // 編集した範囲
  const col = range.getColumnIndex();                // 編集した列
  const row = range.getRowIndex();                   // 編集した行
  const value = range.getValue();                      // 編集した値

  if (sheet.getName() === SHEET_INFO.SELECT_MEMBER.NAME &&
    range.getA1Notation() === SHEET_INFO.SELECT_MEMBER.CHANNEL_NAME_RANGE) {

    //「メンバー選択」シートに貼り付け
    const slackApi = new SlackApi();
    const selectMemberSheet = new Sheet(SS.getSheetByName(SHEET_INFO.SELECT_MEMBER.NAME), SHEET_INFO.SELECT_MEMBER.HEADER_ROWS);
    const channelId = selectMemberSheet.getValue(SHEET_INFO.SELECT_MEMBER.CHANNEL_ID_RANGE);
    const slackNameValues = slackApi.getSlackNameValuesById(channelId);
    selectMemberSheet.setValuesHeaderRowAfter(slackNameValues);

    //「メンバー名リスト」シートに貼り付け
    const memberNames = slackNameValues.map(value => [value[0]]);
    const slackNames = slackNameValues.map(value => [value[1]]);
    const memberNamesAndSlackNames = memberNames.concat(slackNames);

    const memberNameListSheet = new Sheet(SS.getSheetByName(SHEET_INFO.MEMBER_LIST.NAME));
    memberNameListSheet.setValuesHeaderRowAfter(memberNamesAndSlackNames);

  }


}



/**
* チェックが入ったメンバーの一覧を、入力画面シートの1行目に展開する
* Slackに募集メッセージを投稿する
*/
function setMemberNamesToInpuSheetAndPostSlack() {

  //チェックが入ったメンバー名の配列を取得
  const selectMemberSheet = new SelectMemberSheet(SS.getSheetByName(SHEET_INFO.SELECT_MEMBER.NAME), SHEET_INFO.SELECT_MEMBER.HEADER_ROWS);
  const checkedMembersNames = selectMemberSheet.getCheckedMembers();

  if (checkedMembersNames[0].length === 0) {
    Browser.msgBox(`メンバーが１人も選択されていません。チェックを入れてください`);
    return;
  }

  //入力画面シートの1行目に、チェックの入ったメンバー配列を貼り付ける
  const inputDataSheet = new InputDateSheet();
  inputDataSheet.setCheckedMembers(checkedMembersNames);

  postInputRequest();

}

/** 
*  Slackに入力依頼メッセージを投稿
*/
function postInputRequest() {

  const selectMemberSheet = new SelectMemberSheet(SS.getSheetByName(SHEET_INFO.SELECT_MEMBER.NAME), SHEET_INFO.SELECT_MEMBER.HEADER_ROWS);
  const checkedMembersIds = selectMemberSheet.getCheckedMembersIDs().flat();

  // if (checkedMembersIds.length === 0) {
  //   Browser.msgBox ('送りたいメンバーにチェックを入れてください');
  //   return;
  // };

  makeMessageAndPostSlack_(checkedMembersIds, SHEET_INFO.POST_SLACK_MESSAGE.MAIL_BODY_RANGE_FIRST_POST);

  setTriggerTommorow8AM();

}

/** NOTE webhookURLを設定しておかないといけない
*  Slackに入力リマインドメッセージを投稿
*/
function postRemind() {

  //チェックの入ったメンバーのslackIDを取得
  const selectMemberSheet = new SelectMemberSheet(SS.getSheetByName(SHEET_INFO.SELECT_MEMBER.NAME), SHEET_INFO.SELECT_MEMBER.HEADER_ROWS);
  const inputDataSheet = new InputDateSheet();
  const unresponsiveMembersName = inputDataSheet.makeUnansweredMemberList();

  //Slack名をSlackIDに変換
  const unresponsiveMembersIds = unresponsiveMembersName.map(value => selectMemberSheet.convertUserSlackNameToSlackId(value));

  //回答していないメンバーがいなければ終了
  if (unresponsiveMembersIds.length === 0) return;

  makeMessageAndPostSlack_(unresponsiveMembersIds, SHEET_INFO.POST_SLACK_MESSAGE.MAIL_BODY_RANGE_PRESS_ANSWER);

  setTriggerTommorow8AM();

}

/**
*  メッセージの本文を作成するメソッド
*  (NOTE webhookURLを設定しておかないといけない)
* @param {Array} memberIds メンションするメンバーのID
* @param {String} messageRange メッセージの入っているシートレンジ
*/
function makeMessageAndPostSlack_(memberIds, messageRange) {
  const webhookUrl = new Properties().get('WEBHOOK_URL');
  const slackMessage = new SlackMessage(webhookUrl);

  //slackIDをメンションに変換
  const memberMentions = memberIds.map(value => slackMessage.getUserMention(value)).join();

  //メッセージの本文をシートから取得
  const postSlackMessageSheet = SS.getSheetByName(SHEET_INFO.POST_SLACK_MESSAGE.NAME);
  const messageBody = postSlackMessageSheet.getRange(messageRange).getValues().flat().join();

  const spreadSheetUrl = SS.getUrl();

  const message = memberMentions + messageBody + spreadSheetUrl;

  slackMessage.send(message);

  return;
}
