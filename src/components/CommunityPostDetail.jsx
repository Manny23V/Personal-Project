import {
  ArrowUpIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { useAuth } from "../utils/useAuth.js";
import Button from "./Button.jsx";
import ImageFluid from "./ImageFluid.jsx";
import { useState } from "react";
import CreateCommentForm from "./CreateCommentForm.jsx";

export default function CommunityPostDetail({
  post,
  onUpvote,
  onDelete,
  disableBtns = false,
  commentCount,
  onComment,
}) {
  const { user } = useAuth();
  const [showCommentForm, setShowCommentForm] = useState(false);

  return (
    <article className="rounded-lg outline outline-gray-200 shadow-sm bg-white overflow-hidden">
      {/* comment modal */}
      {showCommentForm && (
        <CreateCommentForm
          onClose={() => {
            setShowCommentForm(false);
          }}
          onSubmit={onComment}
        />
      )}


      <div className="p-6">
        {/* author */}
        <div className="mb-4 text-sm text-gray-500">
          <span className="font-medium text-primary-500">
            {post.profiles.username}
          </span>
          <span className="mx-2">•</span>
          <span>{new Date(post.created_at).toLocaleString()}</span>
        </div>

        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

        {/* optional image */}
        {post.img_url && (
          <div className="mb-6">
            <ImageFluid
              src={post.img_url}
              alt={post.title}
              className="rounded-lg h-120"
            />
          </div>
        )}

        <div className="whitespace-pre-wrap leading-relaxed">{post.body}</div>

        {/* post controls: delete, comment, upvote, etc. */}
        <div className="mt-6 flex gap-2 flex-wrap">
          <Button
            className="flex gap-2"
            disabled={disableBtns || !user}
            onClick={onUpvote}
            type="button"
          >
            <ArrowUpIcon className="w-4 text-white" />
            {post.community_post_votes.length}
          </Button>

          <Button
            variant="outlined"
            className="flex gap-2"
            type="button"
            onClick={() => {
              setShowCommentForm(true);
            }}
          >
            <ChatBubbleLeftIcon className="w-4 text-primary-500" />
            {commentCount}
          </Button>

          {user?.id === post.user_id && (
            <Button
              variant="base"
              className="flex gap-2 outline outline-red-500 text-red-500"
              disabled={disableBtns}
              onClick={onDelete}
              type="button"
            >
              <TrashIcon className="w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="border-t border-gray-300 px-6 py-4">
        <h2 className="font-semibold">Comments ({commentCount})</h2>
      </div>
    </article>
  );
}
