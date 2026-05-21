export default function AnimeProp_HP({ anime }) {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">

      {/* cover image */}
      <img
        src={anime.images.jpg.image_url}
        alt={anime.title}
        className="w-full h-64 object-cover"
      />

      {/* info section */}
      <div className="p-3 flex flex-col gap-1">

        <h2 className="font-semibold text-sm line-clamp-2">
          {anime.title}
        </h2>

        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">

          {/* score */}
          <span>⭐ {anime.score ?? 'N/A'}</span>

          {/* episode count */}
          <span>{anime.episodes ? `${anime.episodes} eps` : 'N/A'}</span>

        </div>

      </div>

    </div>
  )
}