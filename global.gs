const SS = SpreadsheetApp.getActiveSpreadsheet();

/** @enum {string} */
const SHEET_INFO = Object.freeze({
  INPUT_DATE: {
    NAME: '入力画面'
  },
  SELECT_MEMBER: {
    NAME: 'メンバー選択',
    HEADER_ROWS: 3,
    CHANNEL_ID_RANGE: 'C1'
  },
  SLACK_CHANNEL: {
    NAME: 'チャンネル名一覧'
  },
  POST_SLACK:{
    NAME: 'Slackに投稿',
    MAIL_BODY_RANGE_FIRST_POST: 'A2',
    MAIL_BODY_RANGE_PRESS_ANSWER: 'B2'
  }
});

const COSTUM_MENU = [
  {
    name: '1. チャンネルメンバー更新',
    functionName: 'setMemberList'
  },
  {
    name: '2. チェックの入ったメンバーを入力画面にセット',
    functionName: 'setMemberName'
  },
  {
    name: '3. Slackに投稿',
    functionName: 'postInputRequest'
  },
    {
    name: '9. チャンネルリストを更新',
    functionName: 'updateSlackChannels'
  }

];
