// DriveService.gs - Drive helpers for OPD app

var ROOT_FOLDER_NAME = 'OPD_App_Data';
var PATIENTS_FOLDER_NAME = 'Patients';

/**
 * Get or create a single child folder under a parent.
 */
function getOrCreateChildFolder_(parent, name) {
  var it = parent.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  return parent.createFolder(name);
}

/**
 * Get or create root folder OPD_App_Data/.
 */
function getRootFolder_() {
  var it = DriveApp.getFoldersByName(ROOT_FOLDER_NAME);
  if (it.hasNext()) return it.next();
  return DriveApp.createFolder(ROOT_FOLDER_NAME);
}

/**
 * Get or create Patients folder OPD_App_Data/Patients/.
 */
function getPatientsFolder_() {
  var root = getRootFolder_();
  return getOrCreateChildFolder_(root, PATIENTS_FOLDER_NAME);
}

/**
 * Get or create folder for a patient by phone.
 * Path: OPD_App_Data/Patients/<phone>/
 */
function getPatientFolder_(phone) {
  if (!phone) throw new Error('Phone is required');
  var patientsFolder = getPatientsFolder_();
  return getOrCreateChildFolder_(patientsFolder, String(phone));
}

/**
 * Get or create folder for a specific visit.
 * Path: OPD_App_Data/Patients/<phone>/<visit_date_ISO>/
 */
function getVisitFolder_(phone, visitDateIso) {
  if (!visitDateIso) throw new Error('visitDateIso is required');
  var patientFolder = getPatientFolder_(phone);
  return getOrCreateChildFolder_(patientFolder, visitDateIso);
}

/**
 * Save JSON metadata as visit.json inside a visit folder.
 */
function saveVisitJson_(visitFolder, data) {
  var json = JSON.stringify(data, null, 2);
  var files = visitFolder.getFilesByName('visit.json');
  if (files.hasNext()) {
    var file = files.next();
    file.setContent(json);
    return file;
  }
  return visitFolder.createFile('visit.json', json, MimeType.PLAIN_TEXT);
}

/**
 * Parse ISO date string.
 */
function parseDate_(dateStr) {
  return new Date(dateStr);
}

