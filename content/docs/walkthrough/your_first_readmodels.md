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
Akkatecture has no opinions about how to make read models. since they are just essentially data transfer objects for projections. It is up to you to decide what is best read model for the underlying persistence at hand.

```csharp
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

Our simple query model for retreiving the revenue.

```csharp
public class GetRevenueQuery
{        
}
```

## A Note On ReadModels and QueryModels

Queries are just like command in a way that they model the intent to get something done, the only difference between a query and a command is that a query is an intent to get information. In your application you can model this around any persistent library.