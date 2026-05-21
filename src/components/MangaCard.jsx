import ImageFluid from "./ImageFluid.jsx";

// card showing manga details (name, ratings, synposis, etc.)
// tailored for profile page
const MangaCard = ({ manga, className="" }) => {
  return (
    <article className={`flex-1 min-w-40 sm:min-w-60 shrink-0 p-1 outline outline-gray-100 shadow-md rounded-sm overflow-y-auto ${className}`}>
      <ImageFluid src={manga.imgUrl} className="h-60 sm:h-90 mb-4 rounded-md" />
      <div>
        <p className="mb-1 text-xs text-gray-600">
          {manga.publishing} | {manga.published}
        </p>

        <h3 className="mb-1 font-medium">{manga.name}</h3>
        <div className="flex flex-wrap gap-2 mb-4 text-xs text-blue-500">
          <p>Chapters: {manga.chapters}</p>
          <p>Rating: {manga.rating}</p>
          <p>Ranking: {manga.ranking}</p>
        </div>

        <p className="mb-4 text-sm max-h-32 overflow-y-auto">
          {manga.synopsis}
        </p>
        <p className="text-xs text-gray-600">
          Genres: {manga.genres.join(", ")}
        </p>
      </div>
    </article>
  );
};

export default MangaCard;
