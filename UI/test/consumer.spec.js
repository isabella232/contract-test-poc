// original file: https://github.com/pact-foundation/pact-js/blob/master/examples/e2e/test/consumer.spec.js
import path from "path"
import chai from "chai"
import chaiAsPromised from "chai-as-promised"
const expect = chai.expect
import { Pact, Matchers } from "@pact-foundation/pact"
import { judgeAge, checkAge } from "../src/age-app/src/helpers.js"

const LOG_LEVEL = process.env.LOG_LEVEL || "DEBUG"

chai.use(chaiAsPromised)

describe("Pact", () => {
  const provider = new Pact({
    consumer: "UI",
    provider: "Gate",
    port: 5000, // You can set the port explicitly here or dynamically (see setup() below)
    log: path.resolve(process.cwd(), "logs", "mockserver-integration.log"),
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: LOG_LEVEL,
    spec: 2,
  })

  const { like } = Matchers

  before(() =>
    provider.setup().then(opts => {
      process.env.API_HOST = `http://localhost:${opts.port}`
    })
  )

  afterEach(() => provider.verify())

  describe("when a call to the Gate is made to assess over 100 age", () => {

    const name = "ALICE"
    const age = 101
    const data = { name: name, age: age }
    console.log(data)
    
    before(() =>
      provider.addInteraction({
        uponReceiving: "a request for user ALICE, aged 101",
        withRequest: {
          method: "POST",
          path: "/user",
          body: data,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: { name: 'ALICE', age: 'old'}, // still capitalized and age rendered as 'old'
        },
      })
    )

    it("a response is given", done => {
      // TODO make it work with judgeAge() function
      expect(checkAge(data)).to.eventually.be.fulfilled.notify(done)
    })
  })

  describe("when a call to the Gate is made to assess less than 100 age", () => {

    const name = "Bob"
    const age = 32
    const data = { name: name, age: age }
    console.log(data)

    before(() =>
      provider.addInteraction({
        uponReceiving: "a request for user Bob, aged 32",
        withRequest: {
          method: "POST",
          path: "/user",
          body: data,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: { name: 'BOB', age: 'young'}, // capitalized and age rendered as 'young'
        },
      })
    )

    it("a response is given", done => {
      // TODO make it work with judgeAge() function
      expect(checkAge(data)).to.eventually.be.fulfilled.notify(done)
    })
  })

  describe("when a call to the Gate is made to assess negative age", () => {
    const name = 'Derek'
    const age = -1
    const data = { name: name, age: age }
    console.log(data)

    before(() =>
      provider.addInteraction({
        uponReceiving: "a request for user Derek, aged -1",
        withRequest: {
          method: "POST",
          path: "/user",
          body: data,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: {code: 400, description: `LOL, dude, \`${age}\` is not a valid age"`, name: "Bad Request"}, // expecting a specific error message
        },
      })
    )

    it("a response is given", done => {
      // TODO make it work with judgeAge() function
      expect(checkAge(data)).to.eventually.be.fulfilled.notify(done)
    })
  })

  // Write pact files
  after(() => {
    return provider.finalize()
  })
})