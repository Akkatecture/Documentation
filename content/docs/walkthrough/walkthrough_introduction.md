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
    - csharp
    - dotnet
---
Lets design a domain using Akkatecture. The plan is for you to try and model a bank that allows you to transfer money from yourself to anyone in the bank so long as you have enough funds and their account id. 

## Business Requirements
An investor with huge pockets wants to start her own bank. She wants to open it in europe and wants to allow customers to create bank accounts for free. The bank does not deal in overdrafts or loaning. The bank only fascilitates the transfer of money between accounts within the bank. The transaction fee for a successful money deposit is €0.25. The minimum amount of money allowed to transfer is €1.00. Which means that the minimum amount of money allowed to exit a bank account is €1.25. The bank fee is flat regardless of the amount of money being transferred. The bank would like to keep track of how much money it has gained as revenue as a result of the transaction fees.

In the walkthrough we will implement this bank together step by step starting with the aggregate. Lets begin with [designing your first aggregate](/docs/your-first-aggregate).
