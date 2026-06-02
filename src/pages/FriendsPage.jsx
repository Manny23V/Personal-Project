import { useState, useEffect } from 'react'
import { useAuth } from '../utils/useAuth'
import { supabase } from '../supabaseClient'
import FriendSearch from '../components/FriendSearch'
import FriendList from '../components/FriendList'
import FriendRequests from '../components/FriendRequests'

export default function FriendsPage() {
    const { user } = useAuth()
    const [friends, setFriends] = useState([])
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchFriends = async () => {
        const { data, error } = await supabase
            .from('friendships')
            .select(`
                id,
                user_id,
                friend_id,
                user:profiles!friendships_user_id_fkey(username, avatar_url),
                friend:profiles!friendships_friend_id_fkey(username, avatar_url)
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
                user:profiles!friendships_user_id_fkey(username, avatar_url)
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

    if (loading) return <p className="p-8 text-gray-400">Loading...</p>

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
            <h1 className="text-2xl font-bold">Friends</h1>

            <FriendSearch user={user} onRequestSent={fetchFriends} />

            {requests.length > 0 && (
                <FriendRequests
                    requests={requests}
                    onAccepted={() => {
                        fetchFriends()
                        fetchRequests()
                    }}
                />
            )}

            <FriendList friends={friends} currentUserId={user.id} />
        </div>
    )
}