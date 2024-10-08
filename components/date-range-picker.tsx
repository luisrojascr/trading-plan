"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function CalendarDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  var currentDate = new Date()
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    to: currentDate,
  })
  const router = useRouter()
  const pathname = usePathname()
  const searchParams: any = useSearchParams()

  const setDates = (dateRange: DateRange | undefined) => {
    const current = new URLSearchParams(searchParams)
    if (dateRange) {
      const dateFrom = dateRange.from as Date
      const dateTo = dateRange.to as Date
      setDate(dateRange)
      current.set("from", new Date(dateFrom).toString())
      current.set("to", new Date(dateTo).toString())
      const search = current.toString()
      const query = search ? `?${search}` : ""

      router.push(`${pathname}${query}`)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDates}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
