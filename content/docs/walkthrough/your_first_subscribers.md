---
title: "Your First Subscribers"
lesson: 7
chapter: 3
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - walkthrough
    - akkatecture
    - subscriber
    - csharp
    - dotnet
---
If we look back at our task requirements, the last one states that;
*The bank would like to keep track of how much money it has gained as revenue as a result of the transaction fees.*

One way to satisfy this requirement is to use a `DomainEventSubscriber` that Subscribes to the `FeesDeductedEvent` domain event, which then tells the persistence mechanism to store the result so that it can later be read by a `ReadModel`.

```csharp
public class RevenueSubscriber : DomainEventSubscriber,
    ISubscribeTo<Account,AccountId,FeesDeductedEvent>
{
    public IActorRef RevenueRepository { get; }    
    public RevenueSubscriber(IActorRef revenueRepository)
    {
        RevenueRepository = revenueRepository;
    }
        
    public Task Handle(IDomainEvent<Account, AccountId, FeesDeductedEvent> domainEvent)
    {
        var command = new AddRevenueCommand(domainEvent.AggregateEvent.Amount);
        RevenueRepository.Tell(command);
            
        return Task.CompletedTask;
    }
}
```

Our mock revenue repository is going to be modelled as an actor, but typically this would be a type of persistent storage that applies to your use case.

```csharp
public class RevenueRepository : ReceiveActor
{
    public Money Revenue { get; private set; } = new Money(0.00m);
    public int Transactions { get; private set; } = 0;

    public RevenueRepository()
    {
        Receive<AddRevenueCommand>(Handle);
        Receive<GetRevenueQuery>(Handle);
    }

    private bool Handle(AddRevenueCommand command)
    {
        Revenue = Revenue + command.AmountToAdd;
        Transactions++;
        return true;
    }

    private bool Handle(GetRevenueQuery query)
    {
        var readModel = new RevenueReadModel(Revenue, Transactions);
        Sender.Tell(readModel);
        return true;
    }
}
```

This repository handles a `AddRevenueCommand` which is just a data transfer object (dto) that holds the amount of money to add to the current revenue. The repository also handles a query `GetRevenueQuery`. You can now see a hint of how the read/query side of an Akkatecture application might work. On to the next section on **read models**.

[Next →](/docs/your-first-read-models)