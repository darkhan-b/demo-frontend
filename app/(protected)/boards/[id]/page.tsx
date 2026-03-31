'use client'

import { useEffect, useState } from 'react'
import { apiRequest } from '@/lib/api'
import { useParams, useRouter } from 'next/navigation'

export default function BoardPage() {
  const { id } = useParams()
  const router = useRouter()

  const [board, setBoard] = useState<any>(null)

  useEffect(() => {
    apiRequest(`/boards/${id}`).then(setBoard)
  }, [id])

  if (!board) return <div>Loading...</div>

  const grouped = {
    todo: board.tasks.filter((t: any) => t.status === 'todo'),
    in_progress: board.tasks.filter((t: any) => t.status === 'in_progress'),
    done: board.tasks.filter((t: any) => t.status === 'done'),
  }

  return (
    <div>
      <button onClick={() => router.push('/dashboard')}>
        Назад
      </button>

      <h1>{board.title}</h1>

      <div style={{ display: 'flex', gap: 20 }}>
        {Object.entries(grouped).map(([status, tasks]) => (
          <div key={status}>
            <h3>{status}</h3>

            {tasks.map((task: any) => (
              <div key={task.id}>{task.title}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}