import { useRef } from 'react'
import AnimeProp_HP from './AnimeProp_HP'

export default function HP_Carousel({ animeList }) {
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
                {animeList.map((anime) => (
                <div key={anime.mal_id} className="min-w-[160px]">
                    <AnimeProp_HP anime={anime} />
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