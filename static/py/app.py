import warnings
import pandas as pd
import sqlite3
from pathlib import Path

# Ignore warnings related to Decimal numbers
warnings.filterwarnings('ignore')

# Define the paths using pathlib
base_dir = Path(__file__).resolve().parent.parent.parent
csv_file_path = base_dir / 'static' / 'data' / 'Border_Crossing_Entry_Data.csv'
sqlite_db_path = base_dir / 'static' / 'sql' / 'data.sqlite'

# Ensure the directory for the SQLite database exists
sqlite_db_path.parent.mkdir(parents=True, exist_ok=True)

# Check if the CSV file exists
if not csv_file_path.exists():
    raise FileNotFoundError(f"Error: The file '{csv_file_path}' does not exist.")

# Read the CSV file into a pandas DataFrame
df = pd.read_csv(csv_file_path)

# Check if 'Date' column exists
if 'Date' not in df.columns:
    raise KeyError("Error: 'Date' column not found in the CSV file.")

# Data cleaning: Split the 'Date' column into 'Month' and 'Year', and remove the 'Point' column
df['Date'] = pd.to_datetime(df['Date'], format='%b %Y')
df['Month'] = df['Date'].dt.strftime('%B')  # Full name of the month
df['Year'] = df['Date'].dt.strftime('%Y')
df = df.drop(columns=['Date', 'Point'])

# Reorder columns to place 'Month' and 'Year' where 'Date' was
columns_order = ['Port Name', 'State', 'Port Code', 'Border', 'Month', 'Year', 'Measure', 'Value', 'Latitude', 'Longitude']
df = df[columns_order]

# Create a connection to a new SQLite database
with sqlite3.connect(sqlite_db_path) as conn:
    # Save the DataFrame to the SQLite database
    df.to_sql('border_crossing_entry_data', conn, if_exists='replace', index=False)

print("CSV file cleaned and converted to SQLite database successfully.")
