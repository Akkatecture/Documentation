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
We now need to design the aggregate events that will form as the basis of your domain. Some of events that occur in this system could be:

* Bank account has been opened.
* Money has been sent to a bank account.
* Bank fees for the sending of money have been deducted from bank account.
* Money has been received by a bank account.

Lets model these events accordingly.

The event that represents a bank account being opened
```csharp
//Walkthrough.Domain/Model/Account/Events/AccountOpenedEvent.cs
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
//Walkthrough.Domain/Model/Account/Events/MoneySentEvent.cs
public class MoneySentEvent : AggregateEvent<Account,AccountId>
{
    public Transaction Transaction { get; }

    public MoneySentEvent(Transaction transaction)
    {
        Transaction = transaction;
    }
}

```

The event that represents a bank account deducting bank fees
```csharp
//Walkthrough.Domain/Model/Account/Events/FeesDeductedEvent.cs
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
//Walkthrough.Domain/Model/Account/Events/MoneyReceivedEvent.cs
public class MoneyReceivedEvent : AggregateEvent<Account,AccountId> 
{
    public Transaction Transaction { get; }

    public MoneyReceivedEvent(Transaction transaction)
    {
        Transaction = transaction;
    }
}

```

We need to add each aggregate event applier method to the [aggregate state](/docs/your-first-aggregate#the-account-aggregate) as an `IApply<>`.

`AccountState` becomes:

```csharp
//Walkthrough.Domain/Model/Account/AccountState.cs
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
        Balance -=  aggregateEvent.Transaction.Amount;
    }

    public void Apply(FeesDeductedEvent aggregateEvent)
    {
        Balance -= aggregateEvent.Amount;
    }

    public void Apply(MoneyReceivedEvent aggregateEvent)
    {
        Balance +=  aggregateEvent.Transaction.Amount;
    }
}
```

> Notice how events are treated as facts. The only domain logic here is how to apply the event to the aggregate state. If you have `if-else` statements in your state model, reconsider your modelling of events and state.

Head over to the next section on **specifications**.

[Next →](/docs/your-first-specifications)
