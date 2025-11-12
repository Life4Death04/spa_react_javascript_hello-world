/**
 * ProfilePage - Displays authenticated user information from Auth0's ID Token
 *
 * This component demonstrates how to access and display user profile data
 * that Auth0 provides through the ID Token after successful authentication.
 */

import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { CodeSnippet } from "../components/code-snippet";
import { PageLayout } from "../components/page-layout";

export const ProfilePage = () => {
  /**
   * useAuth0 hook provides access to authentication state and user information.
   *
   * The 'user' object contains decoded information from the ID Token, including:
   * - sub: Unique user identifier from Auth0
   * - name: User's display name
   * - email: User's email address
   * - picture: URL to user's profile picture
   * - email_verified: Whether email has been verified
   * - updated_at: When user profile was last updated
   *
   * This is different from the Access Token (used for API calls).
   * ID Token = User identity information
   * Access Token = API authorization
   */
  const { user } = useAuth0();

  /**
   * Safety check: If user is not authenticated or data hasn't loaded yet,
   * don't render anything. This prevents errors when trying to access user properties.
   *
   * Note: This component is protected by AuthenticationGuard, so user should
   * always be available, but it's good practice to check.
   */
  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          Profile Page
        </h1>
        <div className="content__body">
          <p id="page-description">
            <span>
              You can use the <strong>ID Token</strong> to get the profile
              information of an authenticated user.
            </span>
            <span>
              <strong>Only authenticated users can access this page.</strong>
            </span>
          </p>
          <div className="profile-grid">
            <div className="profile__header">
              {/* 
                Display user's profile picture from Auth0.
                This comes from their social login (Google, Facebook) or uploaded avatar.
              */}
              <img
                src={user.picture}
                alt="Profile"
                className="profile__avatar"
              />
              <div className="profile__headline">
                {/* 
                  User's display name - comes from their Auth0 profile.
                  Could be from social login or manually set during signup.
                */}
                <h2 className="profile__title">{user.name}</h2>
                {/* 
                  User's email address from Auth0.
                  This is typically how users log in and is verified by Auth0.
                */}
                <span className="profile__description">{user.email}</span>
              </div>
            </div>
            <div className="profile__details">
              {/* 
                Display the complete decoded ID Token for educational purposes.
                In production, you'd typically only show specific fields you need.
                
                The ID Token contains standard OpenID Connect claims like:
                - iss: Issuer (your Auth0 domain)
                - aud: Audience (your application)
                - exp: Expiration time
                - iat: Issued at time
                - sub: Subject (unique user ID)
                Plus user profile information
              */}
              <CodeSnippet
                title="Decoded ID Token"
                code={JSON.stringify(user, null, 2)}
              />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
