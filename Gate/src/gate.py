import requests
from flask import Flask, jsonify, request, json
from flask_cors import CORS
from werkzeug.exceptions import HTTPException, BadRequest

wd_url = 'http://localhost:8080/user'


def request_wd(name, age):
    payload = {'name': name, 'age': int(age)}
    req = requests.post(wd_url, json=payload)
    return req.content.decode('utf-8')


def capitalize_name(name):
    return name.upper()


api = Flask(__name__)
cors = CORS(api)
api.config['CORS_HEADERS'] = 'Content-Type'


@api.errorhandler(HTTPException)
def handle_exception(e):
    response = e.get_response()
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "description": e.description,
    })
    response.content_type = "application/json"
    return response


@api.route('/user', methods=['POST'])
def judge_name():
    print(request.get_json())
    print(request.method)
    if request.method == 'POST':
        content = request.get_json(force=True)
        if int(content['age']) < 0:
            return handle_exception(BadRequest(description=f"LOL, dude, `{content['age']}` is not a valid age"))
        else:
            name = capitalize_name(content['name'])
            age = content['age']
            return api.response_class(
                response=request_wd(name, age),
                status=200,
                mimetype='application/json; charset=utf-8'
            )


if __name__ == '__main__':
    api.run()
