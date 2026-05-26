import ImageFluid from "./ImageFluid.jsx";

// card showing manga details (name, ratings, synposis, etc.)
// tailored for profile page
const MangaCard = ({ manga, className = "" }) => {
  const genreStrings = manga.genres.map((g) => g.name).join(", ");
  return (
    <article
      className={`flex-1 min-w-40 sm:min-w-60 shrink-0 p-1 outline outline-gray-100 shadow-md rounded-sm overflow-y-auto ${className}`}
    >
      <ImageFluid
        src={manga.images.jpg.large_image_url}
        className="h-60 sm:h-90 mb-4 rounded-md"
      />
      <div>
        <p className="mb-1 text-xs text-gray-600">
          {manga.status} | {manga.published.string}
        </p>

        <h3 className="mb-1 font-medium">{manga.title}</h3>
        <div className="flex flex-wrap gap-2 mb-4 text-xs text-blue-500">
          <p>Chapters: {manga.chapters}</p>
          <p>Rating: {manga.score || "0.0"}</p>
          <p>Ranking: {manga.rank || "None"}</p>
        </div>

        <p className="mb-4 text-sm max-h-32 overflow-y-auto">
          {manga.synopsis}
        </p>
        <p className="text-xs text-gray-600">
          Genres: {genreStrings}
        </p>
      </div>
    </article>
  );
};

export default MangaCard;
