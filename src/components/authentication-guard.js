/**
 * AuthenticationGuard - A reusable "bouncer" component that protects routes from unauthorized access.
 *
 * This component acts like a security checkpoint:
 * - If user is authenticated → renders the protected component
 * - If user is NOT authenticated → redirects to Auth0 login page
 * - After login → brings user back to the route they originally tried to access
 *
 * Without this guard, protected routes would crash when trying to access user data.
 */

import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import { PageLoader } from "./page-loader";

export const AuthenticationGuard = ({ component }) => {
  /**
   * withAuthenticationRequired is Auth0's Higher-Order Component (HOC) that:
   * 1. Wraps our component with authentication logic
   * 2. Checks if user is authenticated before rendering
   * 3. Automatically handles login redirects and return navigation
   * 4. Prevents crashes by ensuring user is authenticated before component mounts
   */
  const Component = withAuthenticationRequired(component, {
    /**
     * onRedirecting: What to show while the authentication check happens and redirect occurs
     * This prevents users from seeing:
     * - Blank screens
     * - Error messages
     * - Flash of unauthenticated content
     *
     * Instead, they see a smooth loading experience during the security check.
     */
    onRedirecting: () => (
      <div className="page-layout">
        <PageLoader />
      </div>
    ),
  });

  /**
   * Return the auth-protected version of our component.
   * Now it's safe to use useAuth0() hooks and access user data inside the component.
   */
  return <Component />;
};
