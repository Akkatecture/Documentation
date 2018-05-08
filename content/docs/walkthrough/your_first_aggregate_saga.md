---
title: "Your First Aggregate Saga"
lesson: 6
chapter: 3
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - walkthrough
    - akkatecture
    - saga
    - csharp
    - dotnet
---
In Akkatecuture `AggregateSaga<,,>`'s are usefuly for coordinating message passing between service or aggregate boundaries in domain driven design. More about sagas can be said in our documentation over [here](/docs/sagas). The one major component missing in our current task is the ability to tell other aggregate roots that they have received money. In other words, we lack the ability to command bank accounts to receive money as a result of a bank account having sent the money. 

Since we are making a saga incharge of coordinating money transfer, lets call it the `MoneyTransferSaga`.

```csharp
public class MoneyTransferSaga : AggregateSaga<MoneyTransferSaga, MoneyTransferSagaId, MoneyTransferSagaState> 
    ISagaIsStartedBy<Account, AccountId, MoneySentEvent>,
    ISagaHandles<Account, AccountId, FeesDeductedEvent>
{
}
```

> We could have used a domain event subscriber to do all of this but then we would need to build in all the nice features specific to aggregate sagas. Which is why in Akkaecture we built them out since aggregate sagas are special kinds of stateful domain event subscribers who specialize in these kind of scenarios. Lets have a look at a domain event **subscriber** next.

[NEXT →](/docs/your-first-subscribers)

