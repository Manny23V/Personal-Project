import ImageFluid from "./ImageFluid.jsx";
import { Link } from "react-router";
import Button from "./Button.jsx";

const HEADER_CLASSES = "bg-gray-800 text-white";

// a forum-style card for community posts
// onDelete must be a function that handles the removal of a post from the database
const CommunityPostCard = ({ post, showDeleteBtn = false, onDelete }) => {
  const author = post.profiles;
  const postDate = new Date(post.created_at).toLocaleString();
  return (
    <article className="my-4">
      {/* topbar with username and post date (mobile) */}
      <div
        className={`flex h-20 gap-4 sm:gap-0 sm:hidden items-center ${HEADER_CLASSES}`}
      >
        <Link to={`/profile/${author.username}`} className="h-full flex">
          <ImageFluid src={author.pfp_url} />
        </Link>
        <div>
          <p className="font-semibold">{author.username}</p>
          <p className="text-xs">Posted {postDate}</p>
        </div>
      </div>

      <section className="flex outline outline-gray-300 rounded-xs sm:h-42">
        {/* username and pfp */}
        <div className={`hidden sm:flex sm:flex-col ${HEADER_CLASSES}`}>
          <p className="px-1 text-sm">{author.username}</p>

          <Link to={`/profile/${author.username}`} className="h-full flex">
            <ImageFluid src={author.pfp_url} className="w-30 flex-1" />
          </Link>
        </div>

        {/* date, post body, and options */}
        <div className="flex-1 flex flex-col">
          <p className={`hidden sm:block ${HEADER_CLASSES} px-4 text-sm`}>
            Posted {postDate}
          </p>
          <div className="flex flex-col flex-1 p-2 sm:p-3 gap-4 sm:gap-2">
            <p className="flex-1 text-sm max-h-20 overflow-auto">{post.body}</p>
            {showDeleteBtn && (
              <Button
                variant="base"
                className="max-w-24 text-xs outline outline-red-500 text-red-500 hover:bg-red-50"
                onClick={() => {
                  onDelete(post.comm_id, author.id, post.body);
                }}
              >
                Delete Post
              </Button>
            )}
          </div>
        </div>
      </section>
    </article>
  );
};

export default CommunityPostCard;
