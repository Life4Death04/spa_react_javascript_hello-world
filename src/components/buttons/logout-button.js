/**
 * A simple logout button component that uses Auth0 for authentication.
 * When clicked, it triggers the logout process and redirects the user to the application's home page.
 */
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    /**
     * When using the logout() method, the Auth0 React SDK clears the application session and redirects to the Auth0 /v2/logout endpoint to clear the Auth0 session under the hood.
     */
    logout({
      /**
       * As with the login method, you can pass an object argument to logout() to customize the logout behavior of the React application. You can define a logoutParams property on that configuration object to define parameters for the /v2/logout call. This process is fairly invisible to the user. See logoutParams for more details on the parameters available.
       */
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <button className="button__logout" onClick={handleLogout}>
      Log Out
    </button>
  );
};
