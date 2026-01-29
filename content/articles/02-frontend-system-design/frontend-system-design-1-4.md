---
title: "Why GraphQL over Rest API"
description: "Many companies today use GraphQL. In this blog, we’ll explore what GraphQL is, its benefits, and why it’s so popular. Suppose your app needs information about continents, countries, and languages. If you’re using REST API, you’ll likely call multiple API to fetch this data and then organize it for your frontend. Be patient—it’s not an Instagram Reel, but for serious learners, it’ll be worth the read."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-03-04"
datePublished: "2026-03-04"
showOnArticles: false
courseName: 02-frontend-system-design
topics:
  - nodejs
  - javascript

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759048343/Portfolio/FrontendSystemDesignCourse/titleImages/4_jzpcly.png)

Many companies today use **GraphQL**. In this blog, we’ll explore what GraphQL is, its benefits, and why it’s so popular. Be patient—it’s not an Instagram Reel, but for serious learners, it’ll be worth the read.

Here’s what we’ll cover:

1. What is GraphQL?
2. Why GraphQL? Its benefits
3. REST vs. GraphQL
4. Building blocks of GraphQL
5. Building a GraphQL app
6. Calling GraphQL from the client
7. Tools provided by the GraphQL community
8. Advanced features that make GraphQL powerful


### What is GraphQL?

Suppose your app needs information about continents, countries, and languages. If you’re using REST API, you’ll likely call multiple API to fetch this data and then organize it for your frontend.

(Read: [Deep Dive into REST API](https://heyashu.in/digital-garden/notes/front-end-design-system/http-headers-methods-status-codes-and-rest-api-deep-dive))

In GraphQL, however, you define **exactly** what data you need, and the **GraphQL server acts as a middle layer** to handle the request efficiently. This means the frontend gets only the data it asks for, reducing unnecessary load and improving performance.

Let’s see how!

![image.png](https://heyashu.in/images/blogs/g_2.jpg)

### More About GraphQL

GraphQL stands for **Graph Query Language**.

Imagine a graph where continents have countries, and countries have languages. It’s like a hierarchy where everything is interconnected, forming a graph structure. If you observe closely, almost everything on the planet is connected in some way, just like a graph.

This is why GraphQL is so powerful—it mirrors the way data is naturally structured. It allows us to efficiently query and showcase only the specific data we need in a frontend web app.

![image.png](https://heyashu.in/images/blogs/g_3.jpg)

GraphQL empowers the client by giving it the **flexibility and capability** to request exactly what data is needed—no more, no less.

The biggest benefit of GraphQL is that it allows you to fetch only the required information. For example, in the screenshot below, the client requests only `firstName` and `lastName`, and that’s exactly what the response includes.

Even if additional information like `userVillage` or `pincode` is available on the server, it won’t be sent unless explicitly requested. This avoids unnecessary data transfer, keeping the frontend clean and optimized.

This level of control is one of the key advantages of GraphQL over REST API.

You can try it out yourself using tools like GraphQL playground or GraphiQL!

https://studio.apollographql.com/sandbox/explorer

![image.png](https://heyashu.in/images/blogs/g_4.jpg)

### Benefits of GraphQL

1. **Avoids Overfetching:** Fetch only the data you need.
2. **Avoids Underfetching:** Retrieve all required data in a single request.
3. **Better Mobile Performance:** Mobile apps often need less data, and GraphQL ensures only the necessary information is sent.
4. **Efficiency and Precision:** Optimized data fetching leads to efficient performance.
5. **Declarative Data Fetching:** The frontend is in control of what data is needed.
6. **Structured and Hierarchical Data:** GraphQL organizes data in a structured and logical way.
7. **Strongly Typed Language:** GraphQL uses a schema that defines data types, reducing errors.
8. **Fewer Mistakes:** With type checking, there’s less room for errors in requests and responses.
9. **Introspection:** Unlike REST API, where you need to document endpoints, GraphQL comes with built-in introspection for easy exploration.
10. **Real-Time Capabilities:** GraphQL supports subscriptions for real-time updates.


### REST vs. GraphQL Comparison
- **Data Fetching**:
    - REST API: Requires multiple endpoints.
    - GraphQL: Uses a single endpoint for all data.
- **Request Structure**:
    - REST API: Fixed structure with HTTP methods.
    - GraphQL: Flexible, using queries and mutations.
- **Overfetching/Underfetching**:
    - REST API: Common issue.
    - GraphQL: Solved with precise queries.
- **Response Size**:
    - REST API: Fixed.
    - GraphQL: Flexible.
- **Versioning**:
    - REST API: Explicit versioning required.
    - GraphQL: No versioning needed due to flexible schema.
- **Schema Definition**:
    - REST API: Not well-defined.
    - GraphQL: Strongly defined schema.
- **Real-Time Capabilities**:
    - REST API: Polling and WebSockets.
    - GraphQL: Built-in subscriptions.
- **Tools**:
    - REST API: Postman.
    - GraphQL: GraphQL Playground.
- **Caching**:
    - REST API: Relies on HTTP caching.
    - GraphQL: Fine-grained caching possible.
- **Client Control**:
    - REST API: Server defines the response.
    - GraphQL: Client decides the response.
- **Adoption**:
    - REST API: Widely adopted.
    - GraphQL: Rapidly growing in popularity.

### More About GraphQL

GraphQL has two key components:

1. **Creator (Server):** Responsible for providing the data via GraphQL queries and mutations.
2. **Consumer (Client):** Sends requests to the server and consumes the data.

You can use a simple HTTP fetch request to interact with GraphQL. However, to fully leverage its benefits, it’s recommended to use libraries like **Apollo Client** or **graphql-hooks**.

Explore tools and libraries here: [GraphQL Community Tools](https://graphql.org/community/tools-and-libraries/?tags=javascript)

On the server side, you can use GraphQL server libraries.


### GraphQL Building Blocks

1. **Schema/Types:** Defines the structure of the data.

   * **Scalar Types:** Basic types like `Int`, `String`, `Boolean`, and `ID`.
   * **Custom Types:** Define complex types like `Country`, `Language`, etc., based on your data.

   GraphQL is a strongly typed language, and its schema is also known as **SDL (Schema Definition Language)**.
2. **Query/Mutations:**

   * **Query:** Used to fetch data.
   * **Mutation:** Used to update or modify data.

   Syntax for these will be covered in detail later.
3. **Resolver:** Contains the logic to fetch data from the database or perform updates.


### Creating a GraphQL Server

To create a server, you can use various libraries. For example, **Apollo Server** is a popular choice. Follow this guide to get started: [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server)

Alternatively, you can try the following commands to set up a basic GraphQL server:

```jsx
mkdir graphql-server-example
cd graphql-server-example
npm init --yes 
npm pkg set type="module"
npm install @apollo/server graphql

// create a index.js file 
// and wirte a script in package.json   "start": "node index.js"

// then paste this in index.js

// The ApolloServer constructor requires two parameters: your schema
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql

# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

# This "Book" type defines the queryable fields for every book in our data source.
type Book {
  id: ID!
  name: String!
  author: String!
 
}
  type Author{
  id: ID!
  name: String!
  books: [Book]
  }

# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
type Query {
  authors: [Author]
  books: [Book]
}
`;

const books = [
  {
    id: 1,
    name: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    id: 2,
    name: 'City of Glass',
    author: 'Paul Auster',
  },
];

const authors = [
  {
    id: 1,
    name: 'John Doe',
    books: [1, 2],
  },
];

const resolvers = {
  Query: {
    books: () => books,
    authors: () => authors,
  },
};

// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
```

### Overall Flow of GraphQL

In GraphQL, you work with:

1. **Type Definitions (TypeDefs):** Where you define the types, queries, and mutations.
2. **Resolvers:** For each query or mutation, you create a function with the same name as defined in your schema.

The **Apollo Server** acts as the bridge that connects these and ensures everything works together seamlessly.

When you run `npm start`, a GraphQL Playground opens where you can test your queries and fetch the data you need.

Here’s a screenshot for reference: (Insert your screenshot here)

![image.png](https://heyashu.in/images/blogs/g_5.jpg)

If you inspect the network tab and click the play button to run a query, you'll see headers and payload, similar to REST API.

```jsx
fetch("http://localhost:4000/", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,hi-IN;q=0.8,hi;q=0.7",
    "content-type": "application/json",
    "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": "\"Android\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "http://localhost:4000/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"query\":\"query ExampleQuery {\\n  books {\\n    id\\n    name\\n  }\\n}\\n\",\"variables\":{},\"operationName\":\"ExampleQuery\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
```

So, like this, you can create relationships between different data sets. You need to learn GraphQL properly, but the goal of this note was to make you familiar with these topics and help you become interview-ready when someone asks you about the difference between REST API and GraphQL. Similarly, you can add mutations into resolvers and typeDefs to handle updates.

For the frontend, there are client libraries like Apollo Client that can make things more efficient. There’s a lot more to learn, but that’s all for now.

Hey your feedback si required for me , please give  [this repo](https://github.com/aherrahul/portfolio-v1/) a star 🌟 if you liked the blog
if you want to contribute in it please feel free to fork , You can see github link on top right corner of top bar or  [click here](https://github.com/aherrahul/portfolio-v1/)


Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.

I am waiting for your feedback, See you in next episode,


Thanks 👋🏻