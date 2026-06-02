import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function FriendSearch({ user, onRequestSent }) {
    const [query, setQuery] = useState('')
    const [result, setResult] = useState(null)
    const [status, setStatus] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        setResult(null)
        setStatus(null)

        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .eq('username', query.trim())
            .neq('id', user.id) // exclude yourself
            .single()

        setLoading(false)

        if (error || !data) {
            setStatus('not_found')
            return
        }

        setResult(data)
    }

    const handleAddFriend = async () => {
        setLoading(true)

        // check if friendship already exists
        const { data: existing } = await supabase
            .from('friendships')
            .select('id, status')
            .or(
                `and(user_id.eq.${user.id},friend_id.eq.${result.id}),and(user_id.eq.${result.id},friend_id.eq.${user.id})`
            )
            .single()

        if (existing) {
            setStatus(existing.status === 'accepted' ? 'already_friends' : 'already_sent')
            setLoading(false)
            return
        }

        const { error } = await supabase
            .from('friendships')
            .insert({ user_id: user.id, friend_id: result.id })

        setLoading(false)

        if (error) {
            setStatus('error')
            return
        }

        setStatus('sent')
        onRequestSent()
    }

    return (
        <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Add a Friend</h2>

        <form onSubmit={handleSearch} className="flex gap-2">
            <input
            type="text"
            placeholder="Search by username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
            <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700"
            >
            Search
            </button>
        </form>

        {loading && <p className="text-sm text-gray-400">Searching...</p>}

        {status === 'not_found' && (
            <p className="text-sm text-red-400">No user found with that username.</p>
        )}

        {result && (
            <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
                <img
                src={result.avatar_url ?? `https://api.dicebear.com/7.x/identicon/svg?seed=${result.username}`}
                alt={result.username}
                className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                />
                <span className="text-sm font-medium">{result.username}</span>
            </div>

            {status === 'sent' && (
                <span className="text-sm text-green-500">Request sent!</span>
            )}
            {status === 'already_friends' && (
                <span className="text-sm text-gray-400">Already friends</span>
            )}
            {status === 'already_sent' && (
                <span className="text-sm text-gray-400">Request already sent</span>
            )}
            {!status && (
                <button
                onClick={handleAddFriend}
                disabled={loading}
                className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 disabled:opacity-50"
                >
                Add Friend
                </button>
            )}
            </div>
        )}
        </div>
    )
}