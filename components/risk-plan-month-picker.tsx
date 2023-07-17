"use client"

import * as React from "react"
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

export function MonthPickerDemo({ handleMonthChange }: any) {
  const [date, setDate] = React.useState<Date>()
  const today = new Date()
  const nextMonth = addMonths(new Date(), 1)
  const [month, setMonth] = React.useState<Date>(nextMonth)

  const footer = (
    <button
      disabled={isSameMonth(today, month)}
      onClick={() => setMonth(today)}
    >
      Mes Actual
    </button>
  )

  const handleMonth = async (month: Date) => {
    setMonth(month)
    await handleMonthChange(month)
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
            <span>{format(month, "MMMM yyyy")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          month={month}
          onMonthChange={handleMonth}
          toDate={new Date(today)}
          footer={footer}
        />
      </PopoverContent>
    </Popover>
  )
}
