class SelectMemberSheet {
  constructor() {
    const ss = SpreadsheetApp.openById(`1YmODv7zavFFdmjNYREBYEpO6lzJecHVIXTfPsM54CMQ`);
    this.sheet = ss.getSheetByName(`メンバー選択`);
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

function testSelectMemberSheet() {
  const selectMemberSheet = new SelectMemberSheet();

  //　インスタンスの確認
   console.log(selectMemberSheet);

  // シートがつかめているか確認するメソッド
  console.log(inputDataSheet.sheet);

  // シート名を確認するメソッド
  console.log(inputDataSheet.sheet.getName());

  //　チャンネル名（メンバー選択シートのB1セル）を取得するメソッド
  console.log(selectMemberSheet.getChannelName());
  
  

  //　1次元配列で受け取ったメンバー配列をB列B4セル以下にsetValuesするメソッド
   const testArray = ['Tom', 'Bob', 'Alice'];

  //　1次元配列で受け取ったメンバー配列をB列B4セル以下にsetValuesするメソッド
  console.log(selectMemberSheet.setMembersList(testArray));



}
