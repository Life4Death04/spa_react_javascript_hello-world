/**
 * useExternalAPI - Custom hook for calling your own backend API using Auth0 access tokens
 *
 * This hook demonstrates the pattern of using Auth0 as Identity and Access Management (IAM)
 * while your backend handles business logic and custom data storage.
 *
 * Flow:
 * 1. Get Auth0 access token (not ID token)
 * 2. Pass token to YOUR backend API
 * 3. Backend validates token with Auth0
 * 4. Backend serves your custom business data
 */

import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

export const useExternalAPI = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generic API call function that automatically handles Auth0 token retrieval
   * and includes it in requests to your backend.
   *
   * @param {string} endpoint - The API endpoint (e.g., '/api/posts', '/api/user-data')
   * @param {object} options - Fetch options (method, body, headers, etc.)
   * @returns {Promise} - API response data
   */
  const callAPI = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      /**
       * Get access token specifically for YOUR API.
       * This is different from the ID token - access tokens are for API authorization.
       *
       * The audience MUST match your API identifier configured in Auth0 dashboard.
       */
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://my-custom-api.com", // Your API identifier from Auth0
          scope: "read:posts write:posts read:analytics", // Permissions your app needs
        },
      });

      /**
       * Make the actual API call to YOUR backend.
       * Replace 'https://my-backend.com' with your actual backend URL.
       */
      const response = await fetch(`https://my-backend.com${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`, // Auth0 token for your backend
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Example: Get user's custom data from your backend
   * This would call YOUR database, not Auth0's user management API
   */
  const getUserCustomData = async () => {
    return await callAPI("/api/user/profile");
  };

  /**
   * Example: Get user's posts from your backend
   */
  const getUserPosts = async () => {
    return await callAPI("/api/posts");
  };

  /**
   * Example: Create a new post in your backend
   */
  const createPost = async (postData) => {
    return await callAPI("/api/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    });
  };

  /**
   * Example: Get analytics data from your backend
   */
  const getAnalytics = async () => {
    return await callAPI("/api/analytics");
  };

  return {
    // Generic API caller
    callAPI,

    // Specific API functions
    getUserCustomData,
    getUserPosts,
    createPost,
    getAnalytics,

    // Loading and error states
    loading,
    error,
  };
};

/**
 * Example usage in a component:
 *
 * const MyComponent = () => {
 *   const { getUserPosts, createPost, loading, error } = useExternalAPI();
 *   const [posts, setPosts] = useState([]);
 *
 *   const fetchPosts = async () => {
 *     try {
 *       const userPosts = await getUserPosts();
 *       setPosts(userPosts);
 *     } catch (err) {
 *       console.error('Failed to fetch posts:', err);
 *     }
 *   };
 *
 *   const handleCreatePost = async (newPost) => {
 *     try {
 *       const createdPost = await createPost(newPost);
 *       setPosts(prev => [...prev, createdPost]);
 *     } catch (err) {
 *       console.error('Failed to create post:', err);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       {loading && <p>Loading...</p>}
 *       {error && <p>Error: {error}</p>}
 *       {posts.map(post => <div key={post.id}>{post.title}</div>)}
 *     </div>
 *   );
 * };
 */
