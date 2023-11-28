import { User } from "./../node_modules/.prisma/client/index.d";
export const typeDefs = `#graphql

  type Query {
    user:User
    users:[User]
    posts:[Post]
    profile(id:ID!):Profile
  }

  type Mutation{
    signup(
      name:String!
      email:String!
      password:String!
      bio: String
      ): AuthPayload

      signin(
        email:String!
        password:String!
      ): AuthPayload

      addPost(
        title:String!
        content:String!
      ):PostPayload
  }

type AuthPayload {
  userError:String
  token: String
}

type PostPayload {
  userError:String
  post: Post
}

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User
    createdAt: String!
    published: Boolean!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    posts: [Post]
  }

  type Profile {
    id: ID!
    bio: String!
    createdAt: String!
    user: User!
  }
`;
