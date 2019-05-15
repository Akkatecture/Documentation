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
    - aggregate
    - csharp
    - dotnet
---
On analysis of the business requirements, it is apparent that the main aggregate entity that exists under the `Bank` domain context is an `Account`. The account aggregate needs the ability to be `Opened` and to `Transfer Money` to other `Account`s. Inversely, `Account`s need to also `Receive Money`. Lets call our aggregate responsible for representing an account the `AccountAggregate`.

## The Account Aggregate

First we need to make an `Identity<>` for our aggregate.

```csharp
//Walkthrough.Domain/Model/Account/AccountId.cs
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
//Walkthrough.Domain/Model/Account/AccountState.cs
public class AccountState : AggregateState<Account, AccountId>
{
    public Money Balance { get; set; }
}
```

Lets make a simple `Money` ValueObject<decimal> that will represent money in our application, lets put some simple domain logic into the value object that states that its value must be non-negative.

```csharp
//Walkthrough.Domain/Model/Account/ValueObjects/Money.cs
public class Money : SingleValueObject<decimal>
{
    public Money(decimal value)
        : base(value)
    {
        if(value < 0) throw new ArgumentException(nameof(value));
    }

    //overload the + and - operators to support the
    //addition and subtraction of money
}
```

> Now we have a value object that represents money in our domain. In the fully worked walkthrough in the Akkatecture repository we have overloaded the `+` and `-` operators accordingly.

Now we can make our `Account` aggregate root.

```csharp
//Walkthrough.Domain/Model/Account/Account.cs
public class Account : AggregateRoot<Account, AccountId, AccountState>
{
    public Account(AccountId aggregateId)
        : base(aggregateId)
    {
    }
}
```

And finally we need to make our aggregate root manager, which will be responsible for supervising, and creating the aggregate roots.

```csharp
//Walkthrough.Domain/Model/Account/AccountManager.cs
public class AccountManager : AggregateManager<Account, AccountId, Command<Account, AccountId>>
{
}
```

We have made the basic skeleton of our aggregate domain. To interact with our aggregate we need to use **commands**. Lets proceed to the next part of the walkthrough.

[Next →](/docs/your-first-commands)