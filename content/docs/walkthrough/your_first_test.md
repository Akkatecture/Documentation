---
title: "Your First Aggregate Test"
lesson: 6
chapter: 3
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - walkthrough
    - akkatecture
    - tdd
    - bdd
    - testing
    - csharp
    - dotnet
---

Any business application, especially one that deals with money, has to be rigorously tested. In our use case this means testing the aggregates to see if they behave as we intend them to. Akkatecture has a companion test package called `Akkatecture.TestFixture` that gives test developers the tools to write fluent and easy to read tests


Create an XUnit2 test project under `/test/Domain.Tests` and add the [Akkatecture.TestFixture](https://www.nuget.org/packages/Akkatecture.TestFixture/) package to the project. Also add the [Akka.TestKit.XUnit2](https://www.nuget.org/packages/Akka.TestKit.Xunit2/) package to your project. You can easily use other dotnet testing frameworks but then you need to choose the correct corresponding companion package for `Akka.TestKit.*`. Now we can write a simple test for our first command.

Below is an example of how a test should look like. We have a class that derives from `TestKit` which gives us the ability to do testing in the underlying akka.net actor system

```csharp
//test/Domain.Tests/AccountTests.cs
public class AccountTests : TestKit
{
    [Fact]
    public void WhenOpenAccountCommand_ShouldEmitAccountOpen()
    {
        var accountId = AccountId.New;
        var money = new Money(50.1m);

        this.FixtureFor<Account, AccountId>(accountId)
            .GivenNothing()
            .When(new OpenNewAccountCommand(accountId, money))
            .ThenExpect<AccountOpenedEvent>(x => x.OpeningBalance == money);
    }
}
```

The scenario above, tests the first command `OpenNewAccountCommand`, remember. The test has a clear goal, to see if the aggregate does what we expect it to do. In normal speak this is what the scenario is describing

```
0 - For an Account aggregate with Id = accountId
1 - Given no prior activity
2 - When sent OpenNewAccountCommand
3 - Then expect AccountOpenedEvent to be emitted
```

We also need to test to see if money transferring works this one is a bit more involved but lets do it:

```csharp
[Fact]
public void GivenAccountIsOpened_WhenTransferIsCommanded_ShouldEmitAccountOpen()
{
    var accountId = AccountId.New;
    var receiverAccountId = AccountId.New;
    var openingBalance = new Money(20.3m);
    var transferAmount = new Money(10.98m);
    var transactionId = TransactionId.New;
    var transaction = new Transaction(transactionId, accountId, receiverAccountId, transferAmount);

    this.FixtureFor<Account, AccountId>(accountId)
        .Given(new AccountOpenedEvent(openingBalance))
        .When(new TransferMoneyCommand(accountId, transaction))
        .ThenExpect<MoneySentEvent>(x => x.Transaction == transaction)
        .ThenExpect<FeesDeductedEvent>(x => x.Amount.Value == 0.25m);
}
```

We can describe the test scenario above as follows:

```
0 - For an Account aggregate with Id = accountId
1 - Given that it has AccountOpenedEvent
2 - When sent TransferMoneyCommand
3 - Then expect MoneySentEvent to be emitted
4 - And Then expect FeesDeductedEvent to be emitted
```

The test project can be found in the walkthrough repository [test](https://github.com/Akkatecture/Walkthrough/blob/master/test/Domain.Tests/AccountTests.cs) folder.

The `ReceiveMoneyCommand` can be tested as an excersize to the reader. More information about the testing can be found in the [testing](/docs/testing-aggregates) section of the documentation.


Next we shall go over how to craft your own **sagas**. Which add an extra dimension of capabilities by allowing you to do cross aggregate message coordination.

[Next →](/docs/your-first-aggregate-saga)

