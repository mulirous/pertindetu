import type { ReactNode } from "react"

interface SidebarCardProps {
  title: string
  icon: ReactNode
  content: ReactNode
}

export default function SidebarCard({ title, icon, content }: SidebarCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      {content}
    </div>
  )
}
