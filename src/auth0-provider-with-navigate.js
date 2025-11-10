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
  const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL; // URL where Auth0 redirects after authentication

  /**
   * Callback function that runs after successful authentication
   * @param {Object} appState - State object that can contain routing information
   * This function handles where to navigate the user after they complete authentication
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
        redirect_uri: redirectUri, // Where to redirect after login
      }}
      onRedirectCallback={onRedirectCallback} // Custom navigation handler
    >
      {/* Render all child components within the Auth0 context */}
      {children}
    </Auth0Provider>
  );
};
