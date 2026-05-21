import { useState, useEffect } from 'react'
import AnimeProp_HP from '../components/AnimeProp_HP'


export default function HomePage() {
    const [animeList, setAnimeList] = useState([])
    const [loading, setLoading]     = useState(true)
    const [error, setError]         = useState(null)

    useEffect(() => {
        fetchPopularAnime()
    }, [])

    const fetchPopularAnime = async () => {
        try {
            const response=  await fetch('https://api.jikan.moe/v4/top/anime')

            if (!response.ok) {
                throw new Error('Faild to fetch anime')
            }

            const data = await response.json()
            setAnimeList(data.data)

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Loading anime...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500">Something went wrong: {error}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-8">

            <h1 className="text-3xl font-bold mb-8">Popular Anime</h1>

            {/* grid of anime cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {animeList.map((anime) => (
                    <AnimeProp_HP key={anime.mal_id} anime={anime} />
                ))}
            </div>

        </div>
    )
}