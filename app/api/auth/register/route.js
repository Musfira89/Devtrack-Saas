import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req) {
  try {
    const { name, email, password, organizationName } = await req.json()

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // transaction ensure if any of this task not done , they rollback.
    const result = await prisma.$transaction(async (tx) => {

      // 1st task creating org
      const org = await tx.organization.create({
        data: {
          name: organizationName,
          slug: organizationName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
        },
      })

      // 2nd task creating user 
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "ADMIN",
          organizationId: org.id,
        },
      })

      return { org, user }
    })

    return NextResponse.json({ 
      success: true,
      user: result.user.name
     })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}