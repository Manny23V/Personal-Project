import ImageFluid from "./ImageFluid.jsx";
import Button from "../components/Button.jsx";

import { useAuth } from "../utils/useAuth.js";

// card for a single community, which
// has an image, title, and description
const CommunityCard = ({ comm, showJoinBtn = true, onJoin }) => {
  const { user } = useAuth();

  return (
    <article
      key={comm.id}
      className="flex-1 basis-70 p-3 outline outline-gray-300 shadow-sm rounded-md"
    >
      <ImageFluid src={comm.img_url} className="h-32 mb-2" />
      <h2 className="font-medium">{comm.name}</h2>
      <p className="mb-3 text-xs text-blue-500">Community | {comm.community_memberships.length} Member(s)</p>
      {comm.description && (
        <p className="text-sm h-15 overflow-auto">{comm.description}</p>
      )}

      {user && (
        <Button className="mt-4 text-xs" variant="outlined" onClick={onJoin}>
          {showJoinBtn ? "Join " : "Leave "}
          Community
        </Button>
      )}
    </article>
  );
};

export default CommunityCard;
