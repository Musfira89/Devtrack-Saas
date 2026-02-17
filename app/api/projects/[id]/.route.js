import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name, description, clientId, status } = await req.json()

  // Verify project belongs to org
  const existing = await prisma.project.findFirst({
    where: { id: params.id, organizationId: session.user.organizationId },
  })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

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

export async function DELETE(req, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const existing = await prisma.project.findFirst({
    where: { id: params.id, organizationId: session.user.organizationId },
  })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await prisma.project.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}