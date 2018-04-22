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

Initially before you can create a aggregate, you need to create its
identity and state. You can create your own implementation of `Identity` by implementing the
`IIdentity` interface or you can use a base class `Identity<>` that
Akkatecture provides, like this.


```csharp
public class TestAggregateId : Identity<TestAggregateId>
{
  public TestAggregateId(string value)
    : base(value)
  {
  }
}
```

The `Identity<>` value object provides generic functionality to create and validate aggregate root IDs. Please read the documentation regarding the bundled Identity<> type as it provides several useful features, e.g. several different schemes for ID generation, one that minimizes MSSQL database fragmentation.

Additionally to create your aggregate state, which will be used for applying aggregate events to, you can create your own by inheriting from the base `AggregateState<,,>` class like this.

```csharp
public class TestState : AggregateState<TestAggregate, TestAggregateId>
{

}
```

Next, to create a new aggregate, simply inherit from `AggregateRoot<,,>` like this, making sure to pass test aggregate own type as the first generic argument and the identity as the second, and the state as the third. Make sure to pass down the aggregate identity to the base class, as this is required.

```csharp
    public class TestAggregate : AggregateRoot<TestAggregate, TestAggregateId, TestState>
    {
        public TestAggregate(TestAggregateId aggregateId)
            : base(aggregateId)
        {
        }
    }
```

> Aggregates in Akkatecture exist as singletons in the actor system, and thus by design, only one aggregate root instance can be created or used per id at any given time. The situation of having two aggregate roots available with the same aggregateId means that you have two instances of the aggregate state in the actor system which leads to a data level split brain situation. Akkatecture makes it easy to avoid this with the use of `AggregateManager<,,,,>` which is essentially a message coordinater/dispatcher for the underlying aggregate.