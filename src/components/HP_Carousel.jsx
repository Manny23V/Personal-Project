import { useRef } from 'react'

export default function HP_Carousel({ list, CardComponent }) {
    const scrollRef = useRef(null)

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -500, behavior: 'smooth' })
    }

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 500, behavior: 'smooth' })
    }
    
    return (
        <div className="relative">

            {/* left button */}
            <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow hover:shadow-md transition-shadow"
            >
                ‹
            </button>

            {/* scrollable row */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scroll-smooth px-12 py-2 scrollbar-hide"
            >
                {list.map((item, index) => (
                <div key={`${item.mal_id}-${index}`} className="min-w-[160px]">
                    <CardComponent item={item} />
                </div>
                ))}
            </div>

            {/* right button */}
            <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow hover:shadow-md transition-shadow"
            >
                ›
            </button>

        </div>
    )
}