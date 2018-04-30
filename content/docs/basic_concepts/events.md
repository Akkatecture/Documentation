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

In an event sourced system like Akkatecture, aggregate root data is stored in events, and those events are persisted to be replayed when the aggregate root is re-instantiated across system restarts (re-deployments). Aggregate events are also published via akka.net's [event stream](http://getakka.net/api/Akka.Event.EventStream.html).

```csharp
public class PingEvent : AggregateEvent<PingAggregate, PingAggregateId>
{
    public long TimeSent { get; }
    public string Data { get; }

    public PingEvent(long timeSent, string data)
    {
        TimeSent = timeSent;
        Data = data;
    }
}
```

> Please make sure to read the section on [event tips and tricks](/docs/tips-and-tricks#events) for some additional notes on events, and how to design them.

## Emitting Events

In order to emit an event from an aggregate, call the `protected` `Emit(...)` method which applies the event to the aggregate state and commits the event to the event store. In akka.net terms it calls the `PersistentActor.Persist(...)` method. Below is an example of how it works.

```csharp
public bool Execute(PingCommand command)
{
    // Fancy domain logic here that validates against aggregate state...

    if (string.IsNullOrEmpty(command.Data))
    {
        Throw(DomainError.With("Ping data empty"))
    }

    var aggregateEvent = new PingEvent(command.Data);

    Emit(aggregateEvent);
    
    return true;
}

```
> In akkatecture, the act of emitting an event both applies the event to aggregate state, and publishes the event as a `IDomainEvent` to the akka.net event stream. Please continue reading about [published events](/docs/events#published-events) to understand how aggregate events look like when they get published outside of the aggregate boundary.

## Applying Events

Akkatecture has a rather opinionated way of approaching the application of events. Events that are emitted are only to be applied to its own aggregate state. that makes it rather convienient to isolate the place where aggregate events get applied. To register an aggregate event applyer method on the aggregate state, all you have to do is implement the `IApply<>` interface on your aggregate state.

```csharp
public class PingState : AggregateState<PingAggregate, PingAggregate>,
    IApply<PingEvent>
{
    private List<string> Pings {get; set;} = new List<string>();

    public PingAggregate(PingAggregate aggregateId)
        : base(aggregateId)
    {
    }

    public void Apply(PingEvent aggregateEvent)
    {
        Pings.Add(aggregateEvent.Data);
    }
}
```

> Note the above example of aggregate event application could be improved because it is not idempotent. Designing your apply methods with idempotency in mind, will make for a resilient aggregate state. Here is an example of a more "idempotent" apply method:

```csharp
//Idempotent-y state
public class PingState : AggregateState<PingAggregate, PingAggregateId>,
    IApply<PingEvent>
{
    //using a dictionary instead of a list to get some idempotency
    private Dictionary<long, string> Pings {get; set;} = new Dictionary<long, string>();

    public PingAggregate(PingAggregateId aggregateId)
        : base(aggregateId)
    {
    }

    public void Apply(PingEvent aggregateEvent)
    {
        Pings.Add(aggregateEvent.TimeStamp, aggregateEvent.Data);
    }
}
```

> As you can see above we have made our Appy method Idempotent by using a different datastructure to hold our `Pings`. It is idempotent becuase if we apply the same event to the state we effectively leave the state unchanged.

## Replaying Events

In Akkatecture, the default behaviour for the aggregate roots is to apply the event back to the aggregate state on event replay. Akkatecture has a default `Recover(...)` method on the base `AggregateRoot<,,>` class that you can use do event recovery. All you need to do is tell akka how to apply the persisted event. Do do this, register your recovery event to akka.net's `Recover<>` registry. This is what a typical example will look like.

```csharp
public class UserAccountAggregate : AggregateRoot<UserAccountAggregate,UserAccountId,UserAccountState>
{
    public UserAccountAggregate(UserAccountId id)
        : base(id)
    {
        //command handler registrations
        Command<CreateUserAccountCommand>(Execute);
        Command<UserAccountChangeNameCommand>(Execute);

        //recovery handler registrations
        Recover<UserAccountCreatedEvent>(Recover);
        Recover<UserAccountNameChangedEvent>(Recover);
    }
}
```

It is imperative that you make sure to register all of your events for this aggregate root to avoid having inconsistent state when you do event replay. If you use akka behaviours, make sure that on recovery that you re-establish the correct domain behaviour.

> You need to make sure that you have configured a persistent event store before deploying your application to production since the default persistent provider in Akkatecture is using the same default provider that is used in akka.net persistent actors, namely, the in memory event journal and in memory snap store. Go ahead and look at how this all works in our [event store production readiness](/docs/production-readiness#event-store) documentation.

## Published Events
If you have noticed, Akkatecture uses the aggregate events as a means for aggregates to maintain consistency within that particular aggregates boundaries. For any particular instance of an aggregate root, its local state is always consistent from that local perspective. When you publish an event, the aggregate is letting the rest of your domain know that something has happened. This event will get picked up by any parties interested in that particular event.

> CAP theory comes into play as soon as you publish an event. The "world view" of your other domain entities will be in-consistent with the world view of your aggregates at the time of event publishing. Keep this in mind when desining your system. The best you can hope for is an eventually consistent system within the Akkatecture framework.

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

The most important thing to note here is that the `AggregateSequenceNumber` is the "age" of the aggregate which emitted that particular event at that particular moment in time. So if an aggregate has applied 4 events, then the 4th domain event from that aggregate root will have an `AggregateSequenceNumber` of `4`.

### Event Metadata

The `IMetadata` of the domain event, is essentially a dictionary of keys and values of any metadata related to that domain event. You can add anything to this container to be used as a 'bag of tricks' for your domain. You can add things like telemetry data to this IMetadata container. The container should be seen as a mechanism to allow you to better enrich the domain event, apart from the actual data contained in the `IAggregateEvent`. The aggregate event should be pure to your domain, but you can add additional information to it via the metadata container.

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
