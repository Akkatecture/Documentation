---
title: "Walkthrough Ending"
lesson: 10
chapter: 3
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - walkthrough
    - akkatecture
    - projections
    - csharp
    - dotnet
---
Lets tie up the loose ends so that we can run it. We need to orchestrate the startup of the actor system. Typically in Akkatecture this means instantiating:

* AggregateManagers
* AggregateSagaManagers
* DomainEventSubscribers
* Persistence Dependencies

The persistence dependencies is normally application specific. The `RevenueRepository` in this walkthrough is an implementation detail and will depend on your persistence requirements.

## Startup

We can make a method `CreateActorSystem()` that instantiates all the actors accordingly:

```csharp
//Walkthrough.Application.Program.cs
//Create actor system
var system = ActorSystem.Create("bank-system");

//Create aggregate manager for accounts
var aggregateManager = system.ActorOf(Props.Create(() => new AccountManager()),"account-manager");

//Create revenue repository
var revenueRepository = system.ActorOf(Props.Create(() => new RevenueRepository()),"revenue-repository");

//Create subscriber for revenue repository
system.ActorOf(Props.Create(() => new RevenueSubscriber(revenueRepository)),"revenue-subscriber");

//Create saga manager for money transfer
system.ActorOf(Props.Create(() =>
    new MoneyTransferSagaManager(() => new MoneyTransferSaga(aggregateManager))),"moneytransfer-saga");
```

## Example Usage

In our console application's `Main(...)` method:

```csharp
//Walkthrough.Application.Program.cs
//initialize actor system
CreateActorSystem();

//create send receiver identifiers
var senderId = AccountId.New;
var receiverId = AccountId.New;

//create mock opening balances
var senderOpeningBalance = new Money(509.23m);
var receiverOpeningBalance = new Money(30.45m);

//create commands for opening the sender and receiver accounts
var openSenderAccountCommand = new OpenNewAccountCommand(senderId, senderOpeningBalance);
var openReceiverAccountCommand = new OpenNewAccountCommand(receiverId, receiverOpeningBalance);

//send the command to be handled by the account aggregate
AccountManager.Tell(openReceiverAccountCommand);
AccountManager.Tell(openSenderAccountCommand);

//create command to initiate money transfer
var amountToSend = new Money(125.23m);
var transaction = new Transaction(senderId, receiverId, amountToSend);
var transferMoneyCommand = new TransferMoneyCommand(senderId,transaction);

//send the command to initiate the money transfer
AccountManager.Tell(transferMoneyCommand);

//fake 'wait' to let the saga process the chain of events
await Task.Delay(TimeSpan.FromSeconds(1));

Console.WriteLine("Walkthrough operations complete.\n\n");
Console.WriteLine("Press Enter to get the revenue:");

Console.ReadLine();

//get the revenue stored in the repository
var revenue = RevenueRepository.Ask<RevenueProjection>(new GetRevenueQuery(), TimeSpan.FromMilliseconds(500)).Result;

//print the results
Console.WriteLine($"The Revenue is: {revenue.Revenue.Value}.");
Console.WriteLine($"From: {revenue.Transactions} transaction(s).");

```

There we have our sample application working, congragulations for making it this far.

## In Closing

Make sure to checkout the code and run the [walkthrough](https://github.com/Akkatecture/Walkthrough). A full example can be found in the repository

Fantastic. You have finished the walkthrough. But don't stop there. Further your understanding by looking at some of the external resources that we have collected in [video](/docs/videos), and in [article](/docs/articles) form.
