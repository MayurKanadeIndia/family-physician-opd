/**
 * Entry point for the Web App – JSON API over POST.
 * Expects body: { action: string, data: any }
 */
function doPost(e) {
  try {
    var payload = e.postData && e.postData.contents
      ? JSON.parse(e.postData.contents)
      : {};

    var action = payload.action;
    var data = payload.data || {};

    var result;

    switch (action) {
      case 'savePatientVisit':
        result = savePatientVisit_(data);
        break;
      case 'getPatientHistory':
        result = getPatientHistory_(data.phone);
        break;
      case 'listPatients':
        result = listPatients_();
        break;
      case 'generatePrescriptionPDF':
        result = generatePrescriptionPDF_(data);
        break;
      case 'deleteOldRecords':
        result = deleteOldRecords_();
        break;
      default:
        throw new Error('Unknown action: ' + action);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    var errorResponse = {
      success: false,
      error: err && err.message ? err.message : String(err)
    };
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

