import {
  getAllCommunities,
  joinCommunity,
  leaveCommunity,
} from "../utils/communities.js";
import { useState, useEffect } from "react";
import { useAuth } from "../utils/useAuth.js";

import LoadingSpinner from "../components/LoadingSpinner.jsx";
import CommunityCard from "../components/CommunityCard.jsx";

import { baseInputClasses } from "../utils/baseClasses.js";
import { Link } from "react-router";
import Button from "../components/Button.jsx";

import Header from "../components/Header";

const CommunitiesPage = () => {
  const [comms, setComms] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const { user } = useAuth();

  // get communities
  useEffect(() => {
    getAllCommunities().then(({ data, error }) => {
      if (error) {
        setError("Failed to retrieve communities");
        return;
      }

      // includes all comm data + a list of user ids in that community
      for (const comm of data) {
        comm.community_memberships = comm.community_memberships.map(
          (m) => m.user_id,
        );
      }
      setComms(data);
    });
  }, []);

  // joins or leaves community
  const handleCommunityBtnClick = async (commId, userComms) => {
    const userIsInComm = userComms.find((c) => c.id === commId);
    if (!userIsInComm) {
      await joinCommunity(commId, user.id);
      // update specific comm to include user's id
      setComms(
        comms.map((c) => {
          if (c.id === commId) {
            return {
              ...c,
              community_memberships: [...c.community_memberships, user.id],
            };
          }
          return c;
        }),
      );
    } else {
      await leaveCommunity(commId, user.id);
      // update specific comm to exclude user's id
      setComms(
        comms.map((c) => {
          if (c.id === commId) {
            return {
              ...c,
              community_memberships: c.community_memberships.filter(
                (m) => m !== user.id,
              ),
            };
          }
          return c;
        }),
      );
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  // error message
  if (error) {
    return (
      <p className="mt-20 max-w-sm mx-auto text-center text-red-500">{error}</p>
    );
  }

  // still loading
  if (!comms) {
    return (
      <main className="flex flex-col items-center mt-20">
        <LoadingSpinner />
        <p className="mt-4 text-sm">Loading communities...</p>
      </main>
    );
  }

  // comms the current user is currently in
  const userComms = user
    ? comms.filter((c) => c.community_memberships.includes(user.id))
    : [];

  // comms filtered when user makes a search
  const filteredComms = query
    ? comms.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : comms;

  return (
    <>
      {/* shows header */}
      <Header onSearch={() => {}} />

      <div className="max-w-300 mx-auto p-3">
        <h2 className="font-medium mb-1">Communities</h2>
        <p className="text-xs mb-4 text-blue-500">
          Browse top communities for anime, manga, and more
        </p>
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          className={baseInputClasses + " text-sm mb-4 focus:outline-blue-500"}
          placeholder="Search..."
        />
        <Link to="/communities/create">
          <Button className="text-xs mb-4">Create a Community</Button>
        </Link>
        <main className="flex flex-wrap gap-4">
          {filteredComms.map((c) => (
            <CommunityCard
              key={c.id}
              comm={c}
              onJoin={() => {
                handleCommunityBtnClick(c.id, userComms);
              }}
              showJoinBtn={!userComms.find((uc) => uc.id === c.id)}
            />
          ))}
        </main>
      </div>
    </>
  );
};

export default CommunitiesPage;
