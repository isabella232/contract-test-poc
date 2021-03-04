import fetch from "node-fetch";
import request from "superagent"

const BASE_URL = "http://localhost:5000/"

export async function judgeAge(data) {
    const res = await fetch(BASE_URL + 'user', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: data
    });
    return res
  };

export function checkAge(data) {
    return request
      .post(`${BASE_URL}/user`)
      .send({
        name: data['name'],
        age: data['age']
      })
      .set("Content-Type", "application/json; charset=utf-8")
  }
