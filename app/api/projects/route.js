import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const projects = await prisma.project.findMany({
    where: { organizationId: session.user.organizationId },
    include: {
      client: { select: { id: true, name: true, email: true } },
      _count: { select: { tasks: true, timeEntries: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(projects)
}

export async function POST(req) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name, description, clientId, status } = await req.json()

  if (!name || !clientId) {
    return NextResponse.json({ error: "Name and client are required" }, { status: 400 })
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      clientId,
      status: status || "ACTIVE",
      organizationId: session.user.organizationId,
    },
    include: {
      client: { select: { id: true, name: true, email: true } },
      _count: { select: { tasks: true, timeEntries: true } },  // add this
    },
  })

  return NextResponse.json(project)
}