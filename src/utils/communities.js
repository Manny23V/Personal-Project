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
    .select(
      `*, 
      profiles!community_posts_user_id_fkey(id, username, created_at, pfp_url, bio), 
      community_post_votes(created_at, post_id, user_id), 
      community_post_comments(id, created_at, user_id, post_id, parent_comment_id, body)
      `,
    )
    .eq("comm_id", commId);
};

export const createCommunityPost = async (commId, userId, post) => {
  return await supabase
    .from("community_posts")
    .insert({
      user_id: userId,
      comm_id: commId,
      img_url: post.imgUrl || null,
      title: post.title,
      body: post.body,
    })
    .select();
};

export const removeCommunityPost = async (postId) => {
  return await supabase.from("community_posts").delete().eq("id", postId);
};

// comment must have user id, post id, parent comment id, and body
export const createComment = async (comment) => {
  return await supabase.from("community_post_comments").insert({
    user_id: comment.userId,
    post_id: comment.postId,
    parent_comment_id: comment.parentCommentId || null,
    body: comment.body,
  }).select();
};

export const removeComment = async (commentId) => {
  return await supabase
    .from("community_post_comments")
    .delete()
    .eq("id", commentId);
};

export const createCommunity = async (comm) => {
  return await supabase.from("communities").insert({
    name: comm.name,
    description: comm.description,
    img_url: comm.img_url,
  });
};

export const upvoteCommunityPost = async (postId, userId) => {
  return await supabase
    .from("community_post_votes")
    .insert({
      post_id: postId,
      user_id: userId,
    })
    .select();
};

export const removeCommunityPostUpvote = async (postId, userId) => {
  return await supabase
    .from("community_post_votes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);
};

export const upvoteComment = async (postCommentId, userId) => {
  return await supabase
    .from("community_post_comment_votes")
    .insert({
      post_comment_id: postCommentId,
      user_id: userId,
    })
    .select()
    .single();
};

export const removeCommentUpvote = async (postCommentId, userId) => {
  return await supabase
    .from("community_post_comment_votes")
    .delete()
    .eq("post_comment_id", postCommentId)
    .eq("user_id", userId);
};

/**
 * get the post, its votes, and the person who posted it
 */
export const getCommunityPost = async (postId) => {
  return await supabase
    .from("community_posts")
    .select(
      `
    *, 
    community_post_votes(created_at, post_id, user_id), 
    community_post_comments(*),
    profiles!community_posts_user_id_fkey(*)
    `,
    )
    .eq("id", postId)
    .single();
};

export const getCommunityPostComments = async (postId) => {
  return await supabase
    .from("community_post_comments")
    .select(
      `
      *,
      community_post_comment_votes(*),
      profiles!community_post_comments_user_id_fkey(*)
      `,
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
};

export function buildCommentThreads(comments) {
  // put each comment in a map with its id
  // so it's like (1, {comment, children: []})
  const commentMap = new Map();
  comments.forEach((comment) => {
    commentMap.set(comment.id, {
      ...comment,
      children: [],
    });
  });

  // put each comment either directly into the map
  // or in it's parent list
  const threads = [];
  comments.forEach((comment) => {
    const node = commentMap.get(comment.id);
    // no parent
    if (comment.parent_comment_id === null) {
      threads.push(node);
    } else {
      const parent = commentMap.get(comment.parent_comment_id);
      if (parent) {
        parent.children.push(node);
      }
    }
  });
  return threads;
}
