/**
* 翌日の朝8時にトリガーをセットする
*/
function setTriggerTommorow8AM() {

  deleteTriggers('postRemind');

  const time = new Date();
  time.setDate(time.getDate() + 1);
  time.setHours('8');
  time.setMinutes('0');

  ScriptApp.newTrigger('postRemind').timeBased().at(time).create();
}


/**
* 指定した関数名のトリガーを削除する
*
* @param {String} functionName トリガーの関数名
*/
function deleteTriggers(functionName) {
  
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() == functionName) {
      ScriptApp.deleteTrigger(trigger);
    }
  }
}

