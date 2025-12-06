// PrescriptionPDF.gs - generate prescription PDF into visit folder

/**
 * Generate a prescription PDF for a given visit.
 * Returns: { fileId, url }
 */
function generatePrescriptionPDF_(data) {
  if (!data || !data.patient || !data.patient.phone) {
    throw new Error('Patient phone is required');
  }

  if (!data.visitDateIso) {
    data.visitDateIso = new Date().toISOString();
  }

  var visitFolder = getVisitFolder_(data.patient.phone, data.visitDateIso);

  var fullName = ((data.patient.firstName || '') + ' ' + (data.patient.lastName || '')).trim();
  var doc = DocumentApp.create('Prescription_' + fullName + '_' + data.visitDateIso);
  var body = doc.getBody();

  body.appendParagraph(data.clinicName || 'Clinic').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph(data.doctorName || 'Physician').setHeading(DocumentApp.ParagraphHeading.HEADING2);

  body.appendParagraph('Date: ' + new Date(data.visitDateIso).toLocaleString());
  body.appendParagraph('');

  body.appendParagraph('Patient Details').setHeading(DocumentApp.ParagraphHeading.HEADING3);
  body.appendParagraph('Name: ' + fullName);
  body.appendParagraph('Age: ' + (data.patient.age || ''));
  body.appendParagraph('Gender: ' + (data.patient.gender || ''));
  body.appendParagraph('Phone: ' + (data.patient.phone || ''));
  body.appendParagraph('Weight: ' + (data.patient.weight || ''));
  body.appendParagraph('BP: ' + (data.patient.bloodPressure || ''));
  body.appendParagraph('Temperature: ' + (data.patient.temperature || ''));
  body.appendParagraph('Allergic To: ' + (data.patient.allergies || 'None'));
  body.appendParagraph('');

  if (data.symptoms && data.symptoms.length) {
    body.appendParagraph('Symptoms').setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendListItem(data.symptoms.join(', '));
    body.appendParagraph('');
  }

  if (data.diagnosis && data.diagnosis.length) {
    body.appendParagraph('Diagnosis').setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendListItem(data.diagnosis.join(', '));
    body.appendParagraph('');
  }

  if (data.medications && data.medications.length) {
    body.appendParagraph('Medications').setHeading(DocumentApp.ParagraphHeading.HEADING3);
    var tableData = [['Rx', 'Morning', 'Noon', 'Night', 'Before/After', 'Period']];
    data.medications.forEach(function (m, idx) {
      tableData.push([
        (idx + 1) + '. ' + (m.name || ''),
        m.morning || '',
        m.noon || '',
        m.night || '',
        m.beforeAfter || '',
        m.period || ''
      ]);
    });
    body.appendTable(tableData);
    body.appendParagraph('');
  }

  if (data.notes) {
    body.appendParagraph('Notes').setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendParagraph(data.notes);
    body.appendParagraph('');
  }

  body.appendParagraph('');
  body.appendParagraph('Signature: __________________________');

  doc.saveAndClose();

  var docFile = DriveApp.getFileById(doc.getId());
  var pdfBlob = docFile.getAs(MimeType.PDF);
  pdfBlob.setName('prescription.pdf');

  var existing = visitFolder.getFilesByName('prescription.pdf');
  var pdfFile;
  if (existing.hasNext()) {
    pdfFile = existing.next();
    pdfFile.setTrashed(false);
    pdfFile.setContent(pdfBlob.getBytes());
  } else {
    pdfFile = visitFolder.createFile(pdfBlob);
  }

  // keep Drive clean by trashing the Docs source
  docFile.setTrashed(true);

  return {
    fileId: pdfFile.getId(),
    url: pdfFile.getUrl()
  };
}

