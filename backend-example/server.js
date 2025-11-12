/**
 * Example Node.js/Express backend that validates Auth0 tokens
 * and serves custom business data
 *
 * This demonstrates how your backend can use Auth0 purely as an IAM service
 * while handling your own business logic and data storage.
 *
 * Setup requirements:
 * 1. npm install express express-oauth2-jwt-bearer cors dotenv
 * 2. Create API in Auth0 dashboard with identifier: https://my-custom-api.com
 * 3. Set environment variables (see below)
 */

const express = require("express");
const { auth } = require("express-oauth2-jwt-bearer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow requests from your React app
app.use(express.json());

/**
 * Auth0 JWT validation middleware
 *
 * This validates that incoming tokens are:
 * - Valid JWT tokens signed by Auth0
 * - Have the correct audience (your API identifier)
 * - Are not expired
 * - Come from your Auth0 domain
 */
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE || "https://my-custom-api.com",
  issuerBaseURL: process.env.AUTH0_DOMAIN || "https://your-domain.auth0.com/",
  tokenSigningAlg: "RS256",
});

/**
 * Optional: Scope validation middleware
 * Checks that the token has required permissions/scopes
 */
const requireScope = (requiredScope) => {
  return (req, res, next) => {
    const scopes = req.auth?.scope?.split(" ") || [];

    if (!scopes.includes(requiredScope)) {
      return res.status(403).json({
        error: "Insufficient permissions",
        required: requiredScope,
        provided: scopes,
      });
    }

    next();
  };
};

// ===============================
// PROTECTED API ROUTES
// ===============================

/**
 * Get user's custom profile data
 * This demonstrates linking Auth0 user ID to your own data
 */
app.get(
  "/api/user/profile",
  jwtCheck,
  requireScope("read:profile"),
  async (req, res) => {
    try {
      const userId = req.auth.sub; // Auth0 user ID from token

      // Query YOUR database using Auth0 user ID
      const userProfile = await getUserProfileFromDB(userId);

      if (!userProfile) {
        // First time user - create default profile
        const newProfile = await createDefaultProfile(userId);
        return res.json(newProfile);
      }

      res.json(userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * Get user's posts
 */
app.get(
  "/api/posts",
  jwtCheck,
  requireScope("read:posts"),
  async (req, res) => {
    try {
      const userId = req.auth.sub;

      // Get posts from YOUR database
      const posts = await getPostsByUserId(userId);

      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * Create new post
 */
app.post(
  "/api/posts",
  jwtCheck,
  requireScope("write:posts"),
  async (req, res) => {
    try {
      const userId = req.auth.sub;
      const { title, content, category } = req.body;

      // Validate input
      if (!title || !content) {
        return res
          .status(400)
          .json({ error: "Title and content are required" });
      }

      // Save to YOUR database
      const newPost = await createPost({
        userId,
        title,
        content,
        category,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

/**
 * Get user analytics
 */
app.get(
  "/api/analytics",
  jwtCheck,
  requireScope("read:analytics"),
  async (req, res) => {
    try {
      const userId = req.auth.sub;

      // Generate analytics from YOUR database
      const analytics = await getUserAnalytics(userId);

      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ===============================
// DATABASE FUNCTIONS (Examples)
// ===============================

/**
 * These are example functions - replace with your actual database logic
 * Could be MongoDB, PostgreSQL, MySQL, etc.
 */

async function getUserProfileFromDB(userId) {
  // Example: Query your database for user profile
  // return await UserProfile.findOne({ authId: userId });
  return {
    id: 1,
    authId: userId,
    displayName: "John Doe",
    bio: "Software developer",
    preferences: { theme: "dark", notifications: true },
    createdAt: "2023-01-01T00:00:00Z",
  };
}

async function createDefaultProfile(userId) {
  // Example: Create default profile for new user
  // return await UserProfile.create({ authId: userId, ... });
  return {
    id: Date.now(),
    authId: userId,
    displayName: "New User",
    bio: "",
    preferences: { theme: "light", notifications: true },
    createdAt: new Date().toISOString(),
  };
}

async function getPostsByUserId(userId) {
  // Example: Get user's posts from database
  // return await Post.find({ userId }).sort({ createdAt: -1 });
  return [
    {
      id: 1,
      userId,
      title: "My first post",
      content: "Hello world!",
      category: "general",
      createdAt: "2023-01-01T00:00:00Z",
    },
  ];
}

async function createPost(postData) {
  // Example: Save post to database
  // return await Post.create(postData);
  return {
    id: Date.now(),
    ...postData,
  };
}

async function getUserAnalytics(userId) {
  // Example: Generate analytics data
  return {
    userId,
    totalPosts: 5,
    totalViews: 120,
    lastLogin: new Date().toISOString(),
    popularCategories: ["tech", "programming"],
  };
}

// ===============================
// SERVER STARTUP
// ===============================

app.listen(port, () => {
  console.log(`🚀 API server running on port ${port}`);
  console.log(`🔐 Auth0 audience: ${process.env.AUTH0_AUDIENCE}`);
  console.log(`🏠 Auth0 domain: ${process.env.AUTH0_DOMAIN}`);
});

/**
 * Environment Variables (.env file):
 *
 * AUTH0_DOMAIN=https://your-domain.auth0.com/
 * AUTH0_AUDIENCE=https://my-custom-api.com
 * PORT=3001
 *
 * Database connection variables would go here too:
 * DATABASE_URL=postgresql://username:password@localhost:5432/mydb
 */
