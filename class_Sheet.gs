class Sheet {

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


  getValue(a1Notation) {
    const value = this.sheet.getRange(a1Notation).getValue();
    return value;
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

  /**
   * 値範囲を削除し、新しい値を貼り付けるメソッド
   * @param {Array.<Array.<number|string>>} values - 貼り付ける値
   */
  setValuesHeaderRowAfter(values) {
    this.clearDataValues();
    if (!values.length) return;
    this.sheet.getRange(this.headerRows + 1, 1, values.length, values[0].length).
      setValues(values);
  }

  /**
   * 実データ範囲の値を削除するメソッド
   */
  clearDataValues() {
    const values = this.getDataValues();
    if (!values.length) return;
    this.sheet.
      getRange(1 + this.headerRows, 1, this.sheet.getLastRow() - this.headerRows, this.sheet.getLastColumn()).
      clearContent();
  }

}




