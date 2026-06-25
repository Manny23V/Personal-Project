import { useParams } from "react-router";
import { useState, useEffect } from "react";
import {
  createCommunityPost,
  getCommunity,
  getCommunityPosts,
  joinCommunity,
  leaveCommunity,
  upvoteCommunityPost,
} from "../utils/communities.js";

import { baseInputClasses } from "../utils/baseClasses";

import ImageFluid from "../components/ImageFluid.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Button from "../components/Button.jsx";

import { useAuth } from "../utils/useAuth.js";
import useProfile from "../utils/useProfile.js";
import CommunityPostCard from "../components/CommunityPostCard.jsx";
import {
  removeCommunityPost,
  removeCommunityPostUpvote,
} from "../utils/communities.js";

import Header from "../components/Header";

const DEFAULT_POST_IMG =
  "https://montevista.greatheartsamerica.org/wp-content/uploads/sites/2/2016/11/default-placeholder.png";

const MAX_POST_LENGTH = 1000;
const DEFAULT_POST = {
  userId: null,
  commId: null,
  imgUrl: "",
  title: "",
  body: "",
};

const CommunityDetailPage = () => {
  const { commId } = useParams();
  // community
  const [comm, setComm] = useState(null);
  const [commPosts, setCommPosts] = useState(null);
  const [error, setError] = useState(null);

  // community thread post
  const [post, setPost] = useState(DEFAULT_POST);

  const [disableBtns, setDisableBtns] = useState(false);

  // current user
  const { user } = useAuth();
  const profile = useProfile();

  // fetch the community and its posts
  useEffect(() => {
    getCommunity(commId).then(({ data, error }) => {
      if (error || data.length === 0) {
        setError("Failed to retrieve community");
        return;
      }

      // flatten community membership objects to a list of uuids
      data[0].memberIds = data[0].community_memberships.map((m) => m.user_id);
      delete data[0].community_memberships;
      setComm(data[0]);
    });

    // posts includes the poster's profile picture, handle, etc. as well
    getCommunityPosts(commId).then(({ data, error }) => {
      if (error) {
        console.log(error);
        setError("Failed to retrieve community");
        return;
      }
      setCommPosts(data);
    });
  }, [commId]);

  // create a new post to the community
  const addPost = async (e) => {
    e.preventDefault();
    const { data, error } = await createCommunityPost(comm.id, user.id, post);
    if (error) {
      alert("Failed to create post");
      setPost({ ...DEFAULT_POST });
      return;
    }

    // update ui to include the new post
    setCommPosts(
      commPosts.concat({
        ...data[0],
        profiles: profile,
        community_post_votes: [],
        community_post_comments: [],
      }),
    );

    alert("Successfully created post");
    setPost({ ...DEFAULT_POST });
  };

  const removePost = async (postId) => {
    setDisableBtns(true);
    await removeCommunityPost(postId);
    alert("Successfully deleted post");
    setCommPosts(commPosts.filter((p) => p.id !== postId));
    setDisableBtns(false);
  };

  const upvotePost = async (post, userId) => {
    const postId = post.id;

    setDisableBtns(true);

    if (post.community_post_votes.find((v) => v.user_id === userId)) {
      await removeCommunityPostUpvote(postId, userId);
      setCommPosts(
        commPosts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              community_post_votes: p.community_post_votes.filter(
                (v) => v.user_id !== userId && v.post_id !== postId,
              ),
            };
          }
          return p;
        }),
      );
    } else {
      const { data, error } = await upvoteCommunityPost(postId, userId);
      if (error || data.length === 0) {
        setDisableBtns(false);
        return;
      }

      // update ui to show the new upvote count
      setCommPosts(
        commPosts.map((p) => {
          if (p.id === postId) {
            return ({
              ...p,
              community_post_votes: [...p.community_post_votes, data[0]],
            });
          }
          return p;
        }),
      );
    }

    setDisableBtns(false);
  };

  const handlePostInputChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  // either removes or adds the user to the community
  const handleCommMember = async (isCommunityMember) => {
    if (isCommunityMember) {
      await leaveCommunity(commId, user.id);
      setComm({
        ...comm,
        memberIds: comm.memberIds.filter((id) => id !== user.id),
      });
    } else {
      await joinCommunity(commId, user.id);
      setComm({
        ...comm,
        memberIds: comm.memberIds.concat(user.id),
      });
    }
  };

  // show error message
  if (error) {
    return (
      <p className="mt-20 max-w-sm mx-auto text-center text-red-500">{error}</p>
    );
  }

  // show loading screen
  if (!comm || !commPosts) {
    return (
      <main className="flex flex-col items-center mt-20">
        <LoadingSpinner />
        <p className="mt-4 text-sm">Loading community...</p>
      </main>
    );
  }

  // if the current user logged in is part of this comm
  // (this is useful for the join community button)
  const isCommunityMember = user ? comm.memberIds.includes(user.id) : false;

  return (
    <>
      {/* shows header */}
      <Header onSearch={() => {}} />

      <main className="max-w-300 mx-auto px-2 sm:p-4 sm:mt-2 outline outline-gray-300 rounded-sm shadow-xs">
        {/* community image, desc, etc. */}
        <article className="flex flex-col sm:flex-row sm:items-center gap-4">
          <ImageFluid
            src={comm.img_url}
            className="h-40 sm:h-60 w-full sm:max-w-lg"
          />
          <div>
            <h2 className="mb-1 font-semibold text-2xl">{comm.name}</h2>
            <p className="mb-4 text-sm text-blue-500">
              Community | {comm.memberIds.length} Member(s)
            </p>
            <p className="mb-4 text-sm max-h-40 overflow-auto">
              {comm.description}
            </p>
            {user && profile && (
              <Button
                variant="outlined"
                className="mt-2 text-sm"
                onClick={() => {
                  handleCommMember(isCommunityMember);
                }}
              >
                {isCommunityMember ? "Leave" : "Join"} Community
              </Button>
            )}
          </div>
        </article>

        <section className="mt-5">
          {/* form to create a post */}
          {user && profile && (
            <form
              onSubmit={addPost}
              className="flex flex-col sm:flex-row mx-auto gap-4 mb-4 p-3 outline outline-gray-300 rounded-xs shadow-sm"
            >
              {/* user profile */}
              <div className="max-w-50 sm:w-50">
                <ImageFluid
                  src={profile.pfp_url}
                  className="size-40 w-full mb-1"
                />
                <p className="text-sm font-medium">{profile.username}</p>
              </div>

              {/* post textfield and button to create post */}
              <div className="w-full">
                <p className="font-medium text-lg mb-2">
                  Post
                  <span className="ml-2 text-xs font-normal text-blue-500">
                    join the discussion
                  </span>
                </p>

                <ImageFluid
                  src={post.imgUrl || DEFAULT_POST_IMG}
                  className="h-60"
                />
                <label htmlFor="comm-post-img" className="block mt-2 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  id="comm-post-img"
                  value={post.imgUrl}
                  onChange={handlePostInputChange}
                  name="imgUrl"
                  className={baseInputClasses}
                />

                <label htmlFor="comm-post-title" className="block mt-2 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="comm-post-title"
                  value={post.title}
                  onChange={handlePostInputChange}
                  name="title"
                  className={baseInputClasses}
                  required
                />

                <label htmlFor="comm-post-body" className="block mt-2 mb-1">
                  Body
                </label>
                <textarea
                  type="text"
                  value={post.body}
                  onChange={handlePostInputChange}
                  name="body"
                  className={baseInputClasses + " text-sm resize-none mb-4"}
                  placeholder="Post to the thread..."
                  maxLength={MAX_POST_LENGTH}
                  required
                ></textarea>
                <Button
                  className="text-sm"
                  type="submit"
                  disabled={!isCommunityMember}
                >
                  {isCommunityMember
                    ? "Add Post"
                    : "Join the Community to Post"}
                </Button>
              </div>
            </form>
          )}

          <hr className="block my-4" />

          <div className="text-center">
            <h2 className="text-xl text-center font-medium">All Posts</h2>
            <p className="text-sm text-blue-500">Browse all user comments</p>
          </div>

          {/* all posts */}
          {commPosts.length === 0 ? (
            <p className="text-sm">No posts yet. Be the first to post!</p>
          ) : (
            commPosts.map((p) => (
              <CommunityPostCard
                key={p.id}
                post={p}
                onDelete={() => {
                  removePost(p.id);
                }}
                onUpvote={() => {
                  upvotePost(p, user.id);
                }}
                disableBtns={disableBtns}
              />
            ))
          )}
        </section>
      </main>
    </>
  );
};

export default CommunityDetailPage;
