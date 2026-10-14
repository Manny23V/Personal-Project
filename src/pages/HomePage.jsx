import { useState, useEffect } from 'react'
import HP_Carousel from '../components/HP_Carousel'
import AnimeProp_HP from '../components/AnimeProp_HP'
import MangaProp_HP from '../components/MangaProp_HP'
import { getTopAnime, getRecommendations, searchAnime } from '../utils/mal.js'

export default function HomePage({searchQuery}) {
  // Recommendations and popular anime
  const [popularAnime, setPopularAnime] = useState([]);
  const [recommendedAnime, setRecommendedAnime] = useState([]);
  const [recommendedManga, setRecommendedManga] = useState([]);

  // States for searching, loading, etc.
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);

  // Gets all the popular and recommended mal resources
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [popular, recommendedAni, recommendedMa] = await Promise.all([
          getTopAnime(),
          getRecommendations("anime"),
          getRecommendations("manga"),
        ]);

        setPopularAnime(popular);
        setRecommendedAnime(recommendedAni);
        setRecommendedManga(recommendedMa);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Handles search results 
  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    const fetchSearchResults = async (query) => {
      setSearching(true);
      try {
        setSearchResults(await searchAnime(query));
      } catch (err) {
        setError(err.message);
      } finally {
        setSearching(false);
      }
    };
    fetchSearchResults(searchQuery);
  }, [searchQuery]);

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
          <HP_Carousel list={searchResults} CardComponent={AnimeProp_HP} useDetailPageLink={true}/>
        )}

      </div>
    )
  }
  return (
    <div className="min-h-screen p-8 flex flex-col gap-12">

      <section>
        <h2 className="text-2xl font-bold mb-4">Popular Anime</h2>
        <HP_Carousel list={popularAnime} CardComponent={AnimeProp_HP} useDetailPageLink={true}/>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Anime Recommendations</h2>
        <HP_Carousel list={recommendedAnime} CardComponent={AnimeProp_HP} useDetailPageLink={true}/>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Manga Recommendations</h2>
        <HP_Carousel list={recommendedManga} CardComponent={MangaProp_HP} useDetailPageLink={true}/>
      </section>

    </div>
  )
}