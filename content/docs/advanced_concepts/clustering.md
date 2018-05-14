---
title: "Clustering"
lesson: 3
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
To get clustering working in Akkatecture, you need to  install its companion package to Akkatecture called `Akkatecture.Clustering`. This library includes some factories to get your distributed domain going, without doing any changes to your domain code (as it should be). To install the NuGet package from package manager command prompt:

```csharp
//Add the Akkatecture.Clustering package to your project named FirstAkkatectureProject.
PM> Install-Package Akkatecture.Clustering -ProjectName FirstAkkatectureProject
```

To start an aggregate manager in a clustered environment, you need to use the `ClusterFactory<,,>.StartAggregateCluster(...)` method as follows:

```csharp
//on worker node
var userAccountAggregateManagerCluster = ClusterFactory<UserAccountAggregateManager, UserAccountAggregate, UserAccountId>
    .StartAggregateCluster(actorSystem);
```
The above method invocation will start the actual cluster on that particular node, in addition to returning an `IActorRef`. It is usually suitable to do this on beefy worker nodes which are responsible for carrying out the more intense calculations of your application.

To start a proxy to the aggregate manager in a clustered environment, you need to use the `ClusterFactory<,,>.StartAggregateClusterProxy(...)` method as follows:
```csharp
//on clientside node
var userAccountAggregateManagerProxy = ClusterFactory<UserAccountAggregateManager, UserAccountAggregate, UserAccountId>
    .StartAggregateClusterProxy(actorSystem, proxyRoleName);
```
This will start a proxy into a `userAccountAggregateManagerCluster`. The reference returned by this factory method is a reference to the actual cluster. One would typically proxy commands into a cluster from a client application (api or console or desktop app). All commands for that aggregate manager sent through that proxy reference will be sharded accordingly.

Similarly, to start an aggregate saga manager in a clustered environment, use the `ClusterFactory<,,,>.StartAggregateSagaCluster(...)` to instantiate the saga manager:

```csharp
//on worker node
ClusterFactory<MoneyTransferSagaManager, MoneyTransferSaga, MoneyTransferSagaId, MoneyTransferSagaLocator>
    .StartAggregateSagaCluster(actorSystem,moneyTransferSagaFactory, proxyRoleName);
```

We usually do not need to get a reference to proxy into the aggregate saga manager because they are invoked through domain events. If you instantiate a saga cluster on the worker that would be enough.

Clustering is a huge concept with many moving parts, in the meantime, refer to the akka.net documentation on clustering if you want more configuration power. If you want to see a working Akkatecture clustering sample, have a look at the [cluster sample](https://github.com/Lutando/Akkatecture/tree/master/examples/cluster) Which makes use of `Akkatecture.Cluster` factory methods.

Expect more comprehensive documentation moving forward.