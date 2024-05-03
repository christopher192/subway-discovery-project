from flask import Flask, jsonify, abort
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# function to create a connection to the SQLite database
def get_db_connection():
    try:
        conn = sqlite3.connect('../database.db')
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        app.logger.error('Database connection error: %s', e)
        abort(500)

@app.route('/get_outlets', methods = ['GET'])
def get_outlets():
    try:
        conn = get_db_connection()
        outlets = conn.execute('SELECT * FROM subway').fetchall()
        conn.close()

        # convert SQLite rows to a list of dictionaries
        outlet_list = [dict(outlet) for outlet in outlets]

        # return json response
        return jsonify(data = outlet_list, status = 'success')
    except Exception as e:
        app.logger.error('Error retrieving outlets: %s', e)
        abort(500)

if __name__ == '__main__':
    app.run(debug = True)