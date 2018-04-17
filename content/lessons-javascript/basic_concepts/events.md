---
title: "Events"
lesson: 4
chapter: 2
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "lesson"
tags:
    - basic-concepts
    - akkatecture
    - csharp
    - dotnet
---

In an event source system like Akkatecture, aggregate root data is stored stored in events.

```csharp
    public class PingEvent : AggregateEvent<TestAggregate, TestAggregateId>
    {
      public string Data { get; }

      public PingEvent(string data)
      {
          Data = data;
      }
    }
```

[//]: # (TODO LINK)
> Please make sure to read the section on `value objects and events <value-objects>` for some important notes on creating events.

## Emitting Events

In order to emit an event from an aggregate, call the `protected` `Emit(...)` method which applies the event to the aggregate state and commits the event to its event source.

```csharp
    public void Ping(string data)
    {
      // Fancy domain logic here that validates against aggregate state...

      if (string.IsNullOrEmpty(data))
      {
        Throw(DomainError.With("Ping data empty"))
      }

      Emit(new PingEvent(data))
    }

```

## Applying Events

Akkatecture has a rather opinionated way of approaching the application of events. Events that are emitting should only be applied to its own aggregate state. that makes it rather convienient to isolate the place where aggregate events get applied within the aggregate's boundaries. To register the aggregate event applyer method on the aggregate state all you have to  do is implement the `IApply<>` interface on your aggregate state.

```csharp
    public class TestAggregate : AggregateRoot<TestAggregate, TestAggregateId, TestState>,
        IApply<PingEvent>
    {
        private List<string> Pings {get; set;} = new List<string>();

        public TestAggregate(TestAggregateId aggregateId)
            : base(aggregateId)
        {
        }

        public void Apply(PingEvent aggregateEvent)
        {
            Pings.Add(aggregateEvent.Data);
        }
    }
```

> Note the above example of aggregate event application could be improved because it is not idempotent. Desgining your apply methods with idempotency in mind, will make for a resilient aggregate state
