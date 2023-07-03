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
      return balance > 0 ? (
        <div className="block bg-green-500 text-center">{balance}</div>
      ) : (
        <div className="block bg-red-500 text-center">{balance}</div>
      )
    },
  },
  {
    accessorKey: "efectividad",
    header: () => <div className="text-center">Efectividad</div>,
    cell: ({ row }) => {
      return (
        <span className="block text-center">
          {row.getValue("efectividad")}%
        </span>
      )
    },
  },
]
