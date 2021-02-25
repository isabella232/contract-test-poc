package com.ledger

import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Route

import scala.concurrent.Future
import UserRegistry._
import akka.actor.typed.ActorRef
import akka.actor.typed.ActorSystem
import akka.actor.typed.scaladsl.AskPattern._
import akka.util.Timeout
import com.ledger.UserRegistry.JudgmentPerformed

class UserRoutes(userRegistry: ActorRef[UserRegistry.Command])(implicit val system: ActorSystem[_]) {

  import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
  import JsonFormats._

  private implicit val timeout = Timeout.create(system.settings.config.getDuration("my-app.routes.ask-timeout"))

  def judge(user: User): Future[JudgmentPerformed] =
    userRegistry.ask(JudgeAge(user, _))

  val userRoutes: Route =
    pathPrefix("user") {
      concat(
        pathEnd {
          concat(
            post {
              entity(as[User]) { user =>
                onSuccess(judge(user)) { performed =>
                  complete((StatusCodes.OK, performed))
                }
              }
            })
        })
    }
}
