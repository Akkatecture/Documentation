---
title: "Commands"
lesson: 4
chapter: 2
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - basic-concepts
    - akkatecture
    - csharp
    - dotnet
---

Commands are the basic `ValueObject`s, that represent the operations of intent that you want to perform in your domain, they represent the "c" side of cqrs. Aggregate commands are sent to aggregate roots, via aggregate managers, typically, on successful execution, a command can result in one or more aggregate events being emitted.

As an example, imagine you are implementing the command for initiating a bank transfer from one account (your account) to another. it might look something like this.

```csharp
public class TransferMoneyCommand : Command<AccountAggregate, AccountId>
{
    public Money Amount { get; }
    public AccountId DestinationAccountId { get; }

    public TransferMoneyCommand(
        AccountId id,
        Money amount,
        AccountId destinationAccountId)
        : base(id)
    {
        Amount = amount;
        DestinationAccountId = destinationAccountId;
    }
}
```

> Note that the Money class is merely a `ValueObject`, created to hold the amount of money and to do basic validation. In Akkatecture, you don’t have to use the default Akkatecture `Command<,>` implementation to, you can create your own implementation, it merely have to implement the `ICommand<,>` interface.

A command by itself doesn’t do anything and will be swollowed by the underlying actor as unprocessed if no command handler exists for it. To make a command work, you need to implement a command handler which is responsible for the processing of the command.

```csharp
    public class AccountAggregate : AggregateRoot<AccountAggregate, AccountAggregateId, AccountState>
    {
        public AccountAggregate(AccountAggregateId aggregateId)
            : base(aggregateId)
        {
            Command<TransferMoneyCommand>(Execute)
        }

        public bool Execute(TransferMoneyCommand command)
        {
          if(State.Balance < command.Amount)
          {
            //Domain Error, not enough money to send
          }
          if(Id == command.DestinationAccountId)
          {
            //Domain Error, cant send money to yourself
          }

          Emit(new MoneyTransferedEvent(command.Amount, command.DestinationAccountId));

          //tell akkas underlying actor that you handled the command
          return true;
        }
    }
```

> The domain validation `if` statements above that check if there is enough balance, or if the destination account identifier is not the same as the current account can be modelled in `Specifications<>`. You can find out more about specifications in Akkatecture documentation [here](/docs/specifications).

## Ensure Idempotency

Detecting duplicate operations can be hard, especially if you have a distributed application, or simply a web application. Consider the following simplified scenario:

1. The user wants to send her friend money.
2. The user fills in the "send money form".
3. As the user is impatient, or by accident, the user submits the form twice.
4. The first web request completes, is validated, and the money is sent. However, as the browser is waiting on the first web request, this result is ignored.
5. The second web request either transfers money again since there is enough balance, or  throws a domain error as there is no more balance left in the account.
6. The user is presented with a error on the web page, or has accidently sent money twice when she only meant to send it once.

Since Akkatecture's by design dictates that aggregate roots exist as a singleton, we can deal with idempotency at the aggregate level.

We can redesign our command to look like this

```csharp
public class TransferMoneyCommand : Command<AccountAggregate, AccountId>
{
    public Money Amount { get; }
    public DestinationAccountId { get; }

    public TransferMoneyCommand(
        AccountId id,
        ISourceId sourceId,
        AccountId destinationAccountId,
        Money amount)
        : base(id, sourceId)
    {
        Amount = amount;
        DestinationAccountId = destinationAccountId;
    }
}
```

Note the use of the other `protected` constructor of `Command<,>` that takes a `ISourceId` in addition to the aggregate root identity. This `sourceId` can be supplied from outside the aggregate boundary eg the API surface.
You can then use a circular buffer or "list of processed" commands within your aggregate root to reject previously seen commands.

## Easier ISourceId calculation
Ensuring the correct calculation of the command `ISourceId` can be somewhat cumbersome, which is why Akkatecture provides another base command you can use, the `DistinctCommand<,>`. By using the `DistinctCommand<,>` you merely have to implement the `GetSourceIdComponents()` and providing the `IEnumerable<byte[]>` that makes the command unique. The bytes is used to create a deterministic GUID to be used as an ISourceId.

```csharp
public class TransferMoneyCommand : DistinctCommand<AccountAggregate, AccountId>
{
    public Money Amount { get; }
    public DestinationAccountId { get; }

    public TransferMoneyCommand(
        AccountId id,
        ISourceId sourceId,
        AccountId destinationAccountId,
        Money amount)
        : base(id)
    {
        Amount = amount;
        DestinationAccountId = destinationAccountId;
    }

    protected override IEnumerable<byte[]> GetSourceIdComponents()
    {
      yield return Amount.GetBytes();
      yield return DestinationAccountId.GetBytes();
    }
}
```

The `GetBytes()` merely returns the `Encoding.UTF8.GetBytes(...)` of the value object.

[Next, Specifications →](/docs/specifications)