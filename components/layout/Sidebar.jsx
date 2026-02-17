"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Projects", href: "/projects", icon: "📁" },
  { name: "Tasks", href: "/tasks", icon: "✅" },
  { name: "Tracker", href: "/tracker", icon: "⏱️" },
  { name: "Team", href: "/team", icon: "👥" },
  { name: "Invoices", href: "/invoices", icon: "📄" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
]

export default function Sidebar({ organizationName }) {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-blue-400">DevTrack</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <p className="text-sm text-gray-400">Organization</p>
        <p className="font-medium truncate">{organizationName}</p>
      </div>
    </div>
  )
}