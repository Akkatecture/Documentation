---
title: "Getting Started"
lesson: 1
chapter: 1
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "lesson"
tags:
    - getting-started
    - akkatecture
    - csharp
    - dotnet
---

Akkatecture is set of constructs and patterns written in C# ontop of akka.net. The main goal of Akkatecture is to allow developers who are using akka.net to model their business domain within the akka.net framework easily. Akkatecture is built on messaging & event based mode of operation, making it highly reactive and scalable. Akkatecture focusses on messaging and domain driven design integration patterns between domain entities within an akka actor system to make developing distributed domain driven design applications easier.

Akkatecture uses the actor model as the universal primitive of concurrent computation. This means that aggregates, sagas, and other domain concepts are modelled within the actor model. Invoking or interacting with the domain is done by having these actors either react through commands (sent from outside of the aggregate boundary), or through domain events, emitted from within the domain boundary, both of which are fundamentally messages. A strong case can be made for using the actor system as a basis for designing your distributed domain, because actors in actor systems embody 3 things fundamentally:

1. **Processing** - actors can do work when requested to, the requested work can be initiated by a message, typically in the form of a command or an event, the locality of this processing is done within the instantiation of an actor itself.
2. **Storage** - actors can store local internal state, in memory, and defer storing its state to persistence. This state is also thread safe from anything outside of the actors locality since actors process one message at a time and cannot be inspected by normal means.
3. **Communication** - actors can communicate with each other using a pre-defined communication protocol. Typically addressed by using location transparent actor addresses. Actors communicate with message passing and that is the only way that the outside world can communicate with the actor system. Messages beign commands, or events.

The actor model in computer science is a mathematical model of concurrent computation that treats "actors" as the universal primitives of concurrent computation. In response to a message that it receives, an actor can: make local decisions, create more actors, send more messages, and determine how to respond to the next message received. Actors may modify their own private state, but can only affect each other through messages (avoiding the need for any defining of critical sections, or wierd mutexs).

Akka based systems have been used to drive hugely scalable and highly available systems (such as Netflix and The Guardian). Even though these companies tend to run into issues at scale on a daily basis, I still see value in modelling the business domain using actors since (with some haggling), they are quite descriptive of what actually happens in the real world.

[//]: # (TODO LINK)
Please have a look at our documentation, go through the basic concepts, and the walkthroughs to get a good understanding of what akkatecture looks like. Akkatecture is intended for developers who understand cqrs / event sourcing. Knowledge of akka.net will give you more knowledge on how to extend Akkatecture through akka's highly extensible configuration.

### Status of Akkatecture

Akkatecture is still currently in development, however most of the basic building blocks have been built out, but as of yet no v1 to speak of on NuGet.

The next plan is to work on the current core library and branch it out to support clustered deployment scenarios.