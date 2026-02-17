import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">DevTrack</h1>
        <div className="space-x-4">
          <Link href="/login" className="text-black hover:text-gray-600">
            Login
          </Link>
          <Link 
            href="/register" 
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Track Time. Manage Projects.<br />Get Paid Faster.
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The complete SaaS platform for developers and teams
        </p>
       


      </div>
    </div>
  )
}