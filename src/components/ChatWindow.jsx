import { useEffect, useState, useRef } from 'react'
import { supabase } from '../supabaseClient'
import { DEFAULT_PFP_URL } from '../utils/profile'
import { Link } from 'react-router'

export default function ChatWindow({ currentUser, otherUsername }) {
    const [messages, setMessages] = useState([])
    const [otherUser, setOtherUser] = useState(null)
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)
    const bottomRef = useRef(null)

    useEffect(() => {
        const fetchOtherUser = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, pfp_url')
                .eq('username', otherUsername)
                .single()
            if (!error) setOtherUser(data)
        }

        fetchOtherUser()
    }, [otherUsername])

    useEffect(() => {
        if (!otherUser) return

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('chats')
                .select('id, sender_id, receiver_id, content, created_at, read')
                .or(
                `and(sender_id.eq.${currentUser.id},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${currentUser.id})`
                )
                .order('created_at', { ascending: true })
            
            if (!error) {
                setMessages(data)
                setLoading(false)

                // mark unread messages as read
                const unreadIds = data
                    .filter(m => !m.read && m.receiver_id === currentUser.id)
                    .map(m => m.id)

                if (unreadIds.length > 0) {
                    await supabase
                        .from('chats')
                        .update({ read: true })
                        .in('id', unreadIds)
                }
            }
        }

        fetchMessages()

        const channel = supabase
            .channel(`chat-${currentUser.id}-${otherUser.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chats',
            }, (payload) => {
                const msg = payload.new
                const isRelevant =
                    (msg.sender_id === currentUser.id && msg.receiver_id === otherUser.id) ||
                    (msg.sender_id === otherUser.id && msg.receiver_id === currentUser.id)

                if (isRelevant) {
                    setMessages(prev => [...prev, msg])

                    // mark as read if we received it
                    if (msg.receiver_id === currentUser.id) {
                        supabase
                            .from('chats')
                            .update({ read: true })
                            .eq('id', msg.id)
                    }
                }
            })
            .subscribe()
        
        return () => {
            channel.unsubscribe()
        }
    }, [otherUser])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async (e) => {
        e.preventDefault()
        if (!content.trim() || !otherUser) return

        const { error } = await supabase
            .from('chats')
            .insert({
                sender_id: currentUser.id,
                receiver_id: otherUser.id,
                content: content.trim(),
            })

        if (!error) setContent('')
    }

    if (loading) return <p className="text-sm text-gray-400 p-6">Loading messages...</p>

    return (
        <div className="flex flex-col h-full">

        {/* chat header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 shrink-0">
            <Link to={`/profile/${otherUsername}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img
                    src={otherUser?.pfp_url ?? DEFAULT_PFP_URL}
                    alt={otherUsername}
                    className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                />
                <span className="font-medium text-sm">{otherUsername}</span>
            </Link>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
            {messages.length === 0 && (
            <p className="text-sm text-gray-400 text-center mt-10">
                No messages yet. Say hi!
            </p>
            )}

            {messages.map((msg) => {
            const isMine = msg.sender_id === currentUser.id
            return (
                <div
                key={msg.id}
                className={`flex flex-col gap-1 max-w-xs ${isMine ? 'self-end items-end' : 'self-start items-start'}`}
                >
                <div
                    className={`px-4 py-2 rounded-2xl text-sm ${
                    isMine
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}
                >
                    {msg.content}
                </div>
                <span className="text-xs text-gray-400">
                    {new Date(msg.created_at).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    })}
                </span>
                </div>
            )
            })}
            <div ref={bottomRef} />
        </div>

        {/* input */}
        <form
            onSubmit={handleSend}
            className="flex items-center gap-3 px-6 py-4 border-t border-gray-200 shrink-0"
        >
            <input
            type="text"
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
            <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 disabled:opacity-50"
            disabled={!content.trim()}
            >
            Send
            </button>
        </form>

        </div>
    )
}