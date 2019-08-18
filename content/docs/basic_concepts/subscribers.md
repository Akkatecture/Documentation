---
title: "Subscribers"
lesson: 6
chapter: 2
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - basic-concepts
    - akkatecture
    - csharp
    - dotnet
---
Subscribers in Akkatecture come in the form of `DomainEventSubscriber`. They allow you to have listeners within the actor system listening to domain events that get published from the aggregate roots. The events that this type of subscriber listens to come from akka.net's [EventStream](https://getakka.net/articles/utilities/event-bus.html).

```csharp
//subscriber counts how many games have ended
public class GamesEndedSubscriber : DomainEventSubscriber,
    ISubscribeTo<GameAggregate, GameAggregateId, GameEndedEvent>
{
    public int Count { get; set;} = 0;
 
    public bool Handle(IDomainEvent<GameAggregate, GameAggregateId, GameEndedEvent> domainEvent)
    {
        Count++;
        Logger.Info($"{Count} Games ended so far.");
        return true;
    }
}
```
`DomainEventSubscriber`s are actors that subscribe to domain events, domain even subscribers can be thought of as tiny microservices that live within your actor system. some examples of common usages for `DomainEventSubscriber`s could be: 

* Persist projected data.
* Re-publish events onto external message queues.
* Fascilitate in distributed computations and workflows.

Do take note! If your subscription actor is doing "dangerous" work, such as  doing `I/O`, consider applying the [error kernel](https://petabridge.com/blog/how-actors-recover-from-failure-hierarchy-and-supervision/) pattern to defer the danger of `I/O` failure away from the subscription actor. Create a child actor that will be responsible for doing the dangerous `I/O` work, and then make that child actor susceptible to failure. Always defer potential exceptions away from parent actors, and let akka.net's [supervision](http://getakka.net/articles/concepts/supervision.html) protect your domain event subscribers from failure.

> If you want a subscriber to interact between aggregate or domain boundaries, Akkatecture ships with an `AggregateSaga<,,>` implementation that has been specifically tailored for this use case. To learn more about sagas (otherwise known as process managers, or activities, go [here](/docs/sagas))

[Next, Jobs →](/docs/jobs)