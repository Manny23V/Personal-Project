import ImageFluid from "../components/ImageFluid";
import Button from "../components/Button";
import AnimeCard from "../components/AnimeCard";
import MangaCard from "../components/MangaCard.jsx";
import ScrollableContainer from "../components/ScrollableContainer.jsx";
import LabeledPieChart from "../components/LabeledPieChart.jsx";

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  followUser,
  getAllMalResources,
  getProfile,
  getStats,
  removeMalResource,
  unfollowUser,
} from "../utils/profile.js";

import sleep from "../utils/sleep.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EditProfileForm from "../components/EditProfileForm.jsx";
import { DEFAULT_PFP_URL } from "../utils/profile.js";

import { useAuth } from "../utils/useAuth.js";
import ProfileResourceForm from "../components/ProfileResourceForm.jsx";
import ProfileResourceList from "../components/ProfileResourceList.jsx";

// user profile
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [anime, setAnime] = useState(null);
  const [manga, setManga] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams();

  const [showEditForm, setShowEditForm] = useState(false);

  // e.g. "anime" or "manga", form to add a new resource to your profile
  const [resourceFormType, setResourceFormType] = useState(null);

  // anime or manga list manager view
  const [resourceListType, setResourceListType] = useState(null);

  const { user } = useAuth();

  // fetch profile w/ anime and manga, receives an AbortController
  const getFullProfile = async (controller) => {
    const p = await getProfile(username);
    setProfile(p);

    // get user's current anime
    if (!anime) {
      const animeIds = p.user_anime.map((a) => a.anime_id);
      const currentAnime = await getAllMalResources(
        animeIds,
        "anime",
        controller,
      );
      setAnime(currentAnime);
    }

    // only 3 reqs per second, so just sleep
    // a little to restore our limit
    await sleep(1500);

    // get user's current manga
    if (!manga) {
      const mangaIds = p.user_manga.map((m) => m.manga_id);
      const currentManga = await getAllMalResources(
        mangaIds,
        "manga",
        controller,
      );
      setManga(currentManga);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    getFullProfile(controller)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setError("Failed to retrieve profile");
        }
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [username]);

  // toggles edit pfp/bio form visibility
  const handleEditFormVis = () => {
    setShowEditForm(!showEditForm);
  };

  // toggles the add anime/manga form's visibility
  const handleResourceFormVis = (type) => {
    setResourceFormType(type);
  };

  // updates pfp, bio after form submit
  const handleProfileRefresh = (newProfile) => {
    setProfile({
      ...profile,
      pfp_url: newProfile.pfp_url || DEFAULT_PFP_URL,
      bio: newProfile.bio || "No bio yet...",
    });
  };

  // re-renders anime and manga after you add one to your profile
  const handleResourceRefresh = (res) => {
    switch (resourceFormType) {
      case "anime":
        setAnime([...anime, res]);
        break;
      case "manga":
        setManga([...manga, res]);
        break;
    }
  };

  // brings up the menu
  const handleResourceListVis = (type) => {
    setResourceListType(type);
  };

  // remove anime or manga from your list
  const handleResourceRemoval = async (resType, res) => {
    const removedId = res.mal_id;
    const filterFunc = (r) => r && r.mal_id !== removedId;
    await removeMalResource(user.id, removedId, resType);
    if (resType === "anime") {
      setAnime(anime.filter(filterFunc));
    } else if (resType === "manga") {
      setManga(manga.filter(filterFunc));
    }
  };

  const handleFollowClick = (isFollowing) => {
    if (!isFollowing) {
      followUser(user.id, profile.id);
      setProfile({
        ...profile,
        followerIds: profile.followerIds.concat(user.id),
      });
    } else {
      unfollowUser(user.id, profile.id);
      setProfile({
        ...profile,
        followerIds: profile.followerIds.filter((id) => id !== user.id),
      });
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center max-w-xl mx-auto mt-12 gap-2">
        <LoadingSpinner />
        <p className="text-sm">
          Loading profile (this may take a few seconds)...
        </p>
      </main>
    );
  }

  // use generic vague messages (e.g. "no user found")
  if (error) {
    return (
      <main className="max-w-xl mx-auto mt-12 p-0 text-center">{error}</main>
    );
  }

  // watch and read counts
  const stats = getStats(profile.user_anime, profile.user_manga);
  const hasEnoughStats =
    Object.values(stats).reduce((acc, curr) => acc + curr, 0) >= 4;

  // can edit the profile
  const isMyProfile = user ? user.id === profile.id : false;
  const isFollowing = user ? profile.followerIds.includes(user.id) : false;

  return (
    <main className="sm:flex mx-auto max-w-7xl gap-5 p-2 sm:p-4">
      {isMyProfile && showEditForm && (
        <EditProfileForm
          currentProfile={profile}
          onClose={handleEditFormVis}
          onSubmit={handleProfileRefresh}
        />
      )}

      {isMyProfile && resourceFormType && (
        <ProfileResourceForm
          resourceType={resourceFormType}
          onClose={() => {
            handleResourceFormVis(null);
          }}
          onSubmit={handleResourceRefresh}
        />
      )}

      {/* list to manage anime or manga */}
      {isMyProfile && resourceListType && (
        <ProfileResourceList
          resList={resourceListType === "anime" ? anime : manga}
          resType={resourceListType}
          onClose={() => {
            handleResourceListVis(null);
          }}
          onRemoveItem={handleResourceRemoval}
        />
      )}

      {/* user info */}
      <section className="flex-1 mb-5 sm:mb-0 sm:max-w-sm">
        <ImageFluid
          src={profile.pfp_url || DEFAULT_PFP_URL}
          className="h-96 mb-4"
        />
        <div className="flex flex-wrap justify-between items-center mb-2">
          <h2 className="mb-1 text-2xl">{profile.username}</h2>
          <div className="flex flex-wrap gap-4 text-xs">
            <p className="text-blue-500">
              Followers: {profile.followerIds.length}
            </p>
            <p className="text-blue-500">
              Following: {profile.followingIds.length}
            </p>
          </div>
        </div>
        <p className="mb-6 text-sm">{profile.bio || "No bio yet..."}</p>
        {user && !isMyProfile && (
          <Button
            variant="contained"
            className="mb-2 text-sm"
            onClick={() => {
              handleFollowClick(isFollowing);
            }}
          >
            {isFollowing ? "unfollow" : "follow"}
          </Button>
        )}

        {isMyProfile && (
          <Button
            variant="outlined"
            className="mb-10 text-xs"
            onClick={handleEditFormVis}
          >
            Edit Profile
          </Button>
        )}

        {/* statistics */}
        <h2 className="mb-1 font-medium">Statistics</h2>
        <p className="mb-4 text-xs">Anime and Manga summaries</p>

        {hasEnoughStats ? (
          <div className="flex justify-center">
            <LabeledPieChart
              data={[
                { name: "anime watched", value: stats.animeWatched },
                { name: "anime watching", value: stats.animeWatching },
                { name: "manga read", value: stats.mangaRead },
                { name: "manga reading", value: stats.mangaReading },
              ]}
              className="mb-8 sm:mb-4 max-w-xs sm:max-w-full shadow-sm rounded-md"
            />
          </div>
        ) : (
          <p className="text-red-600 text-xs mb-4">
            Add some more anime or manga to see stats!
          </p>
        )}
        <div className="mb-8 text-blue-500 text-xs">
          <p>Total Anime Watched: {stats.animeWatched}</p>
          <p className="mb-2">Current Anime Watching: {stats.animeWatching}</p>
          <p className="text-gray-600">Total Manga Read: {stats.mangaRead}</p>
          <p className="mb-2 text-gray-600">
            Current Manga Reading: {stats.mangaReading}
          </p>
          <p>
            Join Date: {new Date(profile.created_at).toLocaleString("en-US")}
          </p>
        </div>
      </section>

      {/* current anime and manga */}
      <section className="flex-1 min-w-0">
        <h2 className="font-medium">Currently Watching</h2>
        <p className="mb-2 text-xs">
          These are the anime I'm currently interested in!
        </p>

        {anime && (
          <ScrollableContainer containerClass="anime-scroll-div">
            {anime.map((a) => {
              if (!a) {
                return;
              }
              return <AnimeCard key={a.title} anime={a} />;
            })}
          </ScrollableContainer>
        )}

        {isMyProfile && (
          <div className="flex gap-2 mt-2 text-xs">
            <Button
              onClick={() => {
                handleResourceFormVis("anime");
              }}
            >
              Add Anime
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                handleResourceListVis("anime");
              }}
            >
              Manage Anime List
            </Button>
          </div>
        )}

        <h2 className="font-medium mt-10">Currently Reading</h2>
        <p className="mb-4 text-xs">I'm currently enjoying these manga!</p>

        {manga && (
          <ScrollableContainer containerClass="manga-scroll-div">
            {manga.map((m) => {
              if (!m) {
                return;
              }
              return <MangaCard key={m.title} manga={m} />;
            })}
          </ScrollableContainer>
        )}

        {isMyProfile && (
          <div className="flex gap-2 mt-2 text-xs">
            <Button
              onClick={() => {
                handleResourceFormVis("manga");
              }}
            >
              Add Manga
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                handleResourceListVis("manga");
              }}
            >
              Manage Manga List
            </Button>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProfilePage;
