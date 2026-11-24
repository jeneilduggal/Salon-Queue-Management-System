# StyleNYC – Salon Queue Management System

**Live Website:** https://stylenyc-thereiyoren-5860.vercel.app

## Project Overview

StyleNYC is a Salon Queue Management System that helps customers join a salon queue and lets salon staff manage waiting customers, barber assignments, and service progress.

## Main Features

- Customers can view the queue and join by entering their details.
- Customers can select services and view the estimated price and waiting time.
- Receptionists can view and manage the waiting queue.
- Barbers can call the next eligible customer and update service status.
- A waiting-area display shows the currently served and upcoming customers.
- Admins can manage services, barbers, and online queue availability.
- The interface supports English and Gujarati.

## Demo Login Details

Use these PINs to access the staff screens:

| Role | Screen | Demo PIN |
|---|---|---|
| Receptionist | Reception Dashboard (`/#/reception`) | `1234` |
| Barber | Barber View (`/#/barber`) | `5678` |
| Owner / Admin | Admin Dashboard (`/#/admin`) | `9999` |

## Project Screens

1. Customer Home
2. Join Queue
3. Customer Queue Status
4. Reception Dashboard
5. Barber View
6. Waiting Area Display
7. Owner / Admin Dashboard

## Run Locally

Make sure Node.js is installed, then run:

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (Vite usually uses `http://localhost:5173`).

To create a production build:

```bash
npm run build
```

## Project Documentation

- [Project Brief](docs/01-brief.md)
- [Screen Documentation](docs/02-screens.md)
- [User Flows and Business Rules](docs/03-flows-rules.md)
- [Prompt Log](prompts.md)
- [Reflection](reflection.md)
