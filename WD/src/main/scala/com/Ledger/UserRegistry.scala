package com.ledger

import akka.actor.typed.{ActorRef, Behavior}
import akka.actor.typed.scaladsl.Behaviors

final case class User(name: String, age: Int)

object UserRegistry {
  sealed trait Command
  final case class JudgeAge(user: User, replyTo: ActorRef[JudgmentPerformed]) extends Command

  final case class JudgmentPerformed(name: String, age: String)

  def apply(): Behavior[Command] = registry(Set.empty)

  private def registry(users: Set[User]): Behavior[Command] =
    Behaviors.receiveMessage {
      case JudgeAge(user, replyTo) =>
        var age = user.age
        var judgement = "young"
        if (age >= 100) {
          judgement = "old"
        }
        replyTo ! JudgmentPerformed(s"${user.name}", judgement)
        Behaviors.same
    }
}