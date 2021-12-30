class InputDateSheet {

  constructor() {
    const ss = SpreadsheetApp.openById(`1YmODv7zavFFdmjNYREBYEpO6lzJecHVIXTfPsM54CMQ`);
    this.sheet = ss.getSheetByName(`入力画面`);

  }

  getAllValues() {
    const values = this.sheet.getDataRange().getValues();
    return values;
  }


  // メンバー選択シートの、チェックが入ったメンバー名の一次元配列を受け取り、１行目に展開するメソッド
  setCheckedMembers(members) {

    this.sheet.getRange(1, 3, 1, members.length).setValues(members);
    return `${members.length}名のメンバーを記入しました`;
  }


  // 結果を入れていない人 （c列以降の２行目以下のセルが空の人）のSlackIDの配列を作成する
  mekeUnansweredMemberList() {
    const values = this.getAllValues();
    const slackIds = [];

    return slackIds;
  }

}

function testInputDateSheet() {

  const inputDataSheet = new InputDateSheet();

  // インスタンスを確認するメソッド
  console.log(inputDataSheet);

  // シートがつかめているか確認するメソッド
  console.log(inputDataSheet.sheet);

  // シート名を確認するメソッド
  console.log(inputDataSheet.sheet.getName());

  // シートの全てのレコーズを取得するメソッド
  console.log(inputDataSheet.sheet.getAllValues());

  // チェックが入ったメンバー名の一次元配列を受け取り、１行目に展開するメソッド
  console.log(inputDataSheet.setCheckedMembers());

  // 結果を入れていない人 （c列以降の２行目以下のセルが空の人）のSlackIDの配列を作成する
  console.log(inputDataSheet.mekeUnansweredMemberList());

}
