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
One of the biggest benefits of message based systems  is that it is possible to express behaviours purely in terms of message inputs and message outputs. In the context of domain driven design this means that all domain activity can be expressed in terms of commands and events. If we focus on to aggregate roots, an important abstraction in domain driven design, we could formulate message based tests as expressed in a behaviour driven development style as follows:

```
1 - For AggregateRoot A
2 - Given Command C
3 - A Should Emit Event E
```

With this kind of testing based on events and commands, you can have clear meaning to the domain expert or business owner. Not only does this mean that tests expressed in terms of Events and Commands have a clear functional meaning, it also means that they hardly depend on any implementation choices.

Akkatecture has a companion test package, called [Akkatecture.TestFixture](https://www.nuget.org/packages/Akkatecture.TestFixture/) that enables test driven developers to write fluent tests against aggregate roots. Initially only support for testing aggregate roots is available.


```csharp
public class UserAggregateTests : TestKit 
{
    public void RegisteringUser_UsingRegisterCommand_ShouldEmitRegisteredEvent()
    {
        var userId = UserId.New;

        this.FixtureFor<User, UserId>(userId)
            .GivenNothing()
            .When(new RegisterUserCommand(userId))
            .ThenExpect<UserRegisteredEvent>(x => x.RegisteredAt <= DateTime.UtcNow);
    }
}
```

> The given when then test fixture defines three stages: configuration, execution and validation. Each of these stages is represented by a different interface: `IFixtureArranger<,>`, `IFixtureExecutor<,>` and `IFixtureAsserter<,>`, respectively. The static `FixtureFor<,>()` extension method extends the akka.net's `TestKit`. This `FixtureFor<,>()` method is the entry point for writing your tests.

The unit of testing here is the aggregate root, `this.FixtureFor<,>` is meant to test one aggregate root only. Which means that all commands, events, and snapshots that eminate to and from this unit under test is all for the same aggregate root. In other words, all of those message types are bound to the same `aggregateId`.

# Configuration Stage

In the configuration stage, you may configure the fixture in one of four ways:

1) Configure with no initialization using `GivenNothing()`
2) Configure with journalled events using `Given(IAggregateEvent<,>[] events)`
3) Configure with stored snapshot using `Given(IAggregateSnapshot<,> snapshot)`
4) Configure with commands using `Given(ICommand<,>[] commands)`

> The event journal and snapshot stored used will typically be the inmemory version as is the default, which is fine for unit tests.

# Execution Stage

The execution stage can be executed in one of two ways, the most important of which is:

1) Execute by sending command(s) using `When(ICommand<TAggregate, TIdentity>[] commands)`
2) When youre in a validation stage and want to go back to an execution stage, use `AndWhen(ICommand<TAggregate, TIdentity>[] commands)`

> The second method will be explained further on in the documentation

# Validation Stage

The validation stage tests the output of your aggregate root after an execution stage has been executed.

1) Validate the emitted domain event by virtue of a predicate using `ThenExpect<TAggregateEvent>(Predicate<TAggregateEvent> aggregateEventPredicate)`
2) Validate the emitted aggregate event portion of the domain event by virtue of a predicate using `ThenExpect<TAggregateEvent>(Predicate<IDomainEvent> domainEventPredicate)`
3) Validate the `Reply(...)` message of an aggregate root by using `ThenExpectReply<TReply>(Predicate<TReply> aggregateReply)`

# Testing Chained Behaviours

There might come times when you need to test out behavioural flows which are the result of multiple independant commands. To enable this you need to be able to go from the validation stage into the execution stage seemlessly. Lets say that we have a business rule that says, once a user is registered, if that user validates their email, they only can then add 2 factor authentication to their account. If we wanted to test this domain rule we could set up a fixture like this:

```csharp
//example 1
public void RegisteredUser_CanAdd2FAuthAfterValidatingEmail_ShouldEmit2FAuthAddedEvent()
{
    var userId = UserId.New;

    this.FixtureFor<User, UserId>(userId)
        .Given(new UserRegisteredEvent())
        .When(new ValidateEmailCommand(userId, email))
        .ThenExpect<EmailValidatedEvent>()
        .AndWhen(new Add2FAuthenticationCommand())
        .ThenExpect<2FAuthenticationAddedEvent>()
}
```

This fixture can also be tested the following way:

```csharp
//example 2
public void RegisteredUser_CanAdd2FAuthAfterValidatingEmail_ShouldEmit2FAuthAddedEvent()
{
    var userId = UserId.New;

    this.FixtureFor<User, UserId>(userId)
        .Given(new UserRegisteredEvent(userId), new EmailValidatedEvent(userId, email))
        .When(new Add2FAuthenticationCommand())
        .ThenExpect<2FAuthenticationAddedEvent>()
}
```

The difference between the first example and the second example is that the first example also tests the business rules when it comes to validating emails. The second example does not because it is given that the email has been validated by the virtue of it already being journalled in the fixtures event journal.

>For some examples of how some of these tests may look like, check out the tests in the [test project](https://github.com/Lutando/Akkatecture/blob/master/test/Akkatecture.Tests/UnitTests/Aggregates/AggregateTestsWithFixtures.cs). In the future support for testing aggregate sagas will also be supported.