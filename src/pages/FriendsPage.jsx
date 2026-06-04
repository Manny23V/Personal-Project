import { useState, useEffect } from 'react'
import { useAuth } from '../utils/useAuth'
import { supabase } from '../supabaseClient'
import FriendSearch from '../components/FriendSearch'
import FriendList from '../components/FriendList'
import FriendRequests from '../components/FriendRequests'
import Header from '../components/Header'

export default function FriendsPage() {
  const { user } = useAuth()
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('friends')

  const fetchFriends = async () => {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id,
        user_id,
        friend_id,
        created_at,
        user:profiles!friendships_user_id_fkey(username, pfp_url),
        friend:profiles!friendships_friend_id_fkey(username, pfp_url)
      `)
      .eq('status', 'accepted')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

    if (!error) setFriends(data)
  }

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        id,
        user_id,
        user:profiles!friendships_user_id_fkey(username, pfp_url)
      `)
      .eq('friend_id', user.id)
      .eq('status', 'pending')

    if (!error) setRequests(data)
  }

  useEffect(() => {
    if (!user) return
    Promise.all([fetchFriends(), fetchRequests()]).finally(() =>
      setLoading(false)
    )
  }, [user])

  const tabs = [
    { key: 'friends', label: 'Friends' },
    { key: 'requests', label: `Requests${requests.length > 0 ? ` (${requests.length})` : ''}` },
    { key: 'search', label: 'Search Friends' },
  ]

  return (
    <>
      <Header onSearch={() => {}} />

      <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-5xl flex flex-col" style={{ minHeight: '70vh' }}>

          {/* tab header */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 text-sm font-medium transition-colors
                  ${activeTab === tab.key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : (
              <>
                {activeTab === 'friends' && (
                  <FriendList friends={friends} currentUserId={user.id} />
                )}

                {activeTab === 'requests' && (
                  <FriendRequests
                    requests={requests}
                    onAccepted={() => {
                      fetchFriends()
                      fetchRequests()
                    }}
                  />
                )}

                {activeTab === 'search' && (
                  <FriendSearch user={user} onRequestSent={fetchFriends} />
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </>
  )
}