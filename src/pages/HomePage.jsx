import { useState, useEffect } from 'react'
import AnimeCarousel from '../components/HP_Carousel'


export default function HomePage() {
    const [animeList, setAnimeList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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
            <AnimeCarousel animeList={animeList} />
        </div>
    )
}