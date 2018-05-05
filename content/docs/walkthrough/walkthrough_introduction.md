---
title: "Walkthrough Introduction"
lesson: 1
chapter: 3
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/07/2018"
category: "akkatecture"
type: "docs"
tags:
    - walkthrough
    - akkatecture
    - introduction
    - csharp
    - dotnet
---
Let's design a domain using Akkatecture. The walkthrough is designed to get you familiar with Akkatecture, akka.net, cqrs and event sourcing, and a few patterns that come with that. The walkthrough is in 'tutorial' style and requires your attention in order to get the most of it. The walkthrough will cover most of what akkatecture has to offer. 

Pre-requisites - *some* knowledge of akka, cqrs and event sourcing is required to fully get the most out of the walkthrough.

The walkthrough will cover:

- Modelling a simple domain.
- Designing an aggregate root.
- Implementing commands and command handlers.
- Reasoning about events and aggregate state.
- Creating domain event subscribers.
- Building an aggregate saga.
- Writing a simple client application.
- Making your domain distributed across networked nodes.


# Let Us Begin
The task is for you to try and model a bank that allows you to transfer money from one account to another account. The bank has their own arbitrary business rules that you have to codify

**Task** - An investor with huge pockets wants to start her own bank. She wants to open it in europe and wants to allow customers to create bank accounts for free with a non-negative starting balance. The bank does not deal in overdrafts or loaning. The bank wants to allow customers to transfer their money between accounts within the bank. The transaction fee for a successful money deposit is €0.25. The minimum amount of money allowed to transfer is €1.00. Which means that the minimum amount of money allowed to exit a bank account is €1.25. The bank fee is flat regardless of the amount of money being transferred. The bank would like to keep track of how much money it has gained as revenue as a result of the transaction fees.

In the walkthrough we will implement this bank together step by step starting with the aggregate. Lets begin with designing your first aggregate.

[BEGIN →](/docs/your-first-aggregate)