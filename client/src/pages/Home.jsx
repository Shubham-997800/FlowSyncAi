import { Link } from 'react-router-dom'
import { ROUTES, APP_NAME } from '../utils/constants'

function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to {APP_NAME}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          AI-powered task management that helps you prioritize, schedule, and
          accomplish more.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to={ROUTES.REGISTER}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700"
          >
            Get Started
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
