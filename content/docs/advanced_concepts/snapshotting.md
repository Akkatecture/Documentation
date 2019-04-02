---
title: "Snapshotting"
lesson: 2
chapter: 4
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - advanced-concepts
    - akkatecture
    - csharp
    - dotnet
---
State snapshotting is an optimization that you can use to reduce the amount of events that are replayed upon aggregate instantiation. The affect of snapshotting is to limit the 'at most amount of events to replay' for your aggregates. Snapshotting works in the following way; if your aggregate has comitted `N` events, and your last aggregate snapshot was at `N - x` events ago, instead of replaying all N events from the event journal (`[1 to N]`), Akka will hydrate your aggregate with your snapshot and then will replay the remaining journaled events from offset `[N-x to N]`, thus completing your aggregate recovery process. So the optimisation here is that you do not need to load all the comitted events that precede `N - x`. In cases where your aggregate has thousands of events this can be a worthwhile optimisation to reduce replay time and the load on your event journal.

Snapshotting can be applied to both aggregates and sagas. Since, in Akkatecture sagas are modelled similarly to aggregates, the same documentation here applies to sagas, ie the mechanics of snapshotting is the same in both aggregates and sagas.

In Akkatecture there is a notion of an `ISnapshotStrategy` which is a model that describes when a snapshot should be made. By default, Akkatecture aggregates and sagas use the snapshot strategy of `SnapshotNeverStrategy`. This tells the framework that the aggregate never snapshots, and thus, on recovery, will never use the snapshot store. There are a few other strategies namely:

* `SnapshotEveryFewVersionsStrategy` - The most common snapshot strategy. The strategy models the case where you want a snapshot to occur every N versions.
* `SnapshotAlwaysStrategy` - Useful for scenarios where you have low throughput and temporally long running aggregates or sagas.
* `SnapshotNeverStrategy` - This is the default snapshot strategy, which tells the aggregate to never snapshot.

You can implement your own SnapshotStrategy by implementing the `ISnapshotStrategy` interface.

# Wiring It All Up

Lets say we have an `OrderAggregate`. And we want to set its snapshot strategy. We can do the following.

```csharp
public class OrderAggregate : AggregateRoot<OrderAggregate, OrderId, OrderState>
{
    public OrderAggregate(OrderId aggregateId)
        : base(aggregateId)
    {
        var snapshotStrategy = new SnapshotEveryFewVersionsStrategy(10);
        SetSnapshotStrategy(snapshotStrategy);
    }
}
```
> SetSnapshotStrategy can also be used during the aggregates lifetime, ie you can change the strategy as the aggregate evolves during runtime by codifying this behaviour in the aggregates command handlers.

## Setting Up The Aggregate State

We have to now make our aggregate state aware of the fact that it can be hydrated from a snapshot (as well as being hydrated from a stream of event apply methods).


```csharp
public class OrderState : AggregateState<OrderAggregate, OrderId>
    IApply<OrderPlaced>,
    IApply<OrderShipped>,
    IHydrate<OrderSnapshot>,
{
    public CustomerId CustomerId {get; private set;}
    public Address ShippingAddress {get; private set;}

    public void Apply(OrderPlaced aggregateEvent){/* omitted for brevity */}
    public void Apply(OrderShipped aggregateEvent){/* omitted for brevity */}

    public void Hydrate(OrderSnapshot aggregateSnapshot)
    {
        CustomerId = CustomerId.With(aggregateSnapshot.CustomerId);

        ShippingAddress = new Address(
            aggregateSnapshot.ShippingAddressLine,
            aggregateSnapshot.ShippingAddressPostalCode,
            aggregateSnapshot.ShippingAddressTown);
    }
}

public class OrderSnapshot : IAggregateSnapshot<OrderAggregate, OrderId>
{
    public string CustomerId {get;}
    public string ShippingAddressLine{get;}
    public string ShippingAddressPostalCode {get;}
    public string ShippingAddressTown {get;}

    public OrderSnapshot(
        string customerId,
        string shippingAddressline,
        string shippingAddressPostalCode,
        string shippingAddressTown)
        {
            CustomerId = customerId;
            ShippingAddressLine = shippingAddressLine;
            ShippingAddressPostalCode = shippingAddressPostalCode;
            ShippingAddressTown = shippingAddressTown;
        }
}
```

Now all that is left is to override the `AggregateRoot.CreateSnapshot()` method so that Akkatecture can use this model to persist to the snapshot-store.

```csharp
//within OrderAggregate.cs

protected override IAggregateSnapshot<OrderAggregate, OrderId> CreateSnapshot()
{
    return new OrderSnapshot(
        State.CustomerId.Value,
        State.ShippingAddress.Line,
        State.ShippingAddress.PostalCode,
        State.ShippingAddress.Town);
}
```

# In Summary

To get snapshots working in Akkatecture you need to:

* Define your snapshot strategy and set your aggregate to use that particular strategy.
* Define the snapshot model that closely resembles your aggregate state.
* Make your aggregate state model implement `IHydrate<>`
* Override the `Aggregate.CreateSnapshot()` which maps the aggregates state to the aggregates snapshot model.

> The snapshot model should be treated as an invariant since it gets stored by akka.net's snapshot store. The same versioning strategies used in event sourcing for events, are applicable to snapshots as well. If the snapshot loading fails. The aggregate will be reloaded from the event journal and not the snapshot store.