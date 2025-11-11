/**
 * Now, the second steps is create the login button that will trigger the loginWithRedirect method from Auth0.
 * This button will be used in our application to initiate the login process.
 * As you can see, the code is pretty straightforward.
 * We import the useAuth0 hook from the @auth0/auth0-react package to access Auth0's authentication methods.
 * Then, we define a LoginButton component that renders a button element.
 */

import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const LoginButton = () => {
  /**
   * Here we are using the useAuth0 hook to get the loginWithRedirect method.
   * This method performs a redirect to the Auth0 hosted login page (/authorize endpoint).
   */
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      /**
       * By setting up the value of appState.returnTo to /profile, you are telling the Auth0 React SDK the following: When my users log in with Auth0 and return to my React application, take them from the default callback URL path, /callback, to the "Profile" page, /profile. If you don't specify this appState.returnTo option, your users will be redirected by default to the / path after they log in.
       */
      appState: {
        returnTo: "/profile",
      },
      /**
       * Now, the authorizationParams with prompt: "login" is used to ensure that the login page is always shown to the user, even if they have an active session. This forces the user to enter their credentials again, which can be useful in scenarios where you want to ensure that the user is actively logging in rather than being automatically authenticated based on an existing session.
       *
       * Other prompt values are:
       * prompt: "none" - Never show login form, fail if not authenticated
       * prompt: "consent" - Always ask for permissions
       * prompt: "select_account" - Show account picker if multiple accounts
       */
      authorizationParams: {
        prompt: "login",
      },
    });
  };

  return (
    <button className="button__login" onClick={handleLogin}>
      Log In
    </button>
  );
};
