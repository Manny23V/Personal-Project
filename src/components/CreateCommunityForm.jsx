import { useState } from "react";
import Header from "./Header.jsx";
import Button from "./Button.jsx";
import { baseInputClasses } from "../utils/baseClasses.js";
import ImageFluid from "./ImageFluid.jsx";
import { createCommunity } from "../utils/communities.js";
import { useNavigate } from "react-router";

const CreateCommunityForm = () => {
  const [community, setCommunity] = useState({
    name: "",
    description: "",
    img_url: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    await createCommunity(community);
    setLoading(false);
    navigate("/communities");
  };

  const handleInputChange = (e) => {
    setCommunity({ ...community, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header onSearch={() => {}} />
      <form
        onSubmit={handleSubmit}
        className="rounded-sm p-5 shadow-sm max-w-xl mx-auto mt-8"
      >
        <h2 className="text-lg font-medium">Create Community</h2>
        <p className="text-sm text-blue-500 mb-4">
          Add a new thread for like-minded anime and manga fans!
        </p>

        <ImageFluid src={community.img_url || null} className="max-h-60" />
        <label htmlFor="create-comm-img">Image URL</label>
        <input
          type="text"
          id="create-comm-img"
          name="img_url"
          value={community.img_url}
          onChange={handleInputChange}
          className={baseInputClasses + " mb-4"}
          required
        />
        <label htmlFor="create-comm-name">Name</label>
        <input
          type="text"
          id="create-comm-name"
          name="name"
          value={community.name}
          onChange={handleInputChange}
          className={baseInputClasses + " mb-4"}
          required
        />
        <label htmlFor="create-comm-desc">Description</label>
        <input
          type="text"
          id="create-comm-desc"
          name="description"
          value={community.description}
          onChange={handleInputChange}
          className={baseInputClasses + " mb-6"}
          required
        />

        <Button className="text-sm w-full" disabled={loading}>
          Submit
        </Button>
      </form>
    </>
  );
};

export default CreateCommunityForm;
