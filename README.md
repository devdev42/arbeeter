
# Chess Tournament Organizer

A browser-based application for chess tournament management with CSV import/export functionality.

## Features

- Create tournaments by importing players via CSV
- Generate pairings based on ELO ratings or standings
- Export pairings and standings to CSV format
- Persist tournament data in the browser
- Support for handling BYE rounds

## CSV Format

### Player Import Format
```
Name,ELO,School
John Doe,1500,Lincoln High
Jane Smith,1600,Washington Prep
```

### Updated Players Format (for subsequent rounds)
```
Name,ELO,School,Total Score
John Doe,1500,Lincoln High,1
Jane Smith,1600,Washington Prep,0.5
```

## Usage

1. Create a new tournament by uploading a CSV with player information
2. Select pairing method (ELO-based or Score-based)
3. Export pairings to Google Sheets if needed
4. After the round is complete, update player scores in a spreadsheet
5. Upload the updated CSV to display standings and create the next round
