import { useState, useEffect } from "react";
import { useParams } from "react-router";
import Header from "./Header.jsx";
import {
  getMalResource,
  addMalResource,
  removeMalResource,
  getFullProfileById,
} from "../utils/profile.js";
import ImageFluid from "./ImageFluid.jsx";
import { StarIcon, TrophyIcon } from "@heroicons/react/16/solid";


import Button from "./Button.jsx";

import LoadingDiv from "./LoadingDiv.jsx";
import { useAuth } from "../utils/useAuth.js";

const AnimeDetailPage = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [error, setError] = useState(false);

  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingSubmission, setLoadingSubmission] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    getMalResource(id, "anime", abortController).then((anime) => {
      if (!anime) {
        setError(true);
        return;
      }
      setAnime(anime);
    });
  }, [id]);

  useEffect(() => {
    if (!user) {
      return;
    }

    getFullProfileById(user.id).then((pf) => {
      setProfile(pf);
    });
  }, [user]);

  const addAnimeToProfile = async () => {
    setLoadingSubmission(true);
    await addMalResource(user.id, {
      id: id,
      type: "anime",
      status: "current",
    });

    const newProfile = {
      ...profile,
      user_anime: [
        ...profile.user_anime,
        {
          anime_id: parseInt(id),
          status: "current",
        },
      ],
    };
    setProfile(newProfile);
    setLoadingSubmission(false);
  };

  const removeAnimeFromProfile = async () => {
    setLoadingSubmission(true);
    await removeMalResource(user.id, anime.mal_id, "anime");

    const newProfile = {
      ...profile,
      user_anime: profile.user_anime.filter((a) => a.anime_id !== anime.mal_id),
    };
    setProfile(newProfile);
    setLoadingSubmission(false);
  };

  if (error) {
    return (
      <>
        <Header onSearch={() => {}} />
        <p className="mt-40 text-red-500 max-w-fit mx-auto">
          Error retrieving anime
        </p>
      </>
    );
  }

  if (!anime || (user && !profile)) {
    return <LoadingDiv text="Loading Anime..." />;
  }

  const hasAnimeInProfile =
    !user || !profile
      ? false
      : profile.user_anime.some((a) => a.anime_id === parseInt(id));

  return (
    <>
      <div className="bg-white">
        <Header onSearch={() => {}} />
      </div>

      <section
        style={{
          backgroundImage: `url('${anime.images.jpg.large_image_url}')`,
        }}
        className="py-2 bg-contain blur-sm opacity-25 fixed inset-0 -z-50"
      ></section>

      <section className="my-5 p-5 max-w-6xl mx-auto bg-white shadow-md rounded-md">
        {/* image and title */}
        <article className="flex flex-wrap sm:flex-nowrap gap-5 sm:h-120">
          <ImageFluid
            src={anime.images.jpg.large_image_url}
            className="basis-80 max-h-80 sm:max-w-80 sm:max-h-none flex-1 shrink-0 shadow-md rounded-md"
          />

          <div className="flex flex-col justify-center">
            <div>
              <p className="text-gray-500 text-sm">{anime.aired.string}</p>
              <h2 className="mt-1 text-2xl font-bold">{anime.title}</h2>
              <div className="mt-1 flex gap-3 items-center">
                {/* rating and ranking */}
                <p className="flex gap-1 items-center">
                  Score:
                  <StarIcon width={16} className="text-yellow-500" />{" "}
                  {anime.score || 0}{" "}
                </p>
                <p className="flex gap-1 items-center">
                  Rank: <TrophyIcon width={16} className="text-blue-500" />
                  {anime.rank || "No Rank"}
                </p>
              </div>
              <p className="text-sm text-blue-500">
                Episodes: {anime.episodes}
              </p>
            </div>

            {/* synopsis */}
            <p className="mt-4 max-h-50 overflow-y-auto">{anime.synopsis}</p>

            <p className="text-sm mt-4 text-blue-500">
              Genres: {anime.genres.map((g) => g.name).join(", ")}
            </p>

            {user &&
              (hasAnimeInProfile ? (
                <Button
                  className="mt-4 text-sm max-w-fit"
                  onClick={removeAnimeFromProfile}
                  variant="outlined"
                  disabled={loadingSubmission}
                >
                  Remove from My Anime
                </Button>
              ) : (
                <Button
                  className="mt-4 text-sm max-w-fit"
                  onClick={addAnimeToProfile}
                  disabled={loadingSubmission}
                >
                  Add to My Anime
                </Button>
              ))}
          </div>
        </article>

        <h2 className="mt-8 text-2xl font-bold">Trailer</h2>
        {anime.trailer && anime.trailer.embed_url ? (
          <>
            <p>View the anime trailer directly from our website</p>

            <iframe
              src={anime.trailer.embed_url}
              className="mt-4 w-full h-96 shadow-md rounded-md"
            ></iframe>
          </>
        ) : (
          <p>This anime has no trailer.</p>
        )}
      </section>
    </>
  );
};

export default AnimeDetailPage;
