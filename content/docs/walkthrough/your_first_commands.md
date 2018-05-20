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
Let us remind ourselves of some of the business requirements for the task that we are trying to do:

* The bank needs to allow customers to create accounts for free with a non-negative opening balance.
* The bank needs to allow customers to transfer money between accounts.

We could see these as two commands, one for creating the bank account. And another one for initiating a money transfer:

```csharp
//command for creating the bank account
//Walkthrough.Domain/Model/Account/Commands/OpenNewAccountCommand.cs
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
//Walkthrough.Domain/Model/Account/Commands/TransferMoneyCommand.cs
public class TransferMoneyCommand : Command<Account, AccountId>
{
    public Transaction Transaction { get; }
    public TransferMoneyCommand(
    AccountId aggregateId,
    Transaction transaction)
        : base(aggregateId)
    {
        Transaction = transaction;
    }
}
```

But there is actually a third command, we need a command to have an account aggregate receive money.

```csharp
//command for receiving a money transfer
//Walkthrough.Domain/Model/Account/Commands/ReceiveMoneyCommand.cs
public class ReceiveMoneyCommand : Command<Account,AccountId>
{
    public Transaction Transaction { get; }
        
    public ReceiveMoneyCommand(
    AccountId aggregateId, 
    Transaction transaction) 
        : base(aggregateId) 
    {
        Transaction = transaction;
    }
}
```

We have glossed over this `Transaction` model. The transaction model is a model that encompasses the details of the money transaction. The sender and the receiver accounts along with the amount to be transferred. In this walkthrough it will be modelled as an `Entity<TransactionId>`:

```csharp
//Walkthrough.Domain/Model/Account/Entities/Transaction.cs
public class Transaction : Entity<TransactionId>
{
    public AccountId Sender { get; }
    public AccountId Receiver { get; }
    public Money Amount { get; }
        
    public Transaction(TransactionId entityId, AccountId sender, AccountId receiver, Money amount)
        : base(entityId)
    {
        Sender = sender;
        Receiver = receiver;
        Amount = amount;
    }
}
```
Be sure to also model the corresponding `TransactionId` for the `Transaction` entity.

> Typically when designing a business domain, one would start with the events first. Instead of modelling how external players interact with the system, one should start with designing how the system interacts with itself through a process called [event storming](https://en.wikipedia.org/wiki/Event_storming).


Now we can make some events for the business domain. Events are the fundamental building blocks of event sourced systems. Go on ahead next to create your first **events**.

[Next →](/docs/your-first-events)