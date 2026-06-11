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

const MangaDetailPage = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [error, setError] = useState(false);

  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loadingSubmission, setLoadingSubmission] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    getMalResource(id, "manga", abortController).then((manga) => {
      if (!manga) {
        setError(true);
        return;
      }
      setManga(manga);
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

  const addMangaToProfile = async () => {
    setLoadingSubmission(true);
    await addMalResource(user.id, {
      id: id,
      type: "manga",
      status: "current",
    });

    const newProfile = {
      ...profile,
      user_manga: [
        ...profile.user_manga,
        {
          manga_id: parseInt(id),
          status: "current",
        },
      ],
    };
    setProfile(newProfile);
    setLoadingSubmission(false);
  };

  const removeMangaFromProfile = async () => {
    setLoadingSubmission(true);
    await removeMalResource(user.id, manga.mal_id, "manga");

    const newProfile = {
      ...profile,
      user_manga: profile.user_manga.filter((a) => a.manga_id !== manga.mal_id),
    };
    setProfile(newProfile);
    setLoadingSubmission(false);
  };

  if (error) {
    return (
      <>
        <Header onSearch={() => {}} />
        <p className="mt-40 text-red-500 max-w-fit mx-auto">
          Error retrieving manga
        </p>
      </>
    );
  }

  if (!manga || (user && !profile)) {
    return <LoadingDiv text="Loading Manga..." />;
  }

  const hasMangaInProfile =
    !user || !profile
      ? false
      : profile.user_manga.some((a) => a.manga_id === parseInt(id));

  return (
    <>
      <div className="bg-white">
        <Header onSearch={() => {}} />
      </div>

      <section
        style={{
          backgroundImage: `url('${manga.images.jpg.large_image_url}')`,
        }}
        className="py-2 bg-contain blur-sm opacity-25 fixed inset-0 -z-50"
      ></section>

      <section className="my-5 p-5 max-w-6xl mx-auto bg-white shadow-md rounded-md">
        {/* image and title */}
        <article className="flex flex-wrap sm:flex-nowrap gap-5 sm:h-120">
          <ImageFluid
            src={manga.images.jpg.large_image_url}
            className="basis-80 max-h-80 sm:max-w-80 sm:max-h-none flex-1 shrink-0 shadow-md rounded-md"
          />

          <div className="flex flex-col justify-center">
            <div>
              <p className="text-gray-500 text-sm">{manga.published.string}</p>
              <h2 className="mt-1 text-2xl font-bold">{manga.title}</h2>
              <div className="mt-1 flex gap-3 items-center">
                {/* rating and ranking */}
                <p className="flex gap-1 items-center">
                  Score:
                  <StarIcon width={16} className="text-yellow-500" />{" "}
                  {manga.score || 0}{" "}
                </p>
                <p className="flex gap-1 items-center">
                  Rank: <TrophyIcon width={16} className="text-blue-500" />
                  {manga.rank || "No Rank"}
                </p>
              </div>
              <p className="text-sm text-blue-500">
                Chapters: {manga.chapters}
              </p>
            </div>

            {/* synopsis */}
            <p className="mt-4 max-h-50 overflow-y-auto">{manga.synopsis}</p>

            <p className="text-sm mt-4 text-blue-500">
              Genres: {manga.genres.map((g) => g.name).join(", ")}
            </p>

            {user &&
              (hasMangaInProfile ? (
                <Button
                  className="mt-4 text-sm max-w-fit"
                  onClick={removeMangaFromProfile}
                  variant="outlined"
                  disabled={loadingSubmission}
                >
                  Remove from My Manga
                </Button>
              ) : (
                <Button
                  className="mt-4 text-sm max-w-fit"
                  onClick={addMangaToProfile}
                  disabled={loadingSubmission}
                >
                  Add to My Manga
                </Button>
              ))}
          </div>
        </article>
      </section>
    </>
  );
};

export default MangaDetailPage;
