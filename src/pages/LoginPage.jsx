import { Link } from 'react-router'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 flex flex-col gap-6">

        <div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">
            Login to access your anime list
          </p>
        </div>

        <LoginForm />

        <p className="text-sm text-center text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  )
}