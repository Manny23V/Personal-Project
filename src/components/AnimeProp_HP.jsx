import { useNavigate } from "react-router"

export default function AnimeProp_HP({ item, useDetailPageLink=false }) {
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow${useDetailPageLink ? " cursor-pointer" : ""}`}
    onClick={useDetailPageLink ? () => {navigate(`/anime/${item.mal_id}`)} : null}>

      {/* cover image */}
      <img
        src={item.images.jpg.image_url}
        alt={item.title}
        className="w-full h-64 object-cover"
      />

      {/* info section */}
      <div className="p-3 flex flex-col gap-1">

        <h2 className="font-semibold text-sm line-clamp-2">
          {item.title}
        </h2>

        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">

          {/* score */}
          {item.score && <span>⭐ {item.score}</span>}

          {/* episode count */}
          {item.episodes && <span>{item.episodes} eps</span>}

        </div>

      </div>

    </div>
  )
}