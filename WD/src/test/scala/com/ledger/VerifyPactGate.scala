package com.ledger

import org.scalatest.{BeforeAndAfterAll, FunSpec, Matchers}
import com.itv.scalapact.PactVerifySuite
import com.itv.scalapact.shared.{BrokerPublishData, ConsumerVersionSelector, PactBrokerAuthorization, PendingPactSettings, ProviderStateResult}

import scala.concurrent.duration._

class VerifyPactGate extends FunSpec with Matchers with BeforeAndAfterAll with PactVerifySuite {

  describe("Verifying Consumer Contracts") {
    it("should be able to verify it's contracts") {
      val consumer = ConsumerVersionSelector("expectations_from_gate_0.0.2", latest = false) // This should fetch all the latest pacts of consumer with tag example
      val providerVersion = "0.0.3"
      val providerTag = "test-provider"

      verifyPact
        .withPactSource(
          // See: https://github.com/ITV/scala-pact/blob/17e64f4742c99b6f1932d4b4eaa10ff65950f052/scalapact-scalatest/src/main/scala/com/itv/scalapact/ScalaPactVerify.scala#L250-L259
          // +  : https://github.com/ITV/scala-pact/blob/17e64f4742c99b6f1932d4b4eaa10ff65950f052/broker-integration-tests/provider/src/test/scala/provider/VerifyContractsSpec.scala#L41-L52
          pactBrokerWithVersionSelectors(
            "http://localhost", // broker url
            "WD", // provider name
            List(consumer), // consumer tag
            List(providerTag), // provider tag
            PendingPactSettings.PendingDisabled,
            Some(BrokerPublishData(providerVersion, None)), // publish + provider version
            //again, these are publicly known creds for a test pact-broker
            PactBrokerAuthorization(pactBrokerCredentials = ("pactbroker", "PoC_P4CT!"), ""),
            Some(5.seconds)
          )
        )
        .setupProviderState("given") {
              // Useless state for demonstration purposes
          case "User Doe is 123 years old" =>
            val newHeader = "Pact" -> "modifiedRequest"
            ProviderStateResult(true, req => req.copy(headers = Option(req.headers.fold(Map(newHeader))(_ + newHeader))))
        }
        .runVerificationAgainst("localhost", 8080, 10.seconds)
    }
  }

}