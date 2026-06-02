export default function FriendList({ friends, currentUserId }) {
  if (friends.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Your Friends</h2>
        <p className="text-sm text-gray-400">You haven't added any friends yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Your Friends</h2>

      <div className="flex flex-col gap-2">
        {friends.map((friendship) => {
          // show the OTHER person, not yourself
          const friend =
            friendship.user_id === currentUserId
              ? friendship.friend
              : friendship.user

          return (
            <div
              key={friendship.id}
              className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3"
            >
              <img
                src={
                  friend.pfp_url ??
                  `https://api.dicebear.com/7.x/identicon/svg?seed=${friend.username}`
                }
                alt={friend.username}
                className="w-9 h-9 rounded-full border border-gray-200 object-cover"
              />
              <span className="text-sm font-medium">{friend.username}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}