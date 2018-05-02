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
Subscribers in Akkatecture come in the form of `DomainEventSubscriber<,,>`. This allows you to have listeners within the actor system listening to domain events that get published from the aggregate roots.

```csharp
//subscriber counts how many games have ended
public class GamesEndedSubscriber : DomainEventSubscriber<GameAggregate, GameAggregateId, AggregateEvent<GameAggregate, GameAggregateId>>,
    ISubscribeTo<GameAggregate, GameAggregateId, GameEndedEvent>
{
    public int Count { get; set;} = 0;
        
    public Task Handle(IDomainEvent<GameAggregate, GameAggregateId, GameEndedEvent> domainEvent)
    {
        Count++;
        Logger.Info($"{Count} Games ended so far.");
        return Task.CompletedTask;
    }
}
```
You can do absolutely anything from these subscribers, persist projections, do distributed calculations, or they can be used to push data into message queues to notify other domain service boundaries or micro services. Take note, if your subscription actor is doing "dangerous" work, like doing `I/O`, consider applying the [error kernel](https://petabridge.com/blog/how-actors-recover-from-failure-hierarchy-and-supervision/) pattern to defer the danger of exceptions away from the subscription actor. Create a child actor that will be responsible for doing the `I/O` and then make that child actor susceptible to failure, let akka.net's [supervision](http://getakka.net/articles/concepts/supervision.html) do all the work for you. Apply resiliency patterns where necassary.

> If you want a subscriber to interact between aggregate or domain boundaries, Akkatecture ships with an `AggregateSaga<,,>` implementation that has been specifically tailored for this use case. To learn more about sagas (otherwise known as process managers, or activities, go [here](/docs/sagas))