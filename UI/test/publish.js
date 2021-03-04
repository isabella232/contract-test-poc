// original file: https://github.com/pact-foundation/pact-js/blob/master/examples/e2e/test/publish.js

import { Publisher } from "@pact-foundation/pact"
import path from "path"
import childProcess from "child_process"
  
const exec = command =>
    childProcess
      .execSync(command)
      .toString()
      .trim()

const consumerVersion = '0.0.1c'
const tag = 'expectations_from_UI_0.0.1c'
  
const opts = {
    pactFilesOrDirs: [path.resolve(process.cwd(), "pacts")],
    pactBroker: "http://localhost",
    pactBrokerUsername: "pactbroker",
    pactBrokerPassword: "PoC_P4CT!",
    tags: [tag],
    consumerVersion,
}
  
new Publisher(opts)
    .publishPacts()
    .then(() => {
      console.log(
        `Pact contract for consumer version ${consumerVersion} published!`
      )
    })
    .catch(e => {
      console.log("Pact contract publishing failed: ", e)
    })