lazy val akkaHttpVersion = "10.2.3"
lazy val akkaVersion    = "2.6.12"
lazy val scalaPactVersion = "3.2.0"

lazy val root = (project in file(".")).
  settings(
    inThisBuild(List(
      organization    := "com.ledger",
      scalaVersion    := "2.12.12" // see: https://github.com/ITV/scala-pact/blob/17e64f4742c99b6f1932d4b4eaa10ff65950f052/build.sbt#L70-L72
    )),
    name := "WD",
    libraryDependencies ++= Seq(
      "com.typesafe.akka" %% "akka-http"                % akkaHttpVersion,
      "com.typesafe.akka" %% "akka-http-spray-json"     % akkaHttpVersion,
      "com.typesafe.akka" %% "akka-actor-typed"         % akkaVersion,
      "com.typesafe.akka" %% "akka-stream"              % akkaVersion,
      "ch.qos.logback"    % "logback-classic"           % "1.2.3",
      "com.typesafe.akka" %% "akka-http-testkit"        % akkaHttpVersion % Test,
      "com.typesafe.akka" %% "akka-actor-testkit-typed" % akkaVersion     % Test,
      // PACT
      "org.http4s"    %% "http4s-blaze-server"   % "0.21.7",
      "org.http4s"    %% "http4s-dsl"            % "0.21.7",
      "org.http4s"    %% "http4s-circe"          % "0.21.7",
      "org.slf4j"     % "slf4j-simple"           % "1.6.4",
      "org.scalatest" %% "scalatest" % "3.1.0" % Test,
      "com.itv"       %% "scalapact-scalatest-suite" % scalaPactVersion % Test,
      "com.itv"       %% "scalapact-circe-0-13"  % scalaPactVersion % Test,
      "com.itv"       %% "scalapact-http4s-0-21" % scalaPactVersion % Test,
      "com.itv"       %% "scalapact-scalatest"   % scalaPactVersion % Test,
      "com.itv"       %% "scalapact-shared" % scalaPactVersion,
      // Optional for auto-derivation of JSON codecs
      "io.circe" %% "circe-generic" % "0.13.0",
      // Optional for string interpolation to JSON model
      "io.circe" %% "circe-literal" % "0.13.0",
    )
  )


// PACT ---------------------------------------------------------
// Verify: External Approach

enablePlugins(ScalaPactPlugin)

// PACT ^-------------------------------------------------------^
