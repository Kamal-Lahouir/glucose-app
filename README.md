# Glucose Tracker App

A simple and intuitive web application for tracking blood glucose measurements.

## Features

- **Add Measurements**: Record glucose levels with custom names/identifiers
- **Time Periods**: Specify when the measurement was taken (before/after meals)
- **Persistent Storage**: All data is saved locally in your browser
- **View Logs**: Browse all your recorded measurements in a clean table view
- **Excel Export**: Export all your data to an Excel spreadsheet for easy sharing or analysis
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

1. **Add a Measurement**:
   - Enter a name or identifier (like a patient name or file reference)
   - Enter your glucose level in mg/dL
   - Select the time period (before/after breakfast/lunch/dinner)
   - Click "Submit Measurement"

2. **View Your Logs**:
   - All measurements are displayed in the log table
   - Shows name, glucose level, time period, and timestamp

3. **Export to Excel**:
   - Click the "Export to Excel" button to download all your data
   - The file will be named with the current date

4. **Delete Entries**:
   - Click the "Delete" button next to any entry to remove it
   - You'll be asked to confirm before deletion

## Technologies Used

- React 19
- Vite
- XLSX (for Excel export)
- Local Storage API (for data persistence)

## License

ISC