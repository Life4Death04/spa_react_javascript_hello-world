/**
 * Same shit as LoginButton but for Sign Up xddd, but one new thing...
 */

import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/profile",
      },
      authorizationParams: {
        prompt: "login",
        /**
         * This new property, screen_hint: "signup", is used to tell the Auth0 hosted login page to show the sign-up form instead of the login form. This is useful when you want to provide a dedicated sign-up button in your application.
         */
        screen_hint: "signup",
      },
    });
  };

  return (
    <button className="button__sign-up" onClick={handleSignUp}>
      Sign Up
    </button>
  );
};
