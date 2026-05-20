import { useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabaseClient'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (loginError) {
            setError(loginError.message)
            setLoading(false)
            return
        }

        navigate('/')
    }

    return (
        <form onSubmit={handleLogin} className="flex flex-col gap-4">

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="border p-2 rounded"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="border p-2 rounded"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>

        </form>
    )
}