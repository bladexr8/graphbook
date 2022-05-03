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
    Message: {
      user(message, args, context) {
        return message.getUser();
      },
      chat(message, args, context) {
        return message.getChat();
      },
    },
    Chat: {
      messages(chat, args, context) {
        return chat.getMessages({ order: [['id', 'ASC']] });
      },
      users(chat, args, context) {
        return chat.getUsers();
      },
      lastMessage(chat, args, context) {
        return chat.getMessages({
          limit: 1,
          order: [['id', 'DESC']]
        }).then((message) => {
          return message[0];
        })
      }
    },
    RootQuery: {
      //posts(root, args, context) {
      //  return posts;
      //},
      posts(root, args, context) {
        logger.log({ level: 'info', message: 'Querying Database for all Posts...' });
          return Post.findAll({order: [['createdAt', 'DESC']]});
      },
      chats(root, args, context) {
        return User.findAll().then((users) => {
          if (!users.length) {
            return [];
          }
          const usersRow = users[0];
     
          return Chat.findAll({
            include: [{
              model: User,
              required: true,
              through: { where: { userId: usersRow.id } },
            },
            {
              model: Message,
            }],
          });
        });
      },
      chat(root, { chatId }, context) {
        return Chat.findByPk(chatId, {
          include: [{
            model: User,
            required: true,
          },
          {
            model: Message,
          }],
        });
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
      addChat(root, { chat }, context) {
        return Chat.create().then((newChat) => {
          return Promise.all([
            newChat.setUsers(chat.users),
          ]).then(() => {
            logger.log({
              level: 'info',
              message: 'Message was created',
            });
            return newChat;
          });
        });
      },
      addMessage(root, { message }, context) {
        return User.findAll().then((users) => {
          const usersRow = users[0];
       
          return Message.create({
            ...message,
          }).then((newMessage) => {
            return Promise.all([
              newMessage.setUser(usersRow.id),
              newMessage.setChat(message.chatId),
            ]).then(() => {
              logger.log({
                level: 'info',
                message: 'Message was created',
              });
              return newMessage;
            });
          });
        });
      },
    }
  };

  return resolvers;
}