import { useState, useEffect } from "react";
import {
  buildCommentThreads,
  getCommunityPost,
  getCommunityPostComments,
} from "../utils/communities";
import { useParams, useNavigate } from "react-router";
import LoadingDiv from "../components/LoadingDiv.jsx";
import Header from "../components/Header.jsx";
import CommentThread from "../components/CommentThread.jsx";
import CommunityPostDetail from "../components/CommunityPostDetail.jsx";
import {
  removeCommunityPost,
  upvoteCommunityPost,
  removeCommunityPostUpvote,
  upvoteComment,
  removeCommentUpvote,
  removeComment,
  createComment,
} from "../utils/communities.js";
import { useAuth } from "../utils/useAuth.js";
import { getProfileById } from "../utils/profile.js";

const CommunityPostDetailPage = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [disableBtns, setDisableBtns] = useState(false);

  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // get the original post
  useEffect(() => {
    getCommunityPost(postId).then(({ error, data }) => {
      if (error) {
        return console.error(error);
      }

      setPost(data);
    });
  }, [postId]);

  // get post comments
  useEffect(() => {
    getCommunityPostComments(postId).then(({ error, data }) => {
      if (error) {
        return console.error(error);
      }

      setComments(data);
    });
  }, [postId]);

  // build thread tree from comments
  const postThreads = buildCommentThreads(comments);

  if (!post) {
    return <LoadingDiv text="Loading post..." />;
  }

  // owner delete post
  const removePost = async (postId) => {
    setDisableBtns(true);
    await removeCommunityPost(postId);
    alert("Successfully deleted post");
    navigate(`/communities/${post.comm_id}`);
    setDisableBtns(false);
  };

  // owner delete thread comment
  const handleRemoveComment = async (commentId) => {
    setDisableBtns(true);
    await removeComment(commentId);
    setComments(comments.filter((c) => c.id !== commentId));
    setDisableBtns(false);
  };

  // toggle post upvote
  const handlePostVote = async (postId) => {
    if (!user) {
      alert("log in to upvote posts");
      return;
    }

    setDisableBtns(true);

    // already voted, remove vote
    if (post.community_post_votes.find((v) => v.user_id === user.id)) {
      await removeCommunityPostUpvote(postId, user.id);
      setPost({
        ...post,
        community_post_votes: post.community_post_votes.filter(
          (v) => v.user_id !== user.id,
        ),
      });
    } else {
      // add vote to db
      const { error, data } = await upvoteCommunityPost(postId, user.id);
      if (error) {
        console.error(error);
        setDisableBtns(false);
        return;
      }
      setPost({
        ...post,
        community_post_votes: post.community_post_votes.concat(data),
      });
    }

    setDisableBtns(false);
  };

  const handleCommentVote = async (comment) => {
    if (!user) {
      alert("log in to upvote comments");
      return;
    }

    setDisableBtns(true);
    const alreadyVoted = comment.community_post_comment_votes.find(
      (v) => v.user_id === user.id,
    );

    if (alreadyVoted) {
      await removeCommentUpvote(comment.id, user.id);
      // remove upvote from comment in comments list
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id
            ? {
                ...c,
                community_post_comment_votes:
                  c.community_post_comment_votes.filter(
                    (v) => v.user_id !== user.id,
                  ),
              }
            : c,
        ),
      );
    } else {
      // add upvote to db
      const { error, data } = await upvoteComment(comment.id, user.id);
      if (error) {
        console.error(error);
        setDisableBtns(false);
        return;
      }

      // add upvote entry to the comment
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id
            ? {
                ...c,
                community_post_comment_votes:
                  c.community_post_comment_votes.concat(data),
              }
            : c,
        ),
      );
    }

    setDisableBtns(false);
  };

  const handleCreateComment = async (body, parentCommentId = null) => {
    if (!user) {
      alert("log in to comment");
      return;
    }
    const { error: profileError, data: profile } = await getProfileById(
      user.id,
    );
    if (profileError) {
      alert("failed to get profile");
      return;
    }

    const { error, data } = await createComment({
      userId: user.id,
      postId: post.id,
      parentCommentId,
      body,
    });

    if (error) {
      return console.error(error);
    }

    const newComment = {
      ...data[0],
      community_post_comment_votes: [],
      profiles: profile[0],
    };
    setComments(comments.concat(newComment));
  };

  return (
    <>
      <Header onsearch={() => {}} />

      <main className="max-w-300 mx-auto mt-2 px-2">
        {/* main post */}
        <CommunityPostDetail
          post={post}
          commentCount={comments.length}
          onDelete={() => removePost(post.id)}
          onUpvote={() => handlePostVote(post.id)}
          disableBtns={disableBtns}
          onComment={handleCreateComment}
        />

        {/* post comments */}
        {postThreads.map((thread) => (
          <CommentThread
            key={thread.id}
            comment={thread}
            onDelete={handleRemoveComment}
            onUpvote={handleCommentVote}
            disableBtns={disableBtns}
            onComment={handleCreateComment}
          />
        ))}
      </main>
    </>
  );
};

export default CommunityPostDetailPage;
