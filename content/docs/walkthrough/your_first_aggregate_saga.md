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
In Akkatecuture `AggregateSaga<,,>`s are usefuly for coordinating message passing between service or aggregate boundaries. More about sagas can be said in our documentation over [here](/docs/sagas), but in this walkthrough we will re-iterate over some of the concepts and implement them to our needs. 

One of the major components missing in our current task is the ability to tell other Account's that there is money to be received. In other words, we lack the ability to command bank accounts to receive money as a result of another bank account having sent the money. 

Since we are making a saga responsible for coordinating money transfer, lets call it the `MoneyTransferSaga`. Bare with the explanation but we will model it one stab. Sagas need to implement `ISagaIsStartedBy<,,>` and (sometimes) `ISagaHandles<,,>` interfaces. These interfaces give you a nice description of how the saga works and which boundaries it operates between.

```csharp
//Walkthrough.Domain/Sagas/MoneyTransfer/MoneyTransferSaga.cs
public class MoneyTransferSaga : AggregateSaga<MoneyTransferSaga, MoneyTransferSagaId, MoneyTransferSagaState>,
    ISagaIsStartedBy<Account, AccountId, MoneySentEvent>,
    ISagaHandles<Account, AccountId, MoneyReceivedEvent>
{
    public IActorRef AccountAggregateManager { get; }
    public MoneyTransferSaga(IActorRef accountAggregateManager)
    {
        AccountAggregateManager = accountAggregateManager;
    }

    public Task Handle(IDomainEvent<Account, AccountId, MoneySentEvent> domainEvent)
    {
        var isNewSpec = new AggregateIsNewSpecification();
        if (isNewSpec.IsSatisfiedBy(this))
        {
            var command = new ReceiveMoneyCommand(
                domainEvent.AggregateEvent.Transaction.Receiver,
                domainEvent.AggregateEvent.Transaction);
            
            AccountAggregateManager.Tell(command);
                
            Emit(new MoneyTransferStartedEvent(domainEvent.AggregateEvent.Transaction));
        }
            
        return Task.CompletedTask;
    }

    public Task Handle(IDomainEvent<Account, AccountId, MoneyReceivedEvent> domainEvent)
    {
        var spec = new AggregateIsNewSpecification().Not();
        if (spec.IsSatisfiedBy(this))
        {
            Emit(new MoneyTransferCompletedEvent(domainEvent.AggregateEvent.Transaction));
        }
            
        return Task.CompletedTask;
    }
}
```

`AggregateSaga<,,>`s in akkatecture behave just like `AggregateRoot<,,>`s. They are event sourced and have a unique identity per instance based on its `SagaId<>`. If you notice Handle methods on the aggregate saga are handling domain events and not commands (unlike aggregate roots which handle commands). All the same practices of domain validation applies, use specifications to enforce business rules. You can also see that aggregate sagas also `Emit(...)` events just like aggregate roots, however in this case they emit events related to that saga.

Lets talk about the first `Handle` method in depth. Esentially it is responsible for handling the `MoneySentEvent`. Which means telling the receiver aggregate that it is to receive money. We do this using a command that we made in the [previous lesson on commmands](/docs/your-first-commands) using the `ReceiveMoneyCommand`. After creating the receive money command we can tell the account that it has money to be received. After that we can emit an event that expresses the fact that the saga has begun using the `MoneyTransferStartedEvent`.

The `SagaId<>` gives us a way to address the saga in the actor system, and much like `Identity<>` it is also a `SingleValueObject<>`. We can define our `MoneyTransferSagaId` as follows:

```csharp
//Walkthrough.Domain/Sagas/MoneyTransfer/MoneyTransferSagaId.cs
public class MoneyTransferSagaId : SagaId<MoneyTransferSagaId>
{
    public MoneyTransferSagaId(string value)
        : base(value)
    {
    }
}
```

Akkatecture aggregate sagas are also similar to aggregate roots in that they have a state model, but this time it is based on `SagaState<,,>`. We can define our `SagaState<,,>` as follows:

```csharp
//Walkthrough.Domain/Sagas/MoneyTransfer/MoneyTransferSagaState.cs
public class MoneyTransferSagaState : SagaState<MoneyTransferSaga,MoneyTransferSagaId,IMessageApplier<MoneyTransferSaga, MoneyTransferSagaId>>,
    IApply<MoneyTransferStartedEvent>,
    IApply<MoneyTransferCompletedEvent>
{
    public Transaction Transaction { get; private set; }

    public void Apply(MoneyTransferStartedEvent aggregateEvent)
    {
        Transaction = aggregateEvent.Transaction;
        Start();
    }

    public void Apply(MoneyTransferCompletedEvent aggregateEvent)
    {
       Complete();
    }
}
```

> Check out how the saga events are modelled the source code [here](https://github.com/Akkatecture/Walkthrough/Akkatecture.Walkthrough.Domain/Sagas/MoneyTransfer/Events).

`SagaState.Status` is an enum that describes the overall status of the saga. The status can be any of the following:
* NotStarted
* Running
* Completed
* Failed
* Cancelled
* PartiallySucceeded

> To set the saga into those states we recommend you use the methods that set the status member into the specified state. The respective methods are; `Start()`,`Complete()`,...,`PartiallySucceed()`. And these should only ideally be used as a result of an aggregate saga event int a  `SagaState.Apply(...)`.

### AggregateSagaManager

The `AggregateSagaManager<,,>` functions just like the `AggregateManager<,,>`. It is responsible for coordinating the message passing of messages to sagas. In this case it is not `Commands<,>`, but `IDomainEvent`s. We can define our saga manager as follows:

```csharp
//Walkthrough.Domain/Sagas/MoneyTransfer/MoneyTransferSagaManager.cs
public class MoneyTransferSagaManager : AggregateSagaManager<MoneyTransferSaga,MoneyTransferSagaId,MoneyTransferSagaLocator>
{
    public MoneyTransferSagaManager(Expression<Func<MoneyTransferSaga>> factory)
        : base(factory)
    {            
    }
}
```
If you notice, the saga manager needs to have a factory method passed to its constructor so that it knows how to instantiate the underlying sagas since you may need to instantiate the saga with dependancies (like references to aggregatemanagers or other services).

### SagaLocators

`ISagaLocator<>`s are used to return `SagaId<>`s for any given saga, these Ids are used to address sagas in the actor system. Unlike aggregate roots which are located by an aggregateId, Sagas are not. Sagas are locateable from a group or class of events that are related to that saga. In our case, we need to use the `MoneySentEvent` and the `MoneyReceivedEvent` events  addresses the saga that is required to process the event. Both events have a `Transaction.Id` member so we can do that to address the saga. Lets define our `ISagaLocator<>`:

```csharp
//Walkthrough.Domain/Sagas/MoneyTransfer/MoneyTransferSagaLocator.cs
public class MoneyTransferSagaLocator : ISagaLocator<MoneyTransferSagaId>
{
    public const string LocatorIdPrefix = "moneytransfer";

    public MoneyTransferSagaId LocateSaga(IDomainEvent domainEvent)
    {
        switch (domainEvent.GetAggregateEvent())
        {
            case MoneySentEvent evt:
                return new MoneyTransferSagaId($"{LocatorIdPrefix}-{evt.Transaction.Id}");
            case MoneyReceivedEvent evt:
                return new MoneyTransferSagaId($"{LocatorIdPrefix}-{evt.Transaction.Id}");
            default:
                throw new ArgumentNullException(nameof(domainEvent));
        }
    }
}
```

We used a common bit of information that exists between these events to compose a locator for the saga. You can think of the SagaLocator as a function that returns an identifier for a group of events related to that saga. In this walkthrough, our sagas will have the identity of the form `moneytransfer-transaction-{transactionId}`. It is good practice to prefix your saga locator addresses.

> Final note, it is good to think about an aggregate saga as a domain event subscriber that coordinates a distributed process. In Akkatecture, there exists a more barebones domain event subscriber for lighter scenarios. Lets have a look at what a domain event **subscriber** is next.

[Next →](/docs/your-first-subscribers)

