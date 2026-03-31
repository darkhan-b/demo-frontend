'use client'

import { Card } from 'antd'
import { useRouter } from 'next/navigation'

interface BoardCardProps {
  id: string
  title: string
}

export default function BoardCard({ id, title }: BoardCardProps) {
  const router = useRouter()

  return (
    <Card
      hoverable
      onClick={() => router.push(`/boards/${id}`)}
      style={{ borderRadius: 12 }}
    >
      <Card.Meta title={title} />
    </Card>
  )
}