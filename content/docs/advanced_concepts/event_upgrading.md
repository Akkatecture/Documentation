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
Also sometimes known as event upcasting. At some point you might find the need to replace a event with zero or more events. Some use cases might be:

* A previous application version introduced a domain error in the form of a wrong event being emitted from the aggregate.
* The domain has changed, either from a change in requirements or simply from a better understanding of the domain.

In the above cases, Akkatecture suggests that you implement an `AggregateEventUpcaster<,>` and then you can add your own upcast implementation by implementing `IUpcast<,>` on the upcaster. Lets do this with an example.

Imagine we have an OrderAggregate that emits `ProductAddedEvent`s, due to new domain improvements or required it has been deemed necessary to have a new version of that event called `ProductAddedEventV2`. We make changes to the aggregate to emit the new version of the event, but we have a problem in that the old event is persisted in the event journal. To remedy this we will implement a suitable `AggregateEventUpcaster<,>`.

```csharp
public class OrderAggregateEventUpcaster : AggregateEventUpcaster<OrderAggregate, OrderId>,
        IUpcast<ProductAddedEvent, ProductAddedEventV2>
    {
        public ProductAddedEventV2 Upcast(ProductAddedEvent aggregateEvent)
        {
            return new ProductAddedEventV2(
                aggregateEvent.AggregateId,
                /* other things to enrich the event */
                string.Empty);
        }
    }
```

and then our read journal hocon configuration requires the following to be added to it

```json
akka.persistence {
    journal {
        plugin = ""akka.persistence.journal.some-plugin""
        some-plugin {
			event-adapters {
                ##fully qualified class name and assembly of the upcaster
				aggregate-event-upcaster  = ""YourDomain.OrderAggregateEventUpcaster, YourDomain""
			}
			event-adapter-bindings = {
				""Akkatecture.Aggregates.ICommittedEvent, Akkatecture"" = aggregate-event-upcaster
			}
        }
    }
}
```

Now in our order aggrege state, we only need to implement the apply method of the new aggregate event

```csharp
public class OrderState : AggregateState<OrderState, OrderId>,
    IApply<ProductAddedEventV2>,
    IApply<ProductRemovedEvent>,
{
    public Products Products { get; private set; }

    public void Apply(ProductRemovedEvent aggregateEvent)
    {
        Products.Remove(aggregateEvent.Product);
    }

    public void Apply(ProductAddedEventV2 aggregateEvent)
    {
        Products.Add(aggregateEvent.Product);
    }
}
```

> The event upcaster works as a normal `IReadEventAdapter` from [akka.net](https://getakka.net/articles/persistence/event-adapters.html).