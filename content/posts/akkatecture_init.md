---
title: "Akkatecture Init"
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/06/2018"
category: "tech"
type: "post"
tags: []    
---

Akkatecture began because I found the lack of good domain driven design examples for akka.net quite alarming. There are a few examples out there if you look hard enough but they fail in one or two aspects that I find really important. I suspect that most akka users are the ones on the JVM side of the fence, which shows by the higher amount of community members in that open source project. Ok, onwards to Akkatecture, and why I decided to build it. I really like the APIs that ReceiveActors and ReceivePersistentActors expose as opposed to their base variants. I find the APIs to be far more cleaner and geared towards a better functional programming paradigm, which can lead to code that is more readable, testable, and maintainable. Although nothing is perfect. Akkatecture tries to make your domain semi-declarative and at least highly readable and maintainable. I also found myself doing 'pattern-y' things when designing my domains. So instead why not make a generic host of libraries that wrap around akka.net, to make my life easier?

Akkatecture is set of constructs and patterns written in C# ontop of akka.net. The main goal of Akkatecture is to allow developers who are using akka.net to model their business domain within the akka.net framework easily. Akkatecture is built on messaging & event based mode of operation, making it highly reactive and scalable, thanks akka.net! Akkatecture focusses on messaging and domain driven design integration patterns between domain entities within an akka actor system to make developing distributed domain driven design applications easier.

Akkatecture uses the actor model as the universal primitive of concurrent computation. This means that aggregates, sagas, jobs, and other domain concepts are modelled within the actor model. Invoking or interacting with the domain is done by having these actors either react through commands (sent from outside of the aggregate boundary), or through domain events, emitted from within the domain boundary, both of which are fundamentally messages. A strong case can be made for using the actor system as a basis for designing your distributed domain, because actors in actor systems embody 3 things fundamentally:

**Processing** - actors can do work when requested to, the requested work can be initiated by a message, typically in the form of a command or an event, the locality of this processing is done within the instantiation of an actor itself.

**Storage** - actors can store local internal state, in memory, and defer storing its state to persistence. This state is also thread safe from anything outside of the actors locality since actors process one message at a time and cannot be inspected by normal means.

**Communication** - actors can communicate with each other using a pre-defined communication protocol. Typically addressed by using location transparent actor addresses. Actors communicate with message passing and that is the only way that the outside world can communicate with the actor system. Messages beign commands, or events.
The actor model in computer science is a mathematical model of concurrent computation that treats "actors" as the universal primitives of concurrent computation. In response to a message that it receives, an actor can: make local decisions, create more actors, send more messages, and determine how to respond to the next message received. Actors may modify their own private state, but can only affect each other through messages (avoiding the need for any defining of critical sections, or wierd mutexs).

Akka based systems have been used to drive hugely scalable and highly available systems (such as Netflix and The Guardian). Even though these companies tend to run into issues at scale on a daily basis, I still see value in modelling the business domain using actors since (with some haggling), they are quite descriptive of what actually happens in the real world.

Please have a look at our documentation, go through the basic concepts, and the walkthroughs to get a good understanding of what akkatecture looks like. Akkatecture is intended for developers who understand cqrs / event sourcing. Knowledge of akka.net will give you more knowledge on how to extend Akkatecture through akka's highly extensible configuration. In my opinion its highly required to be comfortable with these things in order to use Akkatecture effectively

Please find me on [Discord](/community) or [file GitHub issues](https://github.com/Lutando/Akkatecture/issues) for any questions, guidance, or support-y stuff 👋.

### Status of Akkatecture
Akkatecture is still currently in development, however most of the basic building blocks have been built out, but as of yet no v1 to speak of on NuGet.

The next plan is to work on the current core library and branch it out to support:

* clustered deployment scenarios.
* configuration strategy.
* typed actor references(opt in?)*.
* event upgrading.

**nice-to-have features, not crucial and might be axed for first version*

Some of the issues highlighted above can be seen [here](https://github.com/Lutando/Akkatecture/issues). However I plan to knock these off 1 by 1 and launch the first beta by June.