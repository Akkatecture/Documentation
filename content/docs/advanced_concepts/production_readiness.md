---
title: "Production Readiness"
lesson: 4
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
There actually is a long laundry list of things one might want to consider prior to deploying to production. Remember, now that we are using persisted events as the fundamental elements to hydrating our domain, we need to pay special attention to how we persist them.

# Event Store
Since events stored per aggregate are read in a paginated way, it makes sense to chose a persistence that supports this kind of query well. SQL data bases are fine also, just make sure you do not ship with the defaul akka inmemory persistence plugin. As you can see there are many plugins ([1](https://github.com/AkkaNetContrib/Akka.Persistence.MongoDB),[2](https://github.com/AkkaNetContrib/Akka.Persistence.PostgreSql),[3](https://github.com/AkkaNetContrib/Akka.Persistence.RocksDb),[4](https://github.com/akkadotnet/Akka.Persistence.SqlServer)). Doing some research here is crucial to match your needs.

# Testing
Test all your models to make sure that they are serializable and deserializable. This will give you good assurances on production usage, especially in clustered scenarios.

# Clustering Seed Node
This is applicable to those who plan to deploy in a clustered environment. It would be most advantageous if you had a seed node in your cluster to facilitate the cluster gossip. 1 or more well known addresses that can be used. In windows, [Lighthouse](https://github.com/petabridge/lighthouse) attempts to help you out here by hosting the seed as a windows service and exposing the required ports. Our clustered example seed [here](https://github.com/Lutando/Akkatecture/tree/master/examples/cluster), is actually good enough for many scenarios, the seed node need not even play a part in your applications deployment considerations. The seed is a statically located akka actor system, part of a cluster, that can speak the same gossip language as your worker/client actor system.

