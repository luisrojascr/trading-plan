import { numberFormat } from "../helpers/number_format"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { DataTable } from "./data-table-results"
import { EfectDaysColumns } from "./efectividad-por-dias-columns"
import { columnsEffectivenessMarket } from "./efectividad-por-mercado-columns"
import { econPerformanceByMarketColumns } from "./rendimiento-por-mercado-columns"

function getDaysData(deals: any) {
  if (deals?.length > 0) {
    // Remove duplicates
    return deals
      .filter(
        (dealObj: any, index: number) =>
          deals.findIndex((item: any) => item.symbol === dealObj.symbol) ===
          index
      )
      .map(
        ({
          id,
          symbol,
          time,
        }: {
          id: string
          symbol: string
          time: string
        }) => ({
          id,
          symbol,
          time,
        })
      )
  } else {
    return []
  }
}

export async function Results({ symbols, deals }: any) {
  // console.log("Results deals: ", deals)
  const daysData = await getDaysData(deals)
  const winDeals = deals.filter((d: any) => d.status === "win")
  const loseDeals = deals.filter((d: any) => d.status === "lost")
  const profitAmount = winDeals.reduce((acc: any, d: any) => acc + d.profit, 0)
  const effectivenessMarket = symbols.map((s: any) => {
    const wonDeals = winDeals.filter((d: any) => d.symbol === s.symbol).length
    const lostDeals = loseDeals.filter((d: any) => d.symbol === s.symbol).length

    return {
      ganadas: wonDeals,
      symbol: s.symbol,
      perdidas: lostDeals,
      balance: wonDeals - lostDeals,
      efectividad: ((wonDeals * 100) / (wonDeals + lostDeals)).toFixed(2),
    }
  })

  const econPerformanceByMarket = symbols.map((s: any) => {
    const wonDeals = winDeals.filter((d: any) => d.symbol === s.symbol)
    const lostDeals = loseDeals.filter((d: any) => d.symbol === s.symbol)

    const profitBySymbol = wonDeals.reduce(
      (acc: any, d: any) => acc + d.profit,
      0
    )
    const lostBySymbol = Math.abs(
      lostDeals.reduce((acc: any, d: any) => acc + d.profit, 0)
    )

    return {
      ganadas: numberFormat(profitBySymbol),
      symbol: s.symbol,
      perdidas:
        lostBySymbol === 0
          ? numberFormat(lostBySymbol)
          : numberFormat(-lostBySymbol),
      balance:
        profitBySymbol > lostBySymbol
          ? profitBySymbol - lostBySymbol
          : -lostBySymbol + profitBySymbol,
      efectividad: (
        (profitBySymbol * 100) /
        (profitBySymbol + lostBySymbol)
      ).toFixed(2),
    }
  })

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Resultados de las Operaciones</CardTitle>
          <CardDescription>
            Maneja tu plan de riesgo inteligentemente. Conoce tus números.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="text-center">
                  Rentabilidad de la cuenta
                </TableHead> */}
                <TableHead className="text-center">
                  Total de Operaciones
                </TableHead>
                <TableHead className="text-center">
                  Efectividad en las Entradas
                </TableHead>
                <TableHead className="text-center">
                  Promedio de Ganancia Por Operación
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {/* <TableCell className="text-center font-medium">
                  {deals.length}
                </TableCell> */}
                <TableCell className="text-center font-medium">
                  {deals.length}
                </TableCell>
                <TableCell className="text-center">
                  {((winDeals.length * 100) / deals.length).toFixed(2)}%
                </TableCell>
                <TableCell className="text-center">
                  {numberFormat(profitAmount / winDeals.length)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <CardHeader>
            <CardTitle>Efectividad por mercado</CardTitle>
            <CardDescription>
              Se recomienda mantener una efectividad por encima del 50%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-3">
              <DataTable
                columns={columnsEffectivenessMarket}
                data={effectivenessMarket}
              />
            </div>
          </CardContent>
        </div>
        <div className="col-span-3">
          <CardHeader>
            <CardTitle>Rendimiento económico por mercado</CardTitle>
            <CardDescription>
              Se recomienda mantener un rendimiento por encima del 50%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-3">
              <DataTable
                columns={econPerformanceByMarketColumns}
                data={econPerformanceByMarket}
              />
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  )
}
