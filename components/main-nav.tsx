"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

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
  const pathname = usePathname()

  const navLinks = [
    {
      href: "/",
      name: "Inicio",
    },
    // {
    //   href: "/risk-plan",
    //   name: "Gestión de Riesgo",
    // },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...items}
    >
      {navLinks.map((link) => {
        const isActive = pathname.startsWith(link.href)

        return (
          <Link
            className={
              isActive
                ? "text-sm font-medium text-primary transition-colors hover:text-primary"
                : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            }
            href={link.href}
            key={link.name}
          >
            {link.name}
          </Link>
        )
      })}
      {/* <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Inicio
      </Link>
      <Link
        href="/risk-plan"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Gestión de Riesgo
      </Link> */}
    </nav>
  )
}
