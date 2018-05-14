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
identity and state. You can create your own implementation of `Identity` by implementing the
`IIdentity` interface, or you can use a base class `Identity<>` that
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

Additionally, to create your aggregate state, which will be used for applying aggregate events to, you can create your own state model by inheriting from the base `AggregateState<,,>` class like this:

```csharp
public class StoreState : AggregateState<StoreAggregate, StoreId>
{
}
```

Next, to model your aggregate, simply inherit from `AggregateRoot<,,>`, making sure to pass the aggregate's own type as the first generic argument, with the identity model as the second, and the state model as the third. Make sure to pass down the aggregate identity to the base class, as this is required (no parameterless construction).

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

Aggregates in Akkatecture exist as singletons in the actor system, and thus, by design, only one aggregate root instance can be created or used per `aggregateId` at any given time. Akkatecture gives you the constructs to avoid this with the use of `AggregateManager<,,>` which is essentially a message coordinater/dispatcher for the underlying aggregate.

For most use cases the default `AggregateManager<,,>` will be sufficient all you need to do is to inherit from it

```csharp
public class StoreAggregateManager : 
    AggregateManager<StoreAggregate, StoreId, Command<StoreAggregate, StoreId>>
{       
}
```

The aggregate manager works by resolving the addresses of aggregate roots and routes messages to them accordingly. It routes the messages by using the `Command<,,>.AggregateId` member variable to locate or create the child aggregate roots. Since we are also in an actor system, the `AggregateManager<,,>` is also responsible for supervising aggregate roots (which are also actors within akka.net). The aggregate manager is what enables Akkatecture to take advantage of the [one child per entity pattern](https://gigi.nullneuron.net/gigilabs/child-per-entity-pattern-in-akka-net/). There is another example of this pattern being applied in Akkatecture's `Akkatecture.Cluster` package which does the same thing for aggregates and [sagas](/docs/sagas) in a clustered environment.

> Aggregate managers should not do anything that violates the error kernel pattern. What this means is that the aggregate manager should not do *dangerous* `I/O` within the aggregate manager, since it will be responsible for many aggregates underneath it.

[Next, Events →](/docs/events)