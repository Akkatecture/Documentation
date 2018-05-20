---
title: "Your First Read Models"
lesson: 8
chapter: 3
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - walkthrough
    - akkatecture
    - readmodels
    - csharp
    - dotnet
---
If you ever need to access the data in your aggregates efficiently, its important that read models (otherwise known as projections) are used from some form of persistent store. Loading aggregates from the event store takes time and its impossible to do queries for e.g. aggregates that have a specific value in its state. Read models can be described to be a representation of some state in your domain.

Akkatecture has no opinions about how to make read models. since they are just essentially data transfer objects for projections. It is up to you to decide what is best read model for the underlying persistence at hand.

For the purposes of the walkthrough our read model needs to at least return how much revenue the bank has earned, this cane be modelled as followed:

```csharp
//Walkthrough.Domain/Repositories/Revenue/ReadModels/RevenueReadModel.cs
public class RevenueReadModel
{
    public Money Revenue { get; }
    public int Transactions { get; }

    public RevenueReadModel(Money revenue, int transactions)
    {
        Revenue = revenue;
        Transactions = transactions;
    }
}
```
> The `int:Transactions` is purely there for extra flavour.

Our simple query model for retreiving the revenue could be as follows.

```csharp
//Walkthrough.Domain/Repositories/Revenue/Queries/GetRevenueQuery.cs
public class GetRevenueQuery
{        
}
```

## A Note On ReadModels and QueryModels

Queries are just like commands in a way that they model the intent to get something done, the only difference between a query and a command is that a query is an intent to get information. In your application you can model this around any persistent library.

[Next →](/docs/walkthrough-ending)