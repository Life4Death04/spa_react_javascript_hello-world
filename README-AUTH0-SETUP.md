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

### Step 3: [Coming Next]

_Protected routes and route guards_

### Step 4: [Coming Next]

_User profile and role management_

---

## ⚠️ Quick Notes

- Environment variables must start with `REACT_APP_`
- Auth0 provider MUST be inside BrowserRouter
- Restart dev server after adding `.env` file

**Current Status:** ✅ Foundation Setup Complete
