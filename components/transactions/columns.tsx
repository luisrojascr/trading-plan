"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown } from "lucide-react"

import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transaction = {
  time: string
  symbol: string
  type: "Buy" | "Sell"
  volume: number
  profit: number
  profit2: number
  status: string
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "time",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cierre de operación
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return row.getValue("time") ? (
        <span className="block text-center">
          {format(new Date(row.getValue("time")), "dd/MM/yyyy '-' h:mm a")}
        </span>
      ) : (
        ""
      )
    },
  },
  {
    accessorKey: "symbol",
    header: () => <div className="text-center">Indice</div>,
    cell: ({ row }) => {
      return <span className="block text-center">{row.getValue("symbol")}</span>
    },
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center">Tipo</div>,
    cell: ({ row }) => {
      if (row.getValue("type") && row.getValue("type") === "Buy") {
        return <span className="block text-center">Compra</span>
      }
      if (row.getValue("type") && row.getValue("type") === "Sell") {
        return <span className="block text-center">Venta</span>
      }

      return ""
    },
  },
  {
    accessorKey: "volume",
    header: () => <div className="text-center">Lotaje</div>,
    cell: ({ row }) => {
      return <span className="block text-center">{row.getValue("volume")}</span>
    },
  },
  {
    accessorKey: "profit",
    header: () => <div className="text-center">Ganancia en $</div>,
    cell: ({ row }) => {
      const profit: any = row.getValue("profit")
      return profit >= 0 ? (
        <span className="block text-center">${profit}</span>
      ) : (
        ""
      )
    },
  },
  {
    accessorKey: "profit2",
    header: () => <div className="text-center">Pérdida en $</div>,
    cell: ({ row }) => {
      const profit: any = row.getValue("profit2")
      return profit < 0 ? (
        <span className="block text-center">${profit}</span>
      ) : (
        ""
      )
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => {
      switch (row.getValue("status")) {
        case "win":
          return (
            <span className="block text-center">
              <Badge variant="secondary">Ganada</Badge>
            </span>
          )
        case "lost":
          return (
            <span className="block text-center">
              <Badge variant="destructive">Perdida</Badge>
            </span>
          )
      }
    },
  },
]
