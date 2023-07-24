"use client"

import { useCallback, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { SymbolType } from "../models/symbols"
import { columns } from "./columns"
import { DataTable } from "./data-table"

const FormSchema = z.object({
  transactionSymbol: z.string().optional(),
  transactionType: z.string().optional(),
  transactionState: z.string().optional(),
})

export function Transactions({ data, symbols }: any) {
  const [deals, setDeals] = useState(data)
  // console.log("deals: ", data)
  // console.log("symbols: ", symbols)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const handleOnChange = useCallback(
    (selectedOption: string) => {
      const symbolNames = symbols.map((symbol: SymbolType) => symbol.symbol)
      console.log("form: ", form)
      // form.reset()
      // form.reset({
      //   transactionSymbol: "allSymbols",
      //   transactionType: "allType",
      // })
      let selectedItem = symbolNames.includes(selectedOption)
        ? "it's a symbol"
        : selectedOption
      switch (selectedItem) {
        case "win":
          return setDeals(data.filter((deal: any) => deal.status === "win"))
        case "lost":
          return setDeals(data.filter((deal: any) => deal.status === "lost"))
        case "buy":
          return setDeals(data.filter((deal: any) => deal.type === "Buy"))
        case "sell":
          return setDeals(data.filter((deal: any) => deal.type === "Sell"))
        case "it's a symbol":
          return setDeals(
            data.filter((deal: any) => deal.symbol === selectedOption)
          )
        default:
          setDeals(data)
      }
    },
    [data, symbols]
  )

  const onSubmit = (d: z.infer<typeof FormSchema>) => {
    if (d.transactionState === "win") {
      setDeals(data.filter((deal: any) => deal.status === "win"))
    }

    if (d.transactionState === "lost") {
      setDeals(data.filter((deal: any) => deal.status === "lost"))
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4 grid grid-cols-3 gap-x-8 gap-y-4">
            <div className="items-center gap-3">
              <FormField
                control={form.control}
                name="transactionSymbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lista de índices operados</FormLabel>
                    <Select
                      onValueChange={handleOnChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="allSymbols">Todos</SelectItem>
                        {symbols.map((transaction: SymbolType) => (
                          <SelectItem value={transaction.symbol}>
                            {transaction.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="items-center gap-3">
              <FormField
                control={form.control}
                name="transactionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de transacción</FormLabel>
                    <Select
                      onValueChange={handleOnChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="allType">Todos</SelectItem>
                        <SelectItem value="buy">Compra</SelectItem>
                        <SelectItem value="sell">Venta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="items-center gap-3">
              <FormField
                control={form.control}
                name="transactionState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de la transacción</FormLabel>
                    <Select
                      onValueChange={handleOnChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="allState">Todos</SelectItem>
                        <SelectItem value="win">Ganada</SelectItem>
                        <SelectItem value="lost">Perdida</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* <div className="items-center gap-2 self-end">
              <Button className="w-[200px]" type="submit">
                Filtrar
              </Button>
            </div> */}
          </div>
        </form>
      </Form>
      <DataTable columns={columns} data={deals} />
    </div>
  )
}
