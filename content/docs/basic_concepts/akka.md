---
title: "Akka"
lesson: 7
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
Actors in the [actor model](https://en.wikipedia.org/wiki/Actor_model) are objects which encapsulate state and behavior, they communicate exclusively by exchanging messages which are placed into the recipient’s mailbox. The actor model encompasses Alan Kay's original thoughts on what [object oriented programming ought to be](http://wiki.c2.com/?AlanKaysDefinitionOfObjectOriented). Actors embody three basic principles:

* Processing
* Storage
* Communication

While modeling solutions with actors, it is beneficial to envision a group of people who could be assigned sub-tasks, each human knows precisely how well to execute these sub tasks. These people are rranged into their, functions and by in large into an organizational structure. Think about how to escalate failure to supervisors when things go bad. The result of organising your solution space in this way can conjure up some interesting models to solve problems. One actor by itself is not very useful, however many actors working with a common purpose can be rather fruitful.

Akka.net is just an implementation of an actor sytem that fascilitates the actor model. Go to [akka.net](https://getakka.net/)'s website to get familiar with their implementation of the actor model. To use Akkatecture even more effectively, we suggest that you go on further and complete the [petabridge akka bootcamp](https://github.com/petabridge/akka-bootcamp). It is a good way to get a solid understanding of akka.net, and how it works.

[Next, Configuration →](/docs/configuration)