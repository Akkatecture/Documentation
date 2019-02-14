---
title: "Events"
lesson: 3
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

In an event sourced system like Akkatecture, an aggregate's state can be described as a function that applies series of stored events. Functionally speaking, the state is the result of a left fold over the stream of events. Upon aggregate instatiation the aggregate regains its state by replaying the events stored in the event journal. Aggregate events are also published via akka.net's [event stream](http://getakka.net/api/Akka.Event.EventStream.html).

```csharp
public class PingEvent : AggregateEvent<PingAggregate, PingAggregateId>
{
    public long TimeSent { get; }
    public string Data { get; }

    public PingEvent(
    long timeSent,
    string data)
    {
        TimeSent = timeSent;
        Data = data;
    }
}
```

> Please make sure to read the section on [event tips and tricks](/docs/tips-and-tricks#events) for some additional notes on events, and how to design them.

## Emitting Events

In order to emit an event from an aggregate, call the `AggregateRoot.Emit(...)` method which commits the event to the event store and then applies the event to the aggregate state. In akka.net terms it calls the `PersistentActor.Persist(...)` method with a call-back to apply the event to aggregate state after persistence is successful. Below is an example of how it works.

```csharp
public bool Execute(PingCommand command)
{
    var aggregateEvent = new PingEvent(command.Data);

    Emit(aggregateEvent);

    return true;
}

```
> In Akkatecture, the act of emitting an event does three things, it persists the event to the event journal, it then applies the event to aggregate state, and finally the aggregate will publish the event as a `IDomainEvent` to the akka.net event stream. Please continue reading about [published events](/docs/events#published-events) to understand how aggregate events look like when they get published outside of the aggregate root boundary.

> Events in Akkatecture are journalled as `IComittedEvent<,,>`

## Applying Events

Akkatecture has a rather opinionated way of approaching the application of events. Events that are emitted are only to be applied to its own aggregate state. that makes it rather convienient to isolate the place where aggregate events get applied. To register an aggregate event applyer method on the aggregate state, all you have to do is implement the `IApply<>` interface on your aggregate state.

```csharp
public class PingState : AggregateState<PingAggregate, PingAggregate>,
    IApply<PingEvent>
{
    private List<string> Pings {get; set;} = new List<string>();

    public void Apply(PingEvent aggregateEvent)
    {
        Pings.Add(aggregateEvent.Data);
    }
}
```

## Replaying Events

Akkatecture has defined default behaviours to employ when replaying events persisted to the event journal. This behaviour is defined by the `Recover(...)` method on the base `AggregateRoot<,,>` class. Proceed with caution when using `Become()` for actor behaviours as this effectively clears the command and recovery handlers of the actor.

> You need to make sure that you have configured a persistent event store before deploying your application to production since the default persistent provider in Akkatecture is using the same default provider that is used in akka.net persistent actors, namely, the in-memory event journal and in-memory snapshot store. Go ahead and look at how this all works in our [event store production readiness](/docs/production-readiness#event-store) documentation.

## Published Events
In domain driven design end event sourcing the application of aggregate events to it's state is a means to maintain a consitency boundary. When an aggregate publishes an event, the aggregate is letting the rest of the domain know that something has happened. This event will get picked up by any parties interested in that particular event.

> CAP theory comes into play as soon as you publish an event. The "world view" of your other domain entities will be in-consistent with the world view of your aggregates at the time of event publishing. Keep this in mind when designing your system. The best you can hope for is an eventually consistent system within the Akkatecture framework.

### Domain Events
Domain events are aggregate events that have been published. In Akkatecture a domain event looks as follows:

```csharp
public interface IDomainEvent
{
    //CLR type of the aggregate
    Type AggregateType { get; }
    //CLR type of the identity
    Type IdentityType { get; }
    //CLR type of the aggregate event
    Type EventType { get; }
    //The aggregate sequence number
    long AggregateSequenceNumber { get; }
    //Metadata bag of any and all event metadata
    IMetadata Metadata { get; }
    //The timestamp of when the event was published
    DateTimeOffset Timestamp { get; }
    //The aggregates identity
    IIdentity GetIdentity();
    //The aggregate event
    IAggregateEvent GetAggregateEvent();
}
```

It is important to note here is that the `AggregateSequenceNumber` is the "age" of the aggregate which emitted that particular event at that particular moment in time. So if an aggregate has applied at most 4 events since its first incarnation, then the 4th domain event from that aggregate root will have an `AggregateSequenceNumber` of `4`.

### Event Metadata

The `IMetadata` of the domain event, is essentially a dictionary of keys and values of any metadata related to that domain event. You can add anything to this container to be used as a 'bag of tricks' for your domain. You can add things like telemetry data to this IMetadata container. The container should be seen as a mechanism to allow you to better enrich the domain event without having to add unnecessary or unrelated data contained in the `IAggregateEvent`. The aggregate event should be mostly pure to the aggregate root that emitted the event, but you can add additional information to it via the metadata container.

To add your own `IMetadata` to your DomainEvent ontop of the Akkatecture defaults, use the `Emit(aggregateEvent, metadata)` method when doing an event emit from withing your aggregate root. 


```csharp
public void Ping(PingCommand command)
{
    //Within aggregate root command handler
    //Fancy domain logic here that validates against aggregate state...

    var metadata = Metadata.Empty;
    var data = new Dictionary<string,string>
    {
        {"environment","staging"},
        {"app_version","1.0.3"}
    };

    metadata = metadata.With(data);

    Emit(new PingEvent(command.Data), metadata);
}
```

> You can add things like operation identifiers, build numbers, environment names, deployment regions, performance data, and other things to this metadata container, it is really up to you. The quicker you collect telemetry the better.

[Next, Commands →](/docs/commands)