import { useState, useEffect } from 'react'
import HP_Carousel from '../components/HP_Carousel'
import AnimeProp_HP from '../components/AnimeProp_HP'
import MangaProp_HP from '../components/MangaProp_HP'

export default function HomePage({searchQuery}) {
  const [popularAnime, setPopularAnime]               = useState([])
  const [recommendedAnime, setRecommendedAnime]       = useState([])
  const [recommendedManga, setRecommendedManga]       = useState([])
  const [searchResults, setSearchResults]             = useState([])
  const [loading, setLoading]                         = useState(true)
  const [searching, setSearching]                     = useState(false)
  const [error, setError]                             = useState(null)

  useEffect(() => {
    fetchAll()
  }, [])

  useEffect(() => {
    if (!searchQuery) return
    fetchSearchResults(searchQuery)
  }, [searchQuery])

  const fetchAll = async () => {
    try {

      const [popularRes, recommendedRes, recommendedMangaRes] = await Promise.all([
        fetch('https://api.jikan.moe/v4/top/anime'),
        fetch('https://api.jikan.moe/v4/recommendations/anime'),
        fetch('https://api.jikan.moe/v4/recommendations/manga')
      ])

      if (!popularRes.ok || !recommendedRes.ok || !recommendedMangaRes.ok) {
        throw new Error('Failed to fetch anime')
      }

      const popularData = await popularRes.json()
      const recommendedAniData = await recommendedRes.json()
      const recommendedMaData = await recommendedMangaRes.json()

      setPopularAnime(popularData.data)

      const recommendations = recommendedAniData.data
        .flatMap((item) => item.entry)

      setRecommendedAnime(recommendations)

      const recommendationsMA = recommendedMaData.data
        .flatMap((item) => item.entry)

      setRecommendedManga(recommendationsMA)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSearchResults = async (query) => {
    setSearching(true)
    try {
      const response =  await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }

      const data = await response.json()
      setSearchResults(data.data)

    } catch (err) {
      setError(err.message)
    } finally {
      setSearching(false)
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

  if (searchQuery) {
    return (
      <div className="min-h-screen p-8">

        <h2 className="text-2xl font-bold mb-4">
          Results for "{searchQuery}"
        </h2>

        {searching ? (
          <p className="text-gray-500">Searching...</p>
        ) : searchResults.length === 0 ? (
          <p className="text-gray-500">No results found.</p>
        ) : (
          <HP_Carousel list={searchResults} CardComponent={AnimeProp_HP} />
        )}

      </div>
    )
  }
  return (
    <div className="min-h-screen p-8 flex flex-col gap-12">

      <section>
        <h2 className="text-2xl font-bold mb-4">Popular Anime</h2>
        <HP_Carousel list={popularAnime} CardComponent={AnimeProp_HP}/>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Anime Recommendations</h2>
        <HP_Carousel list={recommendedAnime} CardComponent={AnimeProp_HP}/>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Manga Recommendations</h2>
        <HP_Carousel list={recommendedManga} CardComponent={MangaProp_HP}/>
      </section>

    </div>
  )
}