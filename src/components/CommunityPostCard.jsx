import ImageFluid from "./ImageFluid.jsx";
import { Link } from "react-router";
import Button from "./Button.jsx";
import { useAuth } from "../utils/useAuth.js";
import {
  ArrowUpIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";

// a forum-style card for community posts
// onDelete must be a function that handles the removal of a post from the database
const CommunityPostCard = ({
  post,
  onDelete,
  onUpvote,
  disableBtns = false,
}) => {
  const author = post.profiles;
  const postDate = new Date(post.created_at).toLocaleString();
  const { user } = useAuth();

  return (
    <article className="my-4 shadow-sm rounded-sm max-w-md mx-auto outline outline-gray-300">
      <section className="flex items-center gap-2 p-2">
        <ImageFluid src={author.pfp_url} className="size-10" />
        <p className="font-medium text-sm">{author.username}</p>
        <p className="text-gray-500 text-xs">{postDate}</p>
      </section>
      {post.img_url && <ImageFluid src={post.img_url} className="h-60" />}
      <div className="p-5">
        <h2 className="text-lg font-medium">{post.title}</h2>
        <p className="text-sm mb-4">{post.body}</p>

        <div className="flex gap-2 flex-wrap">
          <Button
            className="text-xs flex gap-2"
            disabled={disableBtns || !user}
            onClick={onUpvote}
            type="button"
          >
            <ArrowUpIcon className="w-4 text-white" />
            {post.community_post_votes.length}
          </Button>

          <Link to={`/communities/${post.comm_id}/posts/${post.id}`}>
            <Button
              variant="outlined"
              className="text-xs flex gap-2"
              disabled={disableBtns}
              type="button"
            >
              <ChatBubbleLeftIcon className="w-4 text-blue-500" />
              {post.community_post_comments.length}
            </Button>
          </Link>

          {user && post.user_id === user.id && (
            <Button
              variant="base"
              className="text-xs flex gap-2 outline outline-red-500 text-red-500"
              disabled={disableBtns}
              type="button"
              onClick={onDelete}
            >
              <TrashIcon className="w-4" />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
};

export default CommunityPostCard;
