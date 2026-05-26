import ImageFluid from "../components/ImageFluid";

// card showing anime details, including image, rating, synopsis, etc.
// tailored for profile display
// classname allows for extra classes for more specific styling
const AnimeCard = ({ anime, className }) => {
  const genreStrings = anime.genres.map((g) => g.name).join(", ");
  return (
    <article
      className={`flex h-48 w-md items-center shrink-0 gap-3 p-1 outline outline-gray-100 shadow-md rounded-sm ${className}`}
    >
      <ImageFluid
        src={anime.images.jpg.large_image_url}
        className="w-32 h-full shrink-0 rounded-md"
      />
      <div className="overflow-y-auto">
        <p className="mb-1 text-xs text-gray-600">
          {anime.status} | {anime.season || "No Season"}
        </p>
        <h3 className="font-medium">{anime.titles[0].title}</h3>
        <div className="flex gap-2 mb-2 text-xs text-blue-500">
          <p>Rating: {anime.score || "0.0"}</p>
          <p>Ranking: {anime.rank || "None"}</p>
          <p>{anime.episodes || 0} episodes</p>
        </div>

        <p className="mb-2 text-sm max-h-15 overflow-y-scroll">{anime.synopsis}</p>
        <p className="text-xs text-gray-600">
          Genres: {genreStrings}
        </p>
      </div>
    </article>
  );
};

export default AnimeCard;
