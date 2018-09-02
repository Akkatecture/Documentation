---
title: "Tips and Tricks"
lesson: 1
chapter: 5
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - further-self-study
    - akkatecture
    - csharp
    - dotnet
---
Whenever creating an application that uses cqrs and event sourcing there are several things you need to keep in mind to  minimize the potential culmination bugs, and headaches to occur.

## Events

Make sure that when your aggregate events are JSON serialized. Since these aggregate events may be used by external systems in the future of your application, they need to be as bare bones as possible with the least amount of noise to the data possible. Make sure that the events have:

-  No type information
-  No runtime information

It is ok to have this information in the event metadata for analytics or other concerns however they serve no business sense (normally) to be part of the events data payload.

Here's an example of good clean event JSON produced from a create user
event. 

```json
{
    "Username": "root",
    "PasswordHash": "1234567890ABCDEF",
    "EMail": "root@example.org",
}
```

**Keep Aggregate Events As Slim As Possible**

A good rule of thumb is to minimize the amount of noisey data that can exist in the aggregate event. If your state event applying method uses all of the event member variables on invokation, then you have a good event. adding bloat and extra data to events waters down how true the events are. Events embody 'facts which happened' in your domain. If you add unessacary 'facts' that dont pertain to that event in your event model, then that event becomes less 'fact-y'.

**Idempotent Apply Methods**

Your apply methods should be functional and idempotent, meaning the application of the same event over the state object multiple times should produce the same result as if it were applied only once.

**Keep Old Event Types**

Keep in mind, that you need to keep the event types in your code for as long as these events are in the event source, which in most cases are *forever* as storage is cheap and information, i.e., your domain events, are expensive. Distinguish between old event types and broken event types with high scrutiny as these are the fundamental building blocks of your domain.

However, you should still clean your code, have a look at how you can
[upgrade and version your events ](/docs/event-upgrading) for details on
how Akkatecture suggests to you in how to solve this.

## Unit Testing

Unit test your aggregates and sagas in isolation from one another. By using black box style  testing you can follow this approach.

**Aggregate Testing**
 - Arrange - setup the aggregate actor, listen to the aggregate actors possible emitted events.
 - Act - send the aggregate actor a command.
 - Assert - check to see if the aggregate actor emits the domain event as desired.

 **Saga Testing**
 - Arrange - setup the saga actor, listen to the saga actors issued commands by mocking its actor reference to a test probe actor
 - Act - send the saga actor a domain event.
 - Assert - check to see if the saga actor tells the probe actor the desired command.

It will be most advantageous to learn akka.net's [test kit](http://getakka.net/articles/actors/testing-actor-systems.html)

## Make Your Domain Expressive

Your domain code is your business model codified. Make sure that you apply the principle of a ubiquitous language to your domain by being explicit but terse in your naming conventions, this leads to a far more enjoyable developer expirience for those who share the code base. With the fall in popularity of UML diagrams and other forms of non-code business domain models, code written in a ddd way **is** your business domain model.

## Plan For Uncertainty & Inconsistency

Akka.net, and by extension, Akkatecture's default messaging policy is [at most once message delivery delivery](https://developer.lightbend.com/blog/2017-08-10-atotm-akka-messaging-part-1/index.html). In at most once delivery, an attempt is made by actors to send a message to the receiver. However, there are no guarantees that the message will be delivered. Any number of things may happen that prevent the successful delivery of an asynchronous message, including, but not limited to packet loss over a network transport. 

Another general rule that is message ordering can only be guaranteed on a sender-receiver pair level.

The guarantee is illustrated in the following:

Actor `A1` sends messages `M1` `M2` `M3` to `A2`.
Actor `A3` sends messages `M4` `M5` `M6` to `A2`.

If `M1` is delivered it must be delivered before `M2` and `M3`.
If `M2` is delivered it must be delivered before `M3`.
If `M4` is delivered it must be delivered before `M5` and `M6`.
If `M5` is delivered it must be delivered before `M6`.

`A2` can see messages from `A1` interleaved with messages from `A3`.

> An example of message ordering as seen from `A2`'s perspective might be `M4` `M5` `M1` `M2` `M3` `M6`.

## Actor Behaviours

To test and manage actors that do not use akka.net's `Become()` methods can become cumbersome. Akkatecture comes with a [specification pattern implementation](/docs/specifications) that will give you the option to do some rich, expressive, domain validation within the actors. Specifications are also highly testable. Feel free to use this at your pleasure.

## Validate Inputs

Validating inputs in CQRS that typically means validate your commands and queries. Do as much *static* or *shallow* validation as possible, `null` checks, and checks for `default(T)` such things are highly recommended where applicable.

**Aggregate Event Members Should Be Primitive**

This is to protect against invariants of domain models, Make sure that your event in its serialized form can be deserialized to any primitive type. Using complex (class) a type as a member in your aggregate event definition can be problematic, if the complex type changes by mistake or otherwise, it can render your aggregate event useless.

For example consider this case:

```csharp
public class GameEndedEvent : AggregateEvent<GameAggregate, GameAggregateId>
{
    //ZonedDateTime is a NodaTime type from a NuGet package
    public ZonedDateTime TimeEnded { get; } 
    //Team is an Entity<TeamId> from this example's domain project
    public Team WinningTeam { get; } 

    public GameEndedEvent(
        ZonedDateTime timeEnded,
        Team winningTeam)
    {
        TimeEnded = timeEnded;
        WinningTeam = winningTeam;
    }
}
```

In the `GameEndedEvent` class definition, there are two members called `TimeEnded` and `WinningTeam`, with the types `ZonedDateTime` (from [NodaTime](https://nodatime.org/)) and `Team` respectively. The issue with an event like this is that unless we freeze the version of the NodaTime package at the point of this events instantiation, we cant guarantee that this event will be able to be used in the future due to NodaTime making their own independant changes to the `ZonedDateTime` type. The issue with the `Team` entity existing in the aggregate event itself can also be problematic since the `Team` entity can evolve within your codebase independantly of the GameEndedEvent. In short, be very careful when adding types to your aggregate event that may evolve. BCL types and primitive types are safe bets because they evolve quite slow in comparison to other types from libraries or your own domain code. See [this](https://buildplease.com/pages/vos-in-events/) post which might persuade you even more.

an example of a better `GameEndedEvent` might be:

```csharp
public class GameEndedEvent : AggregateEvent<GameAggregate, GameAggregateId>
{
    public DateTime TimeEnded { get; }
    public Guid WinningTeamId { get; } 
    public string WinningTeamName { get; }
    public IReadOnlyList<Guid> WinningTeamMemberIds {get;} 

    public GameEndedEvent(
        DateTime timeEnded,
        Guid winningTeamId,
        string winningTeamName,
        IReadOnlyList<Guid> winningTeamMemberIds)
    {
        TimeEnded = timeEnded;
        WinningTeamId = winningTeamId;
        WinningTeamName = winningTeamName;
        WinningTeamMemberIds = winningTeamMemberIds
    }
}
```

In the event model above, the members are defined by BCL types that are "quite invariant", however if you want to be super safe, rather use primitive types or arrays of those primitive types or maps of those primitive types.

> Caveats or points of contention of this rule may include simple value objects like single value objects in Akkatecture that get serialized into a single primitive type. As long as you do not change the underlying primitive type of the `SingleValueObject` you will be fine.