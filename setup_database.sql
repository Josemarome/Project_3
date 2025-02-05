-- Create the database (run this only once)
-- Note: This command should be run separately if running from a script file
-- CREATE DATABASE Border_Crossing;

-- Connect to the Border_Crossing database
-- This should be done manually in the psql command line or through a client tool

-- Drop the table if it already exists to ensure a clean slate
DROP TABLE IF EXISTS Border_Crossing;

-- Create the table with the necessary columns
CREATE TABLE Border_Crossing (
    port_name VARCHAR(100),
    state VARCHAR(100),
    port_code VARCHAR(10),
    border VARCHAR(50),
    date TEXT,
    measure VARCHAR(50),
    value INTEGER,
    latitude DECIMAL,
    longitude DECIMAL,
    point VARCHAR(100)
);

-- Verify the table creation by selecting the first 10 rows (should be empty initially)
SELECT * FROM Border_Crossing LIMIT 10;

