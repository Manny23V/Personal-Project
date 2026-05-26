import Modal from "./Modal";
import ImageFluid from "./ImageFluid";
import Button from "./Button";

// receives anime or manga list,
// and allows the user to edit that list (remove or update statuses)
// onRemoveItem should handle that removal logic
const ProfileResourceList = ({ resList, onRemoveItem, resType, onClose }) => {
  return (
    <Modal onClose={onClose}>
      <h2 className="font-medium text-center">Manage {resType}</h2>
      {resList.length === 0 && (
        <p className="mt-2 text-center text-sm">No {resType} yet!</p>
      )}
      {/* show each anime/manga in a mini-card */}
      {/* uses && just in case that resource is undefined */}
      {resList.map(
        (r) =>
          r && (
            <article
              key={r.title}
              className="sm:flex sm:gap-2 my-4 p-3 outline outline-gray-200 rounded-sm items-center justify-between overflow-auto"
            >
              <ImageFluid
                src={r.images.jpg.image_url}
                className="mb-2 sm:mb-0 h-24 w-16"
              />
              <div className="mb-4 sm:mb-0">
                <h3 className="font-medium mb-1">{r.title}</h3>
                <p className="truncate mb-2 max-w-48 sm:max-w-32 text-sm">
                  {r.synopsis}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-blue-500">
                  <p>Rating: {r.score || 0.0}</p>
                  <p>Ranking: {r.rank || "None"}</p>
                  <p>
                    {resType === "anime"
                      ? `${r.episodes} episodes`
                      : `${r.chapters} chapters`}
                  </p>
                </div>
              </div>

              <Button
                className="text-xs"
                variant="outlined"
                onClick={() => {
                  onRemoveItem(resType, r);
                }}
              >
                Remove
              </Button>
            </article>
          ),
      )}
    </Modal>
  );
};

export default ProfileResourceList;
