const express = require("express")
const request = require("superagent")
const server = express()

let baseURL = 'http://127.0.0.1:5000'

function checkAge(name, age) {
  return request
    .post(`${baseURL}/user`)
    .send({
      name: name,
      age: age
    })
    .set("Content-Type", "application/json; charset=utf-8")
}

checkAge('Bob', 32).then(result => console.log(result.text))

module.exports = { checkAge }