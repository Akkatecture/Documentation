---
title: "Configuration"
lesson: 8
chapter: 2
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - basic-concepts
    - akkatecture
    - csharp
    - dotnet
---
Akkatecture does not have any of its own configuration points as of yet. Akkatecture will use the same configuration methodology as akka using [hocon](http://getakka.net/articles/concepts/configuration.html).

To ensure that your actors have a high degree of ownership, try and limit the amount of managed resources that you pass into an actor. 

Rather have actors create the `I/O` resources that they need to function, rather than relying on a managed resource passed into the actor via an external thread. Conceptually, actors should be "isolated" and self sufficient units of computation.

**instead of doing this**
```csharp
var node = new Uri("http://search.akkatecture.net:8082/data");
var config = new ConnectionConfiguration(node);
var client = new ElasticsearchClient(config);
var searchActor = system.ActorOf(Props.Create(() => new SearchActor(client)));
```
**do this**
```csharp
var node = new Uri("http://search.akkatecture.net:8082/data");
var searchActor = system.ActorOf(Props.Create(() => new SearchActor(node))); 
```

**or do this**
```csharp
public class SearchActor : ReceiveActor
{
    public ElasticsearchClient SearchClient {get;set;}
    public SearchActor()
    {
        //grab Uri string from hocon
        var uriString = Context.System.Settings.Config.GetString("myapplication.elasticsearch.uri");
        var node = new Uri(uriString);
        var config = new ConnectionConfiguration(node);
        var client = new ElasticsearchClient(config);
        SearchClient = new ElasticsearchClient(config);
    }
}
```

> All three examples above are esentially equivalent in functionality. Why the last two examples are better than the first one is because of two reasons. Firstly, `ElasticsearchClient()` might be unserializable (and probably is), so doing remote deploys with an actor that has a construction signature like this will surely fail. Secondly, passing in a managed resource from outside of the actors creation 'scope' can result in some unwanted behaviour if that resource gets killed without the actor knowing. The last two examples guarantee that this is not possible, since the actor is given the information required to build the resource that they need to function