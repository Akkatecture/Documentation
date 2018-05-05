---
title: "Your First Commands"
lesson: 3
chapter: 3
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - walkthrough
    - akkatecture
    - commands
    - csharp
    - dotnet
---
Let us recall some of the business requiremtents for the bank:

* The bank needs to allow customers to create bank accounts for free with a non-negative opening balance.
* The bank needs to allow customers to transfer money between accounts.

We could see these as three commands, one for creating the bank account. And another one for initiating a money transfer:

```csharp
//command for creating the bank account
public class OpenNewAccountCommand : Command<Account, AccountId> 
{
    public Money OpeningBalance { get; }
    public OpenNewAccountCommand(AccountId aggregateId, Money openingBalance)
        : base(aggregateId)
    {
        if(openingBalance == null) throw new ArgumentNullException(nameof(openingBalance));

        OpeningBalance = openingBalance;
    }
}
```

And the transfer money command can be made as follows:

```csharp
//command for initiating (sending) a money transfer
public class TransferMoneyCommand : Command<Account, AccountId>
{
    public AccountId ReceiverId { get; }
    public Money Amount { get; }
    public TransferMoneyCommand(
        AccountId aggregateId, 
        AccountId receiverId,
        Money amount) 
        : base(aggregateId) 
        {
            if(amount == null) throw new ArgumentNullException(nameof(amount));

            Amount = amount;
            ReceiverId = receiverId;
        }
}
```

```csharp
//command for receiving a money transfer
public class ReceiveMoneyCommand : Command<Account, AccountId>
{
    public AccountId SenderId { get; }
    public Money Amount { get; }
    public ReceiveMoneyCommand(
        AccountId aggregateId, 
        AccountId senderId,
        Money amount) 
        : base(aggregateId) 
        {
            if(amount == null) throw new ArgumentNullException(nameof(amount));

            Amount = amount;
            SenderId = senderId;
        }
}
```

> Typically when designing a business domain, one would start with the events first. Instead of modelling how external actors interact with the system, one should start with desgining how the system interacts with itself through a process called [event storming](https://en.wikipedia.org/wiki/Event_storming).


Now we can make some events for the business domain. Events are the funamendamental building blocks of event sourced systems. Go on ahead next to create your first **events**.

[NEXT →](/docs/your-first-events)