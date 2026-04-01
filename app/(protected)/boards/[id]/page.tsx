"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  Typography,
  Spin,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Layout,
  message,
} from "antd";
import Navbar from "@/components/Navbar";

const { Title } = Typography;
const { Content } = Layout;

const statusMap: Record<string, { title: string; color: string }> = {
  todo: { title: "To Do", color: "default" },
  in_progress: { title: "In Progress", color: "blue" },
  done: { title: "Done", color: "green" },
};

export default function BoardPage() {
  const { id } = useParams();
  const router = useRouter();

  const [board, setBoard] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchBoard = async () => {
    const data = await apiRequest(`/boards/${id}`);
    setBoard(data);
  };

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const createTask = async (values: any) => {
    try {
      await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          boardId: Number(id),
        }),
      });

      setOpen(false);
      form.resetFields();
      fetchBoard();
    } catch (e: any) {
      message.error(e.message || "Ошибка при создании задачи");
    }
  };

  const updateTask = async (task: any, newStatus: string) => {
    try {
      await apiRequest(`/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...task,
          status: newStatus,
        }),
      });

      fetchBoard();
    } catch (e: any) {
      message.error(e.message || "Нет прав для редактирования");
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await apiRequest(`/tasks/${taskId}`, {
        method: "DELETE",
      });

      fetchBoard();
    } catch (e: any) {
      message.error(e.message || "Нет прав для удаления");
    }
  };

  if (!board) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Content
          style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
        >
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  const grouped = {
    todo: board.tasks.filter((t: any) => t.status === "todo"),
    in_progress: board.tasks.filter((t: any) => t.status === "in_progress"),
    done: board.tasks.filter((t: any) => t.status === "done"),
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />

      <Content style={{ padding: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <Button onClick={() => router.push("/dashboard")}>← Назад</Button>

          <Title level={3} style={{ margin: 0 }}>
            Доска: {board.title}
          </Title>

          <Button type="primary" onClick={() => setOpen(true)}>
            + Задача
          </Button>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {Object.entries(grouped).map(([status, tasks]) => (
            <div
              key={status}
              style={{
                flex: 1,
                background: "#f5f5f5",
                padding: 12,
                borderRadius: 12,
                minHeight: 400,
              }}
            >
              <Tag color={statusMap[status].color}>
                {statusMap[status].title}
              </Tag>

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {tasks.map((task: any) => (
                  <Card key={task.id} size="small" hoverable>
                    <div style={{ marginBottom: 8 }}>
                      <b>{task.title}</b>
                    </div>

                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                      {task.description}
                    </div>

                    <Space style={{ marginTop: 10 }}>
                      {status !== "todo" && (
                        <Button
                          size="small"
                          onClick={() => updateTask(task, "todo")}
                        >
                          ←
                        </Button>
                      )}
                      {status !== "done" && (
                        <Button
                          size="small"
                          onClick={() => updateTask(task, "done")}
                        >
                          →
                        </Button>
                      )}

                      <Button
                        size="small"
                        danger
                        onClick={() => deleteTask(task.id)}
                      >
                        Удалить
                      </Button>
                    </Space>
                  </Card>
                ))}

                {tasks.length === 0 && (
                  <div style={{ opacity: 0.5, textAlign: "center" }}>Пусто</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Modal
          title="Создать задачу"
          open={open}
          onCancel={() => setOpen(false)}
          onOk={() => form.submit()}
        >
          <Form form={form} layout="vertical" onFinish={createTask}>
            <Form.Item
              name="title"
              label="Название"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="description" label="Описание">
              <Input.TextArea />
            </Form.Item>

            <Form.Item name="status" label="Статус" initialValue="todo">
              <Select
                options={[
                  { value: "todo", label: "To Do" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "done", label: "Done" },
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}
