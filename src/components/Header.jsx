import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../utils/useAuth'
import { supabase } from '../supabaseClient'

export default function Header({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [menuDropdownOpen, setMenuDropdownOpen] = useState(false)
    const [username, setUsername] = useState('')
    const { user } = useAuth()
    const navigate = useNavigate()
    const dropdownRef = useRef(null)
    const MenuDropdownRef = useRef(null)

    useEffect(() =>{
        if (!user) return

        const fetchUsername = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single()

            if (!error) setUsername(data.username)
        }
        
        fetchUsername()
    }, [user])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }

            if (MenuDropdownRef.current && !MenuDropdownRef.current.contains(e.target)) {
                setMenuDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (!searchTerm.trim()) return
        onSearch(searchTerm)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setDropdownOpen(false)
        navigate('/')
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

            {/* right: auth buttons or avatar + dropdown */}
            <div className="flex items-center gap-3 shrink-0">
                {user ? (
                <>
                    <div className="relative" ref={MenuDropdownRef}>
                        <button onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
                            className="flex items-center gap-1 text-sm font-medium hover:text-blue-600"
                        >
                            <button className="text-base">☰</button>
                            {'Menu'}
                        </button>

                        {/* dropdown menu */}
                        {menuDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden z-50">

                                <Link
                                    to="/"
                                    onClick={() => setMenuDropdownOpen(false)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                >
                                    Communities
                                </Link>

                            </div>
                        )}
                    </div>

                    {/* username button + dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-1 text-sm font-medium hover:text-blue-600"
                        >
                            {username}
                            <span className="text-xs">▾</span>
                        </button>

                        {/* dropdown menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden z-50">

                                <Link
                                    to="/profile"
                                    onClick={() => setDropdownOpen(false)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                                >
                                    Profile
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                                >
                                    Logout
                                </button>

                            </div>
                        )}
                    </div>

                    {/* avatar */}
                    <img
                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
                        alt="profile"
                        className="w-9 h-9 rounded-full border border-gray-200"
                    />
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