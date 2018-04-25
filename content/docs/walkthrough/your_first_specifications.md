---
title: "Your First Specifications"
lesson: 6
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
Before we dive into how to construct aggregate sagas in Akkatecture, we are missing some crucial bits. We have laid out some fundamental building blocks, but have not put them all together. Lets do that quickly.

### Putting It All Together

We need to tell our aggregate how to handle commands, and how to handle events being recovered from its event store.

Use the `Command<T>(Func<T,bool> handler)` to register your

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
        
        //register event recovery applyers
        //Recover(...) uses the default apply
        //behaviour
        Recover<BankAccountOpenedEvent>(Recover);
        Recover<MoneySentEvent>(Recover);
        Recover<FeesDeductedEvent>(Recover);
        Recover<MoneyReceivedEvent  >(Recover);
    }
}
```

Lets do our Command Handlers
```csharp
public bool Execute(OpenNewAccountCommand command)
{
    //this spec is part of Akkatecture
    var spec = new AggregateIsNewSpecification();
    if(spec.IsSatisfiedBy(this))
    {
        var aggregateEvent = new BankAccountOpened(command.OpeningBalance)
        Emit(aggregateEvent);
    }

    return true;
}
```

> We return true from the execute method, to let akka know that we did not handle the command.

To be able to send money the business requirements specified *The transaction fee for a successful money deposit is €0.25. The minimum amount of money allowed to transfer is €1.00. Which means that the minimum amount of money allowed to exit a bank account is €1.25*. 

```csharp
public class MinimumTransferAmountSpecification : Specification<Account> 
{
    protected override IEnumerable<string> IsNotSatisfiedBecause(Account obj)
    {
        if (obj.State.Balance.Value < 1.00)
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

Now we can do our command handler for `TransferMoneyCommand`.
```csharp
public bool Execute(TransferMoneyCommand command)
{
    var balanceSpec = new EnoughBalanceAmountSpecification();
    var minimumTransferSpec = new MinimumTransferSpecification();
    var andSpec = new AndSpecification(balanceSpec,minimumTransferSpec);
    if(andSpec.IsSatisfiedBy(this))
    {
        var sentEvent = new MoneySentEvent(command.DestinationId, command.Amount)
        Emit(sentEvent);

        var feeEvent = new FeesDeductedEvent(new Money(0.25m));
        Emit(feeEvent);
    }
    return true;
}
```

> We have a command that actually produced two events as the outcome. This is quite normal and a will happen from time to time. One command does not necessarily mean one event. Transfering money reduces the account balance and charges a fee. For auditing purposes this is a good thing to have.

And finally we need to handle the receiving of money from `ReceiveMoneyCommand`.

```csharp
public bool Execute(ReceiveMoneyCommand command)
{
    var moneyReceived = new MoneyReceivedEvent(command.Amount)

    Emit(moneyReceived);
    return true;
}
```

### Summary

We codified our business specifications into models that derive from `Specification<>`. This allows us to have testable specifications that live in one place. We used the specifications to guard our domains against rule breaking commands & intents. We even used an `AndSpecification<>` to compose our specifications. you can build your own compisions as well. Do not over use your specifications, it is not a silver bullet, also be wary of using them outside of your domain layer. Reducing duplication also increases coupling.