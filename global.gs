/**
* GitHub https://github.com/yukihiroyamaguchi569/GAS_convinient_scheduler/blob/main/README.md
*
*/


const SS = SpreadsheetApp.getActiveSpreadsheet();

/** @enum {string} */
const SHEET_INFO = Object.freeze({
  INPUT_DATE: {
    NAME: '入力画面'
  },
  SELECT_MEMBER: {
    NAME: 'メンバー選択',
    HEADER_ROWS: 3,
    CHANNEL_NAME_RANGE: 'B1',
    CHANNEL_ID_RANGE: 'C1'
  },
  SLACK_CHANNEL: {
    NAME: 'チャンネル名一覧'
  },
  POST_SLACK_MESSAGE:{
    NAME: 'Slack投稿メッセージ',
    MAIL_BODY_RANGE_FIRST_POST: 'A2',
    MAIL_BODY_RANGE_PRESS_ANSWER: 'B2'
  },
  CHANNEL_LIST:{
    NAME:'チャンネル名一覧'
  },
  MEMBER_LIST:{
    NAME:'メンバー名リスト'
  }

});

const COSTUM_MENU = [
  // {
  //   name: '1. チャンネルメンバー更新',
  //   functionName: 'setMemberList'
  // },
  {
    name: '1. Slackへ投稿',
    functionName: 'setMemberNamesToInpuSheetAndPostSlack'
  },
  // {
  //   name: '3. Slackに投稿',
  //   functionName: 'postInputRequest'
  // },
    {
    name: '9. チャンネルリストを更新',
    functionName: 'updateSlackChannels'
  }

];
