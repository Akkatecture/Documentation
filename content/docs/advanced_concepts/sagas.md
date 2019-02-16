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
Sagas (otherwise known as [process managers](https://msdn.microsoft.com/en-us/library/jj591569.aspx), or activities) are useful for doing distributed, long running, persistent transactions. They are also useful for coordinating the message passing between aggregates or bounded contexts. A general rule of thumb is that sagas only subscribe to events, and issue commands. As apposed to aggregate roots, which handle commands, and publish events. Sagas are only invoked through facts (events) that have happened in the business domain. Sagas are really powerful at solving business problems that span transaction boundaries.

**Long Running Saga** - This type of saga typically runs for a long period of time. It may or may not have a terminating state, however the fundamental characteristic of this type of saga is that it runs over an arbitrarily long span of time. Imagine that you are an ecommerce vendor, and you want to give your loyal customers cool promotions. You can have a saga that monitors their ordering history and supply them with really cool voucher codes based on their purchase history. Sagas of this type are long running, persistent, and have no obvious terminating specification. These sagas are really powerful in business cases where you want to give your customers or users value that span across arbitrary time spans.

**Coordinator Saga** - Coordinator sagas are pretty much sagas that fascilitate the communication between transaction boundaries. This could be aggregate root boundaries, or bounded contexts or both. It really depends on the situation. They differ from long running sagas in that they definitely have a terminating state, whereas the long running saga *might not* have a terminating state.

In Akkatecture, both of the above mentioned sagas can be modelled using the `AggregateSaga<,,>` construct.

Sagas are also, themselves, event sourced (while they do not necessarily have to be event sourced). Sagas can have their own events to emit and persist, as they are a special kind of aggregate root within Akkatecture. This means that your sagas can have an "infinite" lifespan and never "terminate". Sagas also exist on a higher level than aggregate roots since they require the knowledge of unrelated aggregate boundaries (in the form of their events). One could say that you can test the 'ubiquity' of your ubiquitous language through your sagas. 

> See the [`TestHelper`](https://github.com/Lutando/Akkatecture/tree/master/test/Akkatecture.TestHelpers/Aggregates/Sagas) example on the Saga that Akkatecture uses to fascilitate its testing. You will get a good idea of how it works here. You may also find the [walkthrough](/docs/walkthrough-introduction) helpful in grasping the concepts.