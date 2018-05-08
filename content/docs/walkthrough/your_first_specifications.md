---
title: "Your First Specifications"
lesson: 5
chapter: 3
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - walkthrough
    - akkatecture
    - specifications
    - csharp
    - dotnet
---
Before we dive into how to construct aggregate sagas in Akkatecture, we are missing some crucial bits. We have laid out some fundamental building blocks, but have not put them all together. Let's do that quickly.

### Putting It All Together

We need to tell our aggregate how to handle commands.

Use the `AggregateRoot.Command<T>(Func<T,bool> handler)` to register your command handlers

```csharp
public class Account : AggregateRoot<Account, AccountId, AccountState>
{
    public Account(AccountId aggregateId)
        : base(aggregateId)
    {
        //register command handlers
        Command<OpenNewAccountCommand>(Execute);
        Command<TransferMoneyCommand>(Execute);
        Command<ReceiveMoneyCommand>(Execute);       
    }
}
```

Lets implement the Command Handlers
```csharp
public bool Execute(OpenNewAccountCommand command)
{
    //this spec is part of Akkatecture
    var spec = new AggregateIsNewSpecification();
    if(spec.IsSatisfiedBy(this))
    {
        var aggregateEvent = new AccountOpenedEvent(command.OpeningBalance)
        Emit(aggregateEvent);
    }

    return true;
}
```

> We return true from the execute method, to let akka know that we handled the command successfully.

To be able to send money the business requirements specified that; *The transaction fee for a successful money deposit is €0.25. The minimum amount of money allowed to transfer is €1.00. Which means that the minimum amount of money allowed to exit a bank account is €1.25*. 

```csharp
public class MinimumTransferAmountSpecification : Specification<Account> 
{
    protected override IEnumerable<string> IsNotSatisfiedBecause(Account obj)
    {
        if (obj.State.Balance.Value < 1.00m)
        {
            yield return $"'{obj.State.Balance.Value}' is lower than 1.25 '{obj.GetIdentity()}' is not new";
        }
    }
}

public class EnoughBalanceAmountSpecification : Specification<Account> 
{
    protected override IEnumerable<string> IsNotSatisfiedBecause(Account obj)
    {
        if (obj.State.Balance.Value < 1.25m)
        {
            yield return $"'Balance for Account: {obj.Id} is {obj.State.Balance.Value}' is lower than 1.25";
        }
    }
}
```

Now we can do our command handler for the `TransferMoneyCommand`.
```csharp
public bool Execute(TransferMoneyCommand command)
{
    var balanceSpec = new EnoughBalanceAmountSpecification();
    var minimumTransferSpec = new MinimumTransferAmountSpecification();
    var andSpec = balanceSpec.And(minimumTransferSpec);
    if(andSpec.IsSatisfiedBy(this))
    {
        var moneySentEvent = new MoneySentEvent(command.ReceiverId, command.Amount)
        Emit(moneySentEvent);

        var feesDeductedEvent = new FeesDeductedEvent(new Money(0.25m));
        Emit(feesDeductedEvent);
    }
    return true;
}
```

> We have a command that actually produced two events as the outcome of its sucessful execution. This is quite normal and can happen from time to time. One successful command does not necessarily mean one event being emitted. Transfering money reduces the account balance and charges a fee. For auditing purposes this is a good thing to have.

And finally we need to handle the receiving of money from `ReceiveMoneyCommand`.

```csharp
public bool Execute(ReceiveMoneyCommand command)
{
    var moneyReceivedEvent = new MoneyReceivedEvent(command.SenderId,command.Amount);

    Emit(moneyReceivedEvent);
    return true;
}
```

### Summary

We codified our business specifications (rules) into models that derive from `Specification<>`. This allows us to have testable specifications that live in one place. We used the specifications to guard our domains against rule breaking commands & intents. We even used an `AndSpecification<>` to compose our specifications. you can build your own compositions as well using [these](https://github.com/Lutando/Akkatecture/tree/master/src/Akkatecture/Specifications/Provided). Do not over use your specifications, it is not a silver bullet, and be aware of the [criticisms](https://en.wikipedia.org/wiki/Specification_pattern#Criticisms) of specifications, finally, one should also be wary of using them outside of your domain layer. Reducing duplication also increases coupling.

Next we shall go over how to craft your own **sagas**. Which add an extra dimension of capabilities in Akkatecture.

[NEXT →](/docs/your-first-aggregate-saga)