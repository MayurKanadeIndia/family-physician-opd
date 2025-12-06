// AutoDelete.gs - delete visit folders older than 1 year

/**
 * Delete visit folders older than 1 year.
 * Returns: { deletedVisitFolders: number }
 */
function deleteOldRecords_() {
  var patientsFolder = getPatientsFolder_();
  var patientFolders = patientsFolder.getFolders();
  var oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  var deletedCount = 0;

  while (patientFolders.hasNext()) {
    var pf = patientFolders.next();
    var visitFolders = pf.getFolders();
    while (visitFolders.hasNext()) {
      var vf = visitFolders.next();
      var dateStr = vf.getName();
      var d = parseDate_(dateStr);
      if (d < oneYearAgo) {
        vf.setTrashed(true);
        deletedCount++;
      }
    }
  }

  return { deletedVisitFolders: deletedCount };
}

/**
 * One-time helper to create a daily cleanup trigger.
 */
function createCleanupTrigger() {
  ScriptApp.newTrigger('deleteOldRecords_')
    .timeBased()
    .everyDays(1)
    .atHour(1)
    .create();
}

