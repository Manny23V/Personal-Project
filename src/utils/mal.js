import { supabase } from "../supabaseClient.js";

// the only columns the homepage cards need
const cardColumns = (type) =>
  type === "anime"
    ? "mal_id, title, images, score, episodes"
    : "mal_id, title, images, score, chapters";

const checkType = (type) => {
  if (type !== "manga" && type !== "anime") {
    throw new Error("Invalid resource type");
  }
};

// highest ranked anime
export const getTopAnime = async (limit = 25) => {
  const { data, error } = await supabase
    .from("anime")
    .select(cardColumns("anime"))
    .eq("sfw", true)
    .not("rank", "is", null)
    .order("rank")
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
};

// picks random top titles
export const getRecommendations = async (type, limit = 25) => {
  checkType(type);
  const { data, error } = await supabase
    .from(type)
    .select(cardColumns(type))
    .eq("sfw", true)
    .order("popularity")
    .limit(200);

  if (error) {
    throw error;
  }

  return data
    .map((row) => ({ row, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, limit)
    .map(({ row }) => row);
};

// finds an anime based on user query
export const searchAnime = async (query, limit = 25) => {
  const likeQuery = `%${query}%`;
  const { data, error } = await supabase
    .from("anime")
    .select(cardColumns("anime"))
    .eq("sfw", true)
    .or(`title.ilike.${likeQuery},title_english.ilike.${likeQuery}`)
    .order("popularity")
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
};
