import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

// friends list with a menu for each friend to visit profile or message them
export default function DashboardFriendList({ friends, currentUserId }) {
  const navigate = useNavigate();
  // currently open friend id
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // closes friend menu when you click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // no friends
  if (friends.length === 0) {
    return (
      <>
        <p className="text-sm text-gray-400">
          You haven't added any friends yet.
        </p>
        <Link to="/friends" className="text-sm text-blue-500 hover:underline">
          Find friends
        </Link>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {friends.map((friendship) => {
        const friend =
          friendship.user_id === currentUserId
            ? friendship.friend
            : friendship.user;
        const isOpen = openMenuId === friendship.id;

        // Show each friend
        return (
          <div
            key={friendship.id}
            className="relative flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3"
            ref={isOpen ? menuRef : null}
          >
            {/* pfp or default / generic pfp */}
            <img
              src={
                friend.pfp_url ??
                `https://api.dicebear.com/7.x/identicon/svg?seed=${friend.username}`
              }
              alt={friend.username}
              className="w-9 h-9 rounded-full border border-gray-200 object-cover"
            />
            {/* username */}
            <span className="text-sm font-medium truncate">
              {friend.username}
            </span>

            <button
              onClick={() => setOpenMenuId(isOpen ? null : friendship.id)}
              className="ml-auto p-1 rounded-full text-gray-400 hover:text-blue-500 hover:bg-gray-50 transition-colors"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>

            {/* drop-down menu to visit profile or message */}
            {isOpen && (
              <div className="absolute right-2 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden z-50">
                <button
                  onClick={() => navigate(`/profile/${friend.username}`)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  View Profile
                </button>
                <button
                  onClick={() => navigate(`/chat/${friend.username}`)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Message
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
