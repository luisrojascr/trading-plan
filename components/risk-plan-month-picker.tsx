"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { addMonths, format, isSameMonth } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function MonthPickerDemo({ selectedPeriod }: { selectedPeriod: Date }) {
  const [date, setDate] = React.useState<Date>()
  const today = new Date()
  const nextMonth = addMonths(new Date(), 0)
  const [month, setMonth] = React.useState<Date>(nextMonth)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams: any = useSearchParams()

  const footer = (
    <button
      disabled={isSameMonth(today, month)}
      onClick={() => setMonth(today)}
    >
      Mes Actual
    </button>
  )

  const handleMonth = async (month: Date) => {
    const current = new URLSearchParams(searchParams)
    setMonth(month)
    current.set("selectedPeriod", month.toString())

    const search = current.toString()
    const query = search ? `?${search}` : ""

    router.push(`${pathname}${query}`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP")
          ) : (
            <span>
              {format(selectedPeriod ? selectedPeriod : month, "MMMM yyyy")}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          month={selectedPeriod ? selectedPeriod : month}
          onMonthChange={handleMonth}
          toDate={new Date(today)}
          footer={footer}
        />
      </PopoverContent>
    </Popover>
  )
}
