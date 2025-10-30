# Glucose Tracker App

A simple and intuitive web application for tracking blood glucose measurements.

## Live Demo

**Access the app here:** https://kamal-lahouir.github.io/glucose-app/

The app is automatically deployed to GitHub Pages whenever changes are pushed to the main branch.

## Features

- **Multi-User Support**: Create and manage multiple users/profiles
- **Add Measurements**: Record glucose levels manually with optional medication tracking
- **CSV Import**: Import glucose data from other apps (supports standard CSV format)
- **Duplicate Detection**: Automatically skips duplicate entries when importing
- **Time Periods**: Specify when the measurement was taken (before/after breakfast/lunch/dinner)
- **Medication Tracking**: Optional support for up to 3 medications per entry
- **Persistent Storage**: All data is saved locally in your browser
- **User Filtering**: View logs for specific users or all users
- **Excel Export**: Export filtered data to Excel spreadsheet with medication information
- **Delete Entries**: Remove individual measurements as needed

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Mode
Run the application in development mode with hot reload:
```bash
npm run dev
```

Then open your browser to the URL shown in the terminal (usually http://localhost:5173)

### Build for Production
Build the application for production:
```bash
npm run build
```

### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

## How to Use

### Getting Started

1. **Create a User**:
   - Click "+ Add User" in the user selector at the top
   - Enter a name for the user (e.g., your name or a family member's name)
   - Click "Save"
   - The new user will be automatically selected

2. **Select a User**:
   - Use the dropdown at the top to switch between users
   - Your selection is saved and will be remembered when you return

### Adding Measurements Manually

1. **Record a Measurement**:
   - Make sure a user is selected
   - Enter your glucose level in mg/dL
   - Select the time period (before/after breakfast/lunch/dinner)
   - Optionally, click "Add Medications" to record any medications taken
   - Click "Submit Measurement"

### Importing from CSV

1. **Import Your Data**:
   - Select the user you want to import data for
   - Click "Import CSV" button
   - Choose your CSV file (format: Date and Time, Time of the Day, Blood Sugar Value, Measurement Unit, Medications)
   - The app will show how many entries were imported and how many duplicates were skipped

### Viewing and Managing Logs

1. **View Logs**:
   - All measurements are displayed in the log table
   - Use the user filter dropdown to view:
     - "All Users" - see all measurements from all users
     - Specific user - see only that user's measurements
   - Table shows: User, Glucose Level, Time Period, Date & Time, Medications

2. **Export to Excel**:
   - Select the user filter (or "All Users")
   - Click "Export to Excel" to download the filtered data
   - The file includes all measurement details and medications

3. **Delete Entries**:
   - Click the "Delete" button next to any entry to remove it
   - You'll be asked to confirm before deletion

## Technologies Used

- React 19
- Vite
- XLSX (for Excel export)
- Local Storage API (for data persistence)

## License

ISC