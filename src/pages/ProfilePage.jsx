import ImageFluid from "../components/ImageFluid";
import Button from "../components/Button";
import AnimeCard from "../components/AnimeCard";
import MangaCard from "../components/MangaCard.jsx";
import anime from "../profileExampleAnime.js";
import manga from "../profileExampleManga.js";
import ScrollableContainer from "../components/ScrollableContainer.jsx";

// temporary example profile, this will later come from database
const profile = {
  pfpUrl:
    "https://i.pinimg.com/736x/db/34/08/db34087fd72f849f7a7c2ef2aefbc3c8.jpg",
  handle: "hvvn",
  bio: "I like watching slice of life and shonen anime, let's connect!",
  followers: 1,
  following: 2,
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
        <Button variant="contained" className="text-sm">
          follow
        </Button>
      </section>

      {/* anime, manga, and stats */}
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

        <h2 className="font-medium mt-4">Currently Reading</h2>
        <p className="mb-4 text-xs">
          I'm currently enjoying these manga!
        </p>
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
