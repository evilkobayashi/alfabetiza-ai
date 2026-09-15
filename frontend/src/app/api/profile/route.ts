import { auth, currentUser } from '@clerk/nextjs/server'
import { upsertUserProfile } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { perfil } = await req.json()
    if (!perfil) {
      return NextResponse.json({ error: 'Perfil is required' }, { status: 400 })
    }

    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress || null
    const fullName =
      user?.fullName ||
      [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
      null

    const saved = await upsertUserProfile(userId, perfil, email, fullName)

    return NextResponse.json({ success: true, profile: saved[0] })
  } catch (error: any) {
    console.error('Error in /api/profile:', error)
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 })
  }
}
