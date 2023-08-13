import { createContext, useCallback, useReducer, useState } from "react";

const PostsContext = createContext({});

export default PostsContext;

function postReducer(state, action) {
  switch (action.type) {
    case "addPosts": {
      const newPosts = [...state];
      action.posts.forEach((post) => {
        const exists = newPosts.find((p) => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    case "deletePost": {
      const newPosts = [];
      state.forEach((post) => {
        if (post._id !== action.postId) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    default: {
      return state;
    }
  }
}

export const PostsProvider = ({ children }) => {
  const [posts, dispatch] = useReducer(postReducer, []);
  const [noMorePosts, setNoMorePosts] = useState(false);

  const deletePost = useCallback((postId) => {
    dispatch({ type: "deletePost", postId });
    // setPosts((value) => {
    //   const newPosts = [];
    //   value.forEach((post) => {
    //     if (post._id !== postId) {
    //       newPosts.push(post);
    //     }
    //   });
    //   return newPosts;
    // });
  }, []);

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    dispatch({ type: "addPosts", posts: postsFromSSR });
    // setPosts(postsFromSSR);
    // setPosts((value) => {
    //   const newPosts = [...value];
    //   postsFromSSR.forEach((post) => {
    //     const exists = newPosts.find((p) => p._id === post._id);
    //     if (!exists) {
    //       newPosts.push(post);
    //     }
    //   });
    //   return newPosts;
    // });
  }, []);

  const getPosts = useCallback(
    async ({ lastPostDate, getNewerPosts = false }) => {
      const result = await fetch("/api/getPosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lastPostDate, getNewerPosts }),
      });

      const json = await result.json();
      const postsResult = json.posts || [];

      if (postsResult.length < 5) {
        setNoMorePosts(true);
      }

      dispatch({ type: "addPosts", posts: postsResult });
      // setPosts((value) => {
      //   const newPosts = [...value];
      //   postsResult.forEach((post) => {
      //     const exists = newPosts.find((p) => p._id === post._id);
      //     if (!exists) {
      //       newPosts.push(post);
      //     }
      //   });
      //   return newPosts;
      // });
    },
    []
  );

  return (
    <PostsContext.Provider
      value={{ posts, setPostsFromSSR, getPosts, noMorePosts, deletePost }}
    >
      {children}
    </PostsContext.Provider>
  );
};
