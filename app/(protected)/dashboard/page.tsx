'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiRequest } from '@/lib/api'
import {
  Layout,
  Typography,
  Button,
  Row,
  Col,
  Spin,
  Modal,
  Form,
  Input,
  Dropdown,
  message,
} from 'antd'
import { MoreOutlined } from '@ant-design/icons'
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
  const [open, setOpen] = useState(false)
  const [editingBoard, setEditingBoard] = useState<Board | null>(null)

  const [form] = Form.useForm()
  const router = useRouter()

  const fetchData = async () => {
    const [user, boards] = await Promise.all([
      apiRequest<User>('/users/me'),
      apiRequest<Board[]>('/boards'),
    ])

    setUser(user)
    setBoards(boards)
  }

  useEffect(() => {
    fetchData().finally(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditingBoard(null)
    form.resetFields()
    setOpen(true)
  }

  const openEdit = (board: Board) => {
    setEditingBoard(board)
    form.setFieldsValue(board)
    setOpen(true)
  }

  const submit = async (values: any) => {
    try {
      if (editingBoard) {
        await apiRequest(`/boards/${editingBoard.id}`, {
          method: 'PATCH',
          body: JSON.stringify(values),
        })
        message.success('Обновлено')
      } else {
        await apiRequest('/boards', {
          method: 'POST',
          body: JSON.stringify(values),
        })
        message.success('Создано')
      }

      setOpen(false)
      fetchData()
    } catch (e: any) {
      message.error(e.message)
    }
  }

  const deleteBoard = async (id: string) => {
    await apiRequest(`/boards/${id}`, { method: 'DELETE' })
    message.success('Удалено')
    fetchData()
  }

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

      <Content style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              Dashboard
            </Title>
          
          </div>

          {user?.role === 'ADMIN' && (
            <Button type="primary" onClick={openCreate}>
              + Создать доску
            </Button>
          )}
        </div>

        <Row gutter={[16, 16]}>
          {boards.map((board) => {
            const menuItems = [
              {
                key: 'edit',
                label: 'Редактировать',
                onClick: () => openEdit(board),
              },
              {
                key: 'delete',
                label: 'Удалить',
                danger: true,
                onClick: () => deleteBoard(board.id),
              },
            ]

            return (
              <Col xs={24} sm={12} md={8} lg={6} key={board.id}>
                <div
                  style={{
                    borderRadius: 12,
                    padding: 16,
                    background: '#fff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    position: 'relative',
                  }}
                  onClick={() => router.push(`/boards/${board.id}`)}
                >
                  <div style={{ fontWeight: 600 }}>{board.title}</div>

                  {user?.role === 'ADMIN' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                        <MoreOutlined />
                      </Dropdown>
                    </div>
                  )}
                </div>
              </Col>
            )
          })}
        </Row>

        <Modal
          title={editingBoard ? 'Редактировать доску' : 'Создать доску'}
          open={open}
          onCancel={() => setOpen(false)}
          onOk={() => form.submit()}
        >
          <Form form={form} layout="vertical" onFinish={submit}>
            <Form.Item
              name="title"
              label="Название"
              rules={[{ required: true, message: 'Введите название' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  )
}