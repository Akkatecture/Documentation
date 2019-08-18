---
title: "Configuration"
lesson: 9
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
Akkatecture uses the same configuration hooks as akka.net's [hocon](http://getakka.net/articles/concepts/configuration.html) configuration file type. Where as akka.net uses the `akka{}` key as its own dedicated namespace in the hocon, Akkatecture uses `akkatecture{}` namespace. The Akkatecture configuration and documentation (with the defaults) are designated within the project's reference configuration file [here](https://github.com/Lutando/Akkatecture/blob/master/src/Akkatecture/Configuration/reference.conf). Have a read over these configuration items and their comments.

In `Akkatecture.Cluster` there is a default configuration that ships with the package. It establishes sane (and opinionated) defaults for clustered scenarios. you can find the default `akka.cluster` and `akka.remote` and `akka.actor` configurations that ship with the package [here](https://github.com/Lutando/Akkatecture/blob/master/src/Akkatecture.Clustering/Configuration/default.conf).


### Considerations

If you notice. The main Akkatecture configuration reference is littered with feature switches for each domain construct that exists in Akkatecture. Turning them off will require you to add more code to your solution to take control of your requirements. Since Akkatecture is a framework that does much for you behind the scenes, if you turn feature switches off, you will need to compensate for it, with handlers or subscribing to events. As with most frameworks, the more barebones you go, the more control you have, at the cost of you having to implement your own custom requirements. Remember Akkatecture is just akka.net under the hood anyways. So feel free to "bust out" of the Akkatecture framework when you see the need to.

> We highly recommend that you consider going through the [walkthrough](/docs/walkthrough-introduction) of Akkatecture which will have you building a solution based on some requiremets.
