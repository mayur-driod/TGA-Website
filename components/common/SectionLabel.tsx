import { cn } from "@/lib/utils"

type SectionLabelProps = {
  children: string
  className?: string
}

export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p className={cn("text-xs font-medium uppercase tracking-widest text-primary", className)}>{children}</p>
  )
}
