import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function FriendRequests({ requests, onAccepted }) {
    const [loadingId, setLoadingId] = useState(null)

    const handleAccept = async (requestId) => {
        setLoadingId(requestId)

        const { error } = await supabase
            .from('friendships')
            .update({ status: 'accepted'})
            .eq('id', requestId)
        
        setLoadingId(null)

        if (!error) onAccepted()
    }

    return (
        <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Friend Requests</h2>

        <div className="flex flex-col gap-2">
            {requests.map((req) => (
            <div
                key={req.id}
                className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3"
            >
                <div className="flex items-center gap-3">
                <img
                    src={
                    req.user.pfp_url ??
                    `https://api.dicebear.com/7.x/identicon/svg?seed=${req.user.username}`
                    }
                    alt={req.user.username}
                    className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                />
                <span className="text-sm font-medium">{req.user.username}</span>
                </div>

                <button
                onClick={() => handleAccept(req.id)}
                disabled={loadingId === req.id}
                className="text-sm bg-green-500 text-white px-3 py-1.5 rounded-full hover:bg-green-600 disabled:opacity-50"
                >
                {loadingId === req.id ? 'Accepting...' : 'Accept'}
                </button>
            </div>
            ))}
        </div>
        </div>
    )
}