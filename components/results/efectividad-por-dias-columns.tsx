"use client"

import { ColumnDef } from "@tanstack/react-table"
import { getDay } from "date-fns"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Transaction = {
  time: string
  ganadas: string
  symbol: string
  perdidas: string
  balance: string
  efectividad: string
}

function getStringDay(day: number) {
  switch (day) {
    case 0:
      return "Domingo"
    case 1:
      return "Lunes"
    case 2:
      return "Martes"
    case 3:
      return "Miércoles"
    case 4:
      return "Jueves"
    case 5:
      return "Viernes"
    case 6:
      return "Sábado"
  }

  return "Lunes"
}

export const EfectDaysColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "time",
    header: () => <div className="text-center">Días</div>,
    cell: ({ row }) => {
      return (
        <span className="block text-center">
          {getStringDay(getDay(new Date(row.getValue("time"))))}
        </span>
      )
    },
  },
  {
    accessorKey: "ganadas",
    header: () => <div className="text-center">Ganadas</div>,
    cell: ({ row }) => {
      return (
        <span className="block text-center">{row.getValue("ganadas")}</span>
      )
    },
  },
  {
    accessorKey: "perdidas",
    header: () => <div className="text-center">Perdidas</div>,
    cell: ({ row }) => {
      return (
        <span className="block text-center">{row.getValue("perdidas")}</span>
      )
    },
  },
  {
    accessorKey: "balance",
    header: () => <div className="text-center">Balance</div>,
    cell: ({ row }) => {
      return (
        <span className="block text-center">{row.getValue("balance")}</span>
      )
    },
  },
  {
    accessorKey: "efectividad",
    header: () => <div className="text-center">Efectividad</div>,
    cell: ({ row }) => {
      return (
        <span className="block text-center">{row.getValue("efectividad")}</span>
      )
    },
  },
]
