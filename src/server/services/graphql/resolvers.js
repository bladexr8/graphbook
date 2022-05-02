import logger from '../../helpers/logger';


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

export default function resolver() {
  const { db } = this;
  const { Post, User, Chat, Message } = db.models;

  const resolvers = {
    Post: {
      user(post, args, context) {
        return post.getUser();
      },
    },
    RootQuery: {
      //posts(root, args, context) {
      //  return posts;
      //},
      posts(root, args, context) {
        logger.log({ level: 'info', message: 'Querying Database for all Posts...' });
          return Post.findAll({order: [['createdAt', 'DESC']]});
        },
    },
    RootMutation: {
      addPost(root, { post }, context) { 
          return User.findAll().then((users) => {
            const usersRow = users[0];
            
            return Post.create({
              ...post,
            }).then((newPost) => {
              return Promise.all([
                newPost.setUser(usersRow.id),
              ]).then(() => {
                logger.log({
                  level: 'info',
                  message: 'Post was created',
                });
                return newPost;
              });
            });
          });
        },
    }
  };

  return resolvers;
}