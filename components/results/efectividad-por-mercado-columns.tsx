"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Transaction = {
  id: number
  ganadas: any[]
  symbol: string
  perdidas: string
  balance: string
  efectividad: string
}

export const columnsEffectivenessMarket: ColumnDef<Transaction>[] = [
  {
    accessorKey: "symbol",
    header: () => <div className="text-center">Indice</div>,
    cell: ({ row }) => {
      return <span className="block text-center">{row.getValue("symbol")}</span>
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
      const balance: number = row.getValue("balance")
      return balance < 0 ? (
        <div className="block text-center font-bold text-red-500">
          {balance}
        </div>
      ) : (
        <div className="block text-center font-bold text-green-500">
          {balance}
        </div>
      )
    },
  },
  {
    accessorKey: "efectividad",
    header: () => <div className="text-center">Efectividad</div>,
    cell: ({ row }) => {
      const efectividad: number = row.getValue("efectividad")
      return efectividad >= 50 ? (
        <span className="block text-center text-green-500">{efectividad}%</span>
      ) : (
        <span className="block text-center text-red-500">{efectividad}%</span>
      )
    },
  },
]
