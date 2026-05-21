import { Link } from 'react-router'
import SignUpForm from '../components/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 flex flex-col gap-6">

        <div>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-gray-500 text-sm mt-1">
            Start tracking and rating your anime
          </p>
        </div>

        <SignUpForm />

        <p className="text-sm text-center text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}