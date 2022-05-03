import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';


const GET_POSTS = gql`{ 
  posts { 
    id
    text
    user {
      avatar
      username
    }
  }
}`;

const ADD_POST = gql`
  mutation addPost($post : PostInput!) {
    addPost(post : $post) {
      id
      text
      user {
        username
        avatar
      }
    }
  }
`;

// Main Application Component
const Feed = () => {
  // set initial state
  //const [posts, setPosts] = useState('');
  const [postContent, setPostContent] = useState('');

  // GraphQL Mutation to add a Post
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [{query: GET_POSTS}]
  });

  // query Posts using GraphQL
  const { loading, error, data } = useQuery(GET_POSTS);

  // form handler
  const handleSubmit = (event) => {
    event.preventDefault();
    addPost({
      variables: {
        post: {
          text: postContent
        }
      }
    });
    // update state
    //setPosts([newPost, ...posts]);
    setPostContent('');
  }

  // Loading Posts...
  if (loading) return 'Loading...';
  if (error) return 'Error! ${error.message}';

  // once posts loaded
  const { posts } = data;

  return (
    <div className="container">
      <div className='postForm'>
        <form onSubmit={handleSubmit}>
          <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)}
            placeholder="Write your custom post..." />
        <input type="submit" value="Submit" />
        </form>
      </div>
      <div className="feed">
        { posts.map((post, i) => 
          <div key={post.id} className="post">
            <div className="header">
              <img src={post.user.avatar} />
              <h2>{post.user.username}</h2>
            </div>
            <p className="content">
              {post.text}
            </p>
          </div>  
        )}
      </div>
    </div>
  )
}
export default Feed