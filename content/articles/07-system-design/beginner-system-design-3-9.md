---
title: "Quiz"
description: "Quiz - System Design Module 3"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Quiz

### Core Concepts Quiz

28 quizzes

1

Multiple Choice

Which scaling technique involves increasing the power of a single server by adding more CPU or memory?

AShardingBReplicationCHorizontal ScalingDVertical Scaling

2

Multiple Choice

What is the main goal of a load balancer in a distributed system?

AReplicate data for backup purposesBMonitor server health for analyticsCPartition data into smaller setsDEvenly distribute incoming traffic among servers

3

Multiple Choice

Which availability strategy involves maintaining backup components that can take over if the primary fails?

ARedundancyBShardingCPartitioningDCaching

4

Multiple Choice

Which consistency model allows temporary inconsistencies but guarantees that, eventually, all replicas will converge?

AStrong ConsistencyBEventual ConsistencyCLinearizabilityDStrict Consistency

5

Multiple Choice

A distributed key-value store needs to route requests efficiently as servers are added or removed. Which technique reduces rehashing disruptions?

ARandom SelectionBSticky SessionsCRound RobinDConsistent Hashing

6

Multiple Choice

What does 'latency' refer to in system performance?

AThe number of users online simultaneouslyBThe number of requests handled per secondCThe time to complete a single requestDThe amount of system downtime

7

Multiple Choice

In a system, which component is considered a single point of failure?

AA read replica databaseBThe only instance of a load balancerCMultiple application serversDA distributed cache

8

Multiple Choice

Which of the following best describes horizontal scaling?

AStoring backup copies of dataBAdding more machines to a system to share the workloadCIncreasing the CPU and memory of a single serverDSplitting data across multiple databases

9

Multiple Choice

Which factor is LEAST likely to affect system reliability?

AThe programming language usedBFailover mechanismsCRedundancy of componentsDMonitoring and alerting

10

Multiple Choice

Which availability tier corresponds with less than 5 minutes of downtime per year?

A99.999% ('five nines')B99%C98%D99.9%

11

Multiple Choice

Which technique ensures that requests are automatically redirected to backup resources if the primary resource fails?

ARate LimitingBThrottlingCFailoverDSharding

12

Multiple Choice

What is an example of a system using strong consistency?

AA social media feed that updates likes after a delayBA distributed cache eventually updating all nodesCA batch processing system updating data overnightDA banking system that reflects account changes immediately to all clients

13

Multiple Choice

Which option best describes throughput in a distributed system?

AThe time to complete the slowest requestBThe size of data storedCThe speed of disk storageDThe number of requests processed per unit of time

14

Multiple Choice

Which situation might cause massive rehashing in a distributed database using hash(key) mod N?

AUsing a consistent hashing ringBIncreasing server memoryCAdding or removing a server nodeDDeploying a read replica

15

Multiple Choice

Which distributed systems challenge does the CAP theorem describe?

AData sharding in monolithsBTrade-offs between consistency, availability, and partition toleranceCLimitations of vertical scalingDTrade-offs between cost, security, and speed

16

Multiple Choice

When using a geographically distributed system, which risk increases if data is not replicated?

AReduced network trafficBImproved performanceCData unavailability during regional outagesDIncreased disk I/O latency

17

Multiple Choice

Which option introduces the highest risk of a single point of failure?

AImplementing active-active load balancingBUsing a single primary database without replicationCDeploying data across multiple regionsDRunning multiple web server instances

18

Multiple Choice

Which architecture is most suitable for handling both high reads and writes in a global application?

AFile-based storageBVertically scaled relational databaseCSingle-server architecture with cachingDDistributed sharded database with replication

19

Multiple Choice

Why is it critical to monitor system metrics and trigger alerts?

ATo detect failures or degradations early and initiate recoveryBTo eliminate the need for shardingCTo simplify code deploymentDTo reduce system memory usage

20

Multiple Choice

Which scenario is BEST suited for eventual consistency?

AStock trading order executionBBank account balance retrievalCSocial media feeds where slight delays in updates are acceptableDReal-time multiplayer game scores

21

Multiple Choice

Which of the following directly improves both reliability and availability?

AReducing network latencyBDecreasing code complexityCEliminating single points of failure using redundancyDChoosing a NoSQL database

22

Sequencing

Arrange the following steps for a highly available web service during a failover event.

Drag and drop to reorder, or use the arrows.

1

Failover mechanism is triggered

2

Traffic is redirected to standby server

3

Health check detects failure

4

Primary server fails

5

Users continue accessing the service via backup

Check Answer

23

Sequencing

Order the steps involved in horizontal scaling of an application server layer.

Drag and drop to reorder, or use the arrows.

1

Begin routing traffic to new server

2

Provision new server instance

3

Monitor system load and determine scaling need

4

Add new server to load balancer pool

Check Answer

24

Sequencing

Arrange the stages to achieve strong consistency in a distributed database write operation.

Drag and drop to reorder, or use the arrows.

1

Leader acknowledges write to client only after all replicas respond

2

Replicas acknowledge write completion to leader

3

Client sends write request to leader node

4

Leader node writes data and forwards to replicas

Check Answer

25

Matching

Match each method to how it improves system availability.

Click an item on the left, then click its match on the right. Click a matched item to unmatch.

Geographic redundancyLoad balancingSynchronous replicationActive-active failover

Prevents server overload and reduces response timesKeeps system operational during regional outagesEnsures up-to-date copies are available on failureEnables seamless traffic shift with no downtime

Check Answer

26

Matching

Match the concept to the system design characteristic.

Click an item on the left, then click its match on the right. Click a matched item to unmatch.

Single Point of FailureShardingConsistent HashingVertical Scaling

Splitting data across multiple servers for scalabilityComponent whose failure brings down the whole systemMinimizes key remapping when servers are added/removedAdding resources to a single server

Check Answer

27

Matching

Match each consistency model description to its name.

Click an item on the left, then click its match on the right. Click a matched item to unmatch.

All replicas return the most recent write after it completesReads may initially be stale, but eventually all replicas convergeA client will always see its own writesWrites are seen by all processes in the same order

Eventual ConsistencyCausal ConsistencyRead-Your-Writes ConsistencyStrong Consistency

Check Answer

28

Matching

Match each availability approach to its primary advantage.

Click an item on the left, then click its match on the right. Click a matched item to unmatch.

Server RedundancyDatabase ReplicationHealth MonitoringAsynchronous Replication

Enables early detection and response to issuesProtects data availability during a database failureReduces performance impact of data copiesProvides backup if a server fails

Check Answer

Launching soon
