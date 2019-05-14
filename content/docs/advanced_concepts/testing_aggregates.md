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
One of the biggest benefits of message based systems is that they enable the possibility to express system behaviours purely in terms of message inputs and message outputs. In the context of domain driven design this means that all domain activity can be expressed in terms of commands and events. If we focus to aggregate roots, an important abstraction in domain driven design, we could formulate message based systemstests as expressed in a behaviour driven development style as follows:

```
1 - For AggregateRoot A
2 - Given some Precondition
2 - When Command C on A
3 - A Should Emit Event E
```
or a failure case
```
1 - For AggregateRoot A
2 - Given some Precondition
2 - When Command C on A
3 - A Reply with FailureResult
```

With this kind of testing that is based on events and commands, you can have clear meaning to the domain expert or business owner. Not only does this mean that tests are expressed in terms of events and cmmands. These tests have a clear functional meaning, it also means that they hardly depend on any implementation details of where your events are stored or how events get published.

Akkatecture has a companion test package, called [Akkatecture.TestFixture](https://www.nuget.org/packages/Akkatecture.TestFixture/) that enables test driven developers to write fluent tests against aggregate roots. Initially, only the support for testing aggregate roots is available, in the future there will be support for testing aggregate sagas.


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

> The given when then test fixture defines three stages: configuration, execution and validation. Each of these stages is represented by a different interface: [`IFixtureArranger<,>`](https://github.com/Lutando/Akkatecture/blob/master/src/Akkatecture.TestFixture/Aggregates/IFixtureArranger.cs), [`IFixtureExecutor<,>`](https://github.com/Lutando/Akkatecture/blob/master/src/Akkatecture.TestFixture/Aggregates/IFixtureExecutor.cs), and [`IFixtureAsserter<,>`](https://github.com/Lutando/Akkatecture/blob/master/src/Akkatecture.TestFixture/Aggregates/IFixtureAsserter.cs) respectively. The static `FixtureFor<,>()` extension method extends the akka.net's `TestKitBase` which allows it to work for any .net testing framework that you choose. The `FixtureFor<,>()` method is the entry point for writing your tests.

The unit of testing here is the aggregate root, the `this.FixtureFor<,>` is meant to test one aggregate root only. Which means that all commands, events, and snapshots that eminate to and from this unit under test is all for the same aggregate root instance. In other words, all of those message types are bound to the same `aggregateId`.

# Configuration Stage

The configuration stage of the aggregate fixture is there to tell the fixture under one preconditions the tests should be run. Typically these preconditions play no role during the assertion phase of your test scenario, but they are important in hydrating your aggregate with behaviours the are required for the test to work as planned. In the configuration stage, you may configure the fixture in one of four ways:

1) Configure with no initialization using `GivenNothing()`
2) Configure with journalled events using `Given(IAggregateEvent<,>[] events)`
3) Configure with stored snapshot using `Given(IAggregateSnapshot<,> snapshot)`
4) Configure with commands using `Given(ICommand<,>[] commands)`

Preconfiguring your tests with `GivenNothing()` tells the fixture that you essentially want your aggregate to be initialized with nothing as if it were `New`. If you want to seed your aggregates journal with events, you can do that by using the `Given(IAggregateEvent<,>[] events)` method. This method seeds the default (inmemory) journal to append the events in order that they are given in this method. The `Given(IAggregateSnapshot<,> snapshot)` initializes the default (inmemory) snapshot journal with that given snapshot. This might be a convienient way to hydrate aggregates that are large in your tests, however the reccomendation is not shy away from using snapshots in your testing because snapshots are an aggregate derivative of your event model, the event model should always take preference. And then finally you can use `Given(ICommand<,>[] commands)` for an added level of flexibility.

> The event journal and snapshot stored used will typically be the inmemory version as is the default, which is fine for unit tests.

# Execution Stage

The execution stage is the staged is the stage that illistrates the part where the domain is invoked. It is the part of the test that describes what interaction the test is trying to observe. Typically after the execution stage, a validation stage follows that should observe the outputs. A good rule of thumb is to mainly observe the outputs of your aggregrate root that arises as a result of an execution. The execution stage can be executed in one of two ways, the most important of which is:

1) Execute by sending command(s) using `When(ICommand<TAggregate, TIdentity>[] commands)`
2) When youre in a validation stage and want to go back to an execution stage, use `AndWhen(ICommand<TAggregate, TIdentity>[] commands)`
The second `AndWhen(...)` execution stage method gives you the ability to chain commands in a fluent way and / or to go from a validation stage into an execution stage again.

> Even though there is a similar command sending step in the configuration stage, one should not worry about asserting the outputs of these configuration stage commands, the main concern of any unit test is to observe what happens after a certain action is invoked given a precondition.

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

    this.FixtureFor<User, UserId>(userId) //configure
        .Given(new UserRegisteredEvent()) //initialize
        .When(new ValidateEmailCommand(userId, email)) //invoke
        .ThenExpect<EmailValidatedEvent>() //test
        .AndWhen(new Add2FAuthenticationCommand()) //invoke again
        .ThenExpect<2FAuthenticationAddedEvent>() //test again
}
```

This fixture can also be tested the following way:

```csharp
//example 2
public void RegisteredUser_CanAdd2FAuthAfterValidatingEmail_ShouldEmit2FAuthAddedEvent()
{
    var userId = UserId.New;

    this.FixtureFor<User, UserId>(userId) //configure
        .Given(new UserRegisteredEvent(userId), new EmailValidatedEvent(userId, email)) //initialize
        .When(new Add2FAuthenticationCommand()) //invoke
        .ThenExpect<2FAuthenticationAddedEvent>() //test
}
```

The difference between the first example and the second example is that the first example also tests the business rules when it comes to validating emails. The second example does not test email validation business rules, because in its initialize stage, it is given that the email has been validated by the virtue of it already being journalled in the fixtures event journal. In general when designing your tests, business rules should be tested that are based on the execution stage and not the init/configuration stage.

>For some examples of how some of these tests may look like, check out the tests in the [test project](https://github.com/Lutando/Akkatecture/blob/master/test/Akkatecture.Tests/UnitTests/Aggregates/AggregateTestsWithFixtures.cs). In the future support for testing aggregate sagas will also be supported.