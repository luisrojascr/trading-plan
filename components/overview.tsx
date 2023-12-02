import { DollarSign, TrendingDown, TrendingUp, Users } from "lucide-react"

import { numberFormat } from "./helpers/number_format"
import { SymbolType } from "./models/symbols"
import { OverviewChart } from "./overview/overview-chart"
import { Portfolio } from "./overview/overview-portfolio"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { WinsVsLost } from "./wins-vs-lost"

async function fetchAccountInfo() {
  const cuentaRealLis = "20841b9b-b8c8-4470-8d40-f9fc4570d381"
  const cuentaRealMia = "51bffb5a-1c6f-4ede-92fa-e06df7d82b07"
  const cuentaDemoMia = "50483a5a-b76d-4b74-86cc-6c1ffbf3d6e0"
  const region = "london" // "singapore" // DEMO london
  const accountId = cuentaDemoMia
  const URL = `https://mt-client-api-v1.${region}.agiliumtrade.ai/users/current/accounts/${accountId}/account-information`
  try {
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        "auth-token": process.env.META_API_TOKEN || "",
      },
      referrerPolicy: "no-referrer",
      next: { revalidate: 10 },
    })

    return await response.json()
  } catch (err) {
    console.error(err)
  }
}

const getMonthlyProfit = (deals: any) => {
  return deals
    .filter((deal: any) => deal.status === "win")
    .reduce((acc: any, curr: any) => acc + curr.profit, 0)
}

const getMonthlyLosses = (deals: any) => {
  return deals
    .map((deal: any) => ({
      ...deal,
      lost: deal.profit < 0 && deal.type !== "Withdrawal" ? deal.profit : 0,
    }))
    .reduce((acc: any, curr: any) => acc + curr.lost, 0)
}

function getSwap(deals: any) {
  if (deals?.length > 0) {
    return deals
      .map(({ swap }: { swap: number }) => {
        return swap
      })
      .reduce(function (prev: number, cur: number) {
        return prev + cur
      }, 0)
  }
}

function getWithdrawalAmount(deals: any) {
  // if (deals?.length > 0) {
  //   return deals
  //     .map(({ withdrawal }: { withdrawal: number }) => {
  //       return withdrawal
  //     })
  //     .reduce(function (prev: number, cur: number) {
  //       return prev + cur * -1
  //     }, 0)
  // }
  return 118 + 101
}

export async function Overview({ deals, symbols, portfolio }: any) {
  const accountInfo = await fetchAccountInfo()
  const overviewChart = symbols?.map((symbol: SymbolType) => ({
    ...symbol,
    ganancia: symbol.profit.toFixed(2),
    perdida: symbol.lost.toFixed(2),
  }))
  const winsAndLostData = [
    {
      name: "Trades Ganados",
      value: +deals
        .filter((deal: any) => deal.status === "win")
        .reduce((acc: any, curr: any) => acc + curr.profit, 0)
        .toFixed(2),
    },
    {
      name: "Trades Perdidos",
      value: Math.abs(
        +deals
          .filter((deal: any) => deal.status === "lost")
          .reduce((acc: any, curr: any) => acc + curr.profit, 0)
          .toFixed(2)
      ),
    },
  ]

  const portfolioChart = portfolio
    ? Object.entries(portfolio).map(([key, val]) => ({
        name: key,
        value: val,
      }))
    : []

  const withdrawal = getWithdrawalAmount(deals)
  const monthlyProfit = getMonthlyProfit(deals)
  const monthlyLoss = getMonthlyLosses(deals)
  const allSwap = await getSwap(deals)?.toFixed(2)
  const netProfit = monthlyProfit + monthlyLoss - -allSwap
  const periodYield =
    (netProfit * 100) / (accountInfo.balance + withdrawal - netProfit)

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-3">
          <Card className="col-span-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Balance actual de la cuenta
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-center text-2xl font-bold">
                {numberFormat(accountInfo.balance)}
              </p>
              <p className="text-center text-xs text-muted-foreground">
                {numberFormat(accountInfo.balance - netProfit + withdrawal)}{" "}
                capital inicial
                {netProfit > 0
                  ? `+${numberFormat(netProfit)} ganados`
                  : `${numberFormat(netProfit)} perdidos`}{" "}
                en el período
                {withdrawal && `- ${numberFormat(withdrawal)} de retiros`}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Número de Operaciones
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-center text-2xl font-bold">
                  {deals?.length}
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  Total de operaciones durante el período
                </p>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Operaciones con Beneficio
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-center text-2xl font-bold text-green-500">
                  {deals.filter((deal: any) => deal.status === "win").length}
                </p>
                {/* <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p> */}
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Operaciones con Pérdida
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-center text-2xl font-bold text-red-500">
                  {deals.filter((deal: any) => deal.status === "lost").length}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-3">
          <Card className="col-span-1 mb-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rentabilidad del período
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {periodYield > 0 ? (
                <p className="text-center text-3xl font-bold text-green-500">
                  {periodYield.toFixed(2)}%
                </p>
              ) : (
                <p className="text-center text-3xl font-bold text-red-500">
                  {periodYield.toFixed(2)}%
                </p>
              )}
              {/* <p className="text-center text-xs text-muted-foreground">
                +3% del mes anterior
              </p> */}
            </CardContent>
          </Card>
          <Card className="col-span-1 mb-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ganancia Neta
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {netProfit > 0 ? (
                <p className="text-center text-2xl font-bold text-green-500">
                  {numberFormat(netProfit)}
                </p>
              ) : (
                <p className="text-center text-2xl font-bold text-red-500">
                  {numberFormat(netProfit)}
                </p>
              )}

              <p className="text-center text-xs text-muted-foreground">
                Beneficio Bruto - Pérdidas - Swap
              </p>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top 3 Indices Más Rentables
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Indice</TableHead>
                    <TableHead className="text-center">Ganadas</TableHead>
                    <TableHead className="text-center">Perdidas</TableHead>
                    <TableHead className="text-center">Balance</TableHead>
                    <TableHead className="text-center">Efectividad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-center font-medium">
                      $1,000
                    </TableCell>
                    <TableCell className="text-center">20%</TableCell>
                    <TableCell className="text-center">$200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-center font-medium">
                      $1,000
                    </TableCell>
                    <TableCell className="text-center">20%</TableCell>
                    <TableCell className="text-center">$200</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-center font-medium">
                      $1,000
                    </TableCell>
                    <TableCell className="text-center">20%</TableCell>
                    <TableCell className="text-center">$200</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Portafolio</CardTitle>
                <CardDescription>
                  Número de operaciones por cada índice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Portfolio data={portfolioChart} />
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>
                  Operaciones Ganadas vs Operaciones Perdidas{" "}
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <WinsVsLost data={winsAndLostData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retiros</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-center text-2xl font-bold text-green-500">
              {numberFormat(withdrawal)}
            </p>
            <p className="text-center text-xs text-muted-foreground">
              Retiros realizados durante el período
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-center text-2xl font-bold text-green-500">
              {numberFormat(monthlyProfit)}
            </p>
            {/* <p className="text-xs text-muted-foreground">
                        +19% from last month
                      </p> */}
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pérdida</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-center text-2xl font-bold text-red-500">
              {numberFormat(monthlyLoss)}
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Swap</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-center text-2xl font-bold text-red-500">
              {numberFormat(allSwap)}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Rendimiento positivo por Indice </CardTitle>
            <CardDescription>
              Rendimiento en dólares por cada índice
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={overviewChart} type="win" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Rendimiento negativo por índice </CardTitle>
            <CardDescription>
              Rendimiento en dólares por cada índice
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={overviewChart} type="lost" />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
