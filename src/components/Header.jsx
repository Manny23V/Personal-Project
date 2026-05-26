import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../utils/useAuth'
import { supabase } from '../supabaseClient'

export default function Header({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('')
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (!searchTerm.trim()) return
        onSearch(searchTerm)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate
    }

    return (
        <header className="w-full px-8 py-4 border-b border-gray-200 flex items-center justify-between gap-4">

            {/* left: website name */}
            <Link to="/" className="text-xl font-bold shrink-0">
                AniTrack
            </Link>

            {/* middle: search bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
                <input
                type="text"
                placeholder="Search anime..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
                />
            </form>

            {/* right: auth buttons or avatar */}
            <div className="flex items-center gap-3 shrink-0">
                {user ? (
                <>
                    {/* profile picture */}
                    <img
                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
                    alt="profile"
                    className="w-9 h-9 rounded-full border border-gray-200"
                    />

                    <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:underline"
                    >
                    Logout
                    </button>
                </>
                ) : (
                <>
                    <Link
                    to="/login"
                    className="text-sm text-gray-600 hover:underline"
                    >
                    Login
                    </Link>
                    <Link
                    to="/signup"
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
                    >
                    Sign Up
                    </Link>
                </>
                )}
            </div>

        </header>
    )
}