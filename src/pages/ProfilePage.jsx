import ImageFluid from "../components/ImageFluid";
import Button from "../components/Button";

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
    <main className="sm:flex">
      {/* user info */}
      <section className="flex-1">
        <ImageFluid src={profile.pfpUrl} className="h-96"/>
        <h2 className="text-2xl">{profile.handle}</h2>
        <p>{profile.bio}</p>
        <p>Followers: {profile.followers}</p>
        <p>Following: {profile.following}</p>
        <Button variant="outlined">follow</Button>
      </section>

      {/* anime, manga, and stats */}
      <section className="flex-1">
        <p>Anime Stats</p>
      </section>
    </main>
  );
};

export default ProfilePage;
