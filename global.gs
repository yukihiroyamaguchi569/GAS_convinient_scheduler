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
  }
});

const COSTUM_MENU = [
  {
    name: 'チャンネルリストを更新',
    functionName: 'updateSlackChannels'
  },
  {
    name: 'チャンネルのメンバーをメンバー選択画面にセット',
    functionName: 'setMemberList'
  },
  {
    name: 'チェックの入ったメンバーを入力画面にセット',
    functionName: 'setMemberName'
  }
];
