'use client'

import { Layout, Button, Typography, Space } from 'antd'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiRequest } from '@/lib/api'

const { Header } = Layout
const { Text } = Typography

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    apiRequest('/users/me').then(setUser)
  }, [])

  const logout = async () => {
    await apiRequest('/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff',
        padding: '0 24px',
      }}
    >
      <Button type="link" onClick={() => router.push('/dashboard')}>
        Dashboard
      </Button>

      <Space>
        <Text>{user?.name}</Text>
        <Text type="secondary">{user?.role}</Text>
        <Button danger onClick={logout}>
          Logout
        </Button>
      </Space>
    </Header>
  )
}