import os
import sqlite3

# create SQLite database
def create_database():
    # check if the database exists
    if os.path.exists('database.db'):
        # delete the database file
        os.remove('database.db')
    else:
        print("The database does not exist")

    # connect to SQLite database
    # automatically create if non existent
    conn = sqlite3.connect('database.db')

    # create cursor object
    c = conn.cursor()

    c.execute('''
        CREATE TABLE subway (
            id INTEGER PRIMARY KEY,
            location_name TEXT NOT NULL,
            address TEXT,
            operating_hour TEXT,
            waze_link TEXT,
            latitude REAL,
            longitude REAL
        )
    ''')

    # commit the transaction
    conn.commit()
    # close the connection
    conn.close()

if __name__ == "__main__":
    create_database()