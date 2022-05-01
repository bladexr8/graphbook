
const posts = [
  {
    id: 2,
    text: 'Lorem ipsum',
      user: {
        avatar: '/uploads/avatar1.png',
        username: 'Test User'
      }
  },
  {
    id: 1,
    text: 'Lorem ipsum',
    user: {
      avatar: '/uploads/avatar2.png',
      username: 'Test User 2'
    }
  }
];

/**
 * The resolvers object holds all types as a property. 
 * Here, we set up RootQuery, holding the posts query 
 * in the same way as we did in our schema. The resolvers 
 * object must equal the schema but be recursively merged. 
 * If you want to query a subfield, such as the user of a 
 * post, you have to extend the resolvers object with a 
 * Post object containing a user function next to RootQuery.
 * 
 * If we send a query for all posts, the posts function is executed.
 */
const resolvers = {
  RootQuery: {
    posts(root, args, context) {
      return posts;
    },
  },
  RootMutation: {
    addPost(root, { post, user }, context) {
      const postObject = {
        ...post,
        user,
        id: posts.length + 1,
      };
      posts.push(postObject);
      return postObject;
    }
  }
};

export default resolvers;