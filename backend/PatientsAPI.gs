// PatientsAPI.gs - save visit and list patients

/**
 * Save a patient visit.
 * data: {
 *   doctorName, clinicName,
 *   patient: { name, age, gender, phone, address },
 *   visitDateIso,
 *   symptoms: [string],
 *   diagnosis: [string],
 *   medications: [{ name, dosage, frequency, notes }],
 *   notes
 * }
 */
function savePatientVisit_(data) {
  if (!data || !data.patient || !data.patient.phone) {
    throw new Error('Patient phone is required');
  }

  if (!data.visitDateIso) {
    data.visitDateIso = new Date().toISOString();
  }

  var visitFolder = getVisitFolder_(data.patient.phone, data.visitDateIso);
  saveVisitJson_(visitFolder, data);

  return {
    phone: data.patient.phone,
    visitDateIso: data.visitDateIso
  };
}

/**
 * List all patients with latest visit date.
 */
function listPatients_() {
  var patientsFolder = getPatientsFolder_();
  var patientFolders = patientsFolder.getFolders();
  var patients = [];

  while (patientFolders.hasNext()) {
    var pf = patientFolders.next();
    var phone = pf.getName();

    var visitFolders = pf.getFolders();
    var latestDate = null;

    while (visitFolders.hasNext()) {
      var vf = visitFolders.next();
      var dateStr = vf.getName();
      var d = parseDate_(dateStr);
      if (!latestDate || d > latestDate) {
        latestDate = d;
      }
    }

    patients.push({
      phone: phone,
      latestVisit: latestDate ? latestDate.toISOString() : null
    });
  }

  patients.sort(function (a, b) {
    if (a.latestVisit && b.latestVisit) {
      return a.latestVisit < b.latestVisit ? 1 : -1;
    } else if (a.latestVisit) {
      return -1;
    } else if (b.latestVisit) {
      return 1;
    }
    return 0;
  });

  return patients;
}

