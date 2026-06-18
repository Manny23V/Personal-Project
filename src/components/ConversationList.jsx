import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { DEFAULT_PFP_URL } from '../utils/profile'

export default function ConversationList({ currentUser, activeUsername, onSelect }) {
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchConversations = async () => {
        // get the latest message from each unique conversation
            const { data, error } = await supabase
                .from('messages')
                .select(`
                id,
                content,
                created_at,
                read,
                sender_id,
                receiver_id,
                sender:profiles!messages_sender_id_fkey(username, pfp_url),
                receiver:profiles!messages_receiver_id_fkey(username, pfp_url)
                `)
                .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
                .order('created_at', { ascending: false })

            if (error) {
                console.log('Conversations error:', JSON.stringify(error))
                setLoading(false)
                return
            }

            const seen = new Set()
            const latest = []
            for (const msg of data) {
                const otherId =
                    msg.sender_id === currentUser.id ? msg.receiver_id : msg.sender_id
                if (!seen.has(otherId)) {
                    seen.add(otherId)
                    latest.push(msg)
                }
            }

            setConversations(latest)
            setLoading(false)
        }

        fetchConversations()

        // real-time: refresh conversation list when a new message arrives
        const channel = supabase
            .channel('conversation-list')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
            }, () => {
                fetchConversations()
            })
            .subscribe()

        return () => supabase.removeChannel(channel)
    }, [currentUser.id])

    if (loading) return <p className="text-sm text-gray-400 p-4">Loading...</p>

    if (conversations.length === 0) {
        return <p className="text-sm text-gray-400 p-4">No conversations yet.</p>
    }

    return (
    <div className="flex flex-col">
      {conversations.map((msg) => {
        const other =
          msg.sender_id === currentUser.id ? msg.receiver : msg.sender
        const isUnread = !msg.read && msg.receiver_id === currentUser.id
        const isActive = other.username === activeUsername

        return (
          <button
            key={msg.id}
            onClick={() => onSelect(other.username)}
            className={`flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100
              ${isActive ? 'bg-blue-50' : ''}
            `}
          >
            <img
              src={other.pfp_url ?? DEFAULT_PFP_URL}
              alt={other.username}
              className="w-9 h-9 rounded-full border border-gray-200 object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${isUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                  {other.username}
                </span>
                <span className="text-xs text-gray-400 shrink-0 ml-2">
                  {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className={`text-xs truncate ${isUnread ? 'font-semibold text-gray-800' : 'text-gray-400'}`}>
                {msg.sender_id === currentUser.id ? 'You: ' : ''}{msg.content}
              </p>
            </div>
            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            )}
          </button>
        )
      })}
    </div>
  )
}