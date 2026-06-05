import { useParams } from "react-router";
import { useState, useEffect } from "react";
import {
  createCommunityPost,
  getCommunity,
  getCommunityPosts,
  joinCommunity,
  leaveCommunity,
  removeCommunityPost,
} from "../utils/communities.js";

import { baseInputClasses } from "../utils/baseClasses";

import ImageFluid from "../components/ImageFluid.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import Button from "../components/Button.jsx";

import { useAuth } from "../utils/useAuth.js";
import useProfile from "../utils/useProfile.js";
import CommunityPostCard from "../components/CommunityPostCard.jsx";

import Header from '../components/Header'

const MAX_POST_LENGTH = 1000;

const CommunityDetailPage = () => {
  const { commId } = useParams();
  // community
  const [comm, setComm] = useState(null);
  const [commPosts, setCommPosts] = useState(null);
  const [error, setError] = useState(null);

  // post comment to thread
  const [post, setPost] = useState("");

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

      // flatten community membershipr objects to a list of uuids
      data[0].memberIds = data[0].community_memberships.map((m) => m.user_id);
      delete data[0].community_memberships;
      setComm(data[0]);
    });

    // posts includes the poster's profile picture, handle, etc. as well
    getCommunityPosts(commId).then(({ data, error }) => {
      if (error) {
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
      setPost("");
      return;
    }

    // update ui to include the new post
    setCommPosts(
      commPosts.concat({
        ...data[0],
        profiles: profile,
      }),
    );

    alert("Successfully created post");
    setPost("");
  };

  // delete your post
  const removePost = async (commId, userId, postBody) => {
    const { error } = await removeCommunityPost(commId, userId, postBody);

    // update ui to remove post
    setCommPosts(
      commPosts.filter((p) => {
        return !(
          p.comm_id === commId &&
          p.user_id === userId &&
          p.body === postBody
        );
      }),
    );
  };

  const handleCommentChange = (e) => {
    setPost(e.target.value);
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
            // TODO: allow users to join the community (should be simple logic)
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
            className="flex flex-col sm:flex-row mx-auto items-center gap-4 mb-4 p-3 outline outline-gray-300 rounded-xs shadow-sm"
          >
            {/* user profile */}
            <div className="max-w-50 sm:w-40">
              <ImageFluid
                src={profile.pfp_url}
                className="size-30 w-full mb-1"
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
              <textarea
                type="text"
                value={post}
                onChange={handleCommentChange}
                className={baseInputClasses + " text-sm resize-none mb-4"}
                placeholder="Post to the thread..."
                maxLength={MAX_POST_LENGTH}
                required
              ></textarea>
              <Button className="text-xs" type="submit" disabled={!isCommunityMember}>
                {
                  isCommunityMember ?
                  "Add Post"
                  :
                  "Join the Community to Post"
                }
              </Button>
            </div>
          </form>
        )}

        {/* all posts */}
        {commPosts.length === 0 ? (
          <p className="text-sm">No posts yet. Be the first to post!</p>
        ) : (
          commPosts.map((p) => (
            <CommunityPostCard
              key={p.profiles.username + p.body}
              post={p}
              onDelete={removePost}
              showDeleteBtn={user && p.profiles.id === user.id}
            />
          ))
        )}
      </section>
    </main>
    </>
  );
};

export default CommunityDetailPage;
