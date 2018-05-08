---
title: "Getting Started"
lesson: 1
chapter: 1
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - getting-started
    - akkatecture
    - csharp
    - dotnet
---

<img src="https://raw.githubusercontent.com/Lutando/Akkatecture/master/logo.svg?sanitize=true" width="100%" height="200">

### Welcome to Akkatecture

Adding Akkatecture as a dependancy is like as installing any other NuGet package in your .net core application. All you need to do is the following:
```csharp
//Add the Akkatecture package to your project named MyFirstActorProject.
PM> Install-Package Akkatecture -ProjectName MyFirstActorProject
```
or
```csharp
dotnet add package Akkatecture
```
Once youve done that you can start designing your domain that can allow you to do something like what is shown below:

```csharp
//Create actor system
var system = ActorSystem.Create("useraccount-example");

//Create supervising aggregate manager for UserAccount aggregate root actors
var aggregateManager = system.ActorOf(Props.Create(() => new UserAccountAggregateManager()));

//Build create user account aggregate command with name "foo bar"
var aggregateId = UserAccountId.New;
var createUserAccountCommand = new CreateUserAccountCommand(aggregateId, "foo bar");
            
//Send command, this is equivalent to command.publish() in other cqrs frameworks
aggregateManager.Tell(createUserAccountCommand);
```

> This example is part of the Akkatecture simple example [project](https://github.com/Lutando/Akkatecture/tree/master/examples/simple), checkout [the
code](https://github.com/Lutando/Akkatecture/blob/master/examples/simple/Akkatecture.Examples.UserAccount.Application/Program.cs#L13) and give it a run to see how it works.

Be sure to also go through our [basic concepts](/docs/primitives) and [walkthrough](/docs/walkthrough-introduction). If you have any suggestions, or edits for Akkatecture's documentation, please visit the [documentation repository](https://github.com/Akkatecture/Documentation) and submit us a pull request 😊.