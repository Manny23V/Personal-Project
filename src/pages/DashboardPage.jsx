import { useState, useEffect } from "react";

import { Link } from "react-router";

import Header from "../components/Header";
import Button from "../components/Button";
import ImageFluid from "../components/ImageFluid";
import LoadingDiv from "../components/LoadingDiv";

import ProfileResourceForm from "../components/ProfileResourceForm";
import DashboardFriendList from "../components/DashboardFriendList";

import useProfile from "../utils/useProfile.js";
import { useAuth } from "../utils/useAuth.js";

import {
  DEFAULT_PFP_URL,
  getStats,
  getUserAnime,
  getUserManga,
  getAllMalResources,
  getFriends,
  removeMalResource,
  updateMalResourceStatus,
} from "../utils/profile.js";

const STATUSES = ["current", "completed", "planned"];

// anime or manga status
const statusLabel = (status, resType) => {
  if (status === "current") {
    return resType === "anime" ? "Watching" : "Reading";
  }
  if (status === "planned") {
    return resType === "anime" ? "Plan to Watch" : "Plan to Read";
  }
  return "Completed";
};

// get anime or manga
const getList = async (userId, resType) => {
  const getRows = resType === "anime" ? getUserAnime : getUserManga;
  const { data, error } = await getRows(userId);
  if (error) {
    return null;
  }
  console.log(getRows);
  return data.map((row) => ({ id: row[`${resType}_id`], status: row.status }));
};

// Manga read, anime watched stats
const StatTile = ({ label, value }) => (
  <div className="border border-gray-200 rounded-xl px-4 py-3">
    <p className="text-2xl font-semibold text-blue-600">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const profile = useProfile();

  // top bar tabs (anime, manga, watching, reading, etc.)
  const [activeTab, setActiveTab] = useState("anime");
  const [statusFilter, setStatusFilter] = useState("all");

  const [lists, setLists] = useState(null);
  const [friends, setFriends] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState(null);

  const updateList = (resType, update) =>
    setLists((prev) => ({ ...prev, [resType]: update(prev[resType]) }));

  useEffect(() => {
    // not logged in
    if (!profile) {
      return;
    }

    // get user friends
    getFriends(profile.id).then(({ data, error }) => {
      if (error) {
        setFriends([]);
        return;
      }
      setFriends(data);
    });

    const attachDetails = (resType, details) =>
      setLists((prev) => ({
        ...prev,
        [resType]: prev[resType].map((row) => ({
          ...row,
          details:
            row.details ??
            details.find((d) => d && d.mal_id === row.id) ??
            null,
        })),
      }));

    const loadLists = async () => {
      const [anime, manga] = await Promise.all([
        getList(profile.id, "anime"),
        getList(profile.id, "manga"),
      ]);
      if (!anime || !manga) {
        setError("Failed to get anime or manga lists");
        setLists({ anime: [], manga: [] });
        return;
      }
      setLists({ anime, manga });

      const ids = (rows) => rows.map((row) => row.id);
      attachDetails("anime", await getAllMalResources(ids(anime), "anime"));
      attachDetails("manga", await getAllMalResources(ids(manga), "manga"));
    };

    loadLists().catch(() => setError("Failed to load anime / manga details"));
  }, [profile]);

  const handleStatusChange = async (resType, id, status) => {
    const { error } = await updateMalResourceStatus(
      profile.id,
      id,
      resType,
      status,
    );
    if (error) {
      setError(`Failed to update ${resType} status`);
      return;
    }
    updateList(resType, (rows) =>
      rows.map((row) => (row.id === id ? { ...row, status } : row)),
    );
  };

  const handleRemove = async (resType, id) => {
    const { error } = await removeMalResource(profile.id, id, resType);
    if (error) {
      setError(`Failed to remove ${resType}`);
      return;
    }
    updateList(resType, (rows) => rows.filter((row) => row.id !== id));
  };

  // the form only gives back the MAL resource, so refetch rows for the status
  const handleAdded = async (res) => {
    const resType = activeTab;
    const rows = await getList(profile.id, resType);
    if (!rows) {
      setError(`Failed to get ${resType} list`);
      return;
    }
    updateList(resType, (prevRows) =>
      rows.map((row) => ({
        ...row,
        details:
          row.id === res.mal_id
            ? res
            : prevRows.find((prev) => prev.id === row.id)?.details,
      })),
    );
  };

  if (!authLoading && !user) {
    return (
      <>
        <Header onSearch={() => {}} />
        <main className="max-w-xl mx-auto mt-12 text-center text-sm">
          <Link to="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>{" "}
          to see your dashboard.
        </main>
      </>
    );
  }

  if (!profile || !lists) {
    return <LoadingDiv text="Loading dashboard..." />;
  }

  const stats = getStats(lists.anime, lists.manga);
  const visibleRows = lists[activeTab].filter(
    (row) => statusFilter === "all" || row.status === statusFilter,
  );

  return (
    <>
      <Header onSearch={() => {}} />

      {showAddForm && (
        <ProfileResourceForm
          resourceType={activeTab}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAdded}
        />
      )}

      <main className="mx-auto max-w-6xl p-3 sm:p-6">
        {/* greeting */}
        <div className="flex items-center gap-4 mb-8">
          <ImageFluid
            src={profile.pfp_url || DEFAULT_PFP_URL}
            alt={profile.username}
            className="w-16 h-16 rounded-full border border-gray-200"
          />
          <div>
            <h1 className="text-2xl">
              Hello, <b>{profile.username}</b>
            </h1>
            <p className="text-xs text-gray-500">
              Manage your lists and keep up with friends.
            </p>
          </div>
        </div>

        {error && (
          <p className="mb-4 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="lg:flex gap-8">
          <div className="flex-1 min-w-0">
            {/* stats */}
            <section className="mb-8">
              <h2 className="mb-1 font-medium">Statistics</h2>
              <p className="mb-4 text-xs text-gray-500">
                Anime and manga summaries
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatTile label="Anime Completed" value={stats.animeWatched} />
                <StatTile label="Anime Watching" value={stats.animeWatching} />
                <StatTile label="Manga Completed" value={stats.mangaRead} />
                <StatTile label="Manga Reading" value={stats.mangaReading} />
              </div>
            </section>

            {/* list manager */}
            <section>
              {/* anime or manga button */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex gap-2">
                  {["anime", "manga"].map((t) => (
                    <Button
                      key={t}
                      variant={activeTab === t ? "contained" : "outlined"}
                      onClick={() => setActiveTab(t)}
                      className="text-sm capitalize"
                    >
                      {t}
                    </Button>
                  ))}
                </div>
                <Button
                  className="text-sm"
                  onClick={() => setShowAddForm(true)}
                >
                  Add {activeTab === "anime" ? "Anime" : "Manga"}
                </Button>
              </div>

              {/* status submenus (all, watching, completed, reading, etc.) */}
              <div className="flex flex-wrap gap-4 mb-4 border-b border-gray-200 text-sm">
                {["all", ...STATUSES].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`pb-2 transition-colors ${
                      statusFilter === s
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {s === "all" ? "All" : statusLabel(s, activeTab)}
                  </button>
                ))}
              </div>

              {/* show all anime or manga */}
              {visibleRows.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No {activeTab} here yet!
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {visibleRows.map(({ id, status, details }) => (
                    <article
                      key={id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl"
                    >
                      {details ? (
                        <ImageFluid
                          src={details.images.jpg.image_url}
                          alt={details.title}
                          className="h-20 w-14 shrink-0 rounded-sm"
                        />
                      ) : (
                        <div className="h-20 w-14 shrink-0 rounded-sm bg-gray-100 animate-pulse" />
                      )}

                      <div className="flex-1 min-w-0">
                        {details ? (
                          <>
                            <Link
                              to={`/${activeTab}/${id}`}
                              className="block font-medium truncate hover:text-blue-600"
                            >
                              {details.title}
                            </Link>
                            <p className="text-xs text-blue-500">
                              {activeTab === "anime"
                                ? `${details.episodes ?? "?"} episodes`
                                : `${details.chapters ?? "?"} chapters`}
                              {details.score
                                ? ` · Rating ${details.score}`
                                : ""}
                            </p>
                          </>
                        ) : (
                          <p className="font-medium text-gray-400">
                            {details === undefined
                              ? "Loading..."
                              : `MAL #${id}`}
                          </p>
                        )}
                      </div>

                      <select
                        value={status}
                        onChange={(e) =>
                          handleStatusChange(activeTab, id, e.target.value)
                        }
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-blue-400"
                        aria-label="Status"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {statusLabel(s, activeTab)}
                          </option>
                        ))}
                      </select>

                      <Button
                        variant="outlined"
                        className="text-xs"
                        onClick={() => handleRemove(activeTab, id)}
                      >
                        Remove
                      </Button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* friends */}
          <aside className="mt-10 lg:mt-0 lg:w-72 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">Friends</h2>
              <Link
                to="/friends"
                className="text-xs text-blue-500 hover:underline"
              >
                Manage
              </Link>
            </div>
            {friends === null ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : (
              <DashboardFriendList
                friends={friends}
                currentUserId={profile.id}
              />
            )}
          </aside>
        </div>
      </main>
    </>
  );
};

export default DashboardPage;
