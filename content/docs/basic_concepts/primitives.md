---
title: "Primitives"
lesson: 1
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
The basic core primitives of Akkatecture are:

- [Value Objects](#value-objects)
- [Identities](#identities)
- [Entities](#entities)

A `ValueObject` is an immutable type that is distinguishable only by the state of its properties. That is, unlike an `Entity`, which has a unique identifier and remains distinct even if its properties are otherwise identical, two `ValueObject`s with the exact same properties can be considered equal. An `Entity` always has a globally unique identifier, so if two entities have the same identity, they are the same entity, regardless of their member values. Akkatecture uses these primitives all over the project and you are highly encouraged to use them as well so that your domain design is highly expressive, readable, and reasonable.

# Value Objects

The `SingleValueObject<>` generic primitive provides you with the necessary class overrides you need to have, so that they can be compared on the basis of their collective state. If all of their component properties are equal to one another, then two `ValueObject`s can be said to be equal. Feel free to derive from this class:

```csharp
public class AccountNumber : SingleValueObject<string>
{
  public AccountNumber(string value)
    : base(value)
  {
      //do some model validation, null checks etc.
  }
}
```
>It is recommended to use `value` as the parameter name, if you intend to serialize value objects. With Akkatecture's built in serialization converters.

# Identities

The `Identity<>` value object provides generic functionality to create
and validate the identities of e.g. aggregate roots. Its basically a wrapper
around a `Guid`.

```csharp
public class AccountId : Identity<AccountId>
{
  public AccountId(string value)
    : base(value)
  {
  }
}
```

1. The identity follow the form `{class without "Id"}-{guid}` e.g. `account-c93fdb8c-5c9a-4134-bbcd-87c0644ca34f` for the above `AccountId` example.

2. The internal `Guid` can be generated using one of the following methods/properties. Note that you can access the `Guid` factories directly by accessing the static methods on the `GuidFactories` class.

3. `New`: Uses the standard `Guid.NewGuid()`.

4.  `NewDeterministic(...)`: Creates a name-based `Guid` using the algorithm from [RFC 4122 §4.3](https://www.ietf.org/rfc/rfc4122.txt), which allows identities to be generated based on known data, e.g. an e-mail, i.e., it always returns the same identity for the same arguments.

5.  `NewComb()`: Creates a sequential `Guid` that can be used to e.g. avoid database fragmentation.

6.  A `string` can be tested to see if its a valid identity using the static `bool IsValid(string)` method.

7.  Any validation errors can be gathered using the static `IEnumerable<string> Validate(string)` method.

>    Its very important to name the constructor argument `value` as it is significant when the identity type is deserialized.


Here's some examples on we can use our newly created `AccountId`

```csharp
// Uses the default Guid.NewGuid()
var accountId = AccountId.New
```

```csharp
// Create a namespace, put this in a constant somewhere
var emailNamespace = Guid.Parse("769077C6-F84D-46E3-AD2E-828A576AAAF3");

// Creates an identity with the value "account-9181a444-af25-567e-a866-c263b6f6119a",
// useful to use when you want to create Id's
// deterministically from other real world "identifiers",
// especially in distributed situations
var accountId = AccountId.NewDeterministic(emailNamespace, "test@example.com");
```

```csharp
// Creates a new identity every time, but an identity when used in e.g.
// database indexes, minimizes fragmentation
var accountId = AccountId.NewComb()
```

> You are not forced to use the `Identity<>` implementation from Akkatecture. If you make your own Identity that implements `IIdentity` then it can still plug into all of the Akkatecture constructs as variants.

# Entities

An `Entity` is an object that has some intrinsic identity, apart from the rest of its state. Even if its properties are the same as another instance of the same type, it remains distinct because of its unique identity. The `Entity<>` In Akkatecture is itself a `ValueObject` however it implements the `IEntity<Identity>` interface, which requires it to have a member called `Identity Id`. Now you can see the relationship between `Entity<>`, `SingleValueObject<>`, and `Identity<>`. A sample `Entity` running onwards from the Account example above, could be:

```csharp
public class Account : Entity<AccountId>
{
  public AccountNumber AccountNumber {get;}
  public Account(AccountId entityId, AccountNumber accountNumber)
    : base(entityId)
  {
      //do some model validation, null checks etc.
      AccountNumber = accountNumber;
  }
}
```

> As you can see `Account` has an `AccountId` entity identifier, and is itself an value object because `Entity<>` inherits from `SingleValueObject<>`, and has a ValueObject member `AccountNumber`.

[Next, Aggregates →](/docs/aggregates)
