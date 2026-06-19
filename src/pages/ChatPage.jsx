import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../utils/useAuth'
import Header from '../components/Header'
import ConversationList from '../components/ConversationList'
import ChatWindow from '../components/ChatWindow'

export default function ChatPage() {
  const { username } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeUsername, setActiveUsername] = useState(username ?? null)

  const handleSelect = (selectedUsername) => {
    setActiveUsername(selectedUsername)
    navigate(`/chat/${selectedUsername}`, { replace: true })
  }

  if (!user) return <p className="p-8 text-gray-400">You must be logged in to view this page.</p>

  return (
    <>
      <Header onSearch={() => {}} />

      <div className="flex justify-center px-4 py-10 min-h-screen bg-gray-50">
        <div
          className="bg-white rounded-2xl shadow-md w-full max-w-4xl flex overflow-hidden"
          style={{ height: '75vh' }}
        >

          {/* left: conversation list */}
          <div className="w-72 border-r border-gray-200 flex flex-col shrink-0">
            <div className="px-4 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-sm">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                currentUser={user}
                activeUsername={activeUsername}
                onSelect={handleSelect}
              />
            </div>
          </div>

          {/* right: chat window */}
          <div className="flex-1 flex flex-col">
            {activeUsername ? (
              <ChatWindow
                currentUser={user}
                otherUsername={activeUsername}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-400">Select a conversation to start chatting</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}