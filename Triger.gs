function setTriggerTommorow8AM() {

  deleteTriggers('postRemind');

  const time = new Date();
  time.setDate(time.getDate() + 1);
  time.setHours('8');
  time.setMinutes('0');

  ScriptApp.newTrigger('postRemind').timeBased().at(time).create();

}


function deleteTriggers(functionName) {
  
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() == functionName) {
      ScriptApp.deleteTrigger(trigger);
    }
  }

}