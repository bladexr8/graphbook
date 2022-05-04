import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import InfiniteScroll from 'react-infinite-scroll-component';


const GET_POSTS = gql`{ 
  query postsFeed($page: Int, $limit: Int) { 
    postsFeed(page: $page, limit: $limit) { 
      posts {
        id
        text
        user {
          avatar
          username
        }
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
  // identify if more data to load
  const [hasMore, setHasMore] = useState(true);
  // current page, # of pages scrolled
  const [page, setPage] = useState(0);

  // query Posts using GraphQL
  const { loading, error, data, fetchMore } = useQuery(GET_POSTS, { variables: { page: 0, limit: 10 }});


  // GraphQL Mutation to add a Post
  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      cache.modify({
          fields: {
              postsFeed(existingPostsFeed) {
                  const { posts: existingPosts } = existingPostsFeed;
                  const newPostRef = cache.writeFragment({
                      data: addPost,
                      fragment: gql`
                          fragment NewPost on Post {
                              id
                              type
                          }
                      `
                  });
                  return {
                      ...existingPostsFeed,
                      posts: [newPostRef, ...existingPosts]
                  };
              }
          }
      });
    },
    optimisticResponse: {
      __typename: "mutation",
      addPost: {
        __typename: "Post",
        text: postContent,
        id: -1,
        user: {
          __typename: "User",
          username: "Loading...",
          avatar: "/public/loading.gif"
        }
      }
    }
  });


    // inifinite scroll package runs the "loadMore" function as long as
    // "hasMore" property is set to true and user scrolls to the bottom
    // of browser window.
    const loadMore = (fetchMore) => {
      const self = this;
      // set page index
      fetchMore({
        variables: {
          page: page + 1
        },
        // logic to add new data for feed. check returned array
        // length - if no posts set "hasMore" to false, otherwise
        // build a new postsFeed object inside "newData" variable.
        // The "posts" array is filled the previous query and newly
        // fetched posts. Ultimately the "newData" variables is 
        // returned and saved in client's cache
        updateQuery(previousResult, { fetchMoreResult }) {
          if (!fetchMoreResult.postsFeed.posts.length) {
            setHasMore(false);
            return previousResult;
          }
          setPage(page + 1)
          const newData = {
            postsFeed: {
              __typename: 'PostFeed',
              posts: [
                ...previousResult.postsFeed.posts,
                ...fetchMoreResult.postsFeed.posts
              ]
            }
          };
          return newData;
        }
      })
    }



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
        <InfiniteScroll
          dataLength={posts.length}
          next={() => loadMore(fetchMore)}
          hasMore={hasMore}
          loader={<div className="loader" key={"loader"}>
            Loading ...</div>}
        >
        {posts.map((post, i) =>
          <div key={post.id} className={'post ' + (post.id < 0
            ? 'optimistic': '')}>
            <div className="header">
              <img src={post.user.avatar} />
              <h2>{post.user.username}</h2>
            </div>
            <p className="content">{post.text}</p>
          </div>
        )}
        </InfiniteScroll>
      </div>
    </div>
  )
}
export default Feed