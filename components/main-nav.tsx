import Link from "next/link"

import { cn } from "@/lib/utils"

interface ItemProps {
  title: string
  href: string
}
interface MainNavProps {
  className?: string
  items?: ItemProps[]
}

export function MainNav({ className, items }: MainNavProps) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...items}
    >
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Panel
      </Link>
      <Link
        href="/risk-plan"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Plan de Riesgossss
      </Link>
    </nav>
  )
}
