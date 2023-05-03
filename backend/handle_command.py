from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)

@app.route('/delete-gmails', methods=['POST'])
def delete_emails():
    email = request.json.get('email')
    query = request.json.get('query')

    # Call the Python script with subprocess
    script = subprocess.Popen(['python3', './bulk_delete_gmail.py', email, query], stdout=subprocess.PIPE)
    stdout, stderr = script.communicate()

    # Return the script output as a JSON response
    retVal = stdout.decode('utf-8', errors='ignore')
    print(f'{retVal} .')
    response = jsonify({'stdout': stdout.decode('utf-8', errors='ignore')})
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response

if __name__ == '__main__':
    app.run(debug=True)
