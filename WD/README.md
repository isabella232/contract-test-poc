# WD (Provider)

(Implementation based on: https://developer.lightbend.com/guides/akka-http-quickstart-scala/)

## Run

### Option 1. Run the Server Using Sbt
```
$ sbt compile
$ sbt run
```

### Option 2. Package the Server (fat jar) and Run it
```
$ sbt clean assembly 
$ scala target/scala-2.13/wd_provider-assembly-0.1.0-SNAPSHOT.jar
```

### Option 3. Docker

```
$ docker build -t WD .
$ docker run WD
```

### Examples of Requests

```
$ # age < 100: "young"
$ curl -H "Content-type: application/json" -X POST -d '{"name": "Alice", "age": 42}' http://localhost:8080/user
{"age":"young","name":"Alice"}
$ # age >= 100: "old"
$ curl -H "Content-type: application/json" -X POST -d '{"name": "Bob", "age": 102}' http://localhost:8080/user
{"age":"old","name":"Bob"}
```

## Verify

### External Approach 1: pact-provider-verifier

```
$ pact-provider-verifier --provider-base-url=http://localhost:8080 --pact-broker-base-url=http://localhost --broker-username=pactbroker --broker-password=PoC_P4CT! --provider="WD" --consumer-version-tag="expectations_from_gate_0.0.2c" --publish-verification-results --provider-app-version="0.0.3p"
```

### External Approach 2: SBT

**IMPORTANT: no possibility to publish results to the broker using this method**

Contra: https://docs.pact.io/implementation_guides/jvm/provider/sbt/#using-the-old-verifypacts-task

> pact.verifier.publishResults	Publishing of verification results will be skipped unless this property is set to 'true[version 3.5.18+]

Did not manage to add `addSbtPlugin("au.com.dius" %% "pact-jvm-provider-sbt" % "3.5.18")` though.

Terminal 1: run provider
```
$ sbt compile run
```

Terminal 2: 

Option 1. Verify (using a JSON file)
```
$ sbt "pactVerify --source pact/ --host localhost --port 8080 --protocol http"
```

Option 2. Verify (using a broker)
```
$ sbt -Dproperty=pact.verifier.publishResults	"pactVerify --host localhost --port 8080 --protocol http"
```

(`-Dproperty=pact.verifier.publishResults` does not work).

Example:
```
$ sbt "pactVerify --source pact/ --host localhost --port 8080 --protocol http"
[info] welcome to sbt 1.4.6 (Oracle Corporation Java 14.0.2)
[info] loading global plugins from /Users/glethuillier/.sbt/1.0/plugins
[info] loading settings for project wd-build from plugins.sbt ...
[info] loading project definition from /Users/glethuillier/contract-test-poc/wd/project
[info] loading settings for project root from build.sbt,pact.sbt ...
[info] set current project to wd_provider (in build file:/Users/glethuillier/contract-test-poc/wd/)
*************************************
** ScalaPact: Running Verifier     **
*************************************
Attempting to use local pact files at: 'pact/'
Verifying against 'localhost' on port '8080' with a timeout of 1 second(s).
--------------------
Attempting to run provider state: User Doe is 123 years old
Provider state ran successfully
--------------------
cURL for request: curl -X POST 'http://localhost:8080/user' -H 'Content-Type: application/json' -H 'Content-Length: 35'
--------------------
Attempting to run provider state: User Smith is 10 years old
Provider state ran successfully
--------------------
cURL for request: curl -X POST 'http://localhost:8080/user' -H 'Content-Type: application/json' -H 'Content-Length: 36'
Results for pact between gate and wd
 - [  OK  ] a request for User Doe
 - [  OK  ] a request for User Smith
[scala-pact] Run completed in: 754 ms
[scala-pact] Total number of test run: 2
[scala-pact] Tests: succeeded 2, failed 0, pending 0
[scala-pact] All Pact verify tests passed or pending.
[success] Total time: 1 s, completed Feb 22, 2021, 2:53:41 PM
```

Example 2: modify the Provider (old when > 200):

```
--- a/wd/src/main/scala/com/Ledger/UserRegistry.scala
+++ b/wd/src/main/scala/com/Ledger/UserRegistry.scala
@@ -20,7 +20,7 @@ object UserRegistry {
       case JudgeAge(user, replyTo) =>
         var age = user.age
         var judgement = "young"
-        if (age >= 100) {
+        if (age >= 200) {
           judgement = "old"
         }
         replyTo ! JudgmentPerformed(s"${user.name}", judgement)
```

Then, re-run the server and the PACT verification:

```
$ sbt "pactVerify --source pact/ --host localhost --port 8080 --protocol http"
[info] welcome to sbt 1.4.6 (Oracle Corporation Java 14.0.2)
[info] loading global plugins from /Users/glethuillier/.sbt/1.0/plugins
[info] loading settings for project wd-build from plugins.sbt ...
[info] loading project definition from /Users/glethuillier/contract-test-poc/wd/project
[info] loading settings for project root from build.sbt,pact.sbt ...
[info] set current project to wd_provider (in build file:/Users/glethuillier/contract-test-poc/wd/)
*************************************
** ScalaPact: Running Verifier     **
*************************************
Attempting to use local pact files at: 'pact/'
Verifying against 'localhost' on port '8080' with a timeout of 1 second(s).
--------------------
Attempting to run provider state: User Doe is 123 years old
Provider state ran successfully
--------------------
cURL for request: curl -X POST 'http://localhost:8080/user' -H 'Content-Type: application/json' -H 'Content-Length: 35'
--------------------
Attempting to run provider state: User Smith is 10 years old
Provider state ran successfully
--------------------
cURL for request: curl -X POST 'http://localhost:8080/user' -H 'Content-Type: application/json' -H 'Content-Length: 36'
Results for pact between gate and wd
 - [FAILED] a request for User Doe
Failed to match response
 ...original
Response          [200]
  headers:        [Server=akka-http/10.2.3,\n                   "Date=Mon, 22 Feb 2021 13:59:42 GMT,\n                   "Content-Type=application/json,\n                   "Content-Length=28]
  matching rules: []
  body:
{"age":"young","name":"Doe"}


 ...closest match was...
Response          [200]
  headers:        []
  matching rules: []
  body:
{
  "age" : "old",
  "name" : "Doe"
}


 ...Differences
Node at: .age
  Value 'old' did not match 'young'

> Rules:
Rules:
 -



 - [  OK  ] a request for User Smith
[scala-pact] Run completed in: 999 ms
[scala-pact] Total number of test run: 2
[scala-pact] Tests: succeeded 1, failed 1, pending 0
[scala-pact] 1 Pact verify tests failed.
```

### Internal Approach (as a test)

Run tests from `src/test/scala/com/ledger/VerifyPactGate.scala`

**Using this method, the results are published to the broker** thanks to `Some(BrokerPublishData(providerVersion, None))`
