package com.ledger

import akka.actor.testkit.typed.scaladsl.ActorTestKit
import akka.http.scaladsl.marshalling.Marshal
import akka.http.scaladsl.model._
import akka.http.scaladsl.testkit.ScalatestRouteTest
import org.scalatest.Matchers
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.wordspec.AnyWordSpec

class UserRoutesSpec extends AnyWordSpec with Matchers with ScalaFutures with ScalatestRouteTest {

  lazy val testKit = ActorTestKit()
  implicit def typedSystem = testKit.system
  override def createActorSystem(): akka.actor.ActorSystem =
    testKit.system.classicSystem

  val userRegistry = testKit.spawn(UserRegistry())
  lazy val routes = new UserRoutes(userRegistry).userRoutes

  import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
  import com.ledger.JsonFormats._

  "UserRoutes" should {
    "be able to transform age (POST /user)" in {
      val user = User("John", 42)
      val userEntity = Marshal(user).to[MessageEntity].futureValue

      val request = Post("/user").withEntity(userEntity)

      request ~> routes ~> check {
        status should ===(StatusCodes.Created)

        contentType should ===(ContentTypes.`application/json`)

        entityAs[String] should ===("""{"age":"young","name":"John"}""")
      }
    }
  }
}
