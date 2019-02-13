---
title: "Aggregates"
lesson: 2
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

Initially, before you can create an aggregate, you need to create its corresponding 
identity and state. You can create your own model of `Identity` by implementing the
`IIdentity` interface, or you can use base class `Identity<>` that
Akkatecture provides, like this:


```csharp
public class StoreId : Identity<StoreId>
{
    public StoreId(string value)
        : base(value)
    {
    }
}
```

The `Identity<>` value object provides generic functionality to create and validate aggregate root identities. Please read the documentation regarding the bundled `Identity<>` type [here](/docs/primitives#identities), as it provides several useful features, e.g. several different schemes for identity generation, one that minimizes MSSQL database fragmentation.

Additionally, to create your aggregate state, which will be used for applying aggregate events to, you can create your own state model by inheriting from the base `AggregateState<,,>` class in the following way:

```csharp
//
public class StoreState : AggregateState<StoreAggregate, StoreId>
{
}
```

Next; to model your aggregate, inherit from `AggregateRoot<,,>`, making sure to pass the aggregate's own type as the first generic argument, with the identity type as the second generic argument, and the state type as the third generic argument. Also be sure to pass down an instance of the aggregate identity to the base class, as this is required. So your final aggregate root should look like this when all is said and done:

```csharp
public class StoreAggregate : AggregateRoot<StoreAggregate, StoreId, StoreState>
{
    public StoreAggregate(StoreId aggregateId)
        : base(aggregateId)
    {
    }
}
```


## Aggregate Managers

Aggregates in Akkatecture exist as singletons in the actor system, and thus, by design, only one aggregate root instance can be created or used per `aggregateId` at any given time. There can only be one incarnation of a particular aggregate root in your actor system active at any given time, this is what the `AggregateManager<,,>` is for.

For most use cases the default `AggregateManager<,,>` will be sufficient, and as usual, all you need to do is to inherit from it to implement an aggregate manager for your aggregate root.

```csharp
public class StoreAggregateManager :
    AggregateManager<StoreAggregate, StoreId, Command<StoreAggregate, StoreId>>
{
}
```

The aggregate manager works by resolving the addresses of aggregate roots and routes messages to them accordingly. It routes the messages by using the `Command<,,>.AggregateId` member to locate or create the child aggregate roots. Since we are also in an actor system, the `AggregateManager<,,>` is also responsible for supervising aggregate roots (which are also actors within akka.net). The aggregate manager is what enables Akkatecture to take advantage of the [one child per entity pattern](https://gigi.nullneuron.net/gigilabs/child-per-entity-pattern-in-akka-net/). There is another example of this pattern being applied in Akkatecture's `Akkatecture.Cluster` package which does the same thing for aggregates and [sagas](/docs/sagas) in a clustered environment.

> Aggregate managers being so close to the root of the actor hierarchy, should not do anything that violates the error kernel pattern. What this means is that the aggregate manager should not do any *dangerous* `I/O` that may jeopardize its ability to be an effective and reliable supervisor and message dispacher.

[Next, Events →](/docs/events)