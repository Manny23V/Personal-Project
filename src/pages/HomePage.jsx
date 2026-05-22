import { useState, useEffect } from 'react'
import HP_Carousel from '../components/HP_Carousel'

export default function HomePage() {
  const [popularAnime, setPopularAnime]               = useState([])
  const [recommendedAnime, setRecommendedAnime]       = useState([])
  const [loading, setLoading]                         = useState(true)
  const [error, setError]                             = useState(null)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {

      const [popularRes, recommendedRes] = await Promise.all([
        fetch('https://api.jikan.moe/v4/top/anime'),
        fetch('https://api.jikan.moe/v4/recommendations/anime'),
      ])

      if (!popularRes.ok || !recommendedRes.ok) {
        throw new Error('Failed to fetch anime')
      }

      const popularData     = await popularRes.json()
      const recommendedData = await recommendedRes.json()

      setPopularAnime(popularData.data)

      const recommendations = recommendedData.data
        .flatMap((item) => item.entry)

      setRecommendedAnime(recommendations)

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
    <div className="min-h-screen p-8 flex flex-col gap-12">

      <section>
        <h2 className="text-2xl font-bold mb-4">Popular Anime</h2>
        <HP_Carousel animeList={popularAnime} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Anime Recommendations</h2>
        <HP_Carousel animeList={recommendedAnime} />
      </section>

    </div>
  )
}