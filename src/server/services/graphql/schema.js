// graphql schema definitions

/**
 * First, we must define a new type called Post. 
 * A Post type has an id of Int and a text value of String.
 * 
 * For our GraphQL server, we need a type called RootQuery. 
 * The RootQuery type wraps all of the queries a client can run. 
 * It can be anything from requesting all posts, all users, posts 
 * by just one user, and so on. You can compare this to all GET requests as 
 * you find them with common REST APIs.
 * 
 * The paths would be /posts, /users, and /users/ID/posts to represent the GraphQL 
 * API as a REST API. When using GraphQL, we only have one route, and we send the 
 * query as a JSON-like object.
 * 
 * At the end of the JSON-like schema, we add RootQuery to the schema property. 
 * This type is the starting point for the Apollo Server.
 * 
 */
const typeDefinitions = `
  type Post {
    id: Int
    text: String
    user: User
  }
  type PostFeed {
    posts: [Post]
  }
  type User {
    id: Int
    avatar: String
    username: String
  }
  type Message {
    id: Int
    text: String
    chat: Chat
    user: User
  }
  type Chat {
    id: Int
    messages: [Message]
    users: [User]
    lastMessage: Message
  }
  type RootQuery {
    posts: [Post]
    chats: [Chat]
    chat(chatId: Int): Chat
    postsFeed(page: Int, limit: Int): PostFeed
  }
  input PostInput {
    text: String!
  }
  input ChatInput {
    users: [Int]
  }
  input MessageInput {
    text: String!
    chatId: Int!
  }
  type RootMutation {
    addPost (
      post: PostInput!
    ): Post
    addChat (
      chat: ChatInput!
    ): Chat
    addMessage (
      message: MessageInput!
    ): Message
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }  
`;

export default [typeDefinitions];