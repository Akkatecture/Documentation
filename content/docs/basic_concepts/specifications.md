---
title: "Specifications"
lesson: 5
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
Akkatecture comes with an implementation of the specification pattern which could be used to e.g. make complex business rules more manageable to read and test.

To use the specification implementation shipped with Akkatecture, simply create a class that inherits from `Specification<>`.

```csharp
public class IsEvenNumberSpecification : Specification<int>
{
    protected override IEnumerable<string> IsNotSatisfiedBecause(int i)
    {
        if (i % 2 == 0)
        {
            yield return $"{i} is not an even number";
        }
    }
}
```

> Note that instead of simply returning a `bool` to indicate whether or not the specification is satisfied, this implementation requires a reason (or reasons) why not the specification is satisfied.

The `ISpecification<>` interface has two methods defined, the traditional `IsSatisfiedBy` and the addition `WhyIsNotSatisfiedBy`, which returns an empty enumerable if the specification was indeed satisfied.

```csharp
public interface ISpecification<in T>
{
    bool IsSatisfiedBy(T obj);

    IEnumerable<string> WhyIsNotSatisfiedBy(T obj);
}
```

As specifications really become powerful when they are combined, Akkatecture also comes with a series of extension methods for the `ISpecification<>` interface that allows for the combination and composition of implemented specifications.

```csharp
// Builds a new specification that requires all input specifications to be
// satified
var allSpec = specEnumerable.All();

// Builds a new specification that requires a predefined amount of the
// input specifications to be satisfied
var atLeastSpec = specEnumerable.AtLeast(4);

// Builds a new specification that requires the two input specifications
// to be satisfied
var andSpec = spec1.And(spec2);

// Builds a new specification that requires one of the two input
// specifications to be satisfied
var orSpec = spec1.Or(spec2);

// Builds a new specification that requires the input specification
// not to be satisfied
var notSpec = spec.Not();
```

If you need a simple expression to combine with other more complex specifications you can use the bundled `ExpressionSpecification<>`, which is a specification wrapper for an expression.

```csharp
var spec = new ExpressionSpecification<int>(i => 1 < i && i < 3);

// 'str' will contain the value "i => ((1 < i) && (i < 3))"
var str = spec.ToString();
```

If the specification isn’t satisfied, a string representation of the expression is returned.

> While specifications are very useful, be careful when using them outside of your domain layer since then you will end up introducing coupling between components, which is not necessarily a bad thing. Specifications are really good at encapsulating domain validation logic in one place.

[Next, Subscribers →](/docs/subscribers)