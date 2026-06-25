import ImageFluid from "../components/ImageFluid.jsx";
import {
  ArrowUpIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import Button from "./Button.jsx";
import { useAuth } from "../utils/useAuth.js";
import { useState } from "react";
import CreateCommentForm from "./CreateCommentForm.jsx";

const CommentThread = ({
  comment,
  depth = 0,
  onDelete,
  onUpvote,
  disableBtns = false,
  onComment,
}) => {
  const { user } = useAuth();
  const [showCommentForm, setShowCommentForm] = useState(false);

  const indentClass = depth >= 5 ? "ml-0" : "ml-1";

  return (
    <div className={`${indentClass} border-l border-gray-200 pl-2 mt-4`}>
      {showCommentForm && (
        <CreateCommentForm
          onClose={() => {
            setShowCommentForm(false);
          }}
          onSubmit={onComment}
          parentCommentId={comment.id}
        />
      )}
      <div className="rounded-lg shadow-sm p-3">
        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500 overflow-hidden">
          <ImageFluid
            src={comment.profiles.pfp_url}
            className="size-10 min-w-10"
          />
          <span>{comment.profiles.username}</span>
          <span>•</span>
          <span>{new Date(comment.created_at).toLocaleDateString()}</span>
        </div>

        <p>{comment.body}</p>

        {/* comment controls: upvote, reply, etc. */}
        <div className="flex gap-2 items-center mt-4">
          <Button
            className="text-xs flex gap-1"
            variant="outlined"
            disabled={disableBtns || !user}
            onClick={() => {
              onUpvote(comment);
            }}
            type="button"
          >
            <ArrowUpIcon className="w-4 text-blue-500" />
            {comment.community_post_comment_votes.length}
          </Button>

          <Button
            variant="base"
            className="text-blue-500 text-xs flex gap-1"
            type="button"
            onClick={setShowCommentForm}
          >
            <ChatBubbleLeftIcon className="w-4 text-primary-500" />
            {comment.children.length}
          </Button>

          {user?.id === comment.user_id && (
            <Button
              variant="base"
              className="flex gap-2  text-red-500"
              disabled={disableBtns}
              onClick={() => {
                onDelete(comment.id);
              }}
              type="button"
            >
              <TrashIcon className="w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* show children replies */}
      {comment.children?.length > 0 && (
        <div>
          {comment.children.map((child) => (
            <CommentThread
              key={child.id}
              comment={child}
              onDelete={onDelete}
              onUpvote={onUpvote}
              disableBtns={disableBtns}
              onComment={onComment}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
