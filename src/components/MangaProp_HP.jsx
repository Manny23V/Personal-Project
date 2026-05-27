export default function MangaProp_HP({ item }) {
    return (
        <div className="flex flex-col rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">

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

                {/* chapter count */}
                {item.chapters && <span>{item.chapters} chs</span>}

                </div>

            </div>

        </div>
    )
}