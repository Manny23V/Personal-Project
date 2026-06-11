import { useState, useEffect } from "react";
import { useAuth } from "./useAuth.js";

import { getProfileById } from "./profile.js";

// custom hook retrieves the profile of the user,
// relies on useAuth which subscribes to auth state changes
const useProfile = () => {
  // get current user
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);

  // get profile, especially when user changes
  useEffect(() => {
    if (loading) {
      return;
    }
    if(!user){
      return;
    }
    getProfileById(user.id).then(({ data, error }) => {
      if (error) {
        return;
      }
      setProfile(data[0]);
    });
  }, [user, loading]);

  return profile;
};

export default useProfile;
