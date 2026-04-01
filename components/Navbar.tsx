'use client'

import { Layout, Typography, Avatar, Button, Space } from 'antd'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiRequest } from '@/lib/api'
import { clearAuth } from '@/lib/clearCookie'
import { LogoutOutlined } from '@ant-design/icons'

const { Header } = Layout
const { Text } = Typography

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    apiRequest('/users/me').then(setUser)
  }, [])

  const logout = () => {
    clearAuth()
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
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: 18,
          cursor: 'pointer',
        }}
        onClick={() => router.push('/dashboard')}
      >
        🧠 TaskFlow
      </div>

      <Space size={16}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: '#fafafa',
            padding: '6px 12px',
            borderRadius: 20,
          }}
        >
          <Avatar>
            {user?.email?.[0]?.toUpperCase()}
          </Avatar>

          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <Text style={{ fontSize: 13 }}>
              {user?.email}
            </Text>

            <Text type="secondary" style={{ fontSize: 11 }}>
              role: {user?.role}
            </Text>
          </div>
        </div>

        <Button
          icon={<LogoutOutlined />}
          danger
          type="text"
          onClick={logout}
        >
          Выйти
        </Button>
      </Space>
    </Header>
  )
}