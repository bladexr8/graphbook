import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { selectionSetMatchesResult } from '@apollo/client/cache/inmemory/helpers';

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

// Main Application Component
const Feed = () => {
  // set initial state
  //const [posts, setPosts] = useState('');
  const [postContent, setPostContent] = useState('');

  // query Posts using GraphQL
  const { loading, error, data } = useQuery(GET_POSTS);

  // form handler
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('handleSubmit...');
    const newPost = {
      id: posts.length + 1,
      text: postContent,
      user: {
        avatar: '/uploads/avatar1.png',
        username: 'Fake User'
      }
    };
    console.log(newPost);
    // update state
    setPosts([newPost, ...posts]);
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