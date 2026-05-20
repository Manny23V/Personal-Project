import ImageFluid from "../components/ImageFluid";

// card showing anime details, including image, rating, synopsis, etc.
// tailored for profile display
// classname allows for extra classes for more specific styling
const AnimeCard = ({ anime, className }) => {
  return (
    <article
      className={`flex h-48 w-md items-center shrink-0 gap-3 p-1 outline outline-gray-100 shadow-md rounded-sm ${className}`}
    >
      <ImageFluid
        src={anime.imgUrl}
        className="w-32 h-full shrink-0 rounded-md"
      />
      <div className="overflow-y-auto">
        <p className="mb-1 text-xs text-gray-600">
          {anime.airing} | {anime.season}
        </p>
        <h3 className="font-medium">{anime.name}</h3>
        <div className="flex gap-2 mb-2 text-xs text-blue-500">
          <p>Rating: {anime.rating}</p>
          <p>Ranking: {anime.ranking}</p>
          <p>{anime.episodes} episodes</p>
        </div>

        <p className="mb-2 text-sm">{anime.synopsis}</p>
        <p className="text-xs text-gray-600">
          Genres: {anime.genres.join(", ")}
        </p>
      </div>
    </article>
  );
};

export default AnimeCard;
