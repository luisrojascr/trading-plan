"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { OverviewProps } from "../models/models"
import { columns } from "./columns"
import { DataTable } from "./data-table"

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export function Transactions({ data, symbols }: any) {
  console.log("deals: ", data)
  console.log("symbols: ", symbols)
  return (
    <div>
      <div className="mb-4 grid grid-cols-5 gap-x-8 gap-y-4">
        <div className="items-center gap-2">
          <Label htmlFor="email">Fecha</Label>
          <Input type="email" id="email" placeholder="Email" />
        </div>
        <div className="items-center gap-2">
          <Label htmlFor="email">Indices</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un indice" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {symbols.map((transaction: OverviewProps) => (
                  <SelectItem value={transaction.symbol}>
                    {transaction.symbol}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="items-center gap-2">
          <Label htmlFor="email">Tipo</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de transacción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="buy">Compra</SelectItem>
                <SelectItem value="sell">Venta</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="items-center gap-2">
          <Label htmlFor="email">Estado</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Estado de la transacción" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="buy">Ganada</SelectItem>
                <SelectItem value="sell">Perdida</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="items-center gap-2 self-end">
          <Button className="w-[200px]" type="submit">
            Filtrar
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
