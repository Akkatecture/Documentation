---
title: "Welcome"
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "15/05/2018"
category: "tech"
type: "post"
tags: []    
---

Akkatecture began because I found that the lack of comprehensive cqrs and es examples for akka.net was a huge oppertunity to help others. I suspect that most akka users, are the ones on the JVM side of the fence, which shows by the higher amount of community members in that open source project. Ok... onwards onto what is Akkatecture pholosophically, and why I decided to build it.

Akkatecture is set of constructs and patterns written in C# ontop of akka.net. The main goal of Akkatecture is to allow developers who are using akka.net to model their business domain within the akka.net framework with less friction. Akkatecture is built on reactive messaging & treats events as first class concept, making it highly scalable, thanks akka.net! Akkatecture focusses mainly on messaging integration patterns within your domain so that you dont have to.

Akkatecture uses the actor model as the universal primitive of concurrent computation. This means that aggregates, sagas, jobs, and other domain concepts are modelled within the actor model. Invoking or interacting with the domain is done by having these actors either react through commands (sent from outside of the aggregate boundary), or through domain events, emitted from within the domain boundary, both of which are fundamentally messages. A strong case can be made for using the actor system as a basis for designing your distributed domain, because actors in actor systems embody 3 things fundamentally:

**Processing** - actors can do work when requested to, the requested work can only be initiated by a message, typically in the form of a command or an event, the locality of this processing is done within the instantiation of an actor itself.

**Storage** - actors can store local internal state, in memory, and defer the storing of its state to a persistent store. This state is also thread safe from anything outside of the actors locality since actors process one message at a time and cannot be inspected externally.

**Communication** - actors can communicate with each other using a pre-defined communication protocol. Typically addressed by using location transparent actor addresses. Actors communicate with message passing and that is the only way that the outside world can communicate with the actor system. Messages beign commands, or events.
The actor model in computer science is a mathematical model of concurrent computation that treats "actors" as the universal primitives of concurrent computation. In response to a message that it receives, an actor can: make local decisions, create more actors, send more messages, and determine how to respond to the next message received. Actors may modify their own private state, but can only affect each other through messages (avoiding the need for any defining of critical sections, or wierd mutexs).

Akka based systems have been used to drive hugely scalable and highly available systems (such as Netflix and The Guardian). Even though these companies tend to run into issues at scale on a daily basis, I still see value in modelling the business domain using actors since, with some haggling, they are quite descriptive and indicative of what actually happens in the real world.

Please have a look at our [documentation](/docs/getting-started), go through the [basic concepts](/docs/primitives), and the [walkthrough](/docs/walkthrough-introduction) to get a good understanding of what Akkatecture looks like.

Please find me on [Discord](/community), or [file GitHub a issue](https://github.com/Lutando/Akkatecture/issues) for any questions, guidance, or support-y stuff or just say hi👋.

### Status of Akkatecture
Akkatecture is still currently in development, however most of the basic building blocks have been built out, but as of yet no v1 to speak of on NuGet.

The next plan is to work on the current core library and branch it out to support:

* typed actor references*.
* persisted event metadata.
* snapshotting state.
* schedueled jobs

**nice-to-have features, not crucial, and might be axed for first version.*

Some of the issues highlighted above can be seen [here](https://github.com/Lutando/Akkatecture/issues). However I plan to knock these off 1 by 1 and launch the first beta by June.