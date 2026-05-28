import { supabase } from "../supabaseClient.js";
import sleep from "./sleep.js";
const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

export const DEFAULT_PFP_URL =
  "https://i.pinimg.com/474x/94/cb/68/94cb68baea50bb98cdab65b74e731c1c.jpg";

// gets the id of every person that follows the user with user_id
export const getFollowerIds = async (user_id) => {
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("followed_id", user_id);

  if (error) {
    throw new Error("Error retrieving followers");
  }

  return data.map((result) => result.follower_id);
};

// gets the id of every person that the user with user_id follows
export const getFollowingIds = async (user_id) => {
  const { data, error } = await supabase
    .from("follows")
    .select("followed_id")
    .eq("follower_id", user_id);

  if (error) {
    throw new Error("Error retrieving followers");
  }

  return data.map((result) => result.followed_id);
};

// retrieves the profile for username, including their anime ids, manga ids,
// and follower / following ids. this does require a join
export const getProfile = async (username) => {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      *,
      user_anime(created_at, anime_id, status),
      user_manga(created_at, manga_id, status)
      `,
    )
    .eq("username", username);

  if (error) {
    throw new Error("Error retrieving profile");
  }

  if (data.length === 0) {
    throw new Error("User not found");
  }

  // get follower and following ids
  const profile = data[0];
  try {
    const followerIds = await getFollowerIds(profile.id);
    const followingIds = await getFollowingIds(profile.id);
    profile.followerIds = followerIds;
    profile.followingIds = followingIds;
    return profile;
  } catch (error) {
    throw new Error("Error retrieving profile");
  }
};

export const getProfileById = async (userId) => {
  return await supabase.from("profiles").select().eq("id", userId);
};

// get current / total watch and read count stats
export const getStats = (userAnime, userManga) => {
  const stats = {
    animeWatched: 0,
    animeWatching: 0,
    mangaRead: 0,
    mangaReading: 0,
  };

  userAnime.forEach((a) => {
    if (a.status === "completed") {
      stats.animeWatched++;
    } else if (a.status === "current") {
      stats.animeWatching++;
    }
  });

  userManga.forEach((m) => {
    if (m.status === "completed") {
      stats.mangaRead++;
    } else if (m.status === "current") {
      stats.mangaReading++;
    }
  });

  return stats;
};

// gets the MAL resource from JIKAN with the given id
// type indicates anime or manga
// (e.g. getMalResource(4218, "manga"))
export const getMalResource = async (id, type, abortController) => {
  if (type !== "manga" && type !== "anime") {
    throw new Error("Invalid resource type");
  }

  const res = await fetch(`${JIKAN_BASE_URL}/${type}/${id}`, {
    signal: abortController?.signal,
  });
  const json = await res.json();
  return json.data;
};

// gets ALL the anime or manga for a user from JIKAN,
// using getMalResource as a helper
// (e.g. getUserResources([1, 5598, 42], "manga"))
export const getAllMalResources = async (
  resourceIds,
  type,
  abortController,
) => {
  if (type !== "manga" && type !== "anime") {
    throw new Error("Invalid resource type");
  }

  const resources = [];
  for (const resourceId of resourceIds) {
    // sleep to avoid rate limits...
    await sleep(400);
    const resource = await getMalResource(resourceId, type, abortController);
    resources.push(resource);
  }
  return resources;
};

// changes a user's profile picture, bio, or both in db
export const updateProfile = async (newProfile) => {
  return await supabase
    .from("profiles")
    .update({
      pfp_url: newProfile.pfp_url,
      bio: newProfile.bio,
    })
    .eq("id", newProfile.id);
};

// adds an anime or manga to your profile
export const addMalResource = async (userId, resource) => {
  return await supabase.from(`user_${resource.type}`).insert({
    user_id: userId,
    [`${resource.type}_id`]: resource.id,
    status: resource.status,
  });
};

// removes a manga or anime from your profile
export const removeMalResource = async (userId, resId, resType) => {
  return await supabase
    .from(`user_${resType}`)
    .delete()
    .eq("user_id", userId)
    .eq(`${resType}_id`, resId);
};

export const followUser = async (followerId, followedId) => {
  return await supabase.from("follows").insert({
    follower_id: followerId,
    followed_id: followedId,
  });
};

export const unfollowUser = async (followerId, followedId) => {
  return await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("followed_id", followedId);
};

export const checkIsFollowing = async (followerId, followedId) => {
  const { data, error } = await supabase
    .from("follows")
    .select()
    .eq("follower_id", followerId)
    .eq("followed_id", followedId);

  if (error) {
    return false;
  }

  return data[0] ? true : false;
};
