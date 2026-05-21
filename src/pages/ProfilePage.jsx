import ImageFluid from "../components/ImageFluid";
import Button from "../components/Button";
import AnimeCard from "../components/AnimeCard";
import MangaCard from "../components/MangaCard.jsx";
import anime from "../profileExampleAnime.js";
import manga from "../profileExampleManga.js";
import ScrollableContainer from "../components/ScrollableContainer.jsx";
import LabeledPieChart from "../components/LabeledPieChart.jsx";

// temporary example profile, this will later come from database
const profile = {
  pfpUrl:
    "https://i.pinimg.com/736x/db/34/08/db34087fd72f849f7a7c2ef2aefbc3c8.jpg",
  handle: "hvvn",
  bio: "I like watching slice of life and shonen anime, let's connect!",
  followers: 1,
  following: 2,
  animeWatched: 10,
  animeWatching: 1,
  mangaRead: 5,
  mangaReading: 10,
  joinDate: new Date(Date.now()),
};

// user profile
const ProfilePage = () => {
  return (
    <main className="sm:flex mx-auto max-w-7xl gap-5 p-2 sm:p-4">
      {/* user info */}
      <section className="flex-1 mb-5 sm:mb-0 sm:max-w-sm">
        <ImageFluid src={profile.pfpUrl} className="h-96 mb-4" />
        <div className="flex flex-wrap justify-between items-center mb-2">
          <h2 className="mb-1 text-2xl">{profile.handle}</h2>
          <div className="flex flex-wrap gap-4 text-xs">
            <p className="text-blue-500">Followers: {profile.followers}</p>
            <p className="text-blue-500">Following: {profile.following}</p>
          </div>
        </div>
        <p className="mb-6 text-sm">{profile.bio}</p>
        <Button variant="contained" className="mb-10 text-sm">
          follow
        </Button>

        {/* statistics */}
        <h2 className="mb-1 font-medium">Stastistics</h2>
        <p className="mb-4 text-xs">Anime and Manga summaries</p>

        <div className="flex justify-center">
          <LabeledPieChart
            data={[
              { name: "anime watched", value: profile.animeWatched },
              { name: "anime watching", value: profile.animeWatching },
              { name: "manga read", value: profile.mangaRead },
              { name: "manga reading", value: profile.mangaReading },
            ]}
            className="mb-8 sm:mb-4 max-w-xs sm:max-w-full shadow-sm rounded-md"
          />
        </div>
        <div className="mb-8 text-blue-500 text-xs">
          <p>Total Anime Watched: {profile.animeWatched}</p>
          <p className="mb-2">
            Current Anime Watching: {profile.animeWatching}
          </p>
          <p className="text-gray-600">Total Manga Read: {profile.mangaRead}</p>
          <p className="mb-2 text-gray-600">
            Current Manga Reading: {profile.mangaReading}
          </p>
          <p>Join Date: {profile.joinDate.toString()}</p>
        </div>
      </section>

      {/* current anime and manga */}
      <section className="flex-1 min-w-0">
        <h2 className="font-medium">Currently Watching</h2>
        <p className="mb-2 text-xs">
          These are the anime I'm currently interested in!
        </p>

        <ScrollableContainer containerClass="anime-scroll-div">
          {anime.map((a) => (
            <AnimeCard key={a.name} anime={a} />
          ))}
        </ScrollableContainer>

        <h2 className="font-medium mt-10">Currently Reading</h2>
        <p className="mb-4 text-xs">I'm currently enjoying these manga!</p>
        <ScrollableContainer containerClass="manga-scroll-div">
          {manga.map((m) => (
            <MangaCard key={m.name} manga={m} />
          ))}
        </ScrollableContainer>
      </section>
    </main>
  );
};

export default ProfilePage;
