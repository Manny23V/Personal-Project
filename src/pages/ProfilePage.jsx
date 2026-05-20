import ImageFluid from "../components/ImageFluid";
import Button from "../components/Button";
import AnimeCard from "../components/AnimeCard";
import anime from "../profileExampleAnime.js";
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
        <ImageFluid src={profile.pfpUrl} className="h-96" />
        <h2 className="text-2xl">{profile.handle}</h2>
        <p>{profile.bio}</p>
        <p>Followers: {profile.followers}</p>
        <p>Following: {profile.following}</p>
        <Button variant="outlined">follow</Button>
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
      </section>
    </main>
  );
};

export default ProfilePage;
