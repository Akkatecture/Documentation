---
title: "Sagas"
lesson: 1
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
Sagas (otherwise known as [process managers](https://msdn.microsoft.com/en-us/library/jj591569.aspx), or activities) are useful for doing distributed, long running persistent, transactions. They are also useful for coordinating message passing between aggregates or bounded contexts. A general rule of thumb is that Sagas only subscribe to events, and issue commands. As apposed to aggregate roots, which handle commands, and publish events. Sagas are only invoked through facts (events) that have happened in your business domain.

**Long Running Saga** - This type of saga typically runs for a long period of time. It may or may not have a terminating state, however the fundamental characteristic of this type of saga is that it runs over an arbitrarily long span of time. Imagine that you are an ecommerce vendor, and you want to give your loyal customers cool promotions. You can have a saga that monitors their ordering history and supply them with really cool voucher codes based on their purchase history. Sagas of this type are long running and persistent, and are really needed in business cases where you want to give your customers/users value that span across arbitrary time spans.

**Coordinator Saga** - Coordinator Sagas are pretty much sagas that fascilitate the communication between domain boundaries. This could be aggregate root boundaries, or bounded contexts or both. It really depends on the situation.

In Akkatecture, both of the above mentioned sagas can be modelled using the `AggregateSaga<,,>` construct.

Sagas are also, themselves, event sourced. Sagas can have their own events to emit and persist, as they are a special kind of aggregate root within Akkatecture. This means that your sagas can have an "infinite" lifespan and never "terminate". Sagas also exist on a higher level than aggregate roots since they require the knowledge of unrelated aggregate boundaries (in the form of their events). One could say that you can test the ubiquity of your ubiquitous language through your Sagas.

> See the `TestHelper` example on the Saga that Akkatecture uses to fascilitate its testing. You will get a good idea of how it works [here](https://github.com/Lutando/Akkatecture/tree/master/test/Akkatecture.TestHelpers/Aggregates/Sagas).