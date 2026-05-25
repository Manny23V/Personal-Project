import Modal from "./Modal";
import Button from "./Button";
import ImageFluid from "./ImageFluid";
import Notification, { NOTIFICATION_TIMEOUT } from "./Notification";
import sleep from "../utils/sleep";

import { baseInputClasses } from "../utils/baseClasses";
import { useState } from "react";
import { useAuth } from "../utils/useAuth";
import { addMalResource, getMalResource } from "../utils/profile";

// allowed status for each anime or manga
const VALID_STATUSES = ["current", "completed", "planned"];
const DEFAULT_RES_TITLE = "Preview";
const DEFAULT_RES_IMG_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm8JCped4WqTx4FCFWk9dGSsHzaZJXJPUkBg&s";

// form to add an anime or manga to your profile
const ProfileResourceForm = ({ onClose, onSubmit, resourceType }) => {
  const [resource, setResource] = useState({
    type: resourceType,
    id: 1,
    status: VALID_STATUSES[0],
  });

  // image of the anime or manga
  const [previewRes, setPreviewRes] = useState({
    title: DEFAULT_RES_TITLE,
    imgUrl: DEFAULT_RES_IMG_URL,
  });
  const { user } = useAuth();

  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (resourceType !== "manga" && resourceType !== "anime") {
    return <p>Provide a valid resource type</p>;
  }

  const handleInputChange = (e) => {
    setResource({ ...resource, [e.target.name]: e.target.value });
    // change displayed image when id changes
    if (e.target.name === "id") {
    }
  };

  const handlePreview = () => {
    // rate limits...
    setDisabled(true);
    sleep(500).then(() => {
      getMalResource(resource.id, resourceType).then((res) => {
        // put a default picture if anime/manga doesn't exist
        if (!res) {
          setPreviewRes({
            title: DEFAULT_RES_TITLE,
            imgUrl: DEFAULT_RES_IMG_URL,
          });
          doErrorTimeout(`${resourceType} doesn't exist (preview)`, 1000);
          return;
        }

        setPreviewRes({
          title: res.title,
          imgUrl: res.images.jpg.large_image_url,
        });
        setDisabled(false);
      });
    });
  };

  // show error notification for some time
  const doErrorTimeout = (errorMsg, timeout = NOTIFICATION_TIMEOUT) => {
    setError(errorMsg);
    setTimeout(() => {
      setError(null);
      setDisabled(false);
    }, timeout);
  };

  // add the user's resource to the database
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Must be logged in.");
      return;
    }

    // make sure the anime or manga exists
    const res = await getMalResource(resource.id, resource.type);
    if (!res) {
      doErrorTimeout(`${resourceType} doesn't exist`);
      return;
    }

    setSuccess(false);
    setDisabled(true);

    // update in supabase
    const { error } = await addMalResource(user.id, resource);
    if (error) {
      doErrorTimeout("Failed to add resource");
      return;
    }

    // show success msg
    setDisabled(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, NOTIFICATION_TIMEOUT);

    // give new anime / manga to caller for
    // whatever they wanted to do with it
    onSubmit(res);
  };

  return (
    <Modal onClose={onClose}>
      <form className="mt-5" onSubmit={handleSubmit}>
        {previewRes.imgUrl && (
          <div className="my-5 max-w-80 mx-auto text-center">
            <ImageFluid src={previewRes.imgUrl} className="h-sm" />
            <h2 className="mt-2 font-medium">{previewRes.title}</h2>
          </div>
        )}
        <Button
          className="mx-auto mb-5 text-sm"
          variant="outlined"
          onClick={handlePreview}
          type="button"
        >
          Preview {resourceType}
        </Button>
        <h2 className="font-medium text-center">Add {resourceType}</h2>
        <p className="mb-8 text-xs text-center">
          Add your current, completed, or other {resourceType}!
        </p>

        {/* ID */}
        <label htmlFor="pf-res-id" className="block my-4">
          MyAnimeList ID
          <input
            type="number"
            id="pf-res-id"
            name="id"
            min={1}
            step={1}
            className={`mt-2 ${baseInputClasses}`}
            value={resource.id}
            onChange={handleInputChange}
            disabled={disabled}
            required
          />
        </label>

        {/* Status */}
        <label htmlFor="pf-res-status" className="block mb-5">
          Status
          <select
            name="status"
            id="pf-res-status"
            className={`mt-2 ${baseInputClasses}`}
            value={resource.status}
            onChange={handleInputChange}
            disabled={disabled}
            required
          >
            {VALID_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>

        <Button className="w-full text-sm" disabled={disabled}>
          Submit
        </Button>

        {/* error / success messages */}
        {error && (
          <Notification type="error" message={error} className="my-4" />
        )}
        {success && (
          <Notification
            type="success"
            message="Successfully added resource"
            className="my-4"
          />
        )}
      </form>
    </Modal>
  );
};

export default ProfileResourceForm;
