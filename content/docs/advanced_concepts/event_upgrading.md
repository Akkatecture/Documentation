---
title: "Event Upgrading"
lesson: 5
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
At some point you might find the need to replace a event with zero or more events. Some use cases might be:

* A previous application version introduced a domain error in the form of a wrong event being emitted from the aggregate.
* The domain has changed, either from a change in requirements or simply from a better understanding of the domain.

In the above cases, Akkatecture suggests that you encapsulate the event upgrading logic in your aggregate state event apply methods.

In the `ShoppingCartState` event upgrading example below we have an event `ProductAddedEvent` that is has been deprecated in the face of domain improvements. The new version is called `ProductAddedEventV2`. We apply the upgrade logic in the deprecated apply method and invoke the correct `Apply()` method.

```csharp
public class ShoppingCartState : AggregateState<ShoppingCartState, ShoppingCartId>,
    IApply<ProductAddedEvent>,
    IApply<ProductRemovedEvent>,
    IApply<ProductAddedEventV2>,
{
    public ShoppingCart Cart { get; private set; }

    public void Apply(ProductAddedEvent aggregateEvent) 
    {
        //we want to convert ProductAddedEvent to V2 then Apply that event
        var productAddedEventv2 = ProductAddedEventV2Factory.From(aggregateEvent);
        Apply(productAddedEventv2);
    }

    public void Apply(ProductRemovedEvent aggregateEvent) 
    {
        Cart.Remove(aggregateEvent.Product);
    }

    public void Apply(ProductAddedEventV2 aggregateEvent) 
    {
        Cart.Add(aggregateEvent.Product);
    }
}

//ProductAddedEventV2Factory.cs
public static class ProductAddedEventV2Factory 
{
    public static ProductAddedEventV2 From(ProductAddedEvent upgradableEvent)
    {
        return new ProductAddedEventV2(upgradableEvent.Foo,upgradableEvent.Product);
    }
}
```

In the `Apply(ProductAddedEvent aggregateEvent)` there is the mapping from the events base version to its second version. After such the correct `Apply(ProductAddedEventV2 aggregateEvent)` is invoked. This is also a great candidate for unit testing the correct behaviour.

>A general rule when versioning events is that adding things does not cause a versioning conflict. Adding a new version of an event is therefore not a problem, as long as we don’t break the definition of a new version event; it must be convertible from an old version of the same event. If this is not possible, then it’s a new event.