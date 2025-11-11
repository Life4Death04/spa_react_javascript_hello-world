/**
 * Here we're setting up a custom Auth0 provider component, this means that any component wrapped within
 * by this provider will have access to Auth0's authentication context and methods. Meaning = they can
 * use Auth0 to log in, log out, and get user information.
 *
 * Imagine this as setting up a phone system in an office building: once the system is in place,
 * anyone in the building can use it to make calls (log in/out, get user info) without needing to
 * set up their own individual phone lines.
 * But it doesn't do anything yet.
 */

/**
 * IMPORTANT: This component has to be place in index.js, as a parent of the Router component from react-router-dom.
 * This is because the Auth0ProviderWithNavigate component uses the useNavigate hook from react-router-dom
 * to handle navigation after authentication. The useNavigate hook relies on being within a Router context.
 * If Auth0ProviderWithNavigate is not a child of Router, the useNavigate hook will not function correctly.
 */

// Import Auth0's React provider component for authentication
import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
// Import navigation hook from React Router v6 for programmatic navigation
import { useNavigate } from "react-router-dom";

/**
 * Custom wrapper component that combines Auth0 authentication with React Router navigation
 * This component acts as a provider that gives all child components access to Auth0's authentication context
 * while properly handling navigation after authentication flows
 */
export const Auth0ProviderWithNavigate = ({ children }) => {
  // Get the navigate function from React Router to handle programmatic navigation
  const navigate = useNavigate();

  // Read Auth0 configuration from environment variables
  // These should be set in your .env file for security
  const domain = process.env.REACT_APP_AUTH0_DOMAIN; // Your Auth0 tenant domain (e.g., "your-app.auth0.com")
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID; // Unique identifier for your Auth0 application
  const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL; // URL where Auth0 redirects after authentication. Imagine it as your "address" for receiving a delivery

  /**
   * Callback function that runs after successful authentication
   * @param {Object} appState - State object that can contain routing information
   * This function handles where to navigate the user after they complete authentication
   * It could sound like the same shit as redirectUri, so check this example:
   * 
   * Imagine auth0 like a food delivery service:
   * User clicks "Login" → "I want to order food (log in)"
    App sends them to Auth0 → "Go to this restaurant (Auth0) to place your order"
    User logs in at Auth0 → "Orders food and pays at the restaurant"
    Auth0 brings them back to redirectUri → "Delivery driver brings food to your address"
    onRedirectCallback runs → "When food arrives, put it on kitchen table (navigate to intended page)"


    Now you getting, this function is usually used for redirecting your users to different pages within your app after they log in. Like if they are admins or simple users.
   */
  const onRedirectCallback = (appState) => {
    // Navigate to the intended destination (returnTo) or stay on current page
    // Uses optional chaining (?.) to safely access appState.returnTo
    navigate(appState?.returnTo || window.location.pathname);
  };

  // Safety check: Ensure all required Auth0 configuration is present
  // If any config is missing, don't render the provider (prevents runtime errors)
  if (!(domain && clientId && redirectUri)) {
    return null;
  }

  // Render the Auth0Provider with all the configuration
  return (
    <Auth0Provider
      domain={domain} // Auth0 tenant domain
      clientId={clientId} // Application client ID
      authorizationParams={{
        redirect_uri: redirectUri, // Where to redirect after login // Keeping in mind the food delivery example: "Here's my address for delivery"
      }}
      onRedirectCallback={onRedirectCallback} // Custom navigation handler  // Keeping in mind the food delivery example: "Here's what to do when delivery arrives"
    >
      {/* Render all child components within the Auth0 context */}
      {children}
    </Auth0Provider>
  );
};
