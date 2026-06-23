import { supabase } from "../supabaseClient.js";

export const getAllCommunities = async () => {
  return await supabase.from("communities").select(`
    *,
    community_memberships(user_id)
    `);
};

export const getCommunity = async (commId) => {
  return await supabase
    .from("communities")
    .select(`*, community_memberships(user_id)`)
    .eq("id", commId);
};

export const joinCommunity = async (commId, userId) => {
  return await supabase.from("community_memberships").insert({
    comm_id: commId,
    user_id: userId,
  });
};

export const leaveCommunity = async (commId, userId) => {
  return await supabase
    .from("community_memberships")
    .delete()
    .eq("comm_id", commId)
    .eq("user_id", userId);
};

export const getCommunityPosts = async (commId) => {
  return await supabase
    .from("community_posts")
    .select("*, profiles(id, username, created_at, pfp_url, bio)")
    .eq("comm_id", commId);
};

export const createCommunityPost = async (commId, userId, post) => {
  return await supabase
    .from("community_posts")
    .insert({
      comm_id: commId,
      user_id: userId,
      body: post,
    })
    .select();
};

export const removeCommunityPost = async (commId, userId, postBody) => {
  return await supabase
    .from("community_posts")
    .delete()
    .eq("comm_id", commId)
    .eq("user_id", userId)
    .eq("body", postBody);
};

export const createCommunity = async (comm) => {
  return await supabase.from("communities").insert({
    name: comm.name,
    description: comm.description,
    img_url: comm.img_url,
  });
};
