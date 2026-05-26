import { supabase } from "../supabaseClient.js";

// TODO: perform a join w/ community members
export const getAllCommunities = async () => {
  return await supabase.from("communities").select(`
    *,
    community_memberships(user_id)
    `);
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
