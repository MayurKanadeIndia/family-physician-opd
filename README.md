# Family Physician OPD App

A modern, browser-based Outpatient Department (OPD) management system designed for family physicians and small clinics.  
This application streamlines daily clinical operations including patient onboarding, OPD visits, follow-ups, and internal workflows.  
Built with a scalable, modular architecture using React + TypeScript and optimized for fast Vercel deployment.

Live Demo: https://family-physician-opd.vercel.app

---

## Badges

![Vercel Deploy](https://img.shields.io/badge/Deploy-Vercel-black)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-2F74C0)
![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS-0EA5E9)
![License](https://img.shields.io/badge/License-Unspecified-lightgrey)

---

## Key Highlights

- Built for **real-world OPD workflow**
- Fully responsive UI suitable for tablets, desktops, and large screens
- Supports patient record creation, editing, and tracking
- Appointment scheduling and OPD queue management
- Clean, reliable, component-driven architecture
- Preconfigured Vite development environment for high-speed builds
- Easy deployment on Vercel

---

## Feature Breakdown

### Patient Management
- Add new patient records
- Maintain historical visit information
- Search and filter patient lists
- Assign OPD/consultation details

### OPD / Visit Management
- Record symptoms, diagnosis, and notes
- Streamlined doctor dashboard for fast input
- Update and manage patient follow-ups

### UI/UX
- Responsive layout for multiple devices
- TailwindCSS-based consistent design system
- Intuitive navigation and low learning curve

### Backend (Optional Folder)
- Repository includes a `backend` directory that can support:
  - APIs for patient CRUD
  - Appointment scheduling endpoints
  - Doctor workflow automations
  - External system integrations

---

## Architecture Overview

### Frontend
- **React** + **TypeScript**
- **Vite** for blazing-fast HMR and builds
- **Tailwind CSS** for a utility-first UI
- Modular components stored inside `/src`

### Backend (future-ready)
- `backend` directory can hold Node.js/Express APIs
- Optional integration with MongoDB, PostgreSQL, or Firebase
- Logical separation for API routes, services, and DB models

### Deployment
- Deployed via **Vercel**
- Zero-config build using Vite adapter

---

## Getting Started

### Prerequisites
- Node.js v16+
- npm v8+

### Installation

```bash
git clone https://github.com/MayurKanadeIndia/family-physician-opd.git
cd family-physician-opd
npm install

### Local Development
npm run dev
The app will be available at:
http://localhost:3000 (or the port shown in the terminal)

### Production Build
npm run build
npm run preview

### Directory Structure

family-physician-opd/
├── backend/                  # Optional backend API (Node/Express)
├── public/                   # Static assets
├── src/                      # Frontend source code
│   ├── components/           # Reusable UI components
│   ├── pages/                # Page-level components
│   ├── hooks/                # Custom React hooks
│   ├── context/              # Global state (if implemented)
│   ├── utils/                # Helper utilities
│   └── styles/               # Tailwind/global styles
├── dist/                     # Production build output
├── package.json
├── tailwind.config.cjs
├── tsconfig.json
└── vite.config.ts

### Roadmap

- Authentication (Admin/Doctor login)
- Role-based dashboards
- Prescription module
- In-clinic billing integration
- PDF/printable diagnosis sheets
- Appointment reminders via SMS/Email
- Multi-physician clinic support

### Contributing

- Contributions, feature requests, and issues are welcome.
- Fork the repository
- Create a new branch
- Commit your changes
- Submit a pull request

### License
This project does not yet include an explicit license.
If you wish to make the repository open-source, consider adding:
- MIT
- Apache 2.0
- GNU GPLv3
A LICENSE file can be generated on GitHub automatically.

### Contact

Developer: Mayur Kanade
GitHub: https://github.com/MayurKanadeIndia

Project Repo: https://github.com/MayurKanadeIndia/family-physician-opd
