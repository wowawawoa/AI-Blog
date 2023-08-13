import { createContext, useCallback, useState } from "react";

const PostsContext = createContext({});

export default PostsContext;

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    console.log("POSTS FROM SSR: ", postsFromSSR);
    setPosts(postsFromSSR);
  }, []);

  return (
    <PostsContext.Provider value={{ posts, setPostsFromSSR }}>
      {children}
    </PostsContext.Provider>
  );
};
