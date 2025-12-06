// HistoryAPI.gs - patient history for last 1 year

/**
 * Get patient history for last 1 year.
 */
function getPatientHistory_(phone) {
  if (!phone) throw new Error('Phone is required');

  var patientFolder = getPatientFolder_(phone);
  var visitFolders = patientFolder.getFolders();

  var oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  var visits = [];

  while (visitFolders.hasNext()) {
    var vf = visitFolders.next();
    var dateStr = vf.getName();
    var d = parseDate_(dateStr);
    if (d >= oneYearAgo) {
      var files = vf.getFilesByName('visit.json');
      if (files.hasNext()) {
        var file = files.next();
        var content = file.getBlob().getDataAsString();
        try {
          var json = JSON.parse(content);
          visits.push(json);
        } catch (e) {
          // skip invalid JSON
        }
      }
    }
  }

  visits.sort(function (a, b) {
    var da = a.visitDateIso || a.date || '';
    var db = b.visitDateIso || b.date || '';
    return da < db ? 1 : -1;
  });

  return visits;
}

