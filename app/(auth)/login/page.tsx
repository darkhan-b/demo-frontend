"use client";

import { Button, Card, Form, Input, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      const data = await apiRequest<{ accessToken: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });

      document.cookie = `accessToken=${data.accessToken}; path=/`;
      message.success("Успешный вход");

      router.push("/dashboard");
    } catch (e: any) {
      message.error(e.message || "Ошибка входа");
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Логин
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Введите email" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password placeholder="Пароль" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Войти
          </Button>
        </Form>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Text>
            Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
}