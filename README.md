# Learning GraphQL

  - [Notes - BASICS](#notes---basics)

    - [Queries - how to get data](#queries---how-to-get-data)
    - [Mutations - how to change data](#mutations---how-to-change-data)
    - [Subscriptions - how to get realtime data](#subscriptions---how-to-get-realtime-data)
    - [Schemas - how to define data and what you can do with it](#schemas---how-to-define-data-and-what-you-can-do-with-it)

  - [Notes - ADVANCED](#notes---advanced)

    - [Advanced query tools](#advanced-query-tools)

      - [Operation names](#operation-names)
      - [Aliases](#aliases)
      - [Fragments](#fragments)
      - [Variables](#variables)
      - [Directives](#directives)

## Resources

Information and examples in the notes below are distilled from:

- [HowtographQL.com - Core Concepts](https://www.howtographql.com/basics/2-core-concepts/)
- [GraphQL docs - Learn section](https://graphql.org/learn/)

Other resources:

- [Public GraphQL APIs list](https://github.com/graphql-kit/graphql-apis)
- [awesome-graphql](https://github.com/chentsulin/awesome-graphql)
- [How to Fetch Data in React from a GraphQL API](https://www.freecodecamp.org/news/5-ways-to-fetch-data-react-graphql/)

## Notes - BASICS

### Queries - how to get data

A _query_ includes all data requirements, and _only_ the required data (so not fetching everything included in a resource!)

- This solves overfetching (having to download superflous info from an endpoint) and underfetching (having to make multiple requests to get the exact info needed).
- Example below - I'm only asking for the name and the title of posts by the person with that id. If there's other info (address, email, DOB, etc.), my request won't bring it back unless I change the query to ask for it too.

The query has the same shape as the result the server sends back - you always get what you expect.

Instead of REST's multiple endpoints with clearly defined structure of info they return, GraphQL exposes one single endpoint.

Anatomy of a query:

- _Field_ -> each bit of info asked for by the query
- _Root field_ -> the "base" field of the query (here, it's `allPersons`)
- _Payload_ -> everything that follows the root field (all the specified fields inside the `{}` after the root field)
- _Argument_ -> each field can have arguments as specified in the schema as key-value pairs in `()`

Examples:

**Querying by id to find a specific person**

```graphql
query {
    allPersons(id: "abc123") {
        name
        posts {
            title
        }
    }
}
```

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

**Using an argument**

The argument `last` is defined in the schema.

```graphql
query {
    allPersons(last: 3) {
        name
    }
}
```

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

**Using multiple arguments**

Here, the height field is set up in the schema to accept an argument of unit of type Enum with a finite set of options, of which `FOOT` is one.

```graphql
{ 
  human(id: "1000") { 
    name 
    height(unit: FOOT) 
  } 
}
```

```json
{ 
  "data": { 
    "human": { 
      "name": "Luke Skywalker", 
      "height": 5.6430448 
    }
  } 
}
```

### Mutations - how to change data

Mutations change data in three different ways (basically completing CRUD!):

- Creating new data
- Updating existing data
- Deleting existing data

While query fields are executed in parallel, mutation fields run in series, one after the other. If two mutations are in the same request, the first has to finish before the second begins (synchronous) to avoid race conditions.

Mutations have similar structures to queries but use the `mutation` keyword instead:

```graphql
mutation {
  createPerson(name: "Bob", age: 36) {
    name
    age
    id
  }
}
```

To which the server would return:

```json
"createPerson": { 
  "name": "Bob", 
  "age": 36, 
  "id": "askdjfoe12342"
}
```

Anatomy of a mutation:

- Still has a _root_ field (here, it's createPerson)
- Still handing in _arguments_ in `()`
- Still asking for a _payload_; here, it's name and age, similar to sending back the new object in the response after a POST request with REST, but you can also ask for other info in the payload not related to the data you've added or changed. This way, you can do a mutation and the function of a query in the same trip!

Usual pattern for IDs: server generates one when a object is created (similar to how REST APIs usually handle POST).

If you wanted to confirm that the new person was created correctly (and have the id, the info that wasn't available beforehand since you already had name and age), you could just shorten the mutation to:

```graphql
mutation {
  createPerson(name: "Bob", age: 36) {
    id
  }
}
```

### Subscriptions - how to get realtime data

_Subscriptions_ let you have a realtime connection to a server to get immediate info about important events (stream of info rather than request/response pattern).

- Subscribing to an event initiates and holds a connection to the server. When that event then happens, the server sends the data to the client.
- Subscriptions use similar syntax as queries and mutations.

```graphql
subscription { 
  newPerson { 
    name 
    age 
  } 
}
```

Now, whenever a mutation happens that creates a new person, the server sends over the name and age of the new person to the client.

### Schemas - how to define data and what you can do with it

GraphQL uses a strong type system to define what data the API can offer.

- All the types that are exposed in an API are written down in a schema using the GraphQL Schema Definition Language (SDL).
- This schema serves as the contract between the client and the server to define how a client can access the data.
- This means that once the FE and BE agree on the schema, both can do their work without having to talk about it further as they're both aware of exactly what data the API is sending.
- This also makes it easy for FE to quickly mock the required data structure, exactly how it comes in from the API, so they can just flip the switch when they're ready to live data.

Schemas are collections of GraphQL types.

- `!` means required
- Types can contain one-to-many relationships, like between `Person` and `Post` since `posts` is an array of posts.

Three special _root types_:

- `type Query { ... }`
- `type Mutation { ... }`
- `type Subscription { ... }`

These root types define entry points for client requests.

Example of full schema:

```graphql
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

👀 See [this page] on the GraphQL docs for more information on schemas! 👀

## Notes - ADVANCED

### Advanced query tools

#### Operation names

You can name queries or other operations with an _operation name_.

- This is optional and gives a meaningful name for the operation and is useful in documents with multiple operations.
- You can look for the operation name in logs and errors when debugging!
- This is similar to how you can either have anonymous or named functions in JS.

After the operation type (query, mutation, or subscription), add the name before opening the `{}`. In the example, the operation name is `HeroNameAndFriends`.

```graphql
query HeroNameAndFriends {
  hero {
    name
    friends {
      name
    }
  }
}
```

#### Aliases

_Aliases_ let you rename fields in the resulting data.

- If we want to get info on two different heroes in the same query, our results JSON would try to include two identical keys of `"name"`, which wouldn't work since key names need to be unique.
- Instead, aliases let us rename them to `"empireHero"` and `"jediHero"`.

Because you can't do:

```graphql
{ 
  { 
    hero(episode: EMPIRE) { 
      name 
    } 
    hero(episode: JEDI) { 
      name 
    } 
  }
}
```

You can use aliases to do this instead:

```graphql
{ 
  { 
    empireHero: hero(episode: EMPIRE) { 
      name 
    } 
    jediHero: hero(episode: JEDI) { 
      name 
    } 
  }
}
```

Resulting in:

```json
{ 
  "data": { 
    "empireHero": { 
      "name": "Luke Skywalker" 
    }, 
    "jediHero": { 
      "name": "R2-D2" 
    } 
  } 
}
```

#### Fragments

_Fragments_ let you construct a set of fields that you'll use multiple times in a query and condense them into a set you can call again and again (almost like saving them in a variable).

Example:

- We need two heroes to compare (aliased accordingly) with an identical set of fields.
- We can create a fragment of the fields (`comparisonFields`) on type `Character` to use in the query instead of rewriting the same set of fields each time.
- We access the fragment with the spread operator. You can use the fragment as many times as you want.

```graphql
{ 
  leftComparison: hero(episode: EMPIRE) { 
    ...comparisonFields 
  } 
  rightComparison: hero(episode: JEDI) { 
    ...comparisonFields 
  } 
}

fragment comparisonFields on Character { 
  name 
  appearsIn 
  friends { 
    name 
  } 
}
```

```json
{
  "data": {
    "leftComparison": {
      "name": "Luke Skywalker",
      "appearsIn": ["NEWHOPE", "EMPIRE", "JEDI"],
      "friends": [
        { "name": "Han Solo" },
        { "name": "Leia Organa" },
        { "name": "C-3PO" },
        { "name": "R2-D2" }
      ]
    },
    "rightComparison": {
      "name": "R2-D2",
      "appearsIn": ["NEWHOPE", "EMPIRE", "JEDI"],
      "friends": [
        { "name": "Luke Skywalker" },
        { "name": "Han Solo" },
        { "name": "Leia Organa" }
      ]
    }
  }
}
```

#### Variables

_Variables_ allow for dynamic argument fields, where GraphQL grabs the dynamic values out of the query and passes them through as a separate dictionary.

The alternative would be trying to dynamically manipulate the query at runtime and then make sure it was still a properly GraphQL-specific format. We want to avoid manually interpolating the string!

Steps:

1. Replace the static value in the query with `$variableName`
2. Declare `$variableName` as one of the variables accepted by the query
3. Pass `variableName: value` in the separate, transport-specific (usually JSON) variables dictionary

This is a lot like the parameterized queries in SQL, only with the variables and values in a separate object rather than an array.

So the query looks like:

```graphql
query HeroNameAndFriends($episode: Episode = PHANTOM) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
```

(You can add a default value with `=` just like in JS/React, like `PHANTOM` here.)

The separate JSON with the variable definitions looks like:

```json
{
  "episode": "JEDI"
}
```

And the results are:

```json
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```

#### Directives

_Directives_ let us dynamically change the structure of our queries with boolean variables. This avoids having to do string manipulation to add/remove fields in a query!

Two core directives:

- `@include(if: Boolean)` - only include this field in the results if true
- `@skip(if: Boolean)` - only skip this field if the results if true (the opposite)

Query:

```graphql
query Hero($episode: Episode, $withFriends: Boolean!) {
  hero(episode: $episode) {
    name
    friends @include(if: $withFriends) {
      name
    }
  }
}
```

If this variables object is included:

```json
{
  "episode": "JEDI",
  "withFriends": false
}
```

Results only show:

```json
{
  "data": {
    "hero": {
      "name": "R2-D2"
    }
  }
}
```

Instead, if the variables object is:

```json
{
  "episode": "JEDI",
  "withFriends": true
}
```

Results show:

```json
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```
