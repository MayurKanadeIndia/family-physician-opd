You are Windsurf AI — generate a complete production-ready Family Physician OPD Web Application with clean architecture, automatic file creation, and working backend APIs.

APP OVERVIEW (Small OPD App — Very Simple UI)
The physician uses an iPad with a simple workflow:
Enter patient details
	Select symptoms
	Select diagnosis
	Select medications
	Generate & print prescription (AirPrint)
	Maintain 1-year patient history

REQUIREMENTS
1. FRONTEND

Build using:
React + Vite
Mobile/iPad-first UI
Very simple and clean design (like the screenshots)
PWA support (manifest + service worker)
Pages to generate:
	Patient Details
	Symptoms (tags)
	Diagnosis (tags)
	Medications (search + dosage + frequency)
	Prescription Preview
	History (last 1 year)
	Dashboard

UI Requirements:
Tag-based selection UI (symptoms + diagnosis)
Auto-complete search for medications
Dosage & frequency selector (Breakfast / Lunch / Dinner / Before / After meal)
“Generate Prescription PDF” button
“Print” button using iPad AirPrint

2. BACKEND = GOOGLE APPS SCRIPT

Windsurf must generate complete backend code, including:
Files:
	Code.gs
	DriveService.gs
	PatientsAPI.gs
	HistoryAPI.gs
	PrescriptionPDF.gs
	AutoDelete.gs (1-year cleanup trigger)

Folder Structure in Google Drive:

OPD_App_Data/
  Patients/
    <phone_number>/
      <visit_date_ISO>/
        visit.json
        prescription.pdf

API Endpoints to implement:
	savePatientVisit()
	getPatientHistory(phone)
	listPatients()
	generatePrescriptionPDF()
	deleteOldRecords()

3. PRESCRIPTION PDF

Include:
	Doctor name
	Clinic name
	Patient details
	Symptoms
	Diagnosis
	Medications with dosage & frequency
	Notes
	Signature placeholder
	Output PDF stored in Google Drive + downloadable + printable.

4. WINDSURF OUTPUT REQUIREMENTS

Windsurf must generate:
A. Full frontend project

src/components/
src/pages/
src/hooks/
src/services/
public/
	index.html
	manifest.json
	service-worker.js
tailwind.config.js
vite.config.js
src/App.jsx

B. Backend Apps Script project

Code.gs
DriveService.gs
PatientsAPI.gs
HistoryAPI.gs
PrescriptionPDF.gs
AutoDelete.gs

C. Integration instructions

How frontend calls Apps Script API
How to deploy the frontend
How to enable AirPrint on iPad