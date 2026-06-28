import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    toast.success('Password reset link sent to your email')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Reset Password</h2>
        {sent ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">Check your email for the reset link.</p>
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">Back to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-gray-600 text-sm mb-4">Enter your email and we'll send you a reset link.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-semibold transition">
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
