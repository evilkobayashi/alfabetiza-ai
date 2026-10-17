import { auth } from '@clerk/nextjs/server'
import { getUserProgress, saveUserProgress } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const progress = await getUserProgress(userId)
    return NextResponse.json({ success: true, progress })
  } catch (error: any) {
    console.error('Error in GET /api/progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { letra, silaba, palavraLida, minutos } = body

    const updated = await saveUserProgress(userId, {
      letra: typeof letra === 'string' ? letra.trim() : undefined,
      silaba: typeof silaba === 'string' ? silaba.trim() : undefined,
      palavraLida: Boolean(palavraLida),
      minutos: typeof minutos === 'number' ? Math.max(0, minutos) : undefined,
    })

    return NextResponse.json({ success: true, progress: updated })
  } catch (error: any) {
    console.error('Error in POST /api/progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
