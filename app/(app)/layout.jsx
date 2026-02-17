import { getSession } from "@/lib/get-session"
import { prisma } from "@/lib/prisma"
import Sidebar from "@/components/layout/Sidebar"
import TopBar from "@/components/layout/TopBar"

export default async function DashboardLayout({ children }) {
  const session = await getSession()
  
  const organization = await prisma.organization.findUnique({
    where: { id: session.user.organizationId },
    select: { name: true },
  })

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar organizationName={organization.name} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={session.user} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}