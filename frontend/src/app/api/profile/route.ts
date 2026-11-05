import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { upsertUserProfile, deleteUserCompletely, logUserConsent } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { perfil } = await req.json()
    if (!perfil || !['KIDS', 'EJA', 'PCD'].includes(perfil)) {
      return NextResponse.json({ error: 'Perfil inválido' }, { status: 400 })
    }

    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress || null
    const fullName =
      user?.fullName ||
      [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
      null

    const saved = await upsertUserProfile(userId, perfil, email, fullName)
    await logUserConsent(userId, email)

    return NextResponse.json({ success: true, profile: saved[0] })
  } catch (error: any) {
    console.error('Error in /api/profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await deleteUserCompletely(userId)
    try {
      const client = await clerkClient()
      await client.users.deleteUser(userId)
    } catch (e) {
      console.warn('Aviso ao remover usuário no Clerk:', e)
    }

    return NextResponse.json({ success: true, message: 'Dados excluídos permanentemente conforme Art. 18, VI da LGPD.' })
  } catch (error: any) {
    console.error('Error deleting profile in /api/profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
