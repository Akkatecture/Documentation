---
title: "Your First Events"
lesson: 4
chapter: 3
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - walkthrough
    - akkatecture
    - events
    - csharp
    - dotnet
---
We now need to design the aggregate events that will alert the system that something has happened. Some events that occur in this system according to the [business requirements](/docs/walkthrough-introduction#business-requirements).

What are some facts that happen in our system:
* Bank account can be opened.
* Money can be sent to a bank account.
* Bank fees for sent money can be deducted from bank account.
* Money can be received by a bank account.

Lets model these events accordingly.

The event that represents a bank account being opened
```csharp
public class AccountOpenedEvent : AggregateEvent<Account,AccountId> 
{
    public Money OpeningBalance { get; }
    public AccountOpenedEvent(Money openingBalance)
    {
        OpeningBalance = openingBalance;
    }
}

```

The event that represents a bank account having sent money
```csharp
public class MoneySentEvent : AggregateEvent<Account,AccountId> 
{
    public Money Amount { get; }
    public AccountId ReceiverId { get; }
    public MoneySentEvent(AccountId receiverId, Money amount)
    {
        Amount = amount;
        ReceiverId = receiverId;
    }
}

```

The event that represents a bank account deducting bank fees
```csharp
public class FeesDeductedEvent : AggregateEvent<Account,AccountId> 
{
    public Money Amount { get; }
    public FeesDeductedEvent(Money amount)
    {
        Amount = amount;
    }
}
```

The event that represents a bank account receiving money
```csharp
public class MoneyReceivedEvent : AggregateEvent<Account,AccountId> 
{
    public Money Amount { get; }
    public AccountId SenderId { get; }
    public MoneyReceivedEvent(AccountId senderId, Money amount)
    {
        Amount = amount;
        SenderId = senderId;
    }
}

```

We need to add each aggregate event applier method to the [aggregate state](/docs/your-first-aggregate#the-account-aggregate) as an `IApply<>`.

`AccountState` becomes:

```csharp
public class AccountState : AggregateState<Account, AccountId>,
    IApply<AccountOpenedEvent>,
    IApply<MoneySentEvent>,
    IApply<FeesDeductedEvent>,
    IApply<MoneyReceivedEvent>
{
    public Money Balance { get; }

    public void Apply(AccountOpenedEvent aggregateEvent) 
    {
        Balance = aggregateEvent.OpeningBalance;
    }

    public void Apply(MoneySentEvent aggregateEvent) 
    {
        Balance -= aggregateEvent.Amount;
    }

    public void Apply(FeesDeductedEvent aggregateEvent) 
    {
        Balance -= aggregateEvent.Amount;
    }

    public void Apply(MoneyReceivedEvent aggregateEvent) 
    {
        Balance += aggregateEvent.Amount;
    }
}
```

> Notice how events are treated as facts. The only domain logic here is how to apply the event to the aggregate state. If you have `if-else` statements in your state model, reconsider your modelling of events and state. 

Head over to the next section on **specifications**.

[Next →](/docs/your-first-specifications)