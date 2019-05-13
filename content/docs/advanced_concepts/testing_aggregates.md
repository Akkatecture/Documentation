---
title: "Testing Aggregates"
lesson: 6
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
One of the biggest benefits of event sourcing above domain driven design using a CQRS pattern is that it is possible to express tests purely in terms of events and commands. In a domain driven design point of view this means that it is possible to test an aggregate root as expressed by a behaviour driven development style fixture as follows:

For AggregateRoot `a`
Given Command `c`
Expect `a` to Emit Event `e`

With this kind of testing based on events and commands, you can have clear meaning to the domain expert or business owner. Not only does this mean that tests expressed in terms of Events and Commands have a clear functional meaning, it also means that they hardly depend on any implementation choices.

Akkatecture has a companion test package, called [Akkatecture.TestFixture](https://www.nuget.org/packages/Akkatecture.TestFixture/) that enables test driven developers to write fluent tests against aggregate roots. Initially only support for testing aggregate roots is available.


```csharp
public void RigisteringUser_UsingRegisterCommand_ShouldEmitRegisteredEvent()
{
    var userId = UserId.New;

    this.FixtureFor<User, UserId>(userId)
        .GivenNothing()
        .When(new RegisterUserCommand(userId))
        .ThenExpect<UserRegisteredEvent>(x => x.RegisteredAt <= DateTime.UtcNow);
}
```

> The given-when-then test fixture defines three stages: configuration, execution and validation. Each of these stages is represented by a different interface: `IFixtureArranger<,>`, `IFixtureExecutor<,>` and `IFixtureAsserter<,>`, respectively. The static `FixtureFor<,>()` extension method extends the akka.net's `TestKit`. This `FixtureFor<,>()` method is the entry point for writing your tests.

The unit of testing here is the aggregate root, `this.FixtureFor<,>` is meant to test one aggregate root only. Which means that all commands, events, and snapshots that eminate to and from this unit under test is all for the same aggregate root. In other words, all of those message types are bound to the same `aggregateId`.

# Configuration Stage

In the configuration stage, you may configure the fixture in one of four ways:

1) Configure with no initialization using `GivenNothing()`
2) Configure with journalled events using `Given(IAggregateEvent<,>[] events)`
3) Configure with stored snapshot using `Given(IAggregateSnapshot<,> snapshot)`
4) Configure with commands using `Given(ICommand<,>[] commands)`

> The event journal and snapshot stored used will typically be the inmemory version as is the default, which is fine for unit tests.

# Execution Stage

The execution stage only allows for 2 ways to //continue from here lutando

> In the future support for testing aggregate sagas will also be supported