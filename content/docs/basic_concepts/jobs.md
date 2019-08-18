---
title: "Jobs"
lesson: 7
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
Akkatecture ships with a model for executing commands known as jobs. These jobs are messages that are persisted and (within reasonable tolerances) will be executed in the future. jobs are not supposed to be used as a conduit in situations where real time responsiveness is needed. Jobs are useful for scheduling jobs that can tolerate high latencies (eg minutes). jobs are suitable for triggering processes at some arbitrary point in time in the future like sending emails or scheduling backups.

> This is a highly experimental feature at this point as should be regarded as such. The API surface may change drastically as things evolve. Feel free to submit your comments [here](https://github.com/Lutando/Akkatecture/issues/146) 

## Jobs
Jobs are just like commands except they do not target any specific domain entity. Jobs are just messages which are likely to be persisted and scheduled to be published in the future. Because these messages are invariant, one must be sure to not alter the message structure/schema, in the same way that aggregate events are invariant. 

For the purposes of demonstration let's say that we have an `EmailCouponJob`
```csharp
[JobName("email-coupon-code-job")]
public class EmailCouponJob : IJob
{
    public string Address { get; }
    public CouponCode Code { get; }
    public EmailCouponJob(
        string address,
        CouponCode code)
    {
        Address = address;
        Code = code;
    }
}
```

We also need to create a `IJobId` this is important later on

```csharp
public class EmailJobId : Identity<EmailJobId>, IJobId
{
    public EmailJobId(string value) 
        : base(value)
    {
    }
}
```

## Job Runners
Job runners are the actors which execute the jobs. Job runners receive the job messages from the job scheduler and executes them. The job runners typically have no concept of scheduling messages, as their one purpose is to handle the job messages. JobRunners would normally inherit from `JobRunner<,>` so that they can consume the `IRun<>` interface to signify what messages/jobs that the runner can handle.

A job runner might look like:
```csharp
public class EmailCouponJobRunner : JobRunner<EmailCouponJob, EmailJobId>,
    IRun<EmailCouponJob>
{
    public bool Run(EmailCouponJob job)
    {
        SendCouponEmail(job.Address, job.Code);
        return true;
    }
}
```



## Job Schedulers
Scheduling is the method by which work is assigned to resources that complete the work. In Akkatecture, the job scheduler is the actor which decides when to trigger work to resources that can handle the work (the job runner).Under the hood, job schedulers are persistent actors which persist messages to a journal and then uses this journal as its primary source of state just like in any other event sourced system. 

The job scheduler for the email coupon job can be described as follows

```csharp
public class EmailCouponJobScheduler<EmailCouponJobScheduler, EmailCouponJob, EmailJobId>
{}
```

The job scheduler polls itself to see if it should trigger the next job as defined in the frequency on on its configuration found [here](https://github.com/Lutando/Akkatecture/blob/0a7c4d8b4d14f982ccbe78239849d4d0747079ff/src/Akkatecture/Configuration/reference.conf#L118).

## Job Managers
`JobManager`s are the glue between the scheduler and the runner. Job manager supervises the runner and the scheduler but also coordinates messages between them. The job manager is the entry point to the job system, all messages that come from outside the job manager would typically be messages to either schedule jobs or to cancel jobs.

Instantiating a job manager looks like this:
```csharp
var jobManager = 
    Props.Create(() =>
        new JobManager<TestJobScheduler, TestJobRunner, TestJob, TestJobId>(
            () => new EmailCouponJobScheduler(),
            () => new EmailCouponJobRunner())
    );
```

## Scheduling Jobs
There are three ways to schedule jobs, `ScheduleOnce`, `ScheduleRepeatedly`, and `ScheduleCron`. All of the schedule methods allow you to specify when the trigger should start. In the case of `ScheduleOnce` this is the actual trigger time. `ScheduleRepeatedly` allows you to schedule a job to triger in the future and then to repeat itself every interval of time. `ScheduleCron` allows you to schedule a job to trigger in the future and then to repeat itself everytime the cron expression yields a positive trigger.


```csharp
var jobId = EmailJobId.New;
var emailCouponJob = new EmailCouponJob("foo@bar.com", CouponCode.NewOneTimeCoupon);
var when = DateTime.UtcNow.AddDays(7);

//Scheduling a one time job for 1 week from now
var oneTimeJob = new Schedule<EmailCouponJob, EmailJobId>(jobId, emailCouponJob, when);
jobManager.Tell(oneTimeJob);

//Scheduling a repeated job for 1 week from now 
//and then every 2 weeks repeatedly from then on
var interval = TimeSpan.FromDays(14);
var repeatedJob = new ScheduleRepeatedly<EmailCouponJob, EmailJobId>(jobId, emailCouponJob, interval, when);
jobManager.Tell(oneTimeJob);

//Scheduling a cron job for 1 week from now
// and then the first of every month at midnight
var cronExpression = "0 0 1 * *"; // cron expression for every first day of the month at midnight
var cronJob = new ScheduleCron<EmailCouponJob, EmailJobId>(jobId, emailCouponJob, cronExpression, when);
jobManager.Tell(cronJob);
```

If you look at the above schedule jobs, they all trigger 7 days from `DateTime.UtcNow`. The difference between the schedule types here is that the `Schedule<,>` job will finish after it has triggered for the first time. The `ScheduleRepeatedly<,>` job will not finish after it has been triggered for the first time, infact, it will be scheduled to be triggered indefinitely after every `interval`. In a similar way to the reapeated schedule, the `ScheduleCron<,>` job will be scheduled to trigger in the future and then will trigger indefinitely everytime the cron expression yields a "trigger next" time.

All jobs can be cancelled by sending a `Cancel<,>(jobId)` message to the job manager, with the correlating jobId.

```csharp
var cancelJob = new Cancel<EmailCouponJob, EmailJobId>(jobId);
jobManager.Tell(cancelJob);
```

### Cron Expressions
Akkatecture takes on a dependency from [Hangfire's Cronos](https://github.com/HangfireIO/Cronos) library. This means that most practical cron expressions are accepted. Take a lot at the libraries expression notation so that you may use them here as well.

### Testing Jobs (And Time)
If you look at [this](https://petabridge.com/blog/how-to-unit-test-akkadotnet-actors-akka-testkit/) blog post on how to test for time, you can see how one might want to test jobs. To set up your TestKit appropriately for this, one hase to make sure that you have configured your TestKit's configuration to use the [`TestScheduler`](http://api.getakka.net/docs/stable/html/64701727.htm). This scheduler allows you to manipulate time in your unit tests by using `Advance(...)` and `AdvanceTo(...)` methods.

Your job test might look like this where the `BackupJob` emits a `BackupJobDone` when it has finished its work.

```csharp
//tests/JobTests
[Fact]
[Category("JobTests")]
public void EveryTwoWeeks_BackupJob_IsRun()
{
    var scheduler = (TestScheduler) Sys.Scheduler;
    var backupJob = new BackupJob();
    var start = DateTime.UtcNow.AddDays(14);
    var interval = TimeSpan.FromDays(14);
    var jobManager = /* Omitted for brevity */ 

    var scheduleRepeatedly = new ScheduleRepeatedly<BackupJob, BackupJobId>(
        jobId,
        backupJob,
        interval,
        when);
    jobManager.Tell(scheduleRepeatedly);

    scheduler.Advance(interval) //advance by 2 weeks
    ExpectMsg<BackupJobDone>();
    scheduler.Advance(interval) //advance by 2 weeks
    ExpectMsg<BackupJobDone>();
}
```

As you can see we can tell the TestKit to advance time to our bidding in order to test how the job scheduler and runner will react. More examples can be found in the unit test project of Akkatecture.
 
[Next, Akka →](/docs/akka)