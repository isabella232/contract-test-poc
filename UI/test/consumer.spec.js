// original file: https://github.com/pact-foundation/pact-js/blob/master/examples/e2e/test/consumer.spec.js
const path = require("path")
const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
const expect = chai.expect
const { Pact, Matchers } = require("@pact-foundation/pact")
const LOG_LEVEL = process.env.LOG_LEVEL || "WARN"

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


  // Setup a Mock Server before unit tests run.
  // This server acts as a Test Double for the real Provider API.
  // We then call addInteraction() for each test to configure the Mock Service
  // to act like the Provider
  // It also sets up expectations for what requests are to come, and will fail
  // if the calls are not seen.
  before(() =>
    provider.setup().then(opts => {
      process.env.API_HOST = `http://localhost:5000`
    })
  )

  // After each individual test (one or more interactions)
  // we validate that the correct request came through.
  // This ensures what we _expect_ from the provider, is actually
  // what we've asked for (and is what gets captured in the contract)
  afterEach(() => provider.verify())

  // Configure and import consumer API
  // Note that we update the API endpoint to point at the Mock Service
  const {
    checkAge
  } = require("../src/consumer")


  describe("when a call to the Gate is made to assess ALICE's age", () => {
    const name = 'ALICE'
    const age = 101

    before(() =>
      provider.addInteraction({
        uponReceiving: "a request for user ALICE, aged 101",
        withRequest: {
          method: "POST",
          path: "/user",
          body: { name: name, age: age},
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
      expect(checkAge(name, age)).to.eventually.be.fulfilled.notify(done)
    })
  })

  describe("when a call to the Gate is made to assess Bob's age", () => {
    const name = 'Bob'
    const age = 32

    before(() =>
      provider.addInteraction({
        uponReceiving: "a request for user Bob, aged 32",
        withRequest: {
          method: "POST",
          path: "/user",
          body: { name: name, age: age},
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
      expect(checkAge(name, age)).to.eventually.be.fulfilled.notify(done)
    })
  })

  // Write pact files
  after(() => {
    return provider.finalize()
  })
})