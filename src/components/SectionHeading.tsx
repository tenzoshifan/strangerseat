import type { ReactNode } from 'react'

interface SectionHeadingProps {
  title: string
  detail?: string
  action?: ReactNode
}

export function SectionHeading({ title, detail, action }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {detail && <p>{detail}</p>}
      </div>
      {action}
    </div>
  )
}
