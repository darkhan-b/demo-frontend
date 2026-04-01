'use client'

import { Button, Card, Flex, Form, Input, Typography, message } from 'antd'
import { useRouter } from 'next/navigation'
import { apiRequest } from '@/lib/api'

const { Title } = Typography

export default function RegisterPage() {
  const router = useRouter()

  const onFinish = async (values: any) => {
    if (values.password.length < 6) {
      message.error('Минимум 6 символов')
      return
    }

    try {
      await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(values),
      })

      message.success('Аккаунт создан')
      router.push('/login')
    } catch (e: any) {
      message.error(e.message || 'Ошибка регистрации')
    }
  }

  return (
    <Flex
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f5f5',
      }}
    >
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: 'center' }}>
          Регистрация юзера
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input placeholder="Ваше имя" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Некорректный email' },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password placeholder="Пароль" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Зарегистрироваться
          </Button>
        </Form>

        <p style={{ textAlign: 'center', marginTop: 16 }}>
          Уже есть аккаунт?{' '}
          <a href="/login">Войти</a>
        </p>
      </Card>
    </Flex>
  )
}