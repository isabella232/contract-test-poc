addSbtPlugin("io.spray" % "sbt-revolver" % "0.9.1")
addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.15.0")
addSbtPlugin("au.com.dius" %% "pact-jvm-provider-sbt" % "3.5.12") // See: https://docs.pact.io/implementation_guides/jvm/provider/sbt/#using-the-old-verifypacts-task

import sbt.Defaults.sbtPluginExtra

// PACT ---------------------------------------------------------
// Verify: External Approach
val scalaPactVersion = "3.2.0"
libraryDependencies += {
  val sbtV = (sbtBinaryVersion in pluginCrossBuild).value
  val scalaV = (scalaBinaryVersion in update).value
  sbtPluginExtra("com.itv" % "sbt-scalapact" % scalaPactVersion, sbtV, scalaV)
}

// Verify: Internal Approach
addSbtPlugin("com.itv" % "sbt-scalapact" % scalaPactVersion)

// PACT ^-------------------------------------------------------^