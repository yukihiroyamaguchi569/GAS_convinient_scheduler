class SelectMemberSheet {
  /**
   * シートに関するコンストラクタ
   * @constructor
   * @param {SpreadsheetApp.sheet} sheet - 対象となるシート。デフォルト引数は「SpreadsheetApp.getActiveSheet()」
   * @param {number} headerRows - ヘッダー行の数。デフォルト引数は「1」
   */
  constructor(sheet = SpreadsheetApp.getActiveSheet(), headerRows = 1) {
    /** @type {SpreadsheetApp.Sheet} */
    this.sheet = sheet;
    /** @type {SpreadsheetApp.Sheet} */
    this.headerRows = headerRows;
  }

  /**
 * ヘッダー部分を除いた実データ部分を取得するメソッド
 * @return {Array.<Array.<number|string>>} 実データ
 */
  getDataValues() {
    const values = this.getDataRangeValues();
    const dataValues = values.filter((_, i) => i >= this.headerRows);
    return dataValues;
  }

    /**
   * シートの値すべて取得するメソッド 
   * @return {Array.<Array.<number|string>>} シートの値
   */
  getDataRangeValues() {
    const dataRangeValues = this.sheet.getDataRange().getValues();
    return dataRangeValues;
  }

  //　チャンネル名（メンバー選択シートのB1セル）を取得するメソッド
  getChannelName() {
    const channelName = this.sheet.getRange('B1').getValue();
    return channelName;
  };

  //　1次元配列で受け取ったメンバー配列をB列B4セル以下にsetValuesするメソッド
  setMembersList(memberArray) {
    const transposeArray = memberArray.map(v => [v]); // 行列転置
    const rows = memberArray.length;
    this.sheet.getRange(4, 2, rows, 1).setValues(transposeArray);
    return true;
  };

  // チェックのはいったメンバーのスラックIDを二次元配列で返すメソッド
  getCheckedMembers() {
    const values = this.getDataValues();
    const result = values.filter(value => value[3]).map(value => value[0]);
    return [result];

  };

    // チェックのはいったメンバーのスラックIDを二次元配列で返すメソッド
  getCheckedMembersIDs() {
    const values = this.getDataValues();
    const result = values.filter(value => value[3]).map(value => value[2]);
    return [result];

  };

    /**
    * ユーザーのSlack表示名を受け取って、slackIDを返すメソッド
    * 
    * @param {string}  ユーザーのslackName
    * @return  {string} ユーザーのslackID
    */
  convertUserSlackNameToSlackId(userSlackName) {
    const dataValues = this.getDataValues();
    const result =dataValues.filter(value => value[0] === userSlackName).map(value => value[2]);
    return result;
  }

}

function testSelectMemberSheet() {
  const selectMemberSheet = new SelectMemberSheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_INFO.SELECT_MEMBER.NAME),SHEET_INFO.SELECT_MEMBER.HEADER_ROWS);

  // 　シート名の確認
  console.log(selectMemberSheet.sheet.getName());

  //　チャンネル名（メンバー選択シートのB1セル）を取得するメソッド
  console.log('getChannelName:', selectMemberSheet.getChannelName());

  // const testArray = ['Tom', 'Bob', 'Alice'];
  //　1次元配列で受け取ったメンバー配列をB列B4セル以下にsetValuesするメソッド
  // console.log(selectMemberSheet.setMembersList(testArray));

  // チェックのはいったメンバーのスラック名を二次元配列で返すメソッド
  console.log(selectMemberSheet.getCheckedMembers());

  //ユーザーのSlack表示名を受け取って、slackIDを返すメソッド
  const userName ='高橋宣成';
  console.log(userName, selectMemberSheet.convertUserSlackNameToSlackId(userName));

}

