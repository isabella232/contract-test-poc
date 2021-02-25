import requests
from flask import Flask, json, jsonify
from flask import request

wd_url = 'http://localhost:8080/user'

def request_wd(name, age):
    payload = {'name': name, 'age': age}
    req = requests.post(wd_url, json=payload)
    return req.content.decode('utf-8')

def capitalize_name(name):
    return name.upper()


api = Flask(__name__)

@api.route('/user', methods=['POST'])
def judge_name():
    if request.method == 'POST':
        content = request.json
        name = capitalize_name(content['name'])
        age = content['age']
        return api.response_class(
            response=request_wd(name, age),
            status=200,
            mimetype='application/json; charset=utf-8'
        )

if __name__ == '__main__':
    api.run()