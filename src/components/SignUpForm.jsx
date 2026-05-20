import { useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../lib/supabaseClient'

export default function SignUpForm() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError]     = useState(null)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (signUpError) {
            setError(signUpError.message)
            setLoading(false)
            return
        }

        const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, username })

        if (profileError) {
            setError(profileError.message)
            setLoading(false)
            return
        }

        navigate('/')
    }

    return (
        <form onSubmit={handleSignUp} className="flex flex-col gap-4">

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="border p-2 rounded"
            />

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

            {/* only shows if there's an error */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
                {loading ? 'Creating account...' : 'Sign Up'}
            </button>

        </form>
    )
}