import Modal from "../components/Modal.jsx";
import Button from "./Button.jsx";
import ImageFluid from "./ImageFluid.jsx";
import sleep from "../utils/sleep.js";

import { NOTIFICATION_TIMEOUT } from "./Notification.jsx";
import { DEFAULT_PFP_URL } from "../utils/profile.js";
import { baseInputClasses } from "../utils/baseClasses.js";
import { updateProfile } from "../utils/profile.js";

import { useState } from "react";
import { supabase } from "../supabaseClient.js";

import Notification from "./Notification.jsx";

// a form for the user to change their profile picture, bio, etc.
// onSubmit should handle the database submission logic
// onClose should hide the modal from your page
const EditProfileForm = ({ currentProfile, onSubmit, onClose }) => {
  const [profile, setProfile] = useState(
    currentProfile.pfp_url
      ? currentProfile
      : { ...currentProfile, pfp_url: DEFAULT_PFP_URL },
  );
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  // update the user's profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess(false);
    setDisabled(true);

    // update in supabase
    const { error } = await updateProfile(profile);
    if (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
        setDisabled(false);
      }, NOTIFICATION_TIMEOUT);
      return;
    }

    // show success msg
    setDisabled(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, NOTIFICATION_TIMEOUT);

    // give new profile to caller for
    // whatever they wanted to do with it
    onSubmit(profile);
  };

  const handleInputChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <h2 className="text-center mb-2 font-medium">Edit Profile</h2>
        <p className="text-center text-xs">Customize your info</p>

        {/* profile picture and username*/}
        <ImageFluid
          src={profile.pfp_url || DEFAULT_PFP_URL}
          className="mt-4 mb-2 h-70 max-w-70 mx-auto"
        />
        <h3 className="text-lg font-medium text-center">{profile.username}</h3>
        <label htmlFor="edit-pfp_url" className="block mt-4">
          Profile Picture
          <input
            type="url"
            name="pfp_url"
            id="edit-pfp_url"
            className={`${baseInputClasses}`}
            value={profile.pfp_url}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </label>

        {/* bio */}
        <label htmlFor="edit-bio" className="block my-4">
          Bio
          <textarea
            name="bio"
            id="edit-bio"
            className={`${baseInputClasses} max-h-30 resize-none`}
            maxLength={150}
            value={profile.bio}
            onChange={handleInputChange}
            disabled={disabled}
          ></textarea>
        </label>

        <Button
          className="w-full text-sm"
          disabled={disabled}
          variant="contained"
        >
          Submit
        </Button>

        {/* error / success messages */}
        {error && (
          <Notification
            type="error"
            message="Failed to update profile"
            className="my-4"
          />
        )}
        {success && (
          <Notification
            type="success"
            message="Successfully updated profile"
            className="my-4"
          />
        )}
      </form>
    </Modal>
  );
};

export default EditProfileForm;
