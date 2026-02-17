import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const orgId = session.user.organizationId

  const [totalProjects, activeProjects, totalTasks, completedTasks, timeEntries, members] =
    await Promise.all([
      prisma.project.count({
        where: { organizationId: orgId },
      }),
      prisma.project.count({
        where: { organizationId: orgId, status: "ACTIVE" },
      }),
      prisma.task.count({
        where: { project: { organizationId: orgId } },
      }),
      prisma.task.count({
        where: { project: { organizationId: orgId }, status: "DONE" },
      }),
      prisma.timeEntry.findMany({
        where: { project: { organizationId: orgId }, duration: { not: null } },
        include: {
          project: { select: { name: true } },
          user: { select: { name: true, hourlyRate: true } },
        },
      }),
      prisma.user.count({
        where: { organizationId: orgId },
      }),
    ])

  const totalMinutes = timeEntries.reduce((sum, e) => sum + (e.duration || 0), 0)
  const totalHours = Math.round(totalMinutes / 60)

  const totalRevenue = timeEntries.reduce((sum, e) => {
    const hours = (e.duration || 0) / 60
    const rate = e.user?.hourlyRate || 0
    return sum + hours * rate
  }, 0)

  // Hours per project for chart
  const projectHoursMap = {}
  timeEntries.forEach((e) => {
    const name = e.project.name
    projectHoursMap[name] = (projectHoursMap[name] || 0) + (e.duration || 0) / 60
  })

  const projectHoursChart = Object.entries(projectHoursMap).map(([name, hours]) => ({
    name,
    hours: Math.round(hours),
  }))

  // Recent activity
  const recentTasks = await prisma.task.findMany({
    where: { project: { organizationId: orgId } },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: {
      project: { select: { name: true } },
      assignee: { select: { name: true } },
    },
  })

  return NextResponse.json({
    stats: {
      totalProjects,
      activeProjects,
      totalTasks,
      completedTasks,
      totalHours,
      totalRevenue: Math.round(totalRevenue),
      members,
    },
    projectHoursChart,
    recentTasks,
  })
}