---
title: "Your First Aggregate"
lesson: 2
chapter: 3
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - walkthrough
    - akkatecture
    - csharp
    - dotnet
---
On analysis of the business requirements, it is apparent that the main aggregate entity that exists under the `Bank` domain is a `BankAccount`. The bank account aggregate needs the ability to be `Created` and to `Deposit Money` to other `BankAccounts`. Lets call our aggregate responsible for holding bank account state the `AccountAggregate`.

## The Account Aggregate

First we need to make an `Identity<>` for our aggregate.

```csharp
public class AccountId : Identity<AccountId>
{
    public AccountId(string value)
        : base(value)
        {
        }
}
```

Then we need to make the `Account` aggregate state model that will hold our balance:

```csharp
public class AccountState : AggregateState<Account, AccountId>
{
    public Money Balance { get; set; }
}
```

Lets make a simple `Money` ValueObject<decimal> that will represent money in our application, that can not be zero.

```csharp
public class Money : SingleValueObject<decimal>
{
    public Money(decimal value)
        : base(value)
    {
        if(value < 0) throw new ArgumentException(nameof(value));
    }
}
```

> Now we have a value object that represents money in our system.

now we can make our `Account` aggregate.

```csharp
public class Account : AggregateRoot<Account, AccountId, AccountState>
{
    public Account(AccountId aggregateId)
        : base(aggregateId)
    {

    }
}
```

Now we need to interact with our aggregate through commands. Lets proceed to the [next](/docs/your-first-commands) part of the walkthrough.