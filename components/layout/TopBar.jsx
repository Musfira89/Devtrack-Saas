"use client"

import { signOut } from "next-auth/react"

export default function TopBar({ user }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search..."
          className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative">
          <span className="text-2xl">🔔</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}