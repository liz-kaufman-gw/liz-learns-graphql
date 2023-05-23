# Learning GraphQL

## Notes and examples from <https://www.howtographql.com/>

- [Queries - how to get data](#queries---how-to-get-data)
- [Mutations - how to change data](#mutations---how-to-change-data)
- [Subscriptions - how to get realtime data](#subscriptions---how-to-get-realtime-data)
- [Schemas - how to define data and what you can do with it](#schemas---how-to-define-data-and-what-you-can-do-with-it)

### Queries - how to get data

- Query includes all data requirements, and _only_ the required data (so not fetching everything included in a resource!)

  - This solves overfetching (having to download superflous info from an endpoint) and underfetching (having to make multiple requests to get the exact info needed)
  - Example below - I'm only asking for the title of the posts by a person and only the name of her last three followers. I don't get back the content of her posts or more than three followers or more info than I need about the person or their followers.

- Anatomy of a query:

  - _Field_ -> each bit of info asked for by the query (here, it's `allPersons`, `name`, `posts`, `title`, etc.)
  - _Root field_ -> the "base" field of the query (here, it's `allPersons`)
  - _Payload_ -> everything that follows the root field (all the specified fields inside the `{}` after the root field)
  - _Argument_ -> each field can have arguments as specified in the schema as key-value pairs in `()`

- Examples:

**Query:**

```typescript
query {
    allPersons(id: "abc123") {
        name
        posts {
            title
        }
    }
}
```

**Result:**

```json
{
  "data": {
    "allPersons": {
      "name": "Mary",
      "posts": [{ "title": "Learn GraphQL" }, { "title": "GraphQL is Neat" }],
    }
  }
}
```

**Query:**

```typescript
query {
    allPersons(last: 3) {
        name
    }
}
```

**Result:**

```json
{
  "data": {
    "allPersons": [
      {name: "Mary"},
      {name: "Sue"},
      {name: "Bob"},
    ]
  }
}
```

- Instead of REST's multiple endpoints with clearly defined structure of info they return, GraphQL exposes one single endpoint. This is possible due to how flexible queries are!
- On the back end, you can see what data is being requested thanks to the resolver functions. These functions collect the data for the request, but you can also track and monitor them.

### Mutations - how to change data

- Mutations change data in three different ways (basically completing CRUD!):

  - Creating new data
  - Updating existing data
  - Deleting existing data

- Mutations have similar structures to queries but use the `mutation` keyword instead:

```typescript
mutation {
  createPerson(name: "Bob", age: 36) {
    name
    age
    id
  }
}
```

To which the server would return:

```typescript
"createPerson": { 
  "name": "Bob", 
  "age": 36, 
  id: "askdjfoe12342"
}
```

- Anatomy of a mutation:

  - Still has a _root_ field (here, it's createPerson)
  - Still handing in _arguments_ in `()`
  - Still asking for a _payload_; here, it's name and age, similar to sending back the new object in the response after a POST request with REST, but you can also ask for other info in the payload not related to the data you've added or changed. This way, you can do a mutation and the function of a query in the same trip!

- Usual pattern for IDs: server generates one when a object is created (similar to how REST APIs usually handle POST).

- If you wanted to confirm that the new person was created correctly (and have the id, the info that wasn't available beforehand since you already had name and age), you could just shorten the mutation to:

```typescript
mutation {
  createPerson(name: "Bob", age: 36) {
    id
  }
}
```

### Subscriptions - how to get realtime data

- _Subscriptions_ let you have a realtime connection to a server to get immediate info about important events (stream of info rather than request/response pattern).

  - Subscribing to an event initiates and holds a connection to the server. When that event then happens, the server sends the data to the client.
  - Subscriptions use similar syntax as queries and mutations.

```typescript
subscription { 
  newPerson { 
    name 
    age 
  } 
}
```

- Now, whenever a mutation happens that creates a new person, the server sends over the name and age of the new person to the client.

### Schemas - how to define data and what you can do with it

- GraphQL uses a strong type system to define what data the API can offer.

  - All the types that are exposed in an API are written down in a schema using the GraphQL Schema Definition Language (SDL).
  - This schema serves as the contract between the client and the server to define how a client can access the data.
  - This means that once the FE and BE agree on the schema, both can do their work without having to talk about it further as they're both aware of exactly what data the API is sending.
  - This also makes it easy for FE to quickly mock the required data structure, exactly how it comes in from the API, so they can just flip the switch when they're ready to live data.

- Schemas are collections of GraphQL types.

  - `!` means required
  - Types can contain one-to-many relationships, like between `Person` and `Post` since `posts` is an array of posts.

- Three special _root types_:

  - `type Query { ... }`
  - `type Mutation { ... }`
  - `type Subscription { ... }`

- These root types define entry points for client requests. Example of full schema:

```typescript
type Query { 
  allPersons(last: Int): [Person!]! 
  allPosts(last: Int): [Post!]! 
}

type Mutation { 
  createPerson(name: String!, age: Int!): Person! 
  updatePerson(id: ID!, name: String!, age: String!): Person! 
  deletePerson(id: ID!): Person! 
}

type Subscription { 
  newPerson: Person! 
}

type Person { 
  id: ID! 
  name: String! 
  age: Int! 
  posts: [Post!]! 
}

type Post { 
  title: String! 
  author: Person! 
}
```
