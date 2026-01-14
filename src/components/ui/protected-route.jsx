import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({children}) => {
  const{isSignedIn,user,isLoaded} =useUser();
  const{pathname}=useLocation();

  // Debug logging
  console.log("ProtectedRoute - isLoaded:", isLoaded);
  console.log("ProtectedRoute - isSignedIn:", isSignedIn);
  console.log("ProtectedRoute - user:", user);
  console.log("ProtectedRoute - pathname:", pathname);
  console.log("ProtectedRoute - user role:", user?.unsafeMetadata?.role);

  // Wait for user data to load
  if (!isLoaded) {
    console.log("ProtectedRoute - Still loading user data...");
    return null; // or a loading spinner
  }

  // If user is not signed in, redirect to login
  if (!isSignedIn) {
    console.log("ProtectedRoute - User not signed in, redirecting to login...");
    return <Navigate to="/?sign-in=true" />;
  }

  // If user is signed in but doesn't have a role and is not on onboarding page, redirect to onboarding
  if (!user?.unsafeMetadata?.role && pathname !== "/onboarding") {
    console.log("ProtectedRoute - User signed in but no role, redirecting to onboarding...");
    return <Navigate to="/onboarding" />;
  }

  // Allow access to the requested page
  console.log("ProtectedRoute - Allowing access to page...");
  return children;
};

export default ProtectedRoute;