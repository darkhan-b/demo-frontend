'use client'

interface TaskCardProps {
  title: string
  description?: string
}

export default function TaskCard({ title, description }: TaskCardProps) {
  return (
    <div style={{ border: '1px solid #ccc', margin: 5, padding: 5 }}>
      <h4>{title}</h4>
      {description && <p>{description}</p>}
    </div>
  )
}