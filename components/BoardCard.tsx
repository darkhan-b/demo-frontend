'use client'

import { Card, Typography } from 'antd'
import { useRouter } from 'next/navigation'

const { Text } = Typography

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
      style={{
        borderRadius: 16,
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}
      bodyStyle={{ padding: 16 }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.04)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontWeight: 600, fontSize: 16 }}>
          {title}
        </div>

        <Text type="secondary" style={{ fontSize: 12 }}>
          Открыть доску →
        </Text>
      </div>
    </Card>
  )
}