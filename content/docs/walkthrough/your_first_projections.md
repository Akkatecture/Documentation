---
title: "Your First Projections"
lesson: 9
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
If you ever need to access the data in your aggregates efficiently, in production, its important that projections (otherwise known as read models) are used from some form of persistent store. Loading aggregates from the event store takes time, and its impossible to do queries for e.g. aggregates that have a specific value in its state. Projections are typically derived partially or mostly by the events stored in the event journal.

> Akkatecture has no opinions about how to make projections yet. since they are just essentially data transfer objects for projections. In the future Akkatecture will ship with a story that deals with durable projections that can be rebuilt or resumed on application start up.

For the purposes of the walkthrough our projection will  needs to at least return how much revenue the bank has earned, this can be modelled as followed:

```csharp
//Walkthrough.Domain/Repositories/Revenue/Projections/RevenueProjection.cs
public class RevenueProjection
{
    public Money Revenue { get; }
    public int Transactions { get; }

    public RevenueProjection(
        Money revenue,
        int transactions)
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

## A Note On Projections and QueryModels

Queries are just like commands in a way that they model the intent to get something done, the only difference between a query and a command is that a query is an intent to get information. In your application you can model this around any persistent library. A final note is that projections need not only be for reading data from a persistent store.

[Next →](/docs/walkthrough-ending)
