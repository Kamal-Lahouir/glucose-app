# Glucose Tracker App

A comprehensive web application for tracking blood glucose measurements with **cloud sync across all your devices**.

## Live Demo

**Access the app here:** https://kamal-lahouir.github.io/glucose-app/

The app is automatically deployed to GitHub Pages whenever changes are pushed to the main branch.

## Key Features

### 🌐 Cloud Sync
- **Access from anywhere**: Sign in on your laptop, phone, or tablet - your data is always in sync
- **Never lose data**: All measurements automatically backed up to the cloud
- **Secure authentication**: Email/password login keeps your data private
- **Automatic migration**: Existing local data is seamlessly moved to cloud on first login

### 📊 Comprehensive Tracking
- **Multi-User Support**: Create and manage multiple users/profiles
- **Add Measurements**: Record glucose levels manually with optional medication tracking
- **CSV Import**: Import glucose data from other apps (supports standard CSV format)
- **Duplicate Detection**: Automatically skips duplicate entries when importing
- **Time Periods**: Specify when the measurement was taken (before/after breakfast/lunch/dinner)
- **Medication Tracking**: Optional support for up to 3 medications per entry

### 📈 Visualizations & Insights
- **Glucose trend chart** over time with target range indicators
- **Statistics dashboard** (average, min, max, total readings)
- **Time period analysis** showing averages by time of day
- **Flexible date range filtering** (7, 14, 30, 60, 90, 365 days)

### 💾 Data Management
- **User Filtering**: View logs for specific users or all users
- **Excel Export**: Export filtered data to Excel spreadsheet with medication information
- **Delete Entries**: Remove individual measurements as needed
- **Real-time sync status**: Visual feedback when data is syncing to cloud

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Firebase Setup (Required for Cloud Sync)

To enable cloud sync across devices, you need to set up Firebase:

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)
2. **Enable Email/Password authentication** in Authentication settings
3. **Create a Firestore database** in Firestore Database settings
4. **Get your Firebase config** from Project Settings > General > Your apps
5. **Update the config** in `src/firebase/config.js` with your Firebase credentials

**Detailed step-by-step instructions**: See [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

**Note**: Without Firebase setup, the app will require authentication but won't sync data. Set up Firebase to enable the full cross-device experience!

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

### Visualizing Your Progress

1. **Access Visualizations**:
   - Click the "Visualizations & Insights" tab at the top
   - View your glucose trends and statistics in interactive charts

2. **Glucose Trend Chart**:
   - See your glucose measurements plotted over time
   - Reference lines show target ranges:
     - Green line (70 mg/dL) - Low threshold
     - Orange line (100 mg/dL) - Target level
     - Red line (140 mg/dL) - High threshold
   - Hover over data points to see detailed information

3. **Statistics Dashboard**:
   - View key metrics at a glance:
     - Average glucose level
     - Minimum reading
     - Maximum reading
     - Total number of readings
   - Statistics update automatically based on your filters

4. **Time Period Analysis**:
   - Bar chart shows average glucose by time of day
   - Compare readings before/after meals
   - Identify patterns to optimize your glucose management

5. **Filter Your Data**:
   - Select date range: Last 7, 14, 30, 60, 90 days, or full year
   - Toggle "Show all users" to compare multiple users' data
   - Charts and statistics update in real-time

## Technologies Used

- **React 19**: Modern UI framework
- **Vite**: Fast build tool and dev server
- **Firebase**: Cloud sync, authentication, and Firestore database
- **Recharts**: Interactive data visualization
- **XLSX**: Excel export functionality
- **Local Storage API**: Client-side data caching

## License

ISC