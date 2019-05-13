---
title: "Testing Actors"
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

Akkatecture has a companion test package that enables test driven developers to write fluent tests against aggregate roots. Initially only support for testing aggregate roots is available. The test will allow you to write tests in a fluent style like:

```csharp
public void RigisteringUser_UsingRegisterCommand_ShouldEmitRegisteredEvent()
{

}
```
You can choose to test your actor using the [Akkatecture.TestFixture](https://www.nuget.org/packages/Akkatecture.TestFixture/) package. 

Testing documentaion is still to be made. More comprehensive documentation on testing will be done in the near future. In the mean time you can have a look at the [Akkatecture.Tests](https://github.com/Lutando/Akkatecture/tree/master/test/Akkatecture.Tests) project on github to get an idea of how to test your domain. Akkatecture is also working on a test fixture for testing aggregates, so far you can find its usage [here](https://github.com/Lutando/Akkatecture/blob/master/test/Akkatecture.Tests/UnitTests/Aggregates/AggregateTestsWithFixtures.cs) but the test fixture package is still to be released to nuget, stay tuned for updates. The test fixture package is supposed to allow you to express business domain tests in a style that mimmics actual domain usage, using the raw akka.net test kit to do this is a little bit bloated for most cases. However, feel free to suppliment the test fixture with petabridge's actor testing documentation using [akka.net TestKit](https://petabridge.com/blog/how-to-unit-test-akkadotnet-actors-akka-testkit/) to get a good idea about how to tests a project like this effectively.


> In the future support for testing aggregate sagas will also be supported