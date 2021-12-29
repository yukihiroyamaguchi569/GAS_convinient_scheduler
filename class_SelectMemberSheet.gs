class SelectMemberSheet { }

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
  console.log(selectMemberSheet.setMembersList);


}
