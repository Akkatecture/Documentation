---
title: "2019 Futurespective"
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "19/01/2019"
category: "tech"
type: "post"
tags: []
---

Akkatecture has just completed its Snapshot story on release [0.4.0](https://github.com/Lutando/Akkatecture/releases/tag/release%252F0.4.0). With this feature, you can optimise your aggregates during the initial load to speed up aggregate responsiveness. Snapshotting is not at all a new concept but this should give you a few options on how to reduce the load time of your aggregates.

In 2019 Akkatecture will implement resumable projections, a resumable projection (or readmodel) is a smart type of projection that is built up from the event event stream that is durable between deployments. Essentially Akkatecture will give you some APIs that will take care of the underlying mechanisms for you. Like in the [akka.net documentation](https://getakka.net/articles/persistence/persistence-query.html#resumable-projections), a resumable projection is a projection that can be built up from any point in your event journal (the beginning, or offset x). It is quite common practice to rebuild your projections from scratch between deployments, especially if your event journals are not unbeleivebly long.

Another goal of 2019 is to have Akkatecture get battle tested in more production environments. As of now, some members of the community are using it in hobby projects with great success.

Don't forget to join the [Discord](/community) community if you have any questions or are looking for ways to contribute. We always appreciate the help. 😊