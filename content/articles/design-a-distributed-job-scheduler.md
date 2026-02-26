---
title: "Design a Distributed Job Scheduler - System Design Interview"
description: "A distributed job scheduler is a system designed to manage, schedule, and execute tasks (referred to as \"jobs\") across multiple computers or nodes in a distributed network."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/design-a-distributed-job-scheduler.md"
dateModified: "2024-09-12"
datePublished: "2024-09-12"
showOnArticles: true
topics:
  - system-design
---

A  **distributed job scheduler**  is a system designed to  **manage** ,  **schedule** , and  **execute**  tasks (referred to as "jobs") across  **multiple**  computers or nodes in a distributed network.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/3bf15579-f805-4fd1-9bd3-02284e4f6c8a_1828x568.png)](https://substackcdn.com/image/fetch/$s_!59wd!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3bf15579-f805-4fd1-9bd3-02284e4f6c8a_1828x568.png)Visualized using  **[Multiplayer](https://dub.sh/LIkklyx)**

Distributed job schedulers are used for automating and managing large-scale tasks like batch processing, report generation, and orchestrating complex workflows across multiple nodes.

In this article, we will walk through the process of designing a scalable distributed job scheduling service that can handle millions of tasks, and ensure high availability.

# 1. Requirements Gathering

Before diving into the design, let’s outline the  **functional**  and  **non-functional**  requirements.

### **Functional Requirements:**

1. Users can submit  **one-time**  or  **periodic**  jobs for execution.
2. Users can  **cancel**  the submitted jobs.
3. The system should  **distribute jobs**  across multiple worker nodes for execution.
4. The system should provide monitoring of  **job status**  (queued, running, completed, failed).
5. The system should **** prevent the same job from being executed multiple times concurrently.

### **Non-Functional Requirements:**

- **Scalability** : The system should be able to schedule and execute millions of jobs.
- **High Availability** : The system should be fault-tolerant with no single point of failure. If a worker node fails, the system should reschedule the job to other available nodes.
- **Latency** : Jobs should be scheduled and executed with minimal delay.
- **Consistency:**  Job results should be consistent, ensuring that jobs are executed once (or with minimal duplication).

### Additional Requirements (Out of Scope):

1. **Job prioritization:**  The system should support scheduling based on job priority.
2. **Job dependencies:**  The system should handle jobs with dependencies.

# 2. High Level Design

At a high level, our distributed job scheduler will consist of the following components:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/cb896b5d-bba1-456b-bba4-e927366e1da4_3225x1991.png)](https://substackcdn.com/image/fetch/$s_!dgbt!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fcb896b5d-bba1-456b-bba4-e927366e1da4_3225x1991.png) **Sketched using [Multiplayer](https://dub.sh/LIkklyx)**

### **1. Job Submission Service**

The Job Submission Service is the  **entry point**  for clients to interact with the system.

It provides an interface for users or services to  **submit** ,  **update** , or  **cancel**  jobs via APIs.

This layer exposes a  **RESTful API**  that accepts job details such as:

- Job name
- Frequency (One-time, Daily)
- Execution time
- Job payload (task details)

It saves job metadata (e.g., execution_time, frequency, status = pending) in the  **Job Store**  (a database) and returns a unique  **Job ID**  to the client.

### 2.  **Job Store**

The Job Store is responsible for  **persisting**  job information and maintaining the current state of all jobs and workers in the system.

The  **Job Store**  contains following database tables:

#### **Job Table**

This table stores the metadata of the job, including job id, user id, frequency, payload, execution time, retry count and status (pending, running, completed, failed).

[![image](https://substack-post-media.s3.amazonaws.com/public/images/3f4bdd94-b79b-4d1d-9fd6-0c6bf2411e95_2091x289.png)](https://substackcdn.com/image/fetch/$s_!Ckz3!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3f4bdd94-b79b-4d1d-9fd6-0c6bf2411e95_2091x289.png) **Sketched using [Multiplayer](https://dub.sh/LIkklyx)**

#### **Job Execution Table**

Jobs can be executed multiple times in case of failures.

This table tracks the execution attempts for each job, storing information like execution id, start time, end time, worker id, status and error message.

If a job fails and is retried, each attempt will be logged here.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/0f193214-fa20-4775-b160-d900626257ea_1974x345.png)](https://substackcdn.com/image/fetch/$s_!LWuM!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0f193214-fa20-4775-b160-d900626257ea_1974x345.png) **Sketched using [Multiplayer](https://dub.sh/LIkklyx)**

#### **Job Schedules**

The  **Schedules Table**  stores scheduling details for each job, including the next_run_time.

- For  **one-time jobs** , the next_run_time is the same as the job’s execution time, and the last_run_time remains null.
- For  **recurring jobs** , the next_run_time is updated after each execution to reflect the next scheduled run.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/e1a92aca-294f-488b-aaf7-557f2be0ff66_1009x264.png)](https://substackcdn.com/image/fetch/$s_!asfC!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe1a92aca-294f-488b-aaf7-557f2be0ff66_1009x264.png) **Sketched using [Multiplayer](https://dub.sh/LIkklyx)**

#### **Worker Table**

The  **Worker Node Table**  stores information about each worker node, including its ip address, status, last heartbeat, capacity and current load.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/a57240a2-41ca-4e4d-abb8-a1ca2765d853_1518x309.png)](https://substackcdn.com/image/fetch/$s_!T-hn!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa57240a2-41ca-4e4d-abb8-a1ca2765d853_1518x309.png) **Sketched using [Multiplayer](https://dub.sh/LIkklyx)**

### 3.  **Scheduling Service**

The  **Scheduling Service**  is responsible for selecting jobs for execution based on their next_run_time in the  **Job Schedules Table** .

It periodically queries the table for jobs scheduled to run at the current minute:

```
SELECT * FROM JobSchedulesTable WHERE next_run_time = 1726110000;
```

Once the due jobs are retrieved, they are pushed to the  **Distributed Job Queue**  for worker nodes to execute.

Simultaneously, the status in  **Job Table**  is updated to SCHEDULED.

### 4. Distributed Job Queue

The  **Distributed Job Queue** (e.g., Kafka, RabbitMQ) acts as a buffer between the  **Scheduling Service**  and the  **Execution Service** , ensuring that jobs are distributed efficiently to available worker nodes.

It holds the jobs and allows the execution service to pull jobs and assign it to worker nodes.

### 5.  **Execution Service**

The Execution Service is responsible for  **running the jobs**  on worker nodes and updating the results in the Job Store.

It consists of a  **coordinator**  and a pool of  **worker nodes** .

#### **Coordinator**

A  **coordinator**  (or  **orchestrator** ) node takes responsibility for:

- **Assigning jobs** : Distributes jobs from the queue to the available worker nodes.
- **Managing worker nodes** : Tracks the status, health, capacity, and workload of active workers.
- **Handling worker node failures** : Detects when a worker node fails and reassigns its jobs to other healthy nodes.
- **Load balancing** : Ensures the workload is evenly distributed across worker nodes based on available resources and capacity.

#### Worker Nodes

**Worker nodes**  are responsible for executing jobs and updating the  **Job Store**  with the results (e.g., completed, failed, output).

- When a worker is assigned a job, it creates a new entry in the  **Job Execution Table** with the job’s status set to running and begins execution.
- After execution is finished, the worker updates the job’s final status (e.g., completed or failed) along with any output in both the  **Jobs**  and  **Job Execution Table** .
- If a worker fails during execution, the coordinator re-queues the job in the distributed job queue, allowing another worker to pick it up and complete it.

# 3. System API Design

Here are some of the important API’s we can have in our system.

1.  **Submit Job**  (POST /jobs)

2.  **Get Job Status**  (GET /jobs/{job_id})

3.  **Cancel Job**  (DELETE /jobs/{job_id})

4.  **List Pending Jobs**  (GET /jobs?status=pending&user_id=u003)

5.  **Get Jobs Running on a Worker**  (GET /job/executions?worker_id=w001)

# 4. Deep Dive into Key Components

### 4.1 SQL vs NoSQL

To choose the right database for our needs, let's consider some factors that can affect our choice:

- We need to store millions of jobs every day.
- Read and Write queries are around the same.
- Data is structured with fixed schema.
- We don’t require ACID transactions or complex joins.

Both SQL and NoSQL databases could meet these needs, but given the scale and nature of the workload, a  **NoSQL database**  like  **DynamoDB**  or  **Cassandra**  could be a better fit, especially when handling  **millions of jobs per day**  and supporting  **high-throughput writes and reads** .

### 4.2 Scaling Scheduling Service

The  **Scheduling service**  periodically checks the the  **Job Schedules Table**  every minute for pending jobs and pushes them to the job queue for execution.

For example, the following query retrieves all jobs due for execution at the current minute:

```
SELECT * FROM JobSchedulesTable WHERE next_run_time = 1726110000;
```

> **Optimizing reads from** JobSchedulesTable:Since we are querying JobSchedulesTable using the next_run_time column, it’s a good idea to partition the table on the next_run_time column to efficiently retrieve all jobs that are scheduled to run at a specific minute.

If the number of jobs in any minute is small, a single node is enough.

However, during peak periods, such as when 50,000 jobs need to be processed in a single minute, relying on one node can lead to delays in execution.

The node may become overloaded and slow down, creating performance bottlenecks.

Additionally, having only one node introduces a  **single point of failure** .

If that node becomes unavailable due to a crash or other issue, no jobs will be scheduled or executed until the node is restored, leading to system downtime.

To address this, we need a distributed architecture where  **multiple worker nodes**  handle job scheduling tasks in parallel, all coordinated by a  **central node.**

***But how can we ensure that jobs are not processed by multiple workers at the same time?***

The solution is to divide jobs into  **segments** . Each worker processes only a specific subset of jobs from the JobSchedulesTable by focusing on assigned segments.

This is achieved by adding an extra column called segment.

The segment column logically groups jobs (e.g., segment=1, segment=2, etc.), ensuring that no two workers handle the same job simultaneously.

A  **coordinator node**  manages the distribution of workload by assigning different segments to worker nodes.

It also monitors the health of the workers using  **heartbeats**  or  **health checks** .

[![image](https://substack-post-media.s3.amazonaws.com/public/images/84bb2b98-2223-4fa3-8b49-2777a6db1976_3482x832.png)](https://substackcdn.com/image/fetch/$s_!8tQu!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F84bb2b98-2223-4fa3-8b49-2777a6db1976_3482x832.png) **Sketched using [Multiplayer](https://dub.sh/LIkklyx)**

In cases of worker node failure, the addition of new workers, or spikes in traffic, the coordinator dynamically rebalances the workload by adjusting segment assignments.

Each worker node queries the JobSchedulesTable using both next_run_time and its assigned segments to retrieve the jobs it is responsible for processing.

Here's an example of a query a worker node might execute:

```
SELECT * FROM JobSchedulesTable WHERE next_run_time = 1726110000 AND segment in (1,2);
```

### 4.3 Handling failure of Jobs

When a job fails during execution, the worker node increments the retry_count in the JobTable.

- If the retry_count is still below the max_retries threshold, the worker retries the job from the beginning.
- Once the retry_count reaches the max_retries limit, the job is marked as failed and will not be executed again, with its status updated to failed.

**Note:**  After a job fails, the worker node should not immediately retry the job, especially if the failure was caused by a transient issue (e.g., network failure).

Instead, the system retries the job after a delay, which increases  **exponentially**  with each subsequent retry (e.g., 1 minute, 5 minutes, 10 minutes).

### 4.4 Handling failure of Worker nodes in Execution Service

**Worker nodes**  are responsible for executing jobs assigned to them by the coordinator in the  **Execution Service** .

When a worker node fails, the system must detect the failure, reassign the pending jobs to healthy nodes, and ensure that jobs are not lost or duplicated.

There are several techniques for detecting failures:

- **Heartbeat Mechanism:** Each worker node periodically sends a heartbeat signal to the coordinator (every few seconds). The coordinator tracks these heartbeats and marks a worker as "unhealthy" if it doesn’t receive a heartbeat for a predefined period (e.g., 3 consecutive heartbeats missed).
- **Health Checks:** In addition to heartbeats, the coordinator can perform periodic  **health checks**  on each worker node. The health checks may include CPU, memory, disk space, and network connectivity to ensure the node is not overloaded.

Once a worker failure is detected, the system needs to recover and ensure that jobs assigned to the failed worker are still executed.

There are two main scenarios to handle:

#### **Pending Jobs (Not Started)**

For jobs that were assigned to a worker but not yet started, the system needs to reassign these jobs to another healthy worker.

The coordinator should re-queue them to the job queue for another worker to pick up.

#### **In-Progress Jobs**

Jobs that were being executed when the worker failed need to be handled carefully to prevent partial execution or data loss.

One technique is to use  **job checkpointing** , where a worker periodically saves the progress of long-running jobs to a persistent store (like a database). If the worker fails, another worker can restart the job from the last checkpoint.

If a job was partially executed but not completed, the coordinator should mark the job as "failed" and re-queue it to the job queue for retry by another worker.

### 4.5  **Addressing Single Points of Failure**

We are using a  **coordinator node**  in both the  **Scheduling**  and  **Execution**  service.

To prevent the  **coordinator**  from becoming a  **single point of failure** , deploy multiple  **coordinator nodes**  with a  **leader-election mechanism** .

This ensures that one node is the active leader, while others are on standby. If the leader fails, a new leader is elected, and the system continues to function without disruption.

- **Leader Election** : Use a consensus algorithm like  **Raft**  or  **Paxos**  to elect a leader from the pool of coordinators. Tools like  **Zookeeper**  or  **etcd**  are commonly used for managing distributed leader elections.
- **Failover** : If the leader coordinator fails, the other coordinators detect the failure and elect a new leader. The new leader takes over responsibilities immediately, ensuring continuity in job scheduling, worker management, and health monitoring.
- **Data Synchronization** : All coordinators should have access to the same  **shared state**  (e.g., job scheduling data and worker health information). This can be stored in a  **distributed database**  (e.g., Cassandra, DynamoDB). This ensures that when a new leader takes over, it has the latest data to work with.

### 4.6 Rate Limiting

#### Rate Limiting at the Job Submission Level

If too many job submissions are made to the scheduling system at once, the system may become overloaded, leading to degraded performance, timeouts, or even failure of the scheduling service.

Implement rate limits at the client level to ensure no single client can overwhelm the system.

> For example, restrict each client to a maximum of 1,000 job submissions per minute.

#### Rate Limiting at the Job Queue Level

Even if the job submission rate is controlled, the system might be overwhelmed if the  **job queue**  (e.g., Kafka, RabbitMQ) is flooded with too many jobs, which can slow down worker nodes or lead to message backlog.

Limit the rate at which jobs are pushed into the distributed job queue. This can be achieved by implementing  **queue-level throttling** , where only a certain number of jobs are allowed to enter the queue per second or minute.

#### Rate Limiting at the Worker Node Level

If the system allows too many jobs to be executed simultaneously by worker nodes, it can overwhelm the underlying infrastructure (e.g., CPU, memory, database), causing performance degradation or crashes.

Implement rate limiting at the worker node level to prevent any single worker from taking on too many jobs at once.

Set  **maximum concurrency limits**  on worker nodes to control how many jobs each worker can execute concurrently.


Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
