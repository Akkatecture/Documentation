---
title: "Clustering"
lesson: 2
chapter: 4
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - advanced-concepts
    - akkatecture
    - csharp
    - dotnet
---
To get clustering working in Akkatecture, you need to  install its companion package to Akkatecture called `Akkatecture.Clustering`. This library includes some factories to get your distributed domain going, without doing any changes to your domain code (as it should be). To install the package in package manager

```csharp
//Add the Akkatecture.Clustering package to your project named FirstAkkatectureProject.
PM> Install-Package Akkatecture.Clustering -ProjectName FirstAkkatectureProject
```

To start an aggregate manager in a clustered environment all you need to do is the following:

```csharp
ClusterFactory<UserAccountAggregateManager, UserAccountAggregate, UserAccountId>
    .StartAggregateCluster(actorSystem);
```

To start a proxy to the aggregate manager all you need to do is:

```csharp
ClusterFactory<UserAccountAggregateManager, UserAccountAggregate, UserAccountId>
    .StartAggregateClusterProxy(actorSystem, proxyRoleName);
```

Similarly, to start an aggregate saga manager in a clustered environment:

```csharp
ClusterFactory<MoneyTransferSagaManager, MoneyTransferSaga, MoneyTransferSagaId, MoneyTransferSagaLocator>
    .StartAggregateSagaCluster(actorSystem,moneyTransferSagaFactory, proxyRoleName);
```

We usually do not need to proxy into the aggregate saga manager because they 


Clustering is a huge concept with many moving parts, so for now refer to the akka.net documentation on clustering since that is basically what you need to get started. If you want to see a working Akkatecture clustering sample, have a look at the [cluster sample](https://github.com/Lutando/Akkatecture/tree/master/examples/cluster) Which makes use of `Akkatecture.Cluster` factory methods.

Expect more comprehensive documentation moving forward.