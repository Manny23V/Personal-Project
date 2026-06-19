import { Link, useNavigate } from 'react-router'

export default function FriendList({ friends, currentUserId }) {
  const navigate = useNavigate()
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
            
          const friendSince = new Date(friendship.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })

          return (
            <Link
              to={`/profile/${friend.username}`}
              key={friendship.id}
              className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors"
            >

              <div className="flex items-center gap-3">
                <img
                  src={friend.pfp_url ?? `https://api.dicebear.com/7.x/identicon/svg?seed=${friend.username}`}
                  alt={friend.username}
                  className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                />
                <span className="text-sm font-medium">{friend.username}</span>
              </div>

              <div className="flex items-center gap-4 ml-auto">
                <span className="text-xs text-gray-400 shrink-0">
                  Since {friendSince}
                </span>

                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                     navigate(`/chat/${friend.username}`)
                  }}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                  title="Message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}