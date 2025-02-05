import pandas as pd
import sqlite3
from pathlib import Path
from flask import Flask, jsonify

# Define file paths
csv_file_path = Path('../data/Border_Crossing_Entry_Data.csv')
sqlite_db_path = Path('../sql/data.sqlite')

# Read the CSV file into a pandas DataFrame
df = pd.read_csv(csv_file_path)

# Clean the data by converting 'Date' column to datetime, then extract 'Month' and 'Year'
df['Date'] = pd.to_datetime(df['Date'], format='%b %Y')
df['Month'] = df['Date'].dt.strftime('%B')  # Full month name
df['Year'] = df['Date'].dt.strftime('%Y')

# Drop the 'Date' and 'Point' columns as they are no longer needed
df = df.drop(columns=['Date', 'Point'])

# Reorder the columns to the desired order
columns_order = ['Port Name', 'State', 'Port Code', 'Border', 'Month', 'Year', 'Measure', 'Value', 'Latitude', 'Longitude']
df = df[columns_order]

# Save the DataFrame to a SQLite database
with sqlite3.connect(sqlite_db_path) as conn:
    df.to_sql('data', conn, if_exists='replace', index=False)

print("The CSV file has been cleaned and successfully converted to an SQLite database.")




# Flask server
app = Flask(__name__)

# Function to query the database
def query_db(query, args=(), one=False):
    con = sqlite3.connect('sql/data.sqlite')
    cur = con.execute(query, args)
    rv = cur.fetchall()
    cur.close()
    con.close()
    return (rv[0] if rv else None) if one else rv

# Route to get data from the database
@app.route('/data', methods=['GET'])
def get_data():
    data = query_db('SELECT * FROM data')
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
