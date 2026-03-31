'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiRequest } from '@/lib/api'
import { Layout, Typography, Button, Row, Col, Spin } from 'antd'
import BoardCard from '@/components/BoardCard'
import Navbar from '@/components/Navbar'

const { Content } = Layout
const { Title } = Typography

interface Board {
  id: string
  title: string
}

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}

export default function DashboardPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      apiRequest<User>('/users/me'),
      apiRequest<Board[]>('/boards'),
    ])
      .then(([user, boards]) => {
        setUser(user)
        setBoards(boards)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />

      <Content style={{ padding: '24px' }}>
        <Title level={2}>Dashboard</Title>

        <p><b>Имя:</b> {user?.name}</p>
        <p><b>Роль:</b> {user?.role}</p>

        {user?.role === 'ADMIN' && (
          <Button type="primary" style={{ marginBottom: 20 }}>
            Создать доску
          </Button>
        )}

        <Row gutter={[16, 16]}>
          {boards.map((board) => (
            <Col xs={24} sm={12} md={8} lg={6} key={board.id}>
              <BoardCard id={board.id} title={board.title} />
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  )
}