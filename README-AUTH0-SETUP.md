# 🔐 Auth0 React Setup Guide

> **Step-by-step guide for integrating Auth0 into React projects**

## 📋 Setup Steps

### Step 1: Setting Up Auth0 Provider

**What you're doing:** Creating the foundation for Auth0 authentication in your React app.

**Actions needed:**

1. **Install Auth0 package:**

   ```bash
   npm install @auth0/auth0-react
   ```

2. **Set up environment variables:**

   - Create `.env` file in project root
   - Add your Auth0 credentials (domain, client ID, callback URL)

3. **Create Auth0 provider component:**

   - Create `src/auth0-provider-with-navigate.js`
   - See this file for complete implementation and detailed explanations

4. **Update app entry point:**
   - Modify `src/index.js`
   - Wrap your app with the Auth0 provider
   - **Important:** Must be inside BrowserRouter

**Files to reference:**

- `src/auth0-provider-with-navigate.js` - Complete provider setup with explanations
- `src/index.js` - Example of correct component wrapping

**Result:** Your app now has Auth0 context available throughout, but no actual login/logout functionality yet.

---

### Step 2: Adding Session Buttons

**What you're doing:** Creating login, signup, and logout buttons that trigger Auth0 authentication.

**Actions needed:**

1. **Create login button:**

   - Add `useAuth0` hook to access `loginWithRedirect` method
   - Configure `appState.returnTo` for post-login navigation
   - Set `authorizationParams.prompt` for login behavior

2. **Create signup button:**

   - Similar to login but with `screen_hint: "signup"` parameter
   - Forces Auth0 to show signup form instead of login form

3. **Create logout button:**
   - Use `logout` method from `useAuth0` hook
   - Configure `logoutParams.returnTo` for post-logout navigation

**Files to reference:**

- `src/components/buttons/login-button.js` - Login implementation with prompt options explained
- `src/components/buttons/signup-button.js` - Signup with screen_hint parameter
- `src/components/buttons/logout-button.js` - Logout configuration

**Result:** Users can now login, signup, and logout, with proper redirects configured.

---

### Step 3: Adding Route Guards

**What you're doing:** Creating a "watchman" that protects routes from unauthorized access and handles authentication flow.

**Actions needed:**

1. **Create authentication guard component:**

   - Use `withAuthenticationRequired` HOC from Auth0
   - Configure loading state during authentication checks
   - Handle redirecting behavior for unauthenticated users

2. **Implement guard in routes:**

   - Wrap protected components with `AuthenticationGuard`
   - Apply to routes that need user authentication
   - Leave public routes unprotected

3. **Handle loading states:**
   - Show loading spinner during Auth0 initialization
   - Prevent flash of unauthenticated content
   - Use `isLoading` from `useAuth0` hook

**Files to reference:**

- `src/components/authentication-guard.js` - Guard implementation with Auth0 HOC
- `src/app.js` - Route structure showing protected vs public routes
- `src/components/page-loader.js` - Loading component for auth states

**Result:** Protected routes are secure, unauthorized users get redirected to login, and users return to intended route after authentication.

---

### Step 4: Accessing User Information

**What you're doing:** Displaying and using authenticated user data from Auth0's ID Token.

**Actions needed:**

1. **Access user object from Auth0:**

   - Use `useAuth0` hook to get user information
   - Extract user data from decoded ID Token
   - Handle loading states and null checks

2. **Display user profile data:**

   - Show user's name, email, and profile picture
   - Access standard OpenID Connect claims
   - Use user.sub for unique user identification

3. **Understand token differences:**
   - ID Token = User identity information (what this step uses)
   - Access Token = API authorization (for calling your backend)
   - Refresh Token = Getting new tokens without re-login

**Files to reference:**

- `src/pages/profile-page.js` - Complete user information display with explanations
- `src/components/authentication-guard.js` - How protection enables safe user access

**Result:** You can safely access and display user profile information throughout your protected components.

---

### Step 5: Integrating React into External API Server

**What you're doing:** Using Auth0 as Identity and Access Management (IAM) to protect your own custom backend API.

**Actions needed:**

1. **Create custom API hook:**

   - Use `getAccessTokenSilently` to get access tokens (not ID tokens)
   - Configure audience to match your API identifier
   - Include token in Authorization header for backend calls

2. **Set up backend token validation:**

   - Install `express-oauth2-jwt-bearer` for token validation
   - Configure Auth0 domain and audience validation
   - Apply middleware to protect your API endpoints

3. **Link Auth0 users to your data:**
   - Use `req.auth.sub` (Auth0 user ID) to identify users in your database
   - Store custom business data linked to Auth0 user identifiers
   - Handle scopes/permissions for different API operations

**Files to reference:**

- `src/hooks/useExternalAPI.js` - Custom hook for calling your backend with Auth0 tokens
- `backend-example/server.js` - Complete Node.js/Express backend example with token validation

**Result:** Your React app can securely call your own backend API using Auth0 access tokens, while Auth0 handles user management and your backend handles business logic.

---

## ⚠️ Quick Notes

- Environment variables must start with `REACT_APP_`
- Auth0 provider MUST be inside BrowserRouter
- Restart dev server after adding `.env` file

**Current Status:** ✅ Foundation Setup Complete

---

## 🎯 Auth0 Authorization Summary

### Frontend (React SPA)

**Goal:** Request access tokens for your API and send them with API calls.

#### 1. Configure Auth0Provider
Set `audience` and `scope` so tokens are valid for your API:

```javascript
<Auth0Provider
  domain="dev-67czjt1nv3ynlrgj.us.auth0.com"  // Your Auth0 tenant
  clientId="YOUR_CLIENT_ID"
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience: "https://my-custom-api.com",    // Your API Identifier from Auth0 Dashboard
    scope: "read:posts write:posts",          // Permissions you need
  }}
>
  {children}
</Auth0Provider>
```

#### 2. Get Access Token & Call API
Use `getAccessTokenSilently()` to fetch a token, then send it in `Authorization` header:

```javascript
const { getAccessTokenSilently } = useAuth0();

const callAPI = async () => {
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: "https://my-custom-api.com",
      scope: "read:posts",
    },
  });

  const response = await fetch('https://my-backend.com/api/posts', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.json();
};
```

**Key Points:**
- `audience` = which API the token is for
- Token includes `aud: "https://my-custom-api.com"` and `permissions` (if RBAC enabled)
- Frontend doesn't enforce permissions; just requests them and sends tokens

---

### Backend (Your API)

**Goal:** Validate tokens and enforce permissions.

#### 1. Create Middleware
Validate JWT signature, `aud`, `iss`, and expiration:

```typescript
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';

export const validateAccessToken = auth({
  audience: "https://my-custom-api.com",          // Must match your API Identifier
  issuerBaseURL: "https://dev-67czjt1nv3ynlrgj.us.auth0.com",  // Your Auth0 domain
  tokenSigningAlg: 'RS256',
});

export const checkPermissions = (permissions: string[]) => {
  return requiredScopes(...permissions);
};
```

#### 2. Protect Routes
Apply middleware to enforce token validation and permissions:

```typescript
// Public - no token
app.get('/api/public', (req, res) => {
  res.json({ msg: 'Public' });
});

// Protected - token required
app.get('/api/posts', validateAccessToken, (req, res) => {
  res.json([{ id: 1, title: 'Post' }]);
});

// Protected + permission check
app.post('/api/posts', 
  validateAccessToken, 
  checkPermissions(['write:posts']), 
  (req, res) => {
    res.status(201).json({ ok: true });
  }
);
```

**Key Points:**
- Validates `aud` matches your API Identifier
- Validates `iss` is your Auth0 domain
- Checks signature via Auth0's JWKS
- Enforces `permissions` or `scope` from token
- Rejects invalid/expired/mismatched tokens

---

### Auth0 Dashboard Setup

**Goal:** Define your API and permissions.

#### 1. Create API
- **Applications** → **APIs** → **Create API**
- **Name:** "My Custom API" (friendly name)
- **Identifier:** `https://my-custom-api.com` (this is your `audience`)
- **Signing Algorithm:** RS256

#### 2. Enable RBAC & Permissions
- **Settings** tab:
  - ✅ Enable RBAC
  - ✅ Add Permissions in the Access Token
- **Permissions** tab:
  - Add: `read:posts`, `write:posts`, `read:analytics`, etc.

#### 3. Create Roles & Assign to Users
- **User Management** → **Roles** → Create roles (e.g., `post_admin`)
- Attach permissions to roles
- Assign roles to users

**Key Points:**
- API in Auth0 = metadata/config, not the actual API code
- `audience` (Identifier) = unique string that identifies your API
- Permissions go into the access token when RBAC is enabled
- Your backend validates tokens; Auth0 just issues them

---

### Complete Flow

**Step-by-Step:**

1. **User logs in via SPA**
   - SPA redirects to Auth0 login
   - User authenticates

2. **Auth0 issues tokens**
   - **ID Token:** User profile info (for SPA display)
   - **Access Token:** For calling your API
     - Contains `aud: "https://my-custom-api.com"`
     - Contains `permissions: ["read:posts", "write:posts"]` (if RBAC enabled)

3. **SPA calls your API**
   - Gets access token via `getAccessTokenSilently()`
   - Sends request with `Authorization: Bearer <token>`

4. **Backend validates token**
   - Middleware checks:
     - ✅ `aud` === `"https://my-custom-api.com"`
     - ✅ `iss` === `"https://dev-67czjt1nv3ynlrgj.us.auth0.com"`
     - ✅ Signature valid (via JWKS from Auth0)
     - ✅ Not expired
   - If valid, extracts `permissions`

5. **Backend enforces authorization**
   - Checks if token has required permission (e.g., `write:posts`)
   - ✅ Has permission → allow request
   - ❌ Missing permission → reject (403)

6. **Backend returns data**
   - SPA receives response and displays it

---

### Key Concepts Recap

| Term | What It Is | Where It's Used |
|------|-----------|-----------------|
| **audience** | API Identifier (e.g., `https://my-custom-api.com`) | Frontend (requests token for it), Backend (validates it) |
| **domain** | Auth0 tenant URL (e.g., `dev-67czjt1nv3ynlrgj.us.auth0.com`) | Frontend (login), Backend (issuer validation) |
| **scope** | Requested permissions (e.g., `read:posts write:posts`) | Frontend (what you want in token) |
| **permissions** | Granted permissions in token (from RBAC) | Backend (what you enforce) |
| **Access Token** | JWT for calling your API | SPA → API in `Authorization` header |
| **ID Token** | User profile info | SPA only (display user info) |

---

### Why Each Piece Matters

- **audience in frontend:** Tells Auth0 "I need a token **for this API**" → token gets `aud` claim
- **audience in backend:** Validates "This token is **for me**" → rejects tokens for other APIs
- **RBAC + Permissions:** Adds `permissions` array to token → backend enforces fine-grained access
- **Middleware validation:** Ensures token is authentic, not tampered, not expired, and meant for your API
- **Permission checks:** Ensures user is authorized to perform specific actions (read vs write)

---

**Complete Picture:** Auth0 = IAM issuing tokens. Your code = frontend requests them, backend validates and enforces them. 🎯
